import { requireMapboxToken } from './mapboxToken'

export interface GeocodeResult {
  lat: number
  lng: number
}

export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const token = requireMapboxToken()
  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
  url.searchParams.set('q', query)
  url.searchParams.set('country', 'br')
  url.searchParams.set('limit', '1')
  url.searchParams.set('access_token', token)

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Falha na geocodificação (${res.status})`)
  }
  const data = await res.json()
  const feature = data.features?.[0]
  if (!feature) return null
  const [lng, lat] = feature.geometry.coordinates
  return { lat, lng }
}

const CONCURRENCY = 5

export async function geocodeBatch(
  queries: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<(GeocodeResult | null)[]> {
  const results: (GeocodeResult | null)[] = new Array(queries.length).fill(null)
  let cursor = 0
  let done = 0

  async function worker() {
    while (cursor < queries.length) {
      const index = cursor++
      try {
        results[index] = await geocodeAddress(queries[index])
      } catch {
        results[index] = null
      }
      done++
      onProgress?.(done, queries.length)
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queries.length) }, worker))
  return results
}
