import { useState } from 'react'
import { useStore } from '../../state/useStore'
import { optimizeRoute, MAX_OPTIMIZATION_STOPS } from '../../services/optimization'
import { selectOrdersForMaxLoad } from '../../services/loadPlanner'
import './RoutePanel.css'

export function RoutePanel() {
  const vehicles = useStore((s) => s.vehicles)
  const selectedVehicleId = useStore((s) => s.selectedVehicleId)
  const setSelectedVehicleId = useStore((s) => s.setSelectedVehicleId)

  const orders = useStore((s) => s.orders)
  const selectedOrderIds = useStore((s) => s.selectedOrderIds)
  const setSelectedOrderIds = useStore((s) => s.setSelectedOrderIds)
  const depot = useStore((s) => s.depot)

  const isOptimizing = useStore((s) => s.isOptimizing)
  const setOptimizing = useStore((s) => s.setOptimizing)
  const optimizedRoute = useStore((s) => s.optimizedRoute)
  const setOptimizedRoute = useStore((s) => s.setOptimizedRoute)
  const focusedOrderId = useStore((s) => s.focusedOrderId)
  const setFocusedOrderId = useStore((s) => s.setFocusedOrderId)

  const [rangeWarning, setRangeWarning] = useState<string | null>(null)

  const vehicle = vehicles.find((v) => v.id === selectedVehicleId)!
  const geocodedOrders = orders.filter((o) => o.geocodeStatus === 'ok' && o.lat != null)
  const selectedOrders = orders.filter((o) => selectedOrderIds.has(o.id))
  const geocodedSelected = selectedOrders.filter((o) => o.lat != null && o.geocodeStatus === 'ok')

  const totalPeso = selectedOrders.reduce((sum, o) => sum + (o.pesoKg ?? 0), 0)
  const totalVolume = selectedOrders.reduce((sum, o) => sum + (o.volumeM3 ?? 0), 0)
  const overCapacity = totalPeso > vehicle.capacidadeKg || totalVolume > vehicle.capacidadeM3
  const pesoPct = vehicle.capacidadeKg > 0 ? Math.min(100, (totalPeso / vehicle.capacidadeKg) * 100) : 0
  const volumePct = vehicle.capacidadeM3 > 0 ? Math.min(100, (totalVolume / vehicle.capacidadeM3) * 100) : 0

  function handleMaximizeLoad() {
    const best = selectOrdersForMaxLoad(orders, vehicle, MAX_OPTIMIZATION_STOPS)
    setSelectedOrderIds(new Set(best.map((o) => o.id)))
    setRangeWarning(null)
  }

  async function handleOptimize() {
    setOptimizing(true)
    setRangeWarning(null)
    try {
      const result = await optimizeRoute(depot, geocodedSelected, vehicle.perfil)
      if (vehicle.distanciaMaximaKm && result.totalDistanceKm > vehicle.distanciaMaximaKm) {
        setRangeWarning(
          `A rota tem ${result.totalDistanceKm.toFixed(0)} km, acima do alcance máximo de ${vehicle.nome} (${vehicle.distanciaMaximaKm} km, ida e volta). Reduza as paradas ou use outro veículo.`,
        )
      }
      setOptimizedRoute({
        stops: result.orderedWaypoints.map((wp, idx) => ({
          order: wp.order,
          sequence: idx + 1,
          distanceFromPrevKm: 0,
          durationFromPrevMin: 0,
        })),
        totalDistanceKm: result.totalDistanceKm,
        totalDurationMin: result.totalDurationMin,
        geometry: result.geometry,
        totalPesoKg: totalPeso,
        totalVolumeM3: totalVolume,
        custoEstimado: result.totalDistanceKm * vehicle.custoPorKm,
        vehicle,
      })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao otimizar rota')
    } finally {
      setOptimizing(false)
    }
  }

  return (
    <div className="route-panel">
      <h2>Roteirização</h2>

      <label className="route-field">
        Veículo
        <select value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nome} — até {v.capacidadeKg}kg / {v.capacidadeM3}m³
              {v.distanciaMaximaKm ? ` / ${v.distanciaMaximaKm}km` : ''}
            </option>
          ))}
        </select>
      </label>

      <button
        className="route-maximize-btn"
        disabled={geocodedOrders.length === 0}
        onClick={handleMaximizeLoad}
      >
        Montar carga máxima ({geocodedOrders.length} pedidos na carteira)
      </button>

      <p className="route-summary-line">
        {selectedOrders.length} pedidos selecionados ({geocodedSelected.length} geocodificados) —{' '}
        {totalPeso.toFixed(0)}kg / {totalVolume.toFixed(2)}m³
      </p>

      <div className="route-capacity-bars">
        <div className="route-capacity-bar">
          <span>Peso {pesoPct.toFixed(0)}%</span>
          <div className="route-capacity-track">
            <div
              className={`route-capacity-fill${pesoPct >= 100 ? ' over' : ''}`}
              style={{ width: `${Math.min(100, pesoPct)}%` }}
            />
          </div>
        </div>
        <div className="route-capacity-bar">
          <span>Volume {volumePct.toFixed(0)}%</span>
          <div className="route-capacity-track">
            <div
              className={`route-capacity-fill${volumePct >= 100 ? ' over' : ''}`}
              style={{ width: `${Math.min(100, volumePct)}%` }}
            />
          </div>
        </div>
      </div>

      {overCapacity && (
        <p className="route-warning">Capacidade do veículo excedida para a seleção atual.</p>
      )}
      {geocodedSelected.length > MAX_OPTIMIZATION_STOPS && (
        <p className="route-warning">
          Máximo de {MAX_OPTIMIZATION_STOPS} paradas por otimização — selecione menos pedidos.
        </p>
      )}
      {rangeWarning && <p className="route-warning">{rangeWarning}</p>}

      <button
        className="route-optimize-btn"
        disabled={
          isOptimizing ||
          geocodedSelected.length === 0 ||
          geocodedSelected.length > MAX_OPTIMIZATION_STOPS
        }
        onClick={handleOptimize}
      >
        {isOptimizing ? 'Otimizando…' : 'Otimizar rota'}
      </button>

      {optimizedRoute && (
        <div className="route-result">
          <h3>Resultado</h3>
          <p>Distância: {optimizedRoute.totalDistanceKm.toFixed(1)} km</p>
          <p>Duração: {Math.round(optimizedRoute.totalDurationMin)} min</p>
          <p>Custo estimado: R$ {optimizedRoute.custoEstimado.toFixed(2)}</p>
          <p className="route-result-hint">Clique em uma parada para localizá-la no mapa</p>
          <ol>
            {optimizedRoute.stops.map((stop) => (
              <li
                key={stop.order.id}
                className={focusedOrderId === stop.order.id ? 'focused' : ''}
                onClick={() => setFocusedOrderId(stop.order.id)}
              >
                <span className="stop-seq">{stop.sequence}</span>
                {stop.order.pedido} — {stop.order.cidade}/{stop.order.estado}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
