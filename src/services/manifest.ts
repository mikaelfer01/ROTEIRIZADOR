import type { Depot, OptimizedRoute } from '../types'

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

/**
 * Builds a printable manifest for a single route: the exact sequence of stops to
 * follow (the path), every order with its NF value, and totals for conferência at
 * dispatch — the document a driver/conferente takes on the road.
 */
export function buildManifestHtml(route: OptimizedRoute, depot: Depot, routeLabel: string): string {
  const totalValor = route.stops.reduce((sum, s) => sum + (s.order.valor ?? 0), 0)

  const pathSteps = [
    depot.nome,
    ...route.stops.map((s) => `${s.order.cidade}/${s.order.estado}`),
    depot.nome,
  ]

  const rows = route.stops
    .map(
      (stop) => `
        <tr>
          <td>${stop.sequence}</td>
          <td>${escapeHtml(stop.order.pedido)}</td>
          <td>${escapeHtml(stop.order.cliente ?? '—')}</td>
          <td>${escapeHtml(stop.order.endereco ?? '—')}</td>
          <td>${escapeHtml(stop.order.cidade)}/${escapeHtml(stop.order.estado)}</td>
          <td>${stop.order.pesoKg != null ? `${stop.order.pesoKg.toFixed(1)} kg` : '—'}</td>
          <td>${stop.order.valor != null ? `R$ ${stop.order.valor.toFixed(2)}` : '—'}</td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Manifesto — ${escapeHtml(routeLabel)}</title>
<style>
  body { font-family: 'Georgia', serif; color: #1c2530; margin: 2rem; }
  h1 { font-size: 1.3rem; margin-bottom: 0.2rem; }
  .meta { font-size: 0.85rem; color: #4a5568; margin: 0.15rem 0; }
  .path { font-size: 0.85rem; margin: 0.8rem 0; padding: 0.6rem 0.8rem; border: 1px solid #c9a227; border-radius: 6px; background: #fdf8ea; }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.82rem; }
  th, td { border: 1px solid #cbd5e0; padding: 0.35rem 0.5rem; text-align: left; }
  th { background: #06234c; color: #fff; }
  tfoot td { font-weight: bold; background: #f1f5f9; }
  .totals { margin-top: 1rem; font-size: 0.9rem; }
  .totals strong { color: #06234c; }
  .print-btn { float: right; background: #06234c; color: #fff; border: none; border-radius: 6px; padding: 0.4rem 0.8rem; font-size: 0.8rem; cursor: pointer; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Imprimir</button>
  <h1>Manifesto de Carga — ${escapeHtml(routeLabel)}</h1>
  <p class="meta">Veículo: ${escapeHtml(route.vehicle.nome)} (até ${route.vehicle.capacidadeKg}kg / ${route.vehicle.capacidadeM3}m³)</p>
  <p class="meta">Saída: ${escapeHtml(depot.nome)} — ${escapeHtml(depot.endereco)}</p>
  <div class="path"><strong>Caminho a seguir:</strong><br/>${pathSteps.map(escapeHtml).join(' &rarr; ')}</div>
  <table>
    <thead>
      <tr><th>#</th><th>Pedido</th><th>Cliente</th><th>Endereço</th><th>Cidade/UF</th><th>Peso</th><th>Valor NF</th></tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr><td colspan="5">Totais</td><td>${route.totalPesoKg.toFixed(1)} kg</td><td>R$ ${totalValor.toFixed(2)}</td></tr>
    </tfoot>
  </table>
  <p class="totals">Distância total: <strong>${route.totalDistanceKm.toFixed(1)} km</strong> · Duração estimada: <strong>${Math.round(route.totalDurationMin)} min</strong> · Custo estimado: <strong>R$ ${route.custoEstimado.toFixed(2)}</strong></p>
</body>
</html>`
}

export function openManifest(route: OptimizedRoute, depot: Depot, routeLabel: string): void {
  const html = buildManifestHtml(route, depot, routeLabel)
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
}
