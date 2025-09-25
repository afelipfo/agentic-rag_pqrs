import { useState } from 'react'
import { Users, MapPin, Truck, CheckCircle, Clock, AlertCircle, Calendar, Target } from 'lucide-react'
import { Button } from '../common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import MapComponent from '../common/MapComponent'
import { apiService, type AssignmentResponse } from '../../services/api'

interface ZoneData {
  name: string
  activePQRS: number
  totalPQRS: number
  personnel: number
  vehicles: number
  priority: 'low' | 'medium' | 'high'
}

const AssignmentModule = () => {
  const [pqrsIds, setPqrsIds] = useState('')
  const [zoneFilter, setZoneFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [assignmentResult, setAssignmentResult] = useState<AssignmentResponse | null>(null)
  const [error, setError] = useState('')
  const [selectedZone, setSelectedZone] = useState<string>('')
  const [showCalendar, setShowCalendar] = useState(false)

  // Mock data for zones - in real implementation this would come from API
  const [zones] = useState<ZoneData[]>([
    { name: 'Comuna 1 - Popular', activePQRS: 1250, totalPQRS: 4200, personnel: 3, vehicles: 2, priority: 'high' },
    { name: 'Comuna 14 - El Poblado', activePQRS: 980, totalPQRS: 3800, personnel: 4, vehicles: 3, priority: 'medium' },
    { name: 'Comuna 3 - Manrique', activePQRS: 750, totalPQRS: 3100, personnel: 2, vehicles: 1, priority: 'medium' },
    { name: 'Comuna 10 - La Candelaria', activePQRS: 620, totalPQRS: 2900, personnel: 3, vehicles: 2, priority: 'low' },
    { name: 'Comuna 11 - Laureles', activePQRS: 890, totalPQRS: 3500, personnel: 3, vehicles: 2, priority: 'medium' },
    { name: 'Comuna 16 - Belén', activePQRS: 540, totalPQRS: 2800, personnel: 2, vehicles: 1, priority: 'low' }
  ])

  const handleZoneClick = (zoneName: string) => {
    setSelectedZone(zoneName)
    setZoneFilter(zoneName)
  }

  const handleQuickAssignment = async () => {
    if (!selectedZone) {
      setError('Por favor selecciona una zona en el mapa')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get active PQRS for selected zone
      const zoneData = zones.find(z => z.name === selectedZone)
      if (!zoneData || zoneData.activePQRS === 0) {
        setError('No hay PQRS activos en la zona seleccionada')
        return
      }

      // Mock assignment for selected zone
      const mockResult: AssignmentResponse = {
        assignments: [
          {
            pqrs_id: `PQRS-${selectedZone.split(' - ')[1]}-001`,
            assigned_personnel: ['EMP001', 'EMP002'],
            assigned_vehicles: ['VEH001'],
            estimated_duration_hours: 8,
            confidence_score: 0.85,
            reasoning: `Asignación automática para zona ${selectedZone} basada en carga de trabajo y disponibilidad`,
            assigned_at: new Date().toISOString(),
            zone: selectedZone
          }
        ],
        total_assigned: 1,
        unassigned: []
      }

      setAssignmentResult(mockResult)
    } catch (err) {
      console.error('Assignment error:', err)
      setError('Error al procesar la asignación.')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignment = async () => {
    if (!pqrsIds.trim()) {
      setError('Por favor ingresa al menos un número de radicado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const ids = pqrsIds.split(',').map(id => id.trim()).filter(id => id)
      const result = await apiService.assignResources({
        pqrs_ids: ids,
        zone_filter: zoneFilter || undefined
      })

      setAssignmentResult(result)
    } catch (err) {
      console.error('Assignment error:', err)
      setError('Error al procesar la asignación. Verifique que el backend esté ejecutándose.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'error':
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Asignación Inteligente
          </h1>
          <p className="text-gray-600">
            Asignación automática de personal y vehículos a PQRS por zona geográfica
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showCalendar ? "default" : "outline"}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendario
          </Button>
        </div>
      </div>

      {/* Main Layout: Map + Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Mapa de Zonas - Medellín
                {selectedZone && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {selectedZone}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapComponent
                zones={zones}
                onZoneClick={handleZoneClick}
                selectedZone={selectedZone}
                height="500px"
              />

              {/* Zone Stats */}
              {selectedZone && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Zona Seleccionada: {selectedZone}
                  </h4>
                  {(() => {
                    const zone = zones.find(z => z.name === selectedZone)
                    return zone ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">PQRS Activos:</span>
                          <div className="font-bold text-blue-900">{zone.activePQRS}</div>
                        </div>
                        <div>
                          <span className="text-blue-700">Personal:</span>
                          <div className="font-bold text-blue-900">{zone.personnel}</div>
                        </div>
                        <div>
                          <span className="text-blue-700">Vehículos:</span>
                          <div className="font-bold text-blue-900">{zone.vehicles}</div>
                        </div>
                        <div>
                          <span className="text-blue-700">Prioridad:</span>
                          <Badge className={
                            zone.priority === 'high' ? 'bg-red-100 text-red-800' :
                            zone.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {zone.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Quick Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Asignación Rápida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Selecciona una zona en el mapa y asigna automáticamente los recursos disponibles.
              </p>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                onClick={handleQuickAssignment}
                disabled={loading || !selectedZone}
                className="w-full"
              >
                {loading ? 'Asignando...' : 'Asignar Automáticamente'}
              </Button>
            </CardContent>
          </Card>

          {/* Manual Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Asignación Manual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Números de Radicado PQRS
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="201810000503, 201810000510..."
                  rows={3}
                  value={pqrsIds}
                  onChange={(e) => setPqrsIds(e.target.value)}
                />
              </div>

              <Button
                onClick={handleAssignment}
                disabled={loading || !pqrsIds.trim()}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Procesando...' : 'Asignar Manualmente'}
              </Button>
            </CardContent>
          </Card>

          {/* Zone Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Zonas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {zones.slice(0, 6).map((zone) => (
                  <div key={zone.name} className="flex justify-between items-center text-sm">
                    <span className="truncate mr-2">{zone.name.split(' - ')[1]}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          zone.priority === 'high' ? 'bg-red-100 text-red-800' :
                          zone.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {zone.activePQRS}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assignment Results */}
      {assignmentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon('success')}
              Resultado de Asignación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{assignmentResult.total_assigned}</div>
                <div className="text-sm text-green-600">Asignados</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{assignmentResult.unassigned.length}</div>
                <div className="text-sm text-red-600">Sin Asignar</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{assignmentResult.assignments.length}</div>
                <div className="text-sm text-blue-600">Total Procesados</div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detalles de Asignaciones</h3>
              {assignmentResult.assignments.map((assignment, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          PQRS: {assignment.pqrs_id}
                        </h4>
                        <Badge className="bg-green-100 text-green-800">
                          Asignado
                        </Badge>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>Confianza: {(assignment.confidence_score * 100).toFixed(0)}%</div>
                        <div>Duración: {assignment.estimated_duration_hours}h</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Personal Asignado
                        </h5>
                        <div className="space-y-1">
                          {assignment.assigned_personnel.map((personnel, idx) => (
                            <div key={idx} className="text-sm bg-blue-50 px-2 py-1 rounded">
                              {personnel}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Vehículos Asignados
                        </h5>
                        <div className="space-y-1">
                          {assignment.assigned_vehicles.map((vehicle, idx) => (
                            <div key={idx} className="text-sm bg-green-50 px-2 py-1 rounded">
                              {vehicle}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Zona
                      </h5>
                      <Badge variant="outline">{assignment.zone}</Badge>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-2">Razonamiento IA</h5>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {assignment.reasoning}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Unassigned PQRS */}
            {assignmentResult.unassigned.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-red-700 mb-3">PQRS Sin Asignar</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 mb-2">
                    Los siguientes PQRS no pudieron ser asignados:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {assignmentResult.unassigned.map((pqrsId) => (
                      <Badge key={pqrsId} className="bg-red-100 text-red-800">
                        {pqrsId}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    Posibles causas: falta de personal disponible, zona sin cobertura, o datos insuficientes.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>¿Cómo funciona la asignación inteligente?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>1. Análisis Inteligente:</strong> El sistema evalúa la urgencia, ubicación y tipo de PQRS.
            </p>
            <p>
              <strong>2. Asignación por Zona:</strong> Busca personal y vehículos disponibles en la zona geográfica correspondiente.
            </p>
            <p>
              <strong>3. Optimización:</strong> Considera carga de trabajo, especialidades y distancia para asignaciones óptimas.
            </p>
            <p>
              <strong>4. IA como Apoyo:</strong> Utiliza GPT-4 para razonamiento avanzado y recomendaciones.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AssignmentModule