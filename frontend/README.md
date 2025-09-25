# 🚀 Sistema PQRS Medellín - Frontend

Interfaz web moderna y accesible para la gestión inteligente de PQRS (Peticiones, Quejas, Reclamos y Sugerencias) en la Secretaría de Infraestructura Física de Medellín.

## ✨ Características Principales

### 🎯 Experiencia de Usuario Optimizada
- **Diseño Responsive**: Funciona perfectamente en desktop, tablet y mobile
- **Accesibilidad WCAG 2.1**: Navegación por teclado, lectores de pantalla, alto contraste
- **Performance Optimizada**: Lazy loading, virtualización, cache inteligente
- **Internacionalización**: Textos en español colombiano, formatos locales

### 🤖 Capacidades IA Integradas
- **Búsqueda Inteligente**: Encuentra PQRS por contenido semántico
- **Asignación Automática**: IA asigna recursos por zona geográfica
- **Chat Conversacional**: Consultas en lenguaje natural
- **Análisis Predictivo**: Insights sobre tendencias y cargas de trabajo

### 📊 Módulos Funcionales
- **Consultas PQRS**: Búsqueda por radicado o contenido inteligente
- **Asignación de Recursos**: Mapa interactivo con asignación automática
- **Métricas y Analytics**: Dashboards con KPIs en tiempo real
- **Chat IA**: Asistente virtual para consultas complejas

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Backend API corriendo (ver README del backend)

### Instalación
```bash
# Clonar repositorio
git clone <repository-url>
cd agentic-rag_pqrs/frontend

# Instalar dependencias
npm install

# Variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

### Variables de Entorno
```env
# API Backend
VITE_API_BASE_URL=http://localhost:8000

# OpenAI (para funcionalidades IA)
VITE_OPENAI_API_KEY=your_openai_key

# Configuración de aplicación
VITE_APP_TITLE="Sistema PQRS Medellín"
VITE_APP_VERSION="1.0.0"
```

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context
- **Routing**: React Router
- **Testing**: Vitest + React Testing Library
- **Performance**: React Window (virtualización)

### Estructura de Carpetas
```
frontend/
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── common/        # Componentes reutilizables
│   │   ├── layout/        # Layout y navegación
│   │   └── modules/       # Módulos principales
│   ├── hooks/             # Custom hooks
│   ├── services/          # Servicios API
│   ├── styles/            # Estilos CSS
│   ├── types/             # TypeScript types
│   ├── utils/             # Utilidades
│   └── tests/             # Tests
├── docs/                  # Documentación
└── UX_DOCUMENTATION.md    # Documentación UX completa
```

## 🎨 Sistema de Diseño

### Paleta de Colores (Gobierno Digital Colombia)
```css
--gov-blue: #0033A0;      /* Azul institucional */
--gov-yellow: #FFCB00;    /* Amarillo complementario */
--gov-red: #C8102E;       /* Rojo para alertas */
--success: #059669;       /* Verde éxito */
--warning: #D97706;       /* Amarillo advertencia */
--error: #DC2626;         /* Rojo error */
```

### Componentes Principales

#### SearchBar con Auto-complete
```tsx
<SearchBar
  placeholder="Buscar PQRS..."
  onSearch={(query) => handleSearch(query)}
  recentSearches={['alumbrado público', 'problemas vías']}
  popularSearches={['alumbrado', 'vías', 'transporte']}
/>
```

#### VirtualizedList para Performance
```tsx
<VirtualizedList
  items={pqrsResults}
  itemHeight={200}
  renderItem={(record, index) => <PQRSItem record={record} />}
/>
```

#### MapComponent Interactivo
```tsx
<MapComponent
  zones={medellinZones}
  onZoneClick={handleZoneSelection}
  selectedZone={currentZone}
  height="500px"
/>
```

## 📱 Casos de Uso Principales

### 1. Consulta Rápida (< 5 segundos)
```
Usuario busca radicado → Resultados instantáneos → Detalles expandidos
```

### 2. Asignación Masiva (< 30 segundos)
```
Selección de zona → IA asigna recursos → Confirmación batch → Rutas generadas
```

### 3. Consulta con IA (< 10 segundos)
```
Pregunta natural → Procesamiento IA → Resultados visuales + acciones contextuales
```

## ♿ Accesibilidad WCAG 2.1

### ✅ Conformidades Implementadas
- **Contraste 4.5:1** mínimo en todos los textos
- **Navegación por teclado** completa con indicadores visuales
- **Lectores de pantalla** con etiquetas ARIA comprehensivas
- **Skip links** para navegación rápida
- **Alt text** en todas las imágenes y iconos

### ⌨️ Atajos de Teclado
- `Ctrl + K`: Abrir búsqueda global
- `Tab`: Navegación secuencial
- `Enter/Espacio`: Activar elementos
- `Escape`: Cerrar modales

## ⚡ Optimizaciones de Performance

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 200KB gzipped

### Técnicas Implementadas
- **Code Splitting**: Lazy loading de módulos
- **Virtualización**: Listas grandes solo renderizan visibles
- **Debounce**: Búsquedas no ejecutan hasta 300ms de inactividad
- **Cache Inteligente**: Resultados de búsqueda cacheados 5 minutos
- **Memoización**: Componentes y cálculos optimizados

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests de integración
npm run test:e2e
```

### Cobertura de Tests
- **Componentes**: 95%+ coverage
- **Hooks personalizados**: Tests completos
- **Utilidades**: Tests unitarios
- **Integración**: Tests end-to-end

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Variables de Producción
```env
# Producción
VITE_API_BASE_URL=https://api.pqrs.medellin.gov.co
VITE_ENVIRONMENT=production
```

### CDN y Assets
- Imágenes optimizadas con WebP
- Bundle splitting automático
- Service Worker para PWA (futuro)

## 📊 Monitoreo y Analytics

### Métricas de UX
- Task Completion Rate
- Time to Complete
- Error Rate
- User Satisfaction Scores

### Performance Monitoring
- Core Web Vitals
- Lighthouse Scores
- Bundle Analysis
- Error Tracking

## 🤝 Contribución

### Guías de Desarrollo
1. Seguir convenciones de código
2. Tests para nuevas funcionalidades
3. Documentación de componentes
4. Code reviews obligatorios

### Commits Convencionales
```
feat: nueva funcionalidad de búsqueda
fix: corrección en virtualización de listas
docs: actualización de documentación UX
style: mejoras de accesibilidad
refactor: optimización de performance
```

## 📚 Documentación Adicional

- **[UX_DOCUMENTATION.md](./UX_DOCUMENTATION.md)**: Documentación completa de UX/UI
- **[API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md)**: Documentación de APIs
- **[ARCHITECTURE.md](../docs/ARCHITECTURE.md)**: Arquitectura del sistema

## 📞 Soporte

### Canales de Comunicación
- **Issues**: GitHub Issues para bugs y features
- **Discussions**: GitHub Discussions para preguntas generales
- **Email**: soporte@pqrs.medellin.gov.co

### Equipo de Desarrollo
- **Frontend Lead**: [Nombre]
- **UX/UI Designer**: [Nombre]
- **QA Lead**: [Nombre]

## 📋 Roadmap

### Próximas Versiones
- **v1.1.0**: PWA completa con offline
- **v1.2.0**: Integración con WhatsApp Business
- **v1.3.0**: Analytics avanzado y reportes
- **v2.0.0**: Multi-municipio y escalabilidad nacional

---

**🏛️ Desarrollado para la Secretaría de Infraestructura Física - Alcaldía de Medellín**

*Sistema inteligente que combina IA avanzada con diseño accesible para optimizar la gestión urbana.*