import type { Map as MapboxMap } from 'mapbox-gl'

const BUILDINGS_LAYER_ID = '3d-buildings'
const TERRAIN_SOURCE_ID = 'mapbox-dem'
const SKY_LAYER_ID = 'sky'
const TRAFFIC_SOURCE_ID = 'mapbox-traffic'
const TRAFFIC_LAYER_ID = 'traffic-flow'

function findFirstSymbolLayerId(map: MapboxMap): string | undefined {
  const layers = map.getStyle()?.layers ?? []
  return layers.find((l) => l.type === 'symbol')?.id
}

export function apply3D(map: MapboxMap, enabled: boolean) {
  if (enabled) {
    if (!map.getSource(TERRAIN_SOURCE_ID)) {
      map.addSource(TERRAIN_SOURCE_ID, {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
    }
    map.setTerrain({ source: TERRAIN_SOURCE_ID, exaggeration: 1.4 })

    if (!map.getLayer(SKY_LAYER_ID)) {
      map.addLayer({
        id: SKY_LAYER_ID,
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun-intensity': 10,
        },
      })
    }

    if (!map.getLayer(BUILDINGS_LAYER_ID) && map.getSource('composite')) {
      try {
        map.addLayer(
          {
            id: BUILDINGS_LAYER_ID,
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 14,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.7,
            },
          },
          findFirstSymbolLayerId(map),
        )
      } catch {
        // base style has no `building` source-layer (e.g. raw satellite imagery) — skip silently
      }
    }

    map.easeTo({ pitch: 60, duration: 600 })
  } else {
    map.setTerrain(null)
    if (map.getLayer(SKY_LAYER_ID)) map.removeLayer(SKY_LAYER_ID)
    if (map.getLayer(BUILDINGS_LAYER_ID)) map.removeLayer(BUILDINGS_LAYER_ID)
    map.easeTo({ pitch: 0, duration: 600 })
  }
}

export function applyTraffic(map: MapboxMap, enabled: boolean) {
  if (enabled) {
    if (!map.getSource(TRAFFIC_SOURCE_ID)) {
      map.addSource(TRAFFIC_SOURCE_ID, {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1',
      })
    }
    if (!map.getLayer(TRAFFIC_LAYER_ID)) {
      map.addLayer({
        id: TRAFFIC_LAYER_ID,
        type: 'line',
        source: TRAFFIC_SOURCE_ID,
        'source-layer': 'traffic',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-width': 2.5,
          'line-color': [
            'match',
            ['get', 'congestion'],
            'low', '#22c55e',
            'moderate', '#eab308',
            'heavy', '#f97316',
            'severe', '#dc2626',
            '#9ca3af',
          ],
        },
      })
    }
  } else {
    if (map.getLayer(TRAFFIC_LAYER_ID)) map.removeLayer(TRAFFIC_LAYER_ID)
  }
}

export function applyOverlays(
  map: MapboxMap,
  state: { show3D: boolean; showTraffic: boolean },
) {
  apply3D(map, state.show3D)
  applyTraffic(map, state.showTraffic)
}
