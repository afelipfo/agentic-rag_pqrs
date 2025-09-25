import React from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

interface FilterOptions {
  estado: string
  comuna: string
  tipo_solicitud: string
  tema_principal: string
  fecha_desde: string
  fecha_hasta: string
}

interface FilterPanelProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  isOpen: boolean
  onToggle: () => void
}

const FilterPanel = ({ filters, onFiltersChange, isOpen, onToggle }: FilterPanelProps) => {
  const comunas = [
    'Comuna 1 - Popular',
    'Comuna 2 - Santa Cruz',
    'Comuna 3 - Manrique',
    'Comuna 4 - Aranjuez',
    'Comuna 5 - Castilla',
    'Comuna 6 - Doce de Octubre',
    'Comuna 7 - Robledo',
    'Comuna 8 - Villa Hermosa',
    'Comuna 9 - Buenos Aires',
    'Comuna 10 - La Candelaria',
    'Comuna 11 - Laureles',
    'Comuna 12 - La América',
    'Comuna 13 - San Javier',
    'Comuna 14 - El Poblado',
    'Comuna 15 - Guayabal',
    'Comuna 16 - Belén'
  ]

  const temas = [
    'Alumbrado Público',
    'Vías y Calles',
    'Infraestructura',
    'Transporte',
    'Espacios Públicos',
    'Servicios Públicos',
    'Seguridad Vial',
    'Mantenimiento',
    'Obras',
    'Otro'
  ]

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      estado: '',
      comuna: '',
      tipo_solicitud: '',
      tema_principal: '',
      fecha_desde: '',
      fecha_hasta: ''
    })
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avanzados
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
                  </span>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm">
                {isOpen ? 'Ocultar' : 'Mostrar'} filtros
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Estado */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Estado
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={filters.estado}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="cerrado">Cerrado</option>
                  <option value="en proceso">En Proceso</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>

              {/* Comuna */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Comuna
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={filters.comuna}
                  onChange={(e) => handleFilterChange('comuna', e.target.value)}
                >
                  <option value="">Todas las Comunas</option>
                  {comunas.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Solicitud */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tipo de Solicitud
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={filters.tipo_solicitud}
                  onChange={(e) => handleFilterChange('tipo_solicitud', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Petición">Petición</option>
                  <option value="Queja">Queja</option>
                  <option value="Reclamo">Reclamo</option>
                  <option value="Sugerencia">Sugerencia</option>
                </select>
              </div>

              {/* Tema Principal */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tema Principal
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={filters.tema_principal}
                  onChange={(e) => handleFilterChange('tema_principal', e.target.value)}
                >
                  <option value="">Todos los Temas</option>
                  {temas.map((tema) => (
                    <option key={tema} value={tema}>
                      {tema}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha Desde */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Fecha Desde
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={filters.fecha_desde}
                  onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                />
              </div>

              {/* Fecha Hasta */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={filters.fecha_hasta}
                  onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
              >
                <X className="mr-2 h-4 w-4" />
                Limpiar Filtros
              </Button>

              <div className="text-sm text-gray-500">
                {activeFiltersCount > 0 && `${activeFiltersCount} filtro${activeFiltersCount !== 1 ? 's' : ''} activo${activeFiltersCount !== 1 ? 's' : ''}`}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default FilterPanel