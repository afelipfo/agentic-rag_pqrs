// Common types for the PQRS system

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

export interface PersonnelRecord {
  id?: number
  employee_id: string
  first_name: string
  last_name: string
  role: string
  zone: string
  status: string
  certifications?: string[]
  shift_start?: string
  shift_end?: string
}

export interface VehicleRecord {
  id?: number
  license_plate: string
  vehicle_type: string
  zone: string
  status: string
  fuel_level?: number
  capacity?: number
}

export interface ZoneRecord {
  id?: number
  name: string
  code: string
  commune: string
  priority_level: string
  population?: number
  area_km2?: number
  latitude?: number
  longitude?: number
}

export interface FilterOptions {
  estado: string
  comuna: string
  tipo_solicitud: string
  tema_principal: string
  fecha_desde: string
  fecha_hasta: string
}

export interface AssignmentRecord {
  pqrs_id: string
  assigned_personnel: string[]
  assigned_vehicles: string[]
  estimated_duration_hours: number
  confidence_score: number
  reasoning: string
  assigned_at: string
  zone: string
}

export type ModuleType = 'query' | 'assignment' | 'metrics' | 'chat'

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical'

export type PQRSStatus = 'activo' | 'cerrado' | 'en proceso' | 'pendiente'

export type RequestType = 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia'