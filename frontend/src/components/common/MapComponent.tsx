import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet'
import { LatLngTuple, LatLngBounds, LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Coordenadas aproximadas de las comunas de Medellín
const comunaCoordinates: Record<string, LatLngTuple[]> = {
  'Comuna 1 - Popular': [
    [6.25, -75.58], [6.26, -75.57], [6.24, -75.56], [6.23, -75.58]
  ],
  'Comuna 14 - El Poblado': [
    [6.20, -75.56], [6.21, -75.55], [6.19, -75.54], [6.18, -75.56]
  ],
  'Comuna 3 - Manrique': [
    [6.27, -75.55], [6.28, -75.54], [6.26, -75.53], [6.25, -75.55]
  ],
  'Comuna 10 - La Candelaria': [
    [6.25, -75.57], [6.26, -75.56], [6.24, -75.55], [6.23, -75.57]
  ],
  'Comuna 11 - Laureles': [
    [6.22, -75.59], [6.23, -75.58], [6.21, -75.57], [6.20, -75.59]
  ],
  'Comuna 16 - Belén': [
    [6.23, -75.61], [6.24, -75.60], [6.22, -75.59], [6.21, -75.61]
  ]
}

interface ZoneData {
  name: string
  activePQRS: number
  totalPQRS: number
  personnel: number
  vehicles: number
  priority: 'low' | 'medium' | 'high'
}

interface MapComponentProps {
  zones: ZoneData[]
  onZoneClick?: (zoneName: string) => void
  selectedZone?: string
  height?: string
}

const MapComponent = ({
  zones,
  onZoneClick,
  selectedZone,
  height = "400px"
}: MapComponentProps) => {
  const [mapLoaded, setMapLoaded] = useState(false)

  // Centro de Medellín
  const center: LatLngTuple = [6.247, -75.565]
  const bounds: LatLngBounds = new (window as any).L.LatLngBounds(
    [6.15, -75.65], // Suroeste
    [6.35, -75.48]  // Noreste
  )

  const getZoneColor = (zone: ZoneData) => {
    if (selectedZone === zone.name) return '#3B82F6' // Azul seleccionado

    const ratio = zone.activePQRS / Math.max(zone.totalPQRS, 1)
    if (ratio > 0.3) return '#EF4444' // Rojo - alta actividad
    if (ratio > 0.15) return '#F59E0B' // Amarillo - media actividad
    return '#10B981' // Verde - baja actividad
  }

  const getZoneData = (zoneName: string): ZoneData | undefined => {
    return zones.find(z => z.name === zoneName)
  }

  // Componente para ajustar el mapa
  const MapController = () => {
    const map = useMap()

    useEffect(() => {
      if (!mapLoaded) {
        map.fitBounds(bounds)
        setMapLoaded(true)
      }
    }, [map, mapLoaded])

    return null
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        // Optimizaciones para mobile
        zoomControl={true}
        scrollWheelZoom={false} // Deshabilitar zoom con scroll en mobile para mejor UX
        doubleClickZoom={true}
        boxZoom={false}
        touchZoom={true}
        dragging={true}
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Object.entries(comunaCoordinates).map(([zoneName, coordinates]) => {
          const zoneData = getZoneData(zoneName)
          if (!zoneData) return null

          const color = getZoneColor(zoneData)
          const isSelected = selectedZone === zoneName

          return (
            <Polygon
              key={zoneName}
              positions={coordinates}
              pathOptions={{
                fillColor: color,
                fillOpacity: isSelected ? 0.8 : 0.6,
                color: isSelected ? '#1E40AF' : '#6B7280',
                weight: isSelected ? 3 : 2,
                opacity: 1
              }}
              eventHandlers={{
                click: () => onZoneClick?.(zoneName),
                mouseover: (e: LeafletMouseEvent) => {
                  const layer = e.target
                  layer.setStyle({
                    fillOpacity: 0.9,
                    weight: 4
                  })
                },
                mouseout: (e: LeafletMouseEvent) => {
                  const layer = e.target
                  layer.setStyle({
                    fillOpacity: isSelected ? 0.8 : 0.6,
                    weight: isSelected ? 3 : 2
                  })
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-lg mb-2">{zoneName}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>PQRS Activos:</span>
                      <span className="font-medium text-red-600">{zoneData.activePQRS}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PQRS Totales:</span>
                      <span className="font-medium">{zoneData.totalPQRS}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personal Disponible:</span>
                      <span className="font-medium text-green-600">{zoneData.personnel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehículos:</span>
                      <span className="font-medium text-blue-600">{zoneData.vehicles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prioridad:</span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${
                        zoneData.priority === 'high' ? 'bg-red-100 text-red-800' :
                        zoneData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {zoneData.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-3 w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    onClick={() => onZoneClick?.(zoneName)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </Popup>
            </Polygon>
          )
        })}
      </MapContainer>

      {/* Leyenda - Responsive */}
      <div className="absolute top-4 right-4 bg-white p-2 md:p-3 rounded-lg shadow-lg border z-[1000] max-w-[140px] md:max-w-none">
        <h4 className="font-semibold text-xs md:text-sm mb-2">Actividad PQRS</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded mr-2"></div>
            <span className="hidden md:inline">{'Alta (>30%)'}</span>
            <span className="md:hidden">Alta</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="hidden md:inline">Media (15-30%)</span>
            <span className="md:hidden">Media</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded mr-2"></div>
            <span className="hidden md:inline">{'Baja (<15%)'}</span>
            <span className="md:hidden">Baja</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded mr-2 border-2 border-blue-700"></div>
            <span className="hidden md:inline">Seleccionada</span>
            <span className="md:hidden">Sel.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapComponent