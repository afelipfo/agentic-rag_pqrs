"""Main FastAPI application for the unified PQRS system."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api.routes import assignment, query, health
from .services.data_service import data_service
from .services.rag_service import rag_service
from .agents.coordinator import agent_coordinator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting unified PQRS system...")

    try:
        # Load data
        logger.info("Loading data...")
        data_stats = data_service.load_all_data()
        logger.info(f"Data loaded: {data_stats}")

        # Initialize RAG service
        logger.info("Initializing RAG service...")
        rag_service.initialize_vectorstore()
        logger.info("RAG service initialized")

        logger.info("System startup complete")

    except Exception as e:
        logger.error(f"Error during startup: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down unified PQRS system...")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Sistema unificado de gestión PQRS con Agentic RAG para la Secretaría de Infraestructura Física de Medellín",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(assignment.router, prefix="/api/assignment", tags=["assignment"])
app.include_router(query.router, prefix="/api/query", tags=["query"])
app.include_router(health.router, prefix="/api/health", tags=["health"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Sistema Unificado PQRS con Agentic RAG",
        "version": settings.app_version,
        "status": "active",
        "docs": "/docs"
    }


@app.post("/api/agent/process")
async def process_agent_request(request: dict):
    """Process a request through the agent coordinator."""
    try:
        from .models.api import AgentTaskRequest

        # Convert dict to AgentTaskRequest
        task_request = AgentTaskRequest(**request)

        # Process through coordinator
        response = agent_coordinator.process_request(task_request)

        return response.dict()

    except Exception as e:
        logger.error(f"Agent processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )