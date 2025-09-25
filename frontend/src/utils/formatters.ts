// Utility functions for formatting data

export const formatDate = (dateString?: string): string => {
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

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'No disponible'

  try {
    const date = new Date(dateString)
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatCurrencyWithCents = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-CO').format(num)
}

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
}

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
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

export const getPriorityColor = (priority: string): string => {
  switch (priority?.toLowerCase()) {
    case 'high':
    case 'alta':
      return 'bg-red-100 text-red-800'
    case 'medium':
    case 'media':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
    case 'baja':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutos`
  } else if (hours < 24) {
    return `${Math.round(hours)} horas`
  } else {
    const days = Math.floor(hours / 24)
    const remainingHours = Math.round(hours % 24)
    if (remainingHours === 0) {
      return `${days} días`
    }
    return `${days} días ${remainingHours} horas`
  }
}

export const formatPhoneNumber = (phone: string): string => {
  // Format Colombian phone numbers
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('57')) {
    // Remove country code for display
    const national = cleaned.slice(2)
    if (national.length === 10) {
      return `${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`
    }
  }
  // Fallback formatting
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  return phone
}

export const formatAddress = (address: string): string => {
  // Basic address formatting for Colombian addresses
  return address.replace(/, /g, '\n')
}

export const getColombianHolidays = (): string[] => {
  // Colombian national holidays (simplified)
  return [
    '1 de enero',      // Año Nuevo
    '6 de enero',      // Reyes Magos
    '19 de marzo',     // Día de San José
    '7 de abril',      // Jueves Santo
    '8 de abril',      // Viernes Santo
    '1 de mayo',       // Día del Trabajo
    '22 de mayo',      // Ascensión del Señor
    '12 de junio',     // Corpus Christi
    '29 de junio',     // San Pedro y San Pablo
    '20 de julio',     // Independencia
    '7 de agosto',     // Batalla de Boyacá
    '15 de agosto',    // Asunción de la Virgen
    '12 de octubre',   // Día de la Raza
    '1 de noviembre',  // Todos los Santos
    '11 de noviembre', // Independencia de Cartagena
    '8 de diciembre',  // Inmaculada Concepción
    '25 de diciembre'  // Navidad
  ]
}

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Hoy'
  } else if (diffDays === 1) {
    return 'Ayer'
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`
  } else {
    const years = Math.floor(diffDays / 365)
    return `Hace ${years} año${years > 1 ? 's' : ''}`
  }
}