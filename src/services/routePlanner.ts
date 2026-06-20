import type { Depot, Order, Vehicle } from '../types'

export interface FleetCluster {
  orders: Order[]
  vehicle: Vehicle
}

function bearingFromDepot(depot: Depot, order: Order): number {
  const dy = order.lat! - depot.lat
  const dx = (order.lng! - depot.lng) * Math.cos((depot.lat * Math.PI) / 180)
  return Math.atan2(dy, dx)
}

function totals(orders: Order[]) {
  return {
    kg: orders.reduce((sum, o) => sum + (o.pesoKg ?? 0), 0),
    m3: orders.reduce((sum, o) => sum + (o.volumeM3 ?? 0), 0),
  }
}

/** Picks the cheapest (lowest cost/km) vehicle able to carry the given load. */
function cheapestViableVehicle(
  kg: number,
  m3: number,
  stopCount: number,
  vehicles: Vehicle[],
  maxStops: number,
): Vehicle | null {
  const viable = vehicles
    .filter((v) => stopCount <= maxStops && kg <= v.capacidadeKg && m3 <= v.capacidadeM3)
    .sort((a, b) => a.custoPorKm - b.custoPorKm)
  return viable[0] ?? null
}

/**
 * Sweep algorithm for capacitated clustering (a standard CVRP heuristic), extended
 * to pick the vehicle automatically instead of requiring one upfront: orders are
 * swept by angular position around the depot and packed into geographically
 * coherent bins bounded only by the largest available vehicle's capacity and the
 * optimization API's stop limit; once a bin is closed, it's assigned the cheapest
 * vehicle in the fleet that can actually carry its accumulated weight/volume —
 * so light nearby clusters land on a Moto/Fiorino while heavier ones escalate to
 * a Van/Caminhão, and a single order too big for the owned fleet falls through to
 * the highest-capacity option (e.g. an outsourced/Fretebras entry) on its own.
 */
export function planFleetClusters(
  orders: Order[],
  depot: Depot,
  vehicles: Vehicle[],
  maxStops: number,
): FleetCluster[] {
  const geocoded = orders.filter(
    (o) => o.geocodeStatus === 'ok' && o.lat != null && o.lng != null,
  )
  const sorted = [...geocoded].sort(
    (a, b) => bearingFromDepot(depot, a) - bearingFromDepot(depot, b),
  )

  const largestVehicle = [...vehicles].sort((a, b) => b.capacidadeKg - a.capacidadeKg)[0]

  const clusters: FleetCluster[] = []
  let current: Order[] = []

  const closeCluster = () => {
    if (current.length === 0) return
    const t = totals(current)
    const vehicle = cheapestViableVehicle(t.kg, t.m3, current.length, vehicles, maxStops) ?? largestVehicle
    clusters.push({ orders: current, vehicle })
    current = []
  }

  for (const order of sorted) {
    const trial = [...current, order]
    const t = totals(trial)
    const fitsLargest =
      t.kg <= largestVehicle.capacidadeKg && t.m3 <= largestVehicle.capacidadeM3 && trial.length <= maxStops

    if (current.length > 0 && !fitsLargest) closeCluster()
    current.push(order)
  }
  closeCluster()

  return clusters
}

/**
 * Upgrades a cluster's vehicle if the actually-optimized route distance exceeds
 * its range limit (e.g. a Fiorino capped at 2000km), picking the cheapest vehicle
 * in the fleet that both carries the load and has enough range — falling back to
 * the original vehicle if nothing in the fleet qualifies.
 */
export function vehicleForRouteDistance(
  vehicles: Vehicle[],
  current: Vehicle,
  distanceKm: number,
  kg: number,
  m3: number,
): Vehicle {
  if (!current.distanciaMaximaKm || distanceKm <= current.distanciaMaximaKm) return current
  const candidates = vehicles
    .filter(
      (v) => v.capacidadeKg >= kg && v.capacidadeM3 >= m3 && (!v.distanciaMaximaKm || v.distanciaMaximaKm >= distanceKm),
    )
    .sort((a, b) => a.custoPorKm - b.custoPorKm)
  return candidates[0] ?? current
}
