# Sistema Unificado PQRS con Agentic RAG

**Sistema Inteligente de Gestión de PQRS (Peticiones, Quejas, Reclamos y Sugerencias) con Agentic RAG para la Secretaría de Infraestructura Física de Medellín**

Un sistema unificado que combina las funcionalidades de asignación inteligente de recursos (basado en pqrs-ai-agent) con consultas inteligentes de PQRS históricos (basado en SIFGPT), implementando una arquitectura Agentic RAG moderna.

## 🎯 Propósito del Sistema

Este sistema fusiona dos herramientas existentes en una sola aplicación modular que gestiona PQRS para la ciudad de Medellín, Colombia, proporcionando:

- **Asignación Inteligente**: Asignación automática de personal y vehículos a PQRS activos por zona geográfica
- **Consultas Inteligentes**: Búsqueda semántica y por radicado en el histórico de PQRS
- **Arquitectura Agentic RAG**: Agentes especializados coordinados por IA para procesamiento inteligente

## 🚀 Características Principales

### 🤖 Arquitectura Agentic RAG
- **Agent Coordinator**: Orquesta agentes especializados basado en el tipo de consulta
- **Assignment Agent**: Maneja asignaciones inteligentes de recursos
- **Query Agent**: Procesa consultas y búsquedas en PQRS históricos
- **Data Agent**: Gestiona carga y mantenimiento de datos

### 📍 Asignación Inteligente de Recursos
- **Asignación automática con IA** de personal y vehículos
- **Optimización basada en zona geográfica** y disponibilidad
- **Dashboard en tiempo real** del estado del sistema
- **Cálculo de rutas optimizadas** y calendarios de trabajo

### 🧠 Consultas Inteligentes de PQRS
- **Búsqueda por número de radicado** con respuesta estandarizada
- **Búsqueda semántica** por contenido (asunto, tema principal, dirección)
- **Filtros avanzados** por estado, tipo, comuna, barrio, etc.
- **Respuestas contextualizadas** con información completa

### 📊 Gestión Integral de Datos
- **Base de datos histórica** de 51,588+ registros de PQRS
- **Vector store con ChromaDB** para búsquedas semánticas
- **Validación automática** de integridad de datos
- **Índices optimizados** para consultas rápidas

## 🏗️ Arquitectura del Sistema

```
unified-pqrs-system/
├── data/                          # Datos del sistema
│   ├── data-pqrs.xlsx            # Histórico PQRS (51,588 registros)
│   ├── data-personal.xlsx        # Personal disponible con zonificación
│   ├── data-transporte.xlsx      # Vehículos asignados
│   └── data-zonificacion.xlsx    # Zonificación de Medellín por comunas
├── src/                          # Código fuente
│   ├── main.py                   # Aplicación FastAPI principal
│   ├── config.py                 # Configuración centralizada
│   ├── models/                   # Modelos de datos Pydantic
│   │   ├── pqrs.py              # Modelos de PQRS, personal, vehículos
│   │   └── api.py               # Modelos de API request/response
│   ├── services/                 # Servicios de negocio
│   │   ├── data_service.py      # Carga y gestión de datos Excel
│   │   ├── rag_service.py       # Sistema RAG con ChromaDB
│   │   └── assignment_service.py # Lógica de asignación IA
│   ├── agents/                   # Agentes especializados
│   │   ├── coordinator.py       # Coordinador de agentes
│   │   ├── assignment_agent.py  # Agente de asignaciones
│   │   ├── query_agent.py       # Agente de consultas
│   │   └── data_agent.py        # Agente de datos
│   ├── api/                      # Endpoints API
│   │   └── routes/
│   │       ├── assignment.py    # Endpoints de asignación
│   │       ├── query.py         # Endpoints de consulta
│   │       └── health.py        # Endpoints de salud
│   └── utils/                    # Utilidades
├── rag/                          # Vector store persistente
├── requirements.txt              # Dependencias Python
├── .env.example                  # Variables de entorno
├── Dockerfile                    # Contenedor Docker
├── docker-compose.yml           # Orquestación
└── README.md                    # Esta documentación
```

## 🔧 Instalación y Configuración

### Requisitos Previos

- **Python 3.11+**
- **OpenAI API Key** (para GPT-4 y embeddings)
- **Datos Excel** en carpeta `data/`

### Instalación Rápida

1. **Clonar y configurar el proyecto**
   ```bash
   cd unified-pqrs-system
   cp .env.example .env
   # Editar .env con tu OPENAI_API_KEY
   ```

2. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecutar la aplicación**
   ```bash
   python -m src.main
   ```

4. **Acceder al sistema**
   - API: `http://localhost:8000`
   - Documentación: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/api/health/`

### Configuración Avanzada

#### Variables de Entorno
```env
OPENAI_API_KEY=tu_api_key_aqui
DEBUG=true
HOST=0.0.0.0
PORT=8000
DATA_DIR=data
CHROMA_PERSIST_DIRECTORY=rag/chroma_db
```

## 📡 API Endpoints

### Asignación de Recursos
- `POST /api/assignment/assign-pqrs` - Asignar recursos a PQRS
- `GET /api/assignment/schedule` - Generar calendario de asignaciones
- `POST /api/assignment/optimize` - Optimizar asignaciones existentes

### Consultas de PQRS
- `POST /api/query/pqrs` - Consulta general con filtros
- `GET /api/query/pqrs/{radicado}` - Consulta por número de radicado
- `GET /api/query/search-content` - Búsqueda semántica
- `GET /api/query/suggestions` - Sugerencias de búsqueda

### Sistema y Monitoreo
- `GET /api/health/` - Estado general del sistema
- `GET /api/health/agents` - Estado de los agentes
- `GET /api/health/data` - Estado de los datos
- `GET /api/health/capabilities` - Capacidades del sistema

### Procesamiento Agentic
- `POST /api/agent/process` - Procesar solicitud a través del coordinador

## 🎨 Casos de Uso Principales

### Caso 1: Asignación Diaria de Recursos
```bash
curl -X POST "http://localhost:8000/api/assignment/assign-pqrs" \
  -H "Content-Type: application/json" \
  -d '{
    "pqrs_ids": ["202510292021", "202510292022"],
    "zone_filter": "Comuna 1"
  }'
```

### Caso 2: Consulta por Radicado
```bash
curl "http://localhost:8000/api/query/pqrs/202510292021"
```

### Caso 3: Búsqueda Semántica
```bash
curl -X POST "http://localhost:8000/api/query/pqrs" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "problemas con vías en El Poblado",
    "query_type": "semantic",
    "limit": 5
  }'
```

### Caso 4: Procesamiento Agentic
```bash
curl -X POST "http://localhost:8000/api/agent/process" \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "Asignar personal para PQRS activos de hoy",
    "parameters": {"zone_filter": "Comuna 1"}
  }'
```

## 🧪 Verificación del Sistema

### Health Check Completo
```bash
curl http://localhost:8000/api/health/
```

### Prueba de Funcionalidades
```bash
# Verificar datos cargados
curl http://localhost:8000/api/health/data

# Verificar agentes activos
curl http://localhost:8000/api/health/agents

# Probar consulta de ejemplo
curl -X POST "http://localhost:8000/api/query/pqrs" \
  -H "Content-Type: application/json" \
  -d '{"query": "reparacion", "query_type": "semantic", "limit": 3}'
```

## 🚀 Despliegue

### Docker
```bash
# Construir imagen
docker build -t unified-pqrs-system .

# Ejecutar contenedor
docker run -p 8000:8000 --env-file .env unified-pqrs-system
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  pqrs-system:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./data:/app/data
      - ./rag:/app/rag
```

```bash
docker-compose up -d
```

## 📊 Métricas y Rendimiento

### Rendimiento Esperado
- **Consultas de radicado**: < 500ms
- **Búsquedas semánticas**: < 2 segundos
- **Asignaciones IA**: < 30 segundos
- **Carga inicial de datos**: < 60 segundos

### Estadísticas del Sistema
- **Base de datos**: 51,588 registros históricos
- **Cobertura**: Todas las comunas de Medellín
- **Tipos de PQRS**: 5 categorías principales
- **Estados**: Activo, Respondido, Cerrado, etc.

## 🔒 Seguridad y Privacidad

- **Validación de entrada** en todos los endpoints
- **Variables de entorno** para credenciales sensibles
- **Logging estructurado** para auditoría
- **Rate limiting** recomendado para producción
- **Encriptación** de datos sensibles según normativas colombianas

## 🤝 Desarrollo y Contribución

### Estructura de Desarrollo
1. **Ramas**: `main` para producción, `develop` para desarrollo
2. **Commits**: Mensajes descriptivos en español
3. **Tests**: Ejecutar `pytest` antes de commits
4. **Linting**: Usar `black` y `flake8`

### Agregar Nuevos Agentes
1. Crear clase en `src/agents/`
2. Registrar en `coordinator.py`
3. Agregar rutas en `src/api/routes/`
4. Actualizar documentación

## 📋 Roadmap

### Fase 1 (Actual) ✅
- Arquitectura Agentic RAG básica
- Asignación inteligente de recursos
- Consultas de PQRS con RAG
- API REST completa

### Fase 2 (Próxima)
- Interfaz web con Streamlit/React
- Notificaciones automáticas
- Métricas avanzadas y dashboards
- Integración con sistemas municipales

### Fase 3 (Futuro)
- Procesamiento de audio con Whisper
- Aprendizaje continuo del modelo
- Integración con GIS municipal
- API para aplicaciones móviles

## 🆘 Solución de Problemas

### Problemas Comunes

**Error de OpenAI API**
```
# Verificar OPENAI_API_KEY en .env
# Verificar cuota de API en OpenAI
```

**Datos no cargan**
```
# Verificar archivos Excel en data/
# Verificar permisos de lectura
# Revisar logs: python -c "import logging; logging.basicConfig(level=logging.DEBUG)"
```

**Vector store falla**
```
# Borrar rag/chroma_db y reiniciar
# Verificar espacio en disco
# Revisar conectividad a OpenAI para embeddings
```

### Logs y Debugging
```bash
# Ejecutar con debug
DEBUG=true python -m src.main

# Ver logs detallados
tail -f logs/app.log
```

## 📄 Licencia

Este proyecto es propiedad de la **Alcaldía de Medellín - Secretaría de Infraestructura Física**. Desarrollado para uso interno de la administración municipal.

## 🏛️ Contexto Institucional

- **Institución**: Secretaría de Infraestructura Física de Medellín
- **Alcance**: Gestión integral de PQRS urbanos
- **Usuarios**: Funcionarios municipales y ciudadanos
- **Objetivo**: Optimizar la atención ciudadana mediante IA

---

**Sistema Unificado PQRS v1.0.0** - Transformando la gestión municipal con Inteligencia Artificial  
*Secretaría de Infraestructura Física - Alcaldía de Medellín*