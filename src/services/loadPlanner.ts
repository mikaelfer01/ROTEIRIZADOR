import type { Order, Vehicle } from '../types'

/**
 * Greedy first-fit-decreasing bin-packing: orders are ranked by how much of the
 * vehicle's combined weight+volume capacity they'd consume, then added in that
 * order while they still fit — this drives utilization as close to 100% as
 * possible within the Mapbox Optimization API's stop limit.
 */
export function selectOrdersForMaxLoad(orders: Order[], vehicle: Vehicle, maxStops: number): Order[] {
  const candidates = orders.filter(
    (o) => o.geocodeStatus === 'ok' && o.lat != null && o.lng != null,
  )

  const scored = candidates
    .map((order) => {
      const pesoRatio = vehicle.capacidadeKg > 0 ? (order.pesoKg ?? 0) / vehicle.capacidadeKg : 0
      const volumeRatio = vehicle.capacidadeM3 > 0 ? (order.volumeM3 ?? 0) / vehicle.capacidadeM3 : 0
      return { order, score: pesoRatio + volumeRatio }
    })
    .sort((a, b) => b.score - a.score)

  const selected: Order[] = []
  let usedKg = 0
  let usedM3 = 0

  for (const { order } of scored) {
    if (selected.length >= maxStops) break
    const peso = order.pesoKg ?? 0
    const volume = order.volumeM3 ?? 0
    if (usedKg + peso > vehicle.capacidadeKg) continue
    if (usedM3 + volume > vehicle.capacidadeM3) continue
    selected.push(order)
    usedKg += peso
    usedM3 += volume
  }

  return selected
}
