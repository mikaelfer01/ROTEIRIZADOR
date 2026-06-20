import { useState } from 'react'
import { useStore } from '../../state/useStore'
import { optimizeRoute, MAX_OPTIMIZATION_STOPS, type OptimizationResult } from '../../services/optimization'
import { selectOrdersForMaxLoad } from '../../services/loadPlanner'
import { planRouteClusters } from '../../services/routePlanner'
import { openManifest } from '../../services/manifest'
import type { OptimizedRoute } from '../../types'
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

  const routePlan = useStore((s) => s.routePlan)
  const setRoutePlan = useStore((s) => s.setRoutePlan)
  const activeRouteIndex = useStore((s) => s.activeRouteIndex)
  const setActiveRouteIndex = useStore((s) => s.setActiveRouteIndex)
  const replaceRouteInPlan = useStore((s) => s.replaceRouteInPlan)
  const appendRouteToPlan = useStore((s) => s.appendRouteToPlan)
  const removeRouteFromPlan = useStore((s) => s.removeRouteFromPlan)
  const isPlanningFleet = useStore((s) => s.isPlanningFleet)
  const planProgress = useStore((s) => s.planProgress)
  const setPlanningFleet = useStore((s) => s.setPlanningFleet)

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

  function buildRoute(result: OptimizationResult, pesoKg: number, volumeM3: number): OptimizedRoute {
    return {
      stops: result.orderedWaypoints.map((wp, idx) => ({
        order: wp.order,
        sequence: idx + 1,
        distanceFromPrevKm: 0,
        durationFromPrevMin: 0,
      })),
      totalDistanceKm: result.totalDistanceKm,
      totalDurationMin: result.totalDurationMin,
      geometry: result.geometry,
      totalPesoKg: pesoKg,
      totalVolumeM3: volumeM3,
      custoEstimado: result.totalDistanceKm * vehicle.custoPorKm,
      vehicle,
    }
  }

  function handleMaximizeLoad() {
    const best = selectOrdersForMaxLoad(orders, vehicle, MAX_OPTIMIZATION_STOPS)
    setSelectedOrderIds(new Set(best.map((o) => o.id)))
    setRangeWarning(null)
  }

  function loadRouteForEditing(index: number) {
    const route = routePlan[index]
    if (!route) return
    setActiveRouteIndex(index)
    setOptimizedRoute(route)
    setSelectedOrderIds(new Set(route.stops.map((s) => s.order.id)))
    setRangeWarning(null)
  }

  function handleNewRouteDraft() {
    setActiveRouteIndex(null)
    setOptimizedRoute(null)
    setSelectedOrderIds(new Set())
    setRangeWarning(null)
  }

  function handleRemoveRoute(index: number) {
    removeRouteFromPlan(index)
    if (activeRouteIndex === index) {
      setOptimizedRoute(null)
      setSelectedOrderIds(new Set())
    }
  }

  async function handlePlanFleet() {
    if (geocodedOrders.length === 0) return
    setPlanningFleet(true, { done: 0, total: 0 })
    setRangeWarning(null)
    try {
      const clusters = planRouteClusters(orders, depot, vehicle, MAX_OPTIMIZATION_STOPS)
      const routes: OptimizedRoute[] = []
      for (let i = 0; i < clusters.length; i++) {
        setPlanningFleet(true, { done: i, total: clusters.length })
        const cluster = clusters[i]
        const result = await optimizeRoute(depot, cluster, vehicle.perfil)
        const pesoKg = cluster.reduce((sum, o) => sum + (o.pesoKg ?? 0), 0)
        const volumeM3 = cluster.reduce((sum, o) => sum + (o.volumeM3 ?? 0), 0)
        routes.push(buildRoute(result, pesoKg, volumeM3))
      }
      setActiveRouteIndex(routes.length > 0 ? 0 : null)
      setRoutePlan(routes)
      if (routes.length > 0) {
        setOptimizedRoute(routes[0])
        setSelectedOrderIds(new Set(routes[0].stops.map((s) => s.order.id)))
      } else {
        setOptimizedRoute(null)
        setSelectedOrderIds(new Set())
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao planejar frota')
    } finally {
      setPlanningFleet(false)
    }
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
      const route = buildRoute(result, totalPeso, totalVolume)
      setOptimizedRoute(route)
      if (activeRouteIndex != null) {
        replaceRouteInPlan(activeRouteIndex, route)
      } else {
        appendRouteToPlan(route)
        setActiveRouteIndex(routePlan.length)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao otimizar rota')
    } finally {
      setOptimizing(false)
    }
  }

  const planTotals = routePlan.reduce(
    (acc, r) => ({
      distanceKm: acc.distanceKm + r.totalDistanceKm,
      custo: acc.custo + r.custoEstimado,
      pedidos: acc.pedidos + r.stops.length,
    }),
    { distanceKm: 0, custo: 0, pedidos: 0 },
  )

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
        className="route-plan-fleet-btn"
        disabled={isPlanningFleet || geocodedOrders.length === 0}
        onClick={handlePlanFleet}
      >
        {isPlanningFleet
          ? `Planejando rota ${(planProgress?.done ?? 0) + 1}…`
          : `Planejar frota automaticamente (${geocodedOrders.length} pedidos)`}
      </button>
      <p className="route-result-hint">
        Agrupa todos os pedidos geocodificados em rotas dentro da capacidade do veículo selecionado —
        sem necessidade de seleção manual.
      </p>

      {routePlan.length > 0 && (
        <div className="route-plan-list">
          <p className="route-summary-line">
            Plano: {routePlan.length} rota(s) · {planTotals.pedidos} pedidos · {planTotals.distanceKm.toFixed(0)} km ·
            R$ {planTotals.custo.toFixed(2)}
          </p>
          {routePlan.map((route, idx) => {
            const isActive = activeRouteIndex === idx
            const routeOverCapacity =
              route.totalPesoKg > route.vehicle.capacidadeKg || route.totalVolumeM3 > route.vehicle.capacidadeM3
            return (
              <div key={idx} className={`route-plan-card${isActive ? ' active' : ''}`}>
                <button className="route-plan-card-main" onClick={() => loadRouteForEditing(idx)}>
                  <span className="route-plan-card-title">Rota {idx + 1}</span>
                  <span className="route-plan-card-meta">
                    {route.stops.length} paradas · {route.totalDistanceKm.toFixed(0)} km · R${' '}
                    {route.custoEstimado.toFixed(2)}
                  </span>
                  {routeOverCapacity && (
                    <span className="route-plan-card-warning">Acima da capacidade do veículo</span>
                  )}
                </button>
                <div className="route-plan-card-actions">
                  <button
                    type="button"
                    title="Gerar manifesto"
                    onClick={() => openManifest(route, depot, `Rota ${idx + 1}`)}
                  >
                    📋
                  </button>
                  <button type="button" title="Remover rota" onClick={() => handleRemoveRoute(idx)}>
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
          <button className="route-new-draft-btn" onClick={handleNewRouteDraft}>
            + Nova rota manual
          </button>
        </div>
      )}

      <button
        className="route-maximize-btn"
        disabled={geocodedOrders.length === 0}
        onClick={handleMaximizeLoad}
      >
        Montar carga máxima ({geocodedOrders.length} pedidos na carteira)
      </button>

      <p className="route-summary-line">
        {activeRouteIndex != null ? `Editando rota ${activeRouteIndex + 1} — ` : ''}
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
        {isOptimizing
          ? 'Otimizando…'
          : activeRouteIndex != null
            ? `Recalcular rota ${activeRouteIndex + 1}`
            : 'Otimizar rota'}
      </button>

      {optimizedRoute && (
        <div className="route-result">
          <div className="route-result-header">
            <h3>{activeRouteIndex != null ? `Rota ${activeRouteIndex + 1}` : 'Resultado'}</h3>
            <button
              type="button"
              className="route-manifest-btn"
              onClick={() =>
                openManifest(
                  optimizedRoute,
                  depot,
                  activeRouteIndex != null ? `Rota ${activeRouteIndex + 1}` : 'Rota',
                )
              }
            >
              📋 Manifesto
            </button>
          </div>
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
