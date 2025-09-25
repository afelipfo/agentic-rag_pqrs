import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

interface PQRSRecord {
  numero_radicado_entrada: string
  estado: string
  asunto?: string
  direccion_hecho?: string
  barrio_hecho?: string
  comuna_hecho?: string
  nombre_peticionario?: string
  telefono_peticionario?: string
  correo_peticionario?: string
  tipo_solicitud?: string
  tema_principal?: string
  fecha_radicacion?: string
  dias_transcurridos?: number
  unidad_responsable?: string
  fecha_vencimiento?: string
}

interface UsePQRSReturn {
  records: PQRSRecord[]
  loading: boolean
  error: string | null
  searchPQRS: (query: string, filters?: Record<string, any>) => Promise<void>
  getPQRSById: (radicado: string) => Promise<PQRSRecord | null>
  refetch: () => Promise<void>
}

export const usePQRS = (): UsePQRSReturn => {
  const [records, setRecords] = useState<PQRSRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchPQRS = async (query: string, filters?: Record<string, any>) => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiService.searchPQRS({
        query,
        filters,
        limit: 50
      })

      setRecords(result.results || [])
    } catch (err) {
      console.error('Error searching PQRS:', err)
      setError('Error al buscar PQRS. Verifique que el backend esté ejecutándose.')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const getPQRSById = async (radicado: string): Promise<PQRSRecord | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiService.getPQRSByRadicado(radicado)
      return result.results?.[0] || null
    } catch (err) {
      console.error('Error getting PQRS by ID:', err)
      setError('Error al obtener PQRS específico.')
      return null
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    // If we have a previous search, we could refetch it
    // For now, just clear the state
    setRecords([])
    setError(null)
  }

  return {
    records,
    loading,
    error,
    searchPQRS,
    getPQRSById,
    refetch
  }
}