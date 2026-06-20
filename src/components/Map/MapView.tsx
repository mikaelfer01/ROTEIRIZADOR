import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { requireMapboxToken } from '../../services/mapboxToken'
import { useStore } from '../../state/useStore'
import { MAP_STYLE_URLS } from '../../services/mapStyles'
import { apply3D, applyOverlays, applyTraffic } from './mapOverlays'
import type { OptimizedRoute } from '../../types'
import { MapControls } from './MapControls'
import './MapView.css'

const ROUTE_SOURCE_ID = 'optimized-route'
const ROUTE_LAYER_ID = 'optimized-route-line'

function applyRouteLayer(map: mapboxgl.Map, optimizedRoute: OptimizedRoute | null) {
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

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const isFirstStyleRender = useRef(true)

  const depot = useStore((s) => s.depot)
  const orders = useStore((s) => s.orders)
  const selectedOrderIds = useStore((s) => s.selectedOrderIds)
  const optimizedRoute = useStore((s) => s.optimizedRoute)
  const mapStyle = useStore((s) => s.mapStyle)
  const show3D = useStore((s) => s.show3D)
  const showGlobe = useStore((s) => s.showGlobe)
  const showTraffic = useStore((s) => s.showTraffic)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = requireMapboxToken()
    const initial = useStore.getState()
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URLS[initial.mapStyle],
      center: [initial.depot.lng, initial.depot.lat],
      zoom: 11,
      projection: initial.showGlobe ? 'globe' : 'mercator',
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    const reapplyStyleDependentLayers = () => {
      const state = useStore.getState()
      applyOverlays(map, { show3D: state.show3D, showTraffic: state.showTraffic })
      applyRouteLayer(map, state.optimizedRoute)
    }

    map.on('load', reapplyStyleDependentLayers)
    map.on('style.load', reapplyStyleDependentLayers)

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.off('load', reapplyStyleDependentLayers)
      map.off('style.load', reapplyStyleDependentLayers)
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (isFirstStyleRender.current) {
      isFirstStyleRender.current = false
      return
    }
    map.setStyle(MAP_STYLE_URLS[mapStyle])
  }, [mapStyle])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setProjection(showGlobe ? 'globe' : 'mercator')
  }, [showGlobe])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    apply3D(map, show3D)
  }, [show3D])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    applyTraffic(map, showTraffic)
  }, [showTraffic])

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
    if (!map || !map.isStyleLoaded()) return
    applyRouteLayer(map, optimizedRoute)
  }, [optimizedRoute])

  return (
    <div className="map-view-wrap">
      <div ref={containerRef} className="map-view" />
      <MapControls />
    </div>
  )
}
