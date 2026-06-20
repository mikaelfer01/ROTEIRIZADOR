import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { requireMapboxToken } from '../../services/mapboxToken'
import { useStore } from '../../state/useStore'
import './MapView.css'

const ROUTE_SOURCE_ID = 'optimized-route'
const ROUTE_LAYER_ID = 'optimized-route-line'

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  const depot = useStore((s) => s.depot)
  const orders = useStore((s) => s.orders)
  const selectedOrderIds = useStore((s) => s.selectedOrderIds)
  const optimizedRoute = useStore((s) => s.optimizedRoute)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = requireMapboxToken()
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [depot.lng, depot.lat],
      zoom: 11,
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const depotMarker = new mapboxgl.Marker({ color: '#1d4ed8' })
      .setLngLat([depot.lng, depot.lat])
      .setPopup(new mapboxgl.Popup().setText(depot.nome))
      .addTo(map)
    markersRef.current.push(depotMarker)

    orders.forEach((order) => {
      if (order.lat == null || order.lng == null) return
      const isSelected = selectedOrderIds.has(order.id)
      const marker = new mapboxgl.Marker({
        color: isSelected ? '#16a34a' : '#9ca3af',
      })
        .setLngLat([order.lng, order.lat])
        .setPopup(new mapboxgl.Popup().setText(`${order.pedido} — ${order.cidade}/${order.estado}`))
        .addTo(map)
      markersRef.current.push(marker)
    })
  }, [orders, selectedOrderIds, depot])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const applyRoute = () => {
      const existingSource = map.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined

      if (!optimizedRoute) {
        if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID)
        if (existingSource) map.removeSource(ROUTE_SOURCE_ID)
        return
      }

      const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        properties: {},
        geometry: optimizedRoute.geometry,
      }

      if (existingSource) {
        existingSource.setData(geojson)
      } else {
        map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: geojson })
        map.addLayer({
          id: ROUTE_LAYER_ID,
          type: 'line',
          source: ROUTE_SOURCE_ID,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#1d4ed8', 'line-width': 4, 'line-opacity': 0.8 },
        })
      }

      const coords = optimizedRoute.geometry.coordinates as [number, number][]
      if (coords.length > 0) {
        const bounds = coords.reduce(
          (b, c) => b.extend(c),
          new mapboxgl.LngLatBounds(coords[0], coords[0]),
        )
        map.fitBounds(bounds, { padding: 60, maxZoom: 14 })
      }
    }

    if (map.isStyleLoaded()) {
      applyRoute()
    } else {
      map.once('load', applyRoute)
    }
  }, [optimizedRoute])

  return <div ref={containerRef} className="map-view" />
}
