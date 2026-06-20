export interface Order {
  id: string
  pedido: string
  cliente?: string
  endereco?: string
  cidade: string
  estado: string
  cep?: string
  pesoKg?: number
  volumeM3?: number
  valor?: number
  lat?: number
  lng?: number
  geocodeStatus: 'pending' | 'ok' | 'failed'
}

export interface Vehicle {
  id: string
  nome: string
  capacidadeKg: number
  capacidadeM3: number
  custoPorKm: number
  perfil: MapboxProfile
}

export type MapboxProfile = 'driving' | 'driving-traffic' | 'walking' | 'cycling'

export type MapStyleKey =
  | 'streets'
  | 'satellite'
  | 'dark'
  | 'light'
  | 'outdoors'
  | 'navDay'
  | 'navNight'

export interface Depot {
  nome: string
  endereco: string
  lat: number
  lng: number
}

export interface RouteStop {
  order: Order
  sequence: number
  distanceFromPrevKm: number
  durationFromPrevMin: number
}

export interface OptimizedRoute {
  stops: RouteStop[]
  totalDistanceKm: number
  totalDurationMin: number
  geometry: GeoJSON.LineString
  totalPesoKg: number
  totalVolumeM3: number
  custoEstimado: number
  vehicle: Vehicle
}

export interface ImportResult {
  orders: Order[]
  warnings: string[]
  errors: string[]
}
