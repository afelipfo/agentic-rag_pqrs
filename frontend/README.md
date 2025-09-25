# Dashboard PQRS - Frontend

Interfaz minimalista y moderna para el Sistema Unificado PQRS con Agentic RAG.

## 🚀 Características

- **Diseño Minimalista**: Interfaz limpia y moderna con paleta gubernamental
- **Responsive**: Optimizado para desktop, tablet y móvil
- **Accesible**: Cumple estándares WCAG 2.1
- **Modular**: Arquitectura de componentes reutilizables
- **TypeScript**: Tipado estático para mayor robustez

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Lucide React** para iconografía
- **React Router** para navegación
- **Axios** para llamadas API
- **Vite** como bundler

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/           # Componentes reutilizables
│   │   │   ├── Button.tsx    # Botón personalizado
│   │   │   ├── Input.tsx     # Campo de entrada
│   │   │   ├── Card.tsx      # Tarjeta de contenido
│   │   │   └── Badge.tsx     # Etiqueta de estado
│   │   ├── modules/          # Módulos principales
│   │   │   ├── QueryModule.tsx      # Consultas PQRS
│   │   │   ├── AssignmentModule.tsx # Asignaciones
│   │   │   ├── MetricsModule.tsx    # Métricas
│   │   │   └── ChatModule.tsx       # Chat IA
│   │   └── layout/           # Layout y navegación
│   │       ├── Dashboard.tsx # Layout principal
│   │       ├── Header.tsx    # Barra superior
│   │       └── Sidebar.tsx   # Navegación lateral
│   ├── hooks/                # Custom hooks
│   ├── services/             # Servicios API
│   ├── types/                # Interfaces TypeScript
│   ├── utils/                # Utilidades
│   │   └── cn.ts            # Función para clases CSS
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/                  # Archivos estáticos
├── package.json            # Dependencias
├── vite.config.ts          # Configuración Vite
├── tailwind.config.ts      # Configuración Tailwind
└── README.md              # Esta documentación
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con la URL del backend
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Acceder al dashboard**
   - Abrir http://localhost:3000
   - El backend debe estar ejecutándose en http://localhost:8000

## 🎨 Diseño y UX

### Paleta de Colores

```css
/* Colores Gubernamentales Medellín */
--gov-blue: #003d82;      /* Azul institucional */
--gov-lightblue: #2563eb;  /* Azul secundario */
--gov-green: #22c55e;      /* Verde para estados positivos */
--gov-gray: #6b7280;       /* Gris neutro */
--gov-lightgray: #f8fafc;  /* Fondo claro */
```

### Principios de Diseño

1. **Minimalista**: Espacios generosos, elementos esenciales
2. **Jerarquía clara**: Información organizada por importancia
3. **Feedback inmediato**: Estados de carga y confirmaciones
4. **Accesible**: Contraste adecuado, navegación por teclado

### Breakpoints Responsive

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔧 Módulos del Sistema

### 1. Consultas Inteligentes 🔍
- Búsqueda por radicado o contenido semántico
- Filtros avanzados (estado, comuna, tipo)
- Resultados en formato de tarjetas
- Información completa del PQRS

### 2. Asignación Inteligente 👥
- Mapa interactivo de Medellín por zonas
- Asignación automática con IA
- Calendario de trabajo semanal
- Optimización de rutas

### 3. Monitoreo y Métricas 📊
- KPIs en tiempo real
- Gráficos interactivos
- Estadísticas por zona
- Alertas y notificaciones

### 4. Asistente IA Conversacional 🤖
- Chat inteligente para consultas complejas
- Procesamiento de lenguaje natural
- Memoria conversacional
- Sugerencias automáticas

## 🔌 Conexión con Backend

### APIs Utilizadas

```typescript
// Consultas
GET  /api/health/         // Estado del sistema
POST /api/query/pqrs      // Búsqueda semántica
GET  /api/query/pqrs/{id} // Consulta por radicado

// Asignaciones
POST /api/assignment/     // Asignación automática

// Agente IA
POST /api/agent/process   // Procesamiento coordinado
```

### Configuración

```env
# .env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME="Sistema PQRS Medellín"
```

## 📱 Características Móviles

- **Navegación hamburguesa** en móviles
- **Gestos táctiles** para mapas
- **Modales deslizantes** para filtros
- **Optimización de rendimiento** en conexiones lentas

## ♿ Accesibilidad

- **WCAG 2.1 AA** compliance
- **Navegación por teclado** completa
- **Screen reader** compatible
- **Contraste de color** mínimo 4.5:1

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests E2E (futuro)
npm run test:e2e
```

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

### Variables de Producción

```env
VITE_API_BASE_URL=https://api.pqrs.medellin.gov.co
VITE_APP_ENV=production
```

### Docker (Opcional)

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto es parte del Sistema PQRS de la Alcaldía de Medellín.

---

**🎯 Dashboard diseñado para maximizar la eficiencia en la gestión de PQRS ciudadanos.**