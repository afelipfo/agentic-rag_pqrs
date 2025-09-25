import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth if needed
api.interceptors.request.use(
  (config) => {
    // Add auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export interface PQRSRecord {
  numero_radicado_entrada: string
  numero_radicado_respuesta?: string
  estado: string
  dias_transcurridos?: number
  fecha_radicacion?: string
  fecha_entrada_sif?: string
  fecha_radicado_respuesta?: string
  fecha_vencimiento?: string
  asunto?: string
  tema_principal?: string
  tipo_solicitud?: string
  direccion_hecho?: string
  barrio_hecho?: string
  comuna_hecho?: string
  nombre_peticionario?: string
  telefono_peticionario?: string
  correo_peticionario?: string
  unidad_responsable?: string
  sistema_informacion?: string
  mes?: number
  ano?: number
  prorroga?: string
}

export interface QueryRequest {
  query: string
  query_type?: 'semantic' | 'radicado' | 'advanced'
  filters?: Record<string, any>
  limit?: number
}

export interface QueryResponse {
  results: PQRSRecord[]
  total_found: number
  query_type: string
  search_metadata?: Record<string, any>
}

export interface AssignmentRequest {
  pqrs_ids: string[]
  zone_filter?: string
}

export interface AssignmentResponse {
  assignments: Array<{
    pqrs_id: string
    assigned_personnel: string[]
    assigned_vehicles: string[]
    estimated_duration_hours: number
    confidence_score: number
    reasoning: string
    assigned_at: string
    zone: string
  }>
  total_assigned: number
  unassigned: string[]
}

export interface HealthResponse {
  status: string
  version: string
  services: Record<string, string>
  data_stats?: Record<string, number>
}

class APIService {
  // Health check
  async getHealth(): Promise<HealthResponse> {
    const response = await api.get('/api/health')
    return response.data
  }

  // Query endpoints
  async searchPQRS(request: QueryRequest): Promise<QueryResponse> {
    const response = await api.post('/api/agent/process', {
      task_type: 'query',
      parameters: request
    })
    return response.data.result
  }

  async getPQRSByRadicado(radicado: string): Promise<QueryResponse> {
    const response = await api.post('/api/agent/process', {
      task_type: 'query',
      parameters: {
        query: radicado,
        query_type: 'radicado'
      }
    })
    return response.data.result
  }

  // Assignment endpoints
  async assignResources(request: AssignmentRequest): Promise<AssignmentResponse> {
    const response = await api.post('/api/agent/process', {
      task_type: 'assignment',
      parameters: request
    })
    return response.data.result
  }

  // Data management
  async reloadData(): Promise<any> {
    const response = await api.post('/api/agent/process', {
      task_type: 'data_management',
      parameters: {
        action: 'reload'
      }
    })
    return response.data.result
  }

  async getStatistics(): Promise<any> {
    const response = await api.post('/api/agent/process', {
      task_type: 'data_management',
      parameters: {
        action: 'statistics'
      }
    })
    return response.data.result
  }

  // Direct API calls for specific endpoints (fallback)
  async directQuery(request: QueryRequest): Promise<QueryResponse> {
    const response = await api.post('/api/query/pqrs', request)
    return response.data
  }

  async directAssign(request: AssignmentRequest): Promise<AssignmentResponse> {
    const response = await api.post('/api/assignment', request)
    return response.data
  }
}

export const apiService = new APIService()
export default api