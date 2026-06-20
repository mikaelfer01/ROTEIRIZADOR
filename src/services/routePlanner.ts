import type { Depot, Order, Vehicle } from '../types'

function bearingFromDepot(depot: Depot, order: Order): number {
  const dy = order.lat! - depot.lat
  const dx = (order.lng! - depot.lng) * Math.cos((depot.lat * Math.PI) / 180)
  return Math.atan2(dy, dx)
}

/**
 * Sweep algorithm for capacitated clustering (a standard CVRP heuristic): orders are
 * sorted by their angular position around the depot, then packed sequentially into
 * vehicle-capacity bins so each resulting cluster stays geographically coherent
 * instead of scattering stops across the map. A new bin starts whenever the current
 * one would exceed the vehicle's weight/volume capacity or the optimization API's
 * stop limit. An order that alone exceeds capacity is still placed in its own bin
 * rather than dropped, so every geocoded order ends up assigned to a route.
 */
export function planRouteClusters(
  orders: Order[],
  depot: Depot,
  vehicle: Vehicle,
  maxStops: number,
): Order[][] {
  const geocoded = orders.filter(
    (o) => o.geocodeStatus === 'ok' && o.lat != null && o.lng != null,
  )
  const sorted = [...geocoded].sort(
    (a, b) => bearingFromDepot(depot, a) - bearingFromDepot(depot, b),
  )

  const clusters: Order[][] = []
  let current: Order[] = []
  let usedKg = 0
  let usedM3 = 0

  for (const order of sorted) {
    const peso = order.pesoKg ?? 0
    const volume = order.volumeM3 ?? 0
    const fitsCapacity = usedKg + peso <= vehicle.capacidadeKg && usedM3 + volume <= vehicle.capacidadeM3
    const fitsStops = current.length < maxStops

    if (current.length > 0 && (!fitsCapacity || !fitsStops)) {
      clusters.push(current)
      current = []
      usedKg = 0
      usedM3 = 0
    }

    current.push(order)
    usedKg += peso
    usedM3 += volume
  }
  if (current.length > 0) clusters.push(current)

  return clusters
}
