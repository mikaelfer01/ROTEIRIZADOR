import { create } from 'zustand'
import type { Depot, ImportResult, MapStyleKey, OptimizedRoute, Order, Vehicle } from '../types'

const DEFAULT_DEPOT: Depot = {
  nome: 'Depósito Vila Paris',
  endereco: 'Rua A, 330, Vila Paris, Contagem, MG',
  lat: -19.9317,
  lng: -44.0539,
}

const DEFAULT_VEHICLES: Vehicle[] = [
  { id: 'moto', nome: 'Moto', capacidadeKg: 30, capacidadeM3: 0.1, custoPorKm: 0.6, perfil: 'driving' },
  { id: 'van', nome: 'Van', capacidadeKg: 1200, capacidadeM3: 8, custoPorKm: 1.4, perfil: 'driving' },
  { id: 'caminhao', nome: 'Caminhão 3/4', capacidadeKg: 3500, capacidadeM3: 20, custoPorKm: 2.3, perfil: 'driving-traffic' },
]

interface AppState {
  depot: Depot
  vehicles: Vehicle[]
  selectedVehicleId: string

  orders: Order[]
  selectedOrderIds: Set<string>
  focusedOrderId: string | null

  optimizedRoute: OptimizedRoute | null
  isOptimizing: boolean
  isGeocoding: boolean
  geocodeProgress: { done: number; total: number } | null

  importWarnings: string[]
  importErrors: string[]

  mapStyle: MapStyleKey
  show3D: boolean
  showGlobe: boolean
  showTraffic: boolean

  setImportResult: (result: ImportResult) => void
  toggleOrderSelection: (id: string) => void
  selectAllOrders: () => void
  clearSelection: () => void
  setSelectedVehicleId: (id: string) => void
  setFocusedOrderId: (id: string | null) => void
  updateOrderGeocode: (id: string, lat: number, lng: number, status: 'ok' | 'failed') => void
  setGeocoding: (isGeocoding: boolean, progress?: { done: number; total: number } | null) => void
  setOptimizing: (isOptimizing: boolean) => void
  setOptimizedRoute: (route: OptimizedRoute | null) => void
  setDepot: (depot: Depot) => void

  setMapStyle: (style: MapStyleKey) => void
  toggle3D: () => void
  toggleGlobe: () => void
  toggleTraffic: () => void
}

export const useStore = create<AppState>((set) => ({
  depot: DEFAULT_DEPOT,
  vehicles: DEFAULT_VEHICLES,
  selectedVehicleId: DEFAULT_VEHICLES[1].id,

  orders: [],
  selectedOrderIds: new Set(),
  focusedOrderId: null,

  optimizedRoute: null,
  isOptimizing: false,
  isGeocoding: false,
  geocodeProgress: null,

  importWarnings: [],
  importErrors: [],

  mapStyle: 'streets',
  show3D: false,
  showGlobe: false,
  showTraffic: false,

  setImportResult: (result) =>
    set({
      orders: result.orders,
      selectedOrderIds: new Set(),
      focusedOrderId: null,
      importWarnings: result.warnings,
      importErrors: result.errors,
      optimizedRoute: null,
    }),

  toggleOrderSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedOrderIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { selectedOrderIds: next }
    }),

  selectAllOrders: () =>
    set((state) => ({ selectedOrderIds: new Set(state.orders.map((o) => o.id)) })),

  clearSelection: () => set({ selectedOrderIds: new Set() }),

  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),

  setFocusedOrderId: (id) => set({ focusedOrderId: id }),

  updateOrderGeocode: (id, lat, lng, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, lat, lng, geocodeStatus: status } : o,
      ),
    })),

  setGeocoding: (isGeocoding, progress = null) =>
    set({ isGeocoding, geocodeProgress: progress }),

  setOptimizing: (isOptimizing) => set({ isOptimizing }),

  setOptimizedRoute: (optimizedRoute) => set({ optimizedRoute }),

  setDepot: (depot) => set({ depot }),

  setMapStyle: (mapStyle) => set({ mapStyle }),
  toggle3D: () => set((state) => ({ show3D: !state.show3D })),
  toggleGlobe: () => set((state) => ({ showGlobe: !state.showGlobe })),
  toggleTraffic: () => set((state) => ({ showTraffic: !state.showTraffic })),
}))
