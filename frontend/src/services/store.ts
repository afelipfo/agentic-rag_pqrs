import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PQRSRecord, PersonnelRecord, VehicleRecord, ZoneRecord, FilterOptions } from '../types'

interface AppState {
  // PQRS data
  pqrsRecords: PQRSRecord[]
  selectedPQRS: PQRSRecord | null

  // Personnel and vehicles
  personnel: PersonnelRecord[]
  vehicles: VehicleRecord[]
  zones: ZoneRecord[]

  // UI state
  loading: boolean
  error: string | null
  activeModule: 'query' | 'assignment' | 'metrics' | 'chat'

  // Filters
  filters: FilterOptions

  // Actions
  setPQRSRecords: (records: PQRSRecord[]) => void
  setSelectedPQRS: (record: PQRSRecord | null) => void
  setPersonnel: (personnel: PersonnelRecord[]) => void
  setVehicles: (vehicles: VehicleRecord[]) => void
  setZones: (zones: ZoneRecord[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setActiveModule: (module: 'query' | 'assignment' | 'metrics' | 'chat') => void
  setFilters: (filters: FilterOptions) => void
  updateFilter: (key: keyof FilterOptions, value: string) => void
  clearFilters: () => void
}

const initialFilters: FilterOptions = {
  estado: '',
  comuna: '',
  tipo_solicitud: '',
  tema_principal: '',
  fecha_desde: '',
  fecha_hasta: ''
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      pqrsRecords: [],
      selectedPQRS: null,
      personnel: [],
      vehicles: [],
      zones: [],
      loading: false,
      error: null,
      activeModule: 'query',
      filters: initialFilters,

      // Actions
      setPQRSRecords: (records) => set({ pqrsRecords: records }),
      setSelectedPQRS: (record) => set({ selectedPQRS: record }),
      setPersonnel: (personnel) => set({ personnel }),
      setVehicles: (vehicles) => set({ vehicles }),
      setZones: (zones) => set({ zones }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setActiveModule: (module) => set({ activeModule: module }),
      setFilters: (filters) => set({ filters }),
      updateFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),
      clearFilters: () => set({ filters: initialFilters })
    }),
    {
      name: 'pqrs-store'
    }
  )
)