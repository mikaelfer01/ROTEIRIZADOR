import { useStore } from '../../state/useStore'
import { optimizeRoute, MAX_OPTIMIZATION_STOPS } from '../../services/optimization'
import './RoutePanel.css'

export function RoutePanel() {
  const vehicles = useStore((s) => s.vehicles)
  const selectedVehicleId = useStore((s) => s.selectedVehicleId)
  const setSelectedVehicleId = useStore((s) => s.setSelectedVehicleId)

  const orders = useStore((s) => s.orders)
  const selectedOrderIds = useStore((s) => s.selectedOrderIds)
  const depot = useStore((s) => s.depot)

  const isOptimizing = useStore((s) => s.isOptimizing)
  const setOptimizing = useStore((s) => s.setOptimizing)
  const optimizedRoute = useStore((s) => s.optimizedRoute)
  const setOptimizedRoute = useStore((s) => s.setOptimizedRoute)

  const vehicle = vehicles.find((v) => v.id === selectedVehicleId)!
  const selectedOrders = orders.filter((o) => selectedOrderIds.has(o.id))
  const geocodedSelected = selectedOrders.filter((o) => o.lat != null && o.geocodeStatus === 'ok')

  const totalPeso = selectedOrders.reduce((sum, o) => sum + (o.pesoKg ?? 0), 0)
  const totalVolume = selectedOrders.reduce((sum, o) => sum + (o.volumeM3 ?? 0), 0)
  const overCapacity = totalPeso > vehicle.capacidadeKg || totalVolume > vehicle.capacidadeM3

  async function handleOptimize() {
    setOptimizing(true)
    try {
      const result = await optimizeRoute(depot, geocodedSelected, vehicle.perfil)
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
            </option>
          ))}
        </select>
      </label>

      <p className="route-summary-line">
        {selectedOrders.length} pedidos selecionados ({geocodedSelected.length} geocodificados) —{' '}
        {totalPeso.toFixed(0)}kg / {totalVolume.toFixed(2)}m³
      </p>

      {overCapacity && (
        <p className="route-warning">Capacidade do veículo excedida para a seleção atual.</p>
      )}
      {geocodedSelected.length > MAX_OPTIMIZATION_STOPS && (
        <p className="route-warning">
          Máximo de {MAX_OPTIMIZATION_STOPS} paradas por otimização — selecione menos pedidos.
        </p>
      )}

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
          <ol>
            {optimizedRoute.stops.map((stop) => (
              <li key={stop.order.id}>
                {stop.order.pedido} — {stop.order.cidade}/{stop.order.estado}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
