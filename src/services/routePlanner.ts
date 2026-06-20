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

function fitsVehicle(orders: Order[], vehicle: Vehicle, maxStops: number): boolean {
  const t = totals(orders)
  return t.kg <= vehicle.capacidadeKg && t.m3 <= vehicle.capacidadeM3 && orders.length <= maxStops
}

/**
 * It's not economical to dispatch a vehicle that's mostly empty, so once the sweep
 * below produces geographically-adjacent groups, this pass merges any group whose
 * load falls short of the fleet's smallest vehicle capacity into its neighbor —
 * e.g. two 500kg pockets become one 1000kg Fiorino load instead of two near-empty
 * runs — stopping only when a merge would bust the largest vehicle's capacity or
 * the optimization API's stop limit. A leftover undersized tail group is folded
 * into its predecessor as a final pass since it has no "next" neighbor to join.
 */
function mergeUndersizedGroups(
  groups: Order[][],
  largestVehicle: Vehicle,
  maxStops: number,
  minLoadKg: number,
): Order[][] {
  const merged = groups.map((g) => [...g])

  let changed = true
  while (changed) {
    changed = false
    for (let i = 0; i < merged.length - 1; i++) {
      if (totals(merged[i]).kg >= minLoadKg) continue
      const combined = [...merged[i], ...merged[i + 1]]
      if (fitsVehicle(combined, largestVehicle, maxStops)) {
        merged[i] = combined
        merged.splice(i + 1, 1)
        changed = true
        break
      }
    }
  }

  const lastIdx = merged.length - 1
  if (lastIdx > 0 && totals(merged[lastIdx]).kg < minLoadKg) {
    const combined = [...merged[lastIdx - 1], ...merged[lastIdx]]
    if (fitsVehicle(combined, largestVehicle, maxStops)) {
      merged[lastIdx - 1] = combined
      merged.pop()
    }
  }

  return merged
}

/**
 * Sweep algorithm for capacitated clustering (a standard CVRP heuristic), extended
 * to pick the vehicle automatically instead of requiring one upfront: orders are
 * swept by angular position around the depot and packed into geographically
 * coherent bins bounded only by the largest available vehicle's capacity and the
 * optimization API's stop limit. Undersized bins are then merged with their
 * geographic neighbor (see mergeUndersizedGroups) so no route ships below the
 * smallest vehicle's capacity. Each final bin is assigned the cheapest vehicle in
 * the fleet that can actually carry its accumulated weight/volume — light nearby
 * loads land on the Fiorino, and anything too big for the owned fleet falls
 * through to the outsourced Fretebras entry on its own.
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
  const minLoadKg = Math.min(...vehicles.map((v) => v.capacidadeKg))

  const groups: Order[][] = []
  let current: Order[] = []

  for (const order of sorted) {
    const trial = [...current, order]
    const fitsLargest = fitsVehicle(trial, largestVehicle, maxStops)

    if (current.length > 0 && !fitsLargest) {
      groups.push(current)
      current = []
    }
    current.push(order)
  }
  if (current.length > 0) groups.push(current)

  const finalGroups = mergeUndersizedGroups(groups, largestVehicle, maxStops, minLoadKg)

  return finalGroups.map((groupOrders) => {
    const t = totals(groupOrders)
    const vehicle =
      cheapestViableVehicle(t.kg, t.m3, groupOrders.length, vehicles, maxStops) ?? largestVehicle
    return { orders: groupOrders, vehicle }
  })
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
