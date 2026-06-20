import type { MapStyleKey } from '../types'

export const MAP_STYLE_URLS: Record<MapStyleKey, string> = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/light-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  navDay: 'mapbox://styles/mapbox/navigation-day-v1',
  navNight: 'mapbox://styles/mapbox/navigation-night-v1',
}

export const MAP_STYLE_LABELS: Record<MapStyleKey, string> = {
  streets: 'Ruas',
  satellite: 'Satélite',
  dark: 'Dark',
  light: 'Light',
  outdoors: 'Relevo',
  navDay: 'Nav Dia',
  navNight: 'Nav Noite',
}
