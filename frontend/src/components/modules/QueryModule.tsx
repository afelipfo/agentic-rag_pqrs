import { useState } from 'react'
import { Search, Filter, MapPin, User, Phone, Mail, Eye, Loader2, Download, MessageCircle } from 'lucide-react'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../common/Collapsible'
import SearchBar from '../common/SearchBar'
import { apiService, type PQRSRecord } from '../../services/api'

const QueryModule = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'semantic' | 'radicado'>('semantic')
  const [filters, setFilters] = useState({
    estado: '',
    comuna: '',
    tipo_solicitud: '',
    fecha_desde: '',
    fecha_hasta: ''
  })
  const [results, setResults] = useState<PQRSRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (radicado: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(radicado)) {
      newExpanded.delete(radicado)
    } else {
      newExpanded.add(radicado)
    }
    setExpandedItems(newExpanded)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const requestData = {
        query: searchQuery.trim(),
        query_type: searchType,
        filters: Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
        limit: 20
      }

      const response = await apiService.searchPQRS(requestData)
      setResults(response.results)
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to mock data if API is not available
      setResults([{
        numero_radicado_entrada: 'API_NO_DISPONIBLE',
        estado: 'error',
        asunto: 'Error de conexión con el backend. Verifique que el servidor esté ejecutándose.',
        tipo_solicitud: 'Error',
        fecha_radicacion: new Date().toISOString().split('T')[0]
      }])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
      case 'en proceso':
        return 'bg-gov-green text-white'
      case 'cerrado':
      case 'finalizado':
        return 'bg-gov-blue text-white'
      case 'pendiente':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-CO')
  }

  const handleDownloadPDF = async (radicado: string) => {
    try {
      // In a real implementation, this would call an API to generate and download a PDF
      alert(`Descargando PDF para el radicado ${radicado}...`)
      // Example: window.open(`/api/pqrs/${radicado}/pdf`, '_blank')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error al descargar el PDF. Intente nuevamente.')
    }
  }

  const handleContact = (record: PQRSRecord) => {
    // In a real implementation, this would open a contact form or modal
    const contactInfo = record.unidad_responsable || 'Secretaría de Infraestructura Física'
    const message = `Hola, me gustaría hacer seguimiento al PQRS ${record.numero_radicado_entrada} sobre: ${record.asunto || 'Sin asunto especificado'}`

    // For demo purposes, we'll use WhatsApp or email
    if (record.telefono_peticionario) {
      // Try WhatsApp
      const whatsappUrl = `https://wa.me/57${record.telefono_peticionario.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } else if (record.correo_peticionario) {
      // Try email
      const emailUrl = `mailto:${record.correo_peticionario}?subject=Seguimiento PQRS ${record.numero_radicado_entrada}&body=${encodeURIComponent(message)}`
      window.location.href = emailUrl
    } else {
      // Fallback to general contact
      alert(`Para contactar sobre este PQRS, comuníquese con: ${contactInfo}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Consultas Inteligentes PQRS
        </h1>
        <p className="text-muted-foreground">
          Busca peticiones, quejas, reclamos y sugerencias por radicado o contenido
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda de PQRS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Type Selector */}
          <div className="flex gap-2">
            <Button
              variant={searchType === 'radicado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('radicado')}
            >
              Por Radicado
            </Button>
            <Button
              variant={searchType === 'semantic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('semantic')}
            >
              Búsqueda Inteligente
            </Button>
          </div>

          {/* Search Input with Auto-complete */}
          <SearchBar
            placeholder={
              searchType === 'radicado'
                ? "Ingresa el número de radicado (ej: 201810000503)"
                : "Describe tu búsqueda (ej: problemas con vías, alumbrado público)"
            }
            onSearch={(query) => {
              setSearchQuery(query)
              handleSearch()
            }}
            onClear={() => setSearchQuery('')}
            recentSearches={['alumbrado público', 'problemas vías', 'PQRS 201810000503']}
            popularSearches={['alumbrado', 'vías', 'transporte', 'agua']}
            className="mb-4"
          />

          {/* Advanced Filters */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filtros Avanzados
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                    value={filters.estado}
                    onChange={(e) => setFilters({...filters, estado: e.target.value})}
                  >
                    <option value="">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="cerrado">Cerrado</option>
                    <option value="en proceso">En Proceso</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Comuna</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                    value={filters.comuna}
                    onChange={(e) => setFilters({...filters, comuna: e.target.value})}
                  >
                    <option value="">Todas las Comunas</option>
                    <option value="Comuna 1">Comuna 1 - Popular</option>
                    <option value="Comuna 2">Comuna 2 - Santa Cruz</option>
                    <option value="Comuna 3">Comuna 3 - Manrique</option>
                    <option value="Comuna 4">Comuna 4 - Aranjuez</option>
                    <option value="Comuna 5">Comuna 5 - Castilla</option>
                    <option value="Comuna 6">Comuna 6 - Doce de Octubre</option>
                    <option value="Comuna 7">Comuna 7 - Robledo</option>
                    <option value="Comuna 8">Comuna 8 - Villa Hermosa</option>
                    <option value="Comuna 9">Comuna 9 - Buenos Aires</option>
                    <option value="Comuna 10">Comuna 10 - La Candelaria</option>
                    <option value="Comuna 11">Comuna 11 - Laureles-Estadio</option>
                    <option value="Comuna 12">Comuna 12 - La América</option>
                    <option value="Comuna 13">Comuna 13 - San Javier</option>
                    <option value="Comuna 14">Comuna 14 - El Poblado</option>
                    <option value="Comuna 15">Comuna 15 - Guayabal</option>
                    <option value="Comuna 16">Comuna 16 - Belén</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo de Solicitud</label>
                  <select
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                    value={filters.tipo_solicitud}
                    onChange={(e) => setFilters({...filters, tipo_solicitud: e.target.value})}
                  >
                    <option value="">Todos</option>
                    <option value="Petición">Petición</option>
                    <option value="Queja">Queja</option>
                    <option value="Reclamo">Reclamo</option>
                    <option value="Sugerencia">Sugerencia</option>
                  </select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Búsqueda ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((record) => (
                <Card key={record.numero_radicado_entrada} className="border-l-4 border-l-gov-blue">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Radicado: {record.numero_radicado_entrada}
                        </h3>
                        <Badge className={getStatusColor(record.estado)}>
                          {record.estado.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExpanded(record.numero_radicado_entrada)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {expandedItems.has(record.numero_radicado_entrada) ? 'Ocultar' : 'Ver'} Detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(record.numero_radicado_entrada)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContact(record)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Contactar
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{record.direccion_hecho || 'Dirección no especificada'}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {record.barrio_hecho && `${record.barrio_hecho}, `}
                          {record.comuna_hecho}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{record.nombre_peticionario || 'No especificado'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          {record.telefono_peticionario && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs">{record.telefono_peticionario}</span>
                            </div>
                          )}
                          {record.correo_peticionario && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="text-xs">{record.correo_peticionario}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>
                          <div className="font-medium">{record.tipo_solicitud || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tema:</span>
                          <div className="font-medium">{record.tema_principal || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Radicación:</span>
                          <div className="font-medium">{formatDate(record.fecha_radicacion)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Días transcurridos:</span>
                          <div className="font-medium">{record.dias_transcurridos || 0}</div>
                        </div>
                      </div>
                    </div>

                    {record.asunto && (
                      <div className="mt-4">
                        <span className="text-muted-foreground">Asunto:</span>
                        <p className="mt-1 text-sm">{record.asunto}</p>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {expandedItems.has(record.numero_radicado_entrada) && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                          Información Detallada
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground">Número de Radicado de Respuesta:</span>
                              <div className="font-medium">{record.numero_radicado_respuesta || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fecha de Entrada al SIF:</span>
                              <div className="font-medium">{formatDate(record.fecha_entrada_sif)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fecha de Radicado de Respuesta:</span>
                              <div className="font-medium">{formatDate(record.fecha_radicado_respuesta)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fecha de Vencimiento:</span>
                              <div className="font-medium">{formatDate(record.fecha_vencimiento)}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground">Unidad Responsable:</span>
                              <div className="font-medium">{record.unidad_responsable || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sistema de Información:</span>
                              <div className="font-medium">{record.sistema_informacion || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Mes/Año:</span>
                              <div className="font-medium">{record.mes || 'N/A'}/{record.ano || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Prórroga:</span>
                              <div className="font-medium">{record.prorroga || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchQuery && !loading && results.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
            <p className="text-muted-foreground">
              Intenta con diferentes términos de búsqueda o ajusta los filtros.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default QueryModule