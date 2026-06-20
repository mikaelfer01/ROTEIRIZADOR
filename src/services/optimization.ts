import { requireMapboxToken } from './mapboxToken'
import type { Depot, MapboxProfile, Order } from '../types'

export const MAX_OPTIMIZATION_STOPS = 12

export interface OptimizationWaypoint {
  order: Order
  waypointIndex: number
}

export interface OptimizationResult {
  orderedWaypoints: OptimizationWaypoint[]
  geometry: GeoJSON.LineString
  totalDistanceKm: number
  totalDurationMin: number
}

interface MapboxTripResponse {
  code: string
  message?: string
  trips?: Array<{
    distance: number
    duration: number
    geometry: GeoJSON.LineString
  }>
  waypoints?: Array<{
    waypoint_index: number
    location: [number, number]
  }>
}

export async function optimizeRoute(
  depot: Depot,
  stops: Order[],
  profile: MapboxProfile,
): Promise<OptimizationResult> {
  const token = requireMapboxToken()

  const geocoded = stops.filter((s) => s.lat != null && s.lng != null)
  if (geocoded.length === 0) {
    throw new Error('Nenhum pedido geocodificado para otimizar.')
  }
  if (geocoded.length > MAX_OPTIMIZATION_STOPS) {
    throw new Error(
      `A API de otimização da Mapbox aceita no máximo ${MAX_OPTIMIZATION_STOPS} paradas por requisição. Selecione até ${MAX_OPTIMIZATION_STOPS} pedidos.`,
    )
  }

  const coordinates = [
    `${depot.lng},${depot.lat}`,
    ...geocoded.map((s) => `${s.lng},${s.lat}`),
  ].join(';')

  const url = new URL(
    `https://api.mapbox.com/optimized-trips/v1/mapbox/${profile}/${coordinates}`,
  )
  url.searchParams.set('roundtrip', 'true')
  url.searchParams.set('source', 'first')
  url.searchParams.set('geometries', 'geojson')
  url.searchParams.set('overview', 'full')
  url.searchParams.set('access_token', token)

  const res = await fetch(url.toString())
  const data: MapboxTripResponse = await res.json()

  if (!res.ok || data.code !== 'Ok' || !data.trips?.[0] || !data.waypoints) {
    throw new Error(data.message ?? `Falha ao otimizar rota (${data.code ?? res.status})`)
  }

  const trip = data.trips[0]

  const orderedWaypoints = data.waypoints
    .map((wp, inputIndex) => ({ wp, inputIndex }))
    .filter(({ inputIndex }) => inputIndex > 0)
    .sort((a, b) => a.wp.waypoint_index - b.wp.waypoint_index)
    .map(({ inputIndex }) => ({
      order: geocoded[inputIndex - 1],
      waypointIndex: data.waypoints![inputIndex].waypoint_index,
    }))

  return {
    orderedWaypoints,
    geometry: trip.geometry,
    totalDistanceKm: trip.distance / 1000,
    totalDurationMin: trip.duration / 60,
  }
}
