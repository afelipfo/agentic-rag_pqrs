import { useState } from 'react'
import { Eye, MessageCircle, MapPin, Calendar, User, Phone, Mail, Clock, Tag } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardHeader } from './Card'
import { Badge } from './Badge'

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

interface PQRSCardProps {
  record: PQRSRecord
  onViewDetails?: (record: PQRSRecord) => void
  onContact?: (record: PQRSRecord) => void
  className?: string
}

const PQRSCard = ({ record, onViewDetails, onContact, className = '' }: PQRSCardProps) => {
  const [expanded, setExpanded] = useState(false)

  const getStatusColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cerrado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pendiente':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const handleContact = (type: 'phone' | 'email') => {
    if (type === 'phone' && record.telefono_peticionario) {
      window.open(`https://wa.me/57${record.telefono_peticionario.replace(/\D/g, '')}`, '_blank')
    } else if (type === 'email' && record.correo_peticionario) {
      window.open(`mailto:${record.correo_peticionario}`, '_blank')
    }
  }

  return (
    <Card className={`border-l-4 border-l-gov-blue hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Radicado: {record.numero_radicado_entrada}
            </h3>
            <Badge className={getStatusColor(record.estado)}>
              {record.estado?.toUpperCase()}
            </Badge>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="shrink-0"
            >
              <Eye className="mr-2 h-4 w-4" />
              {expanded ? 'Ocultar' : 'Ver'} Detalles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onContact?.(record)}
              className="shrink-0"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contactar
            </Button>
          </div>
        </div>

        {record.asunto && (
          <p className="text-gray-700 mt-2 line-clamp-2">
            {record.asunto}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <div className="min-w-0">
                <div className="truncate">
                  {record.direccion_hecho || 'Dirección no especificada'}
                </div>
                <div className="text-gray-500 text-xs">
                  {record.barrio_hecho && `${record.barrio_hecho}, `}
                  {record.comuna_hecho}
                </div>
              </div>
            </div>

            {record.nombre_peticionario && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate">{record.nombre_peticionario}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
              <span>Radicado: {formatDate(record.fecha_radicacion)}</span>
            </div>

            {record.dias_transcurridos !== undefined && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                <span>{record.dias_transcurridos} días transcurridos</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Actions */}
        {(record.telefono_peticionario || record.correo_peticionario) && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            {record.telefono_peticionario && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('phone')}
                className="flex-1"
              >
                <Phone className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            )}
            {record.correo_peticionario && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('email')}
                className="flex-1"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            )}
          </div>
        )}

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Tipo:</span>
                <div className="font-medium">{record.tipo_solicitud || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Tema:</span>
                <div className="font-medium">{record.tema_principal || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Unidad:</span>
                <div className="font-medium">{record.unidad_responsable || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-500">Vencimiento:</span>
                <div className="font-medium">{formatDate(record.fecha_vencimiento)}</div>
              </div>
            </div>

            {record.nombre_peticionario && (
              <div className="pt-2 border-t border-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">Información del Peticionario</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nombre:</span>
                    <div className="font-medium">{record.nombre_peticionario}</div>
                  </div>
                  {record.telefono_peticionario && (
                    <div>
                      <span className="text-gray-500">Teléfono:</span>
                      <div className="font-medium">{record.telefono_peticionario}</div>
                    </div>
                  )}
                  {record.correo_peticionario && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Correo:</span>
                      <div className="font-medium">{record.correo_peticionario}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PQRSCard