# 📱 Documentación UX - Sistema PQRS Medellín

## 🎯 Visión General

El Sistema Unificado PQRS con Agentic RAG es una interfaz web moderna diseñada para optimizar la gestión de Peticiones, Quejas, Reclamos y Sugerencias en la Secretaría de Infraestructura Física de Medellín. La interfaz combina potentes capacidades de IA con un diseño intuitivo y accesible.

## 🎨 Sistema de Diseño

### Paleta de Colores - Gobierno Digital Colombia

```css
/* Colores Primarios */
--gov-blue: #0033A0;      /* Azul institucional */
--gov-yellow: #FFCB00;    /* Amarillo complementario */
--gov-red: #C8102E;       /* Rojo para alertas */

/* Colores Secundarios */
--gov-blue-light: #4A90E2;
--gov-blue-dark: #002855;
--gov-gray-50: #F8F9FA;
--gov-gray-100: #E9ECEF;
--gov-gray-200: #DEE2E6;
--gov-gray-300: #CED4DA;
--gov-gray-400: #ADB5BD;
--gov-gray-500: #6C757D;
--gov-gray-600: #495057;
--gov-gray-700: #343A40;
--gov-gray-800: #212529;
--gov-gray-900: #000000;

/* Colores de Estado */
--success: #059669;
--warning: #D97706;
--error: #DC2626;
--info: #2563EB;
```

### Tipografía

- **Familia principal**: Montserrat (sans-serif moderna)
- **Familia secundaria**: Open Sans (legible)
- **Escala tipográfica**:
  - H1: 2.25rem (36px) - font-bold
  - H2: 1.875rem (30px) - font-bold
  - H3: 1.5rem (24px) - font-semibold
  - Body Large: 1.125rem (18px)
  - Body: 1rem (16px)
  - Body Small: 0.875rem (14px)
  - Caption: 0.75rem (12px)

### Componentes Base

#### Botones
```tsx
// Botón primario (acciones principales)
<Button className="bg-gov-blue hover:bg-gov-blue-dark text-white px-6 py-3 rounded-lg font-semibold">
  Acción Principal
</Button>

// Botón secundario
<Button variant="outline" className="border-gov-blue text-gov-blue hover:bg-gov-blue hover:text-white">
  Acción Secundaria
</Button>

// Botón de peligro
<Button variant="destructive" className="bg-gov-red hover:bg-gov-red-dark">
  Eliminar
</Button>
```

#### Tarjetas de Información
```tsx
<Card className="border-l-4 border-l-gov-blue shadow-sm hover:shadow-md transition-shadow">
  <CardHeader className="pb-3">
    <CardTitle className="text-gov-blue">Título de la Tarjeta</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-gray-600">Contenido de la tarjeta con información relevante.</p>
  </CardContent>
</Card>
```

#### Estados y Badges
```tsx
// Estados de PQRS
<Badge className="bg-green-100 text-green-800 border-green-200">
  Activo
</Badge>

<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
  En Proceso
</Badge>

<Badge className="bg-red-100 text-red-800 border-red-200">
  Pendiente
</Badge>
```

## 📋 Casos de Uso de Diseño

### Caso 1: Consulta Rápida de PQRS
**Usuario objetivo**: Ciudadano o funcionario buscando información específica

**Tiempo objetivo**: < 5 segundos

#### Flujo de Usuario
1. **Entrada**: Usuario llega a la página principal
2. **Acción**: Selecciona tipo de búsqueda (Radicado vs Inteligente)
3. **Búsqueda**: Ingresa número de radicado o descripción
4. **Resultado**: Visualiza información completa del PQRS
5. **Acción opcional**: Expande detalles, descarga PDF, contacta responsable

#### Interfaz Crítica
```
┌─────────────────────────────────────────────────┐
│ 🔍 Búsqueda Inteligente                        │
│                                                 │
│ [Por Radicado] [Búsqueda Inteligente]           │
│                                                 │
│ [Buscar: "Ingresa el número de radicado..."]   │
│                                                 │
│ └─────────────────────────────────────────────┘ │
│ 📋 Resultados (1)                              │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🏷️ Radicado: 202410000123               │ │
│ │ ✅ ACTIVO                                 │ │
│ │ 📍 Dirección: Calle 10 # 20-30           │ │
│ │ 👤 Juan Pérez                            │ │
│ │ 📞 300 123 4567                           │ │
│ │ [Ver Detalles] [PDF] [Contactar]          │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

#### Optimizaciones UX
- **Auto-complete**: Sugerencias mientras escribe
- **Búsqueda por voz**: Botón de micrófono en mobile
- **Resultados instantáneos**: Sin necesidad de presionar Enter
- **Cache inteligente**: Resultados previos disponibles offline

### Caso 2: Asignación Masiva de Recursos
**Usuario objetivo**: Funcionario administrativo asignando recursos

**Tiempo objetivo**: < 30 segundos

#### Flujo de Usuario
1. **Selección**: Elige zona en mapa interactivo
2. **Vista previa**: Revisa PQRS activos en la zona
3. **Asignación**: IA asigna automáticamente recursos
4. **Confirmación**: Revisa y confirma asignaciones
5. **Ejecución**: Genera rutas y notificaciones

#### Interfaz Crítica
```
┌─────────────────────────────────────────────────┐
│ 🗺️ Mapa de Zonas - Medellín                   │
│                                                 │
│ [███████████████] 65% PQRS Activos             │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ 🟢 Zona: Comuna 3 - Manrique              │ │
│ │ 📊 67 PQRS activos de 156 total           │ │
│ │ 👥 6 funcionarios disponibles              │ │
│ │ 🚗 2 vehículos activos                     │ │
│ │ ⭐ Prioridad: ALTA                         │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [Asignar Recursos Automáticamente]              │
│                                                 │
│ ✅ Asignaciones Completadas (3)                │
│ ┌─────────────────────────────────────────────┐ │
│ │ PQRS 202410000123                         │ │
│ │ 👤 Juan Pérez + 🚗 Vehículo #001          │ │
│ │ ⏱️ 2 horas estimadas                      │ │
│ │ ⭐ Prioridad: Alta                         │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

#### Optimizaciones UX
- **Mapa responsive**: Funciona perfectamente en mobile
- **Asignación visual**: Indicadores claros de estado
- **Confirmación batch**: Aprobar múltiples asignaciones
- **Feedback en tiempo real**: Progreso de asignación

### Caso 3: Consulta Compleja con IA
**Usuario objetivo**: Funcionario experto haciendo consultas analíticas

**Tiempo objetivo**: < 10 segundos

#### Flujo de Usuario
1. **Consulta natural**: Escribe pregunta en lenguaje natural
2. **Procesamiento IA**: Sistema analiza y busca información
3. **Resultados visuales**: Muestra datos + insights
4. **Acciones contextuales**: Botones para acciones relevantes

#### Interfaz Crítica
```
┌─────────────────────────────────────────────────┐
│ 🤖 Chat con Asistente IA                       │
│                                                 │
│ Tú: ¿Qué zonas necesitan más personal?         │
│                                                 │
│ 🤖 Analizando PQRS activos...                  │
│                                                 │
│ 📊 **Zonas con Mayor Carga de Trabajo**        │
│                                                 │
│ 1. 🟡 Comuna 3 - Manrique (67 PQRS)           │
│    👥 6 funcionarios → 🚨 Sobrecarga          │
│                                                 │
│ 2. 🟠 Comuna 1 - Popular (45 PQRS)            │
│    👥 8 funcionarios → ⚠️ Alta demanda        │
│                                                 │
│ 3. 🟢 Comuna 14 - El Poblado (23 PQRS)        │
│    👥 12 funcionarios → ✅ Equilibrado        │
│                                                 │
│ [Reasignar Personal] [Ver Mapa Detallado]      │
│ [Generar Reporte] [Notificar Supervisores]     │
└─────────────────────────────────────────────────┘
```

#### Optimizaciones UX
- **Chat conversacional**: Interfaz familiar de mensajería
- **Respuestas contextuales**: Acciones específicas por respuesta
- **Visualización rica**: Gráficos y mapas integrados
- **Memoria conversacional**: Mantiene contexto entre consultas

## ♿ Accesibilidad WCAG 2.1

### Navegación por Teclado
- **Tab order lógico**: Todos los elementos focusables accesibles
- **Skip links**: Enlaces para saltar secciones principales
- **Focus visible**: Indicadores claros de foco activo
- **Atajos de teclado**: Ctrl+K para búsqueda global

### Lectores de Pantalla
- **Etiquetas ARIA**: Descripciones completas de elementos
- **Roles semánticos**: Uso correcto de landmarks
- **Anuncios dinámicos**: Cambios de estado anunciados
- **Texto alternativo**: Descripciones de imágenes y iconos

### Alto Contraste
- **Cumple ratio 4.5:1**: Para texto normal y grande
- **Modo alto contraste**: Soporte para preferencias del sistema
- **Estados claros**: Diferenciación visual de estados interactivos

## 📱 Diseño Responsive

### Breakpoints Estratégicos
```scss
// Mobile First Approach
$mobile: 320px;      // Celulares pequeños
$tablet: 768px;      // Tablets y celulares grandes
$desktop: 1024px;    // Desktop pequeño
$desktop-lg: 1440px; // Desktop grande
```

### Adaptaciones por Dispositivo

#### Mobile (< 768px)
- **Navegación**: Hamburger menu deslizante
- **Contenido**: Stack vertical, texto más grande
- **Interacciones**: Touch targets de 44px mínimo
- **Mapas**: Controles optimizados para touch

#### Tablet (768px - 1024px)
- **Navegación**: Sidebar colapsable
- **Contenido**: Grid de 2 columnas
- **Interacciones**: Hover states disponibles

#### Desktop (> 1024px)
- **Navegación**: Sidebar fija completa
- **Contenido**: Layout de 3+ columnas
- **Interacciones**: Hover states y tooltips

## 🚀 Performance y Optimización

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 200KB gzipped

### Estrategias Implementadas

#### Code Splitting
```tsx
// Lazy loading de módulos
const QueryModule = lazy(() => import('../modules/QueryModule'))
const AssignmentModule = lazy(() => import('../modules/AssignmentModule'))

// Suspense boundaries
<Suspense fallback={<ModuleLoader />}>
  <ActiveComponent />
</Suspense>
```

#### Virtualización
```tsx
// Listas grandes solo renderizan elementos visibles
<VirtualizedList
  items={results}
  itemHeight={200}
  renderItem={(record, index) => <PQRSItem record={record} />}
/>
```

#### Cache Inteligente
```tsx
// Cache de consultas con expiración
const searchCache = useMemo(() => new Map<string, CachedResult>(), [])
const cached = searchCache.get(cacheKey)

if (cached && (Date.now() - cached.timestamp) < 300000) {
  return cached.results // 5 minutos de cache
}
```

#### Optimización de Imágenes
- **Formatos modernos**: WebP con fallbacks
- **Lazy loading**: Solo carga imágenes visibles
- **Responsive images**: Diferentes tamaños por dispositivo

## 🔧 Guías de Implementación

### Estados de Componentes
```tsx
// Estados de carga
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// Estados de UI
const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
const [selectedZone, setSelectedZone] = useState<string>('')
```

### Manejo de Errores
```tsx
// Error boundaries
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### Testing Strategy
```tsx
// Tests unitarios
describe('QueryModule', () => {
  it('renders search interface correctly', () => {
    render(<QueryModule />)
    expect(screen.getByRole('search')).toBeInTheDocument()
  })

  it('handles search results', async () => {
    // Test async operations
    await waitFor(() => {
      expect(screen.getByText('Resultados')).toBeInTheDocument()
    })
  })
})
```

## 🎯 Métricas de Éxito

### KPIs de UX
- **Task Completion Rate**: > 95% para flujos principales
- **Time to Complete**: Dentro de objetivos por caso de uso
- **Error Rate**: < 5% en interacciones críticas
- **User Satisfaction**: > 4.5/5 en encuestas

### KPIs Técnicos
- **Performance Score**: > 90 en Lighthouse
- **Accessibility Score**: 100% WCAG 2.1 AA
- **SEO Score**: > 90 para contenido público
- **Core Web Vitals**: Todos en rango "Good"

## 📚 Próximos Pasos

1. **Validación con usuarios**: Tests con funcionarios reales
2. **Iteración basada en feedback**: Mejoras continuas
3. **Escalabilidad**: Preparación para múltiples municipios
4. **Analytics**: Métricas detalladas de uso y performance

---

**🎨 El Sistema PQRS Medellín combina diseño moderno, accesibilidad completa y performance optimizada para crear una experiencia excepcional tanto para ciudadanos como para funcionarios públicos.**