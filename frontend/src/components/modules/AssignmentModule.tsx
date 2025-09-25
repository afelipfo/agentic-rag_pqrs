import { useState, useCallback } from 'react'
import { MapPin, Users, Truck, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '../common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import MapComponent from '../common/MapComponent'
import { apiService } from '../../services/api'

interface ZoneData {
  name: string
  activePQRS: number
  totalPQRS: number
  personnel: number
  vehicles: number
  priority: 'low' | 'medium' | 'high'
}

const AssignmentModule = () => {
  const [selectedZone, setSelectedZone] = useState<string>('')
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Mock data - En producción vendría del backend
  const zones: ZoneData[] = [
    { name: 'Comuna 1 - Popular', activePQRS: 45, totalPQRS: 120, personnel: 8, vehicles: 3, priority: 'high' },
    { name: 'Comuna 14 - El Poblado', activePQRS: 23, totalPQRS: 89, personnel: 12, vehicles: 5, priority: 'medium' },
    { name: 'Comuna 3 - Manrique', activePQRS: 67, totalPQRS: 156, personnel: 6, vehicles: 2, priority: 'high' },
    { name: 'Comuna 10 - La Candelaria', activePQRS: 34, totalPQRS: 78, personnel: 15, vehicles: 4, priority: 'medium' },
    { name: 'Comuna 11 - Laureles', activePQRS: 28, totalPQRS: 95, personnel: 10, vehicles: 6, priority: 'low' },
  ]

  const handleZoneClick = useCallback((zoneName: string) => {
    setSelectedZone(zoneName)
  }, [])

  const handleAutoAssign = useCallback(async () => {
    if (!selectedZone) return

    setLoading(true)
    try {
      // Simular asignación automática - En producción llamaría al backend
      const mockAssignments = [
        {
          id: '1',
          pqrsId: '202410000123',
          personnel: 'Juan Pérez',
          vehicle: 'Vehículo #001',
          estimatedTime: '2 horas',
          priority: 'high',
          status: 'assigned'
        },
        {
          id: '2',
          pqrsId: '202410000124',
          personnel: 'María González',
          vehicle: 'Vehículo #002',
          estimatedTime: '4 horas',
          priority: 'medium',
          status: 'assigned'
        },
        {
          id: '3',
          pqrsId: '202410000125',
          personnel: 'Carlos Rodríguez',
          vehicle: 'Vehículo #003',
          estimatedTime: '1 hora',
          priority: 'low',
          status: 'assigned'
        }
      ]

      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000))

      setAssignments(mockAssignments)
      setShowResults(true)
    } catch (error) {
      console.error('Assignment error:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedZone])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Asignación Inteligente de Recursos
        </h1>
        <p className="text-muted-foreground">
          Asigna automáticamente personal y vehículos a PQRS activos por zona geográfica
        </p>
      </div>

      {/* Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Zonas - Medellín
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Selecciona una zona en el mapa para ver los PQRS activos y asignar recursos automáticamente.
            </p>
            {selectedZone && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Zona seleccionada: {selectedZone}</span>
              </div>
            )}
          </div>

          <MapComponent
            zones={zones}
            onZoneClick={handleZoneClick}
            selectedZone={selectedZone}
            height="500px"
          />

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleAutoAssign}
              disabled={!selectedZone || loading}
              size="lg"
              className="px-8 py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Asignando recursos automáticamente...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-5 w-5" />
                  Asignar Recursos Automáticamente
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Asignaciones Completadas ({assignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(assignment.status)}
                    <div>
                      <div className="font-medium">PQRS {assignment.pqrsId}</div>
                      <div className="text-sm text-muted-foreground">
                        {assignment.personnel} • {assignment.vehicle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={getPriorityColor(assignment.priority)}>
                      {assignment.priority.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <div className="font-medium">{assignment.estimatedTime}</div>
                      <div className="text-sm text-muted-foreground">Tiempo estimado</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Ver Rutas Optimizadas
              </Button>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar Asignaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {zones.reduce((sum, zone) => sum + zone.activePQRS, 0)}
                </div>
                <div className="text-sm text-muted-foreground">PQRS Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {zones.reduce((sum, zone) => sum + zone.personnel, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Personal Disponible</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {zones.reduce((sum, zone) => sum + zone.vehicles, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Vehículos Activos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {assignments.length}
                </div>
                <div className="text-sm text-muted-foreground">Asignaciones Hoy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AssignmentModule