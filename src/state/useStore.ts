import { create } from 'zustand'
import type { Depot, ImportResult, OptimizedRoute, Order, Vehicle } from '../types'

const DEFAULT_DEPOT: Depot = {
  nome: 'Centro de Distribuição',
  endereco: 'Av. Paulista, 1000, São Paulo, SP',
  lat: -23.5613,
  lng: -46.6565,
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

  optimizedRoute: OptimizedRoute | null
  isOptimizing: boolean
  isGeocoding: boolean
  geocodeProgress: { done: number; total: number } | null

  importWarnings: string[]
  importErrors: string[]

  setImportResult: (result: ImportResult) => void
  toggleOrderSelection: (id: string) => void
  selectAllOrders: () => void
  clearSelection: () => void
  setSelectedVehicleId: (id: string) => void
  updateOrderGeocode: (id: string, lat: number, lng: number, status: 'ok' | 'failed') => void
  setGeocoding: (isGeocoding: boolean, progress?: { done: number; total: number } | null) => void
  setOptimizing: (isOptimizing: boolean) => void
  setOptimizedRoute: (route: OptimizedRoute | null) => void
  setDepot: (depot: Depot) => void
}

export const useStore = create<AppState>((set) => ({
  depot: DEFAULT_DEPOT,
  vehicles: DEFAULT_VEHICLES,
  selectedVehicleId: DEFAULT_VEHICLES[1].id,

  orders: [],
  selectedOrderIds: new Set(),

  optimizedRoute: null,
  isOptimizing: false,
  isGeocoding: false,
  geocodeProgress: null,

  importWarnings: [],
  importErrors: [],

  setImportResult: (result) =>
    set({
      orders: result.orders,
      selectedOrderIds: new Set(),
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
}))
