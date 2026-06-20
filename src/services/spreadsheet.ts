import * as XLSX from 'xlsx'
import type { ImportResult, Order } from '../types'

const CRITICAL_COLS = ['pedido', 'cidade', 'estado'] as const

const COLUMN_ALIASES: Record<string, string> = {
  pedido: 'pedido',
  numeropedido: 'pedido',
  numdopedido: 'pedido',
  cliente: 'cliente',
  nomecliente: 'cliente',
  clientenomefantasia: 'cliente',
  endereco: 'endereco',
  enderecoentrega: 'endereco',
  enderecocompleto: 'endereco',
  rua: 'endereco',
  bairro: 'bairro',
  cidade: 'cidade',
  municipio: 'cidade',
  estado: 'estado',
  uf: 'estado',
  cep: 'cep',
  peso: 'pesoKg',
  pesokg: 'pesoKg',
  volume: 'volumeM3',
  volumem3: 'volumeM3',
  valor: 'valor',
  valortotal: 'valor',
  totaldemercadoria: 'valor',
  quantidade: 'quantidade',
  unidade: 'unidade',
  // recognized but ignored at the order level (product-line / metadata detail)
  previsaodefaturamento: 'ignored',
  previsaodefaturamentocompleta: 'ignored',
  descricaodoproduto: 'ignored',
  descricaodoprodutocompleta: 'ignored',
  operacao: 'ignored',
  situacao: 'ignored',
  vendedor: 'ignored',
}

function normalizeHeader(raw: string): string | null {
  const key = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
  return COLUMN_ALIASES[key] ?? null
}

function toNumber(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

interface AggregatedOrder {
  pedido: string
  cliente?: string
  endereco?: string
  cidade: string
  estado: string
  cep?: string
  pesoKg: number
  hasExplicitPeso: boolean
  valor: number
  hasNonKgUnit: boolean
}

export async function parseSpreadsheet(file: File): Promise<ImportResult> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const grid = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })

  const warnings: string[] = []
  const errors: string[] = []

  if (grid.length === 0) {
    errors.push('A planilha está vazia.')
    return { orders: [], warnings, errors }
  }

  // The export may include title/filter rows above the real header (e.g. pivot-table
  // exports), so locate the row that actually declares a "Pedido" column instead of
  // assuming row 1 is the header.
  const headerRowIndex = grid.findIndex((row) =>
    row.some((cell) => normalizeHeader(String(cell ?? '').trim()) === 'pedido'),
  )
  if (headerRowIndex === -1) {
    errors.push('Não foi possível localizar a coluna "Pedido" no cabeçalho da planilha.')
    return { orders: [], warnings, errors }
  }

  const headerRow = grid[headerRowIndex]
  const headerMap = new Map<number, string>()
  const unmapped: string[] = []
  headerRow.forEach((rawHeader, colIdx) => {
    const header = String(rawHeader ?? '').trim()
    if (!header) return
    const normalized = normalizeHeader(header)
    if (normalized) headerMap.set(colIdx, normalized)
    else unmapped.push(header)
  })

  const mappedFields = new Set(headerMap.values())
  const missingCritical = CRITICAL_COLS.filter((c) => !mappedFields.has(c))
  if (missingCritical.length > 0) {
    errors.push(
      `Colunas obrigatórias não encontradas: ${missingCritical.join(', ')}. Verifique o cabeçalho da planilha.`,
    )
    return { orders: [], warnings, errors }
  }

  if (unmapped.length > 0) {
    warnings.push(`Colunas não reconhecidas (ignoradas): ${unmapped.join(', ')}`)
  }

  // Pivot-style exports list one row per product line, so the same Pedido repeats
  // across several rows — group by Pedido and sum weight/value across its lines.
  const grouped = new Map<string, AggregatedOrder>()
  let skippedRows = 0

  for (let r = headerRowIndex + 1; r < grid.length; r++) {
    const row = grid[r]
    const fields: Record<string, unknown> = {}
    for (const [colIdx, normalized] of headerMap) {
      fields[normalized] = row[colIdx]
    }

    const pedido = String(fields.pedido ?? '').trim()
    const cidade = String(fields.cidade ?? '').trim()
    const estado = String(fields.estado ?? '').trim()
    if (!pedido || !cidade || !estado) {
      skippedRows++
      continue
    }

    const bairro = String(fields.bairro ?? '').trim()
    const enderecoBase = String(fields.endereco ?? '').trim()
    const endereco = bairro && enderecoBase ? `${enderecoBase}, ${bairro}` : enderecoBase || undefined

    let entry = grouped.get(pedido)
    if (!entry) {
      entry = {
        pedido,
        cliente: String(fields.cliente ?? '').trim() || undefined,
        endereco,
        cidade,
        estado,
        cep: String(fields.cep ?? '').trim() || undefined,
        pesoKg: 0,
        hasExplicitPeso: false,
        valor: 0,
        hasNonKgUnit: false,
      }
      grouped.set(pedido, entry)
    }

    const explicitPeso = toNumber(fields.pesoKg)
    if (explicitPeso != null) {
      entry.pesoKg += explicitPeso
      entry.hasExplicitPeso = true
    } else {
      const unidade = String(fields.unidade ?? '').trim().toLowerCase()
      const quantidade = toNumber(fields.quantidade)
      if (quantidade != null) {
        if (unidade === 'kg' || unidade === '') {
          entry.pesoKg += quantidade
        } else {
          entry.hasNonKgUnit = true
        }
      }
    }

    const valor = toNumber(fields.valor)
    if (valor != null) entry.valor += valor
  }

  if (skippedRows > 0) {
    warnings.push(`${skippedRows} linha(s) ignorada(s): Pedido, Cidade ou Estado em branco.`)
  }

  const nonKgOrders = [...grouped.values()].filter((o) => o.hasNonKgUnit)
  if (nonKgOrders.length > 0) {
    const sample = nonKgOrders.slice(0, 5).map((o) => o.pedido).join(', ')
    warnings.push(
      `${nonKgOrders.length} pedido(s) têm itens em unidades diferentes de "kg" (ex: sc, UN) — esse peso não entrou no total automático: ${sample}${nonKgOrders.length > 5 ? '…' : ''}`,
    )
  }

  const orders: Order[] = [...grouped.values()].map((o) => ({
    id: crypto.randomUUID(),
    pedido: o.pedido,
    cliente: o.cliente,
    endereco: o.endereco,
    cidade: o.cidade,
    estado: o.estado,
    cep: o.cep,
    pesoKg: o.pesoKg > 0 ? o.pesoKg : undefined,
    valor: o.valor > 0 ? o.valor : undefined,
    geocodeStatus: 'pending',
  }))

  if (orders.length === 0) {
    errors.push('Nenhuma linha válida encontrada — verifique se Pedido, Cidade e Estado estão preenchidos.')
  }

  return { orders, warnings, errors }
}
