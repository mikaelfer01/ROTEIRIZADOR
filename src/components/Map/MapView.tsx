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
const ROUTE_CASING_LAYER_ID = 'optimized-route-casing'
const ROUTE_LAYER_ID = 'optimized-route-line'

const DEPOT_COLOR = '#06234c'
const SELECTED_COLOR = '#1f8a55'
const MUTED_COLOR = '#9ca3af'

function applyRouteLayer(map: mapboxgl.Map, optimizedRoute: OptimizedRoute | null) {
  const existingSource = map.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined

  if (!optimizedRoute) {
    if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID)
    if (map.getLayer(ROUTE_CASING_LAYER_ID)) map.removeLayer(ROUTE_CASING_LAYER_ID)
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
      id: ROUTE_CASING_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#c9a227', 'line-width': 7, 'line-opacity': 0.55 },
    })
    map.addLayer({
      id: ROUTE_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#0b3d8f', 'line-width': 4, 'line-opacity': 0.95 },
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
  const depotMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const orderMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const isFirstStyleRender = useRef(true)

  const depot = useStore((s) => s.depot)
  const orders = useStore((s) => s.orders)
  const selectedOrderIds = useStore((s) => s.selectedOrderIds)
  const focusedOrderId = useStore((s) => s.focusedOrderId)
  const optimizedRoute = useStore((s) => s.optimizedRoute)
  const mapStyle = useStore((s) => s.mapStyle)
  const show3D = useStore((s) => s.show3D)
  const showGlobe = useStore((s) => s.showGlobe)
  const showTraffic = useStore((s) => s.showTraffic)
  const toggleOrderSelection = useStore((s) => s.toggleOrderSelection)

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

    map.on('mouseenter', ROUTE_LAYER_ID, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', ROUTE_LAYER_ID, () => {
      map.getCanvas().style.cursor = ''
    })
    map.on('click', ROUTE_LAYER_ID, (e) => {
      const route = useStore.getState().optimizedRoute
      if (!route) return
      new mapboxgl.Popup({ offset: 8 })
        .setLngLat(e.lngLat)
        .setHTML(
          `<strong>Rota otimizada</strong><br/>${route.totalDistanceKm.toFixed(1)} km · ${Math.round(
            route.totalDurationMin,
          )} min<br/>Custo estimado: R$ ${route.custoEstimado.toFixed(2)}`,
        )
        .addTo(map)
    })

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

    orderMarkersRef.current.forEach((m) => m.remove())
    orderMarkersRef.current.clear()
    depotMarkerRef.current?.remove()

    const depotMarker = new mapboxgl.Marker({ color: DEPOT_COLOR })
      .setLngLat([depot.lng, depot.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 12 }).setHTML(
          `<strong>${depot.nome}</strong><br/>${depot.endereco}`,
        ),
      )
      .addTo(map)
    depotMarkerRef.current = depotMarker

    orders.forEach((order) => {
      if (order.lat == null || order.lng == null) return
      const isSelected = selectedOrderIds.has(order.id)
      const rows = [
        ['Pedido', order.pedido],
        ['Cliente', order.cliente],
        ['Endereço', order.endereco],
        ['Cidade/UF', `${order.cidade}/${order.estado}`],
        ['CEP', order.cep],
        ['Peso', order.pesoKg != null ? `${order.pesoKg.toFixed(1)} kg` : undefined],
        ['Volume', order.volumeM3 != null ? `${order.volumeM3.toFixed(2)} m³` : undefined],
        ['Valor', order.valor != null ? `R$ ${order.valor.toFixed(2)}` : undefined],
      ].filter(([, value]) => value)

      const popupHtml = `
        <strong>${order.pedido}</strong>
        <table class="order-popup-table">
          ${rows
            .slice(1)
            .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`)
            .join('')}
        </table>
        <em>Clique no marcador para ${isSelected ? 'remover da' : 'incluir na'} rota</em>
      `

      const popup = new mapboxgl.Popup({ offset: 12, closeButton: false, closeOnClick: false }).setHTML(popupHtml)

      const marker = new mapboxgl.Marker({
        color: isSelected ? SELECTED_COLOR : MUTED_COLOR,
      })
        .setLngLat([order.lng, order.lat])
        .setPopup(popup)
        .addTo(map)

      const el = marker.getElement()
      el.style.cursor = 'pointer'
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        toggleOrderSelection(order.id)
      })
      el.addEventListener('mouseenter', () => {
        if (!popup.isOpen()) marker.togglePopup()
      })
      el.addEventListener('mouseleave', () => {
        if (popup.isOpen()) marker.togglePopup()
      })

      orderMarkersRef.current.set(order.id, marker)
    })
  }, [orders, selectedOrderIds, depot, toggleOrderSelection])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    applyRouteLayer(map, optimizedRoute)
  }, [optimizedRoute])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !focusedOrderId) return
    const marker = orderMarkersRef.current.get(focusedOrderId)
    if (!marker) return
    map.flyTo({ center: marker.getLngLat(), zoom: 15, duration: 800 })
    const popup = marker.getPopup()
    if (popup && !popup.isOpen()) marker.togglePopup()
  }, [focusedOrderId])

  return (
    <div className="map-view-wrap">
      <div ref={containerRef} className="map-view" />
      <MapControls />
    </div>
  )
}
