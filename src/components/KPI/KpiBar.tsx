import { useStore } from '../../state/useStore'
import './KpiBar.css'

export function KpiBar() {
  const orders = useStore((s) => s.orders)
  const selectedOrderIds = useStore((s) => s.selectedOrderIds)
  const optimizedRoute = useStore((s) => s.optimizedRoute)

  const geocoded = orders.filter((o) => o.geocodeStatus === 'ok').length

  return (
    <div className="kpi-bar">
      <div className="kpi">
        <span className="kpi-value">{orders.length}</span>
        <span className="kpi-label">Pedidos importados</span>
      </div>
      <div className="kpi">
        <span className="kpi-value">{geocoded}</span>
        <span className="kpi-label">Geocodificados</span>
      </div>
      <div className="kpi">
        <span className="kpi-value">{selectedOrderIds.size}</span>
        <span className="kpi-label">Selecionados</span>
      </div>
      <div className="kpi">
        <span className="kpi-value">
          {optimizedRoute ? `${optimizedRoute.totalDistanceKm.toFixed(1)} km` : '—'}
        </span>
        <span className="kpi-label">Distância otimizada</span>
      </div>
      <div className="kpi">
        <span className="kpi-value">
          {optimizedRoute ? `R$ ${optimizedRoute.custoEstimado.toFixed(2)}` : '—'}
        </span>
        <span className="kpi-label">Custo estimado</span>
      </div>
    </div>
  )
}
