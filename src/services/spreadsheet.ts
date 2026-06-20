import * as XLSX from 'xlsx'
import type { ImportResult, Order } from '../types'

const CRITICAL_COLS = ['pedido', 'cidade', 'estado'] as const

const COLUMN_ALIASES: Record<string, string> = {
  pedido: 'pedido',
  numeropedido: 'pedido',
  numdopedido: 'pedido',
  cliente: 'cliente',
  nomecliente: 'cliente',
  endereco: 'endereco',
  enderecoentrega: 'endereco',
  rua: 'endereco',
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

export async function parseSpreadsheet(file: File): Promise<ImportResult> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  const warnings: string[] = []
  const errors: string[] = []

  if (rows.length === 0) {
    errors.push('A planilha está vazia.')
    return { orders: [], warnings, errors }
  }

  const headerMap = new Map<string, string>()
  const unmapped: string[] = []
  for (const rawHeader of Object.keys(rows[0])) {
    const normalized = normalizeHeader(rawHeader)
    if (normalized) {
      headerMap.set(rawHeader, normalized)
    } else {
      unmapped.push(rawHeader)
    }
  }

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

  const orders: Order[] = []
  rows.forEach((row, idx) => {
    const fields: Record<string, unknown> = {}
    for (const [rawHeader, normalized] of headerMap) {
      fields[normalized] = row[rawHeader]
    }

    const pedido = String(fields.pedido ?? '').trim()
    const cidade = String(fields.cidade ?? '').trim()
    const estado = String(fields.estado ?? '').trim()

    if (!pedido || !cidade || !estado) {
      warnings.push(`Linha ${idx + 2} ignorada: Pedido, Cidade ou Estado em branco.`)
      return
    }

    orders.push({
      id: crypto.randomUUID(),
      pedido,
      cliente: String(fields.cliente ?? '').trim() || undefined,
      endereco: String(fields.endereco ?? '').trim() || undefined,
      cidade,
      estado,
      cep: String(fields.cep ?? '').trim() || undefined,
      pesoKg: toNumber(fields.pesoKg),
      volumeM3: toNumber(fields.volumeM3),
      valor: toNumber(fields.valor),
      geocodeStatus: 'pending',
    })
  })

  if (orders.length === 0) {
    errors.push('Nenhuma linha válida encontrada — verifique se Pedido, Cidade e Estado estão preenchidos.')
  }

  return { orders, warnings, errors }
}
