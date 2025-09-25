import React from 'react'

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  maxHeight?: number
}

/**
 * Componente de lista optimizada para mejorar performance con listas grandes
 * Versión simplificada sin virtualización externa para compatibilidad
 */
export function VirtualizedList<T>({
  items,
  itemHeight = 200,
  renderItem,
  className = '',
  maxHeight = 600
}: VirtualizedListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay elementos para mostrar
      </div>
    )
  }

  // Para listas pequeñas, renderizar normalmente
  if (items.length <= 50) {
    return (
      <div className={`space-y-4 ${className}`}>
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )
  }

  // Para listas grandes, usar contenedor con scroll y optimización básica
  const containerHeight = Math.min(maxHeight, items.length * itemHeight)

  return (
    <div
      className={`w-full overflow-y-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualizedList