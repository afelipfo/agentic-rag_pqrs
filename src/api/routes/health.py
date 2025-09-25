"""Health check API routes."""

from fastapi import APIRouter

from ...models.api import HealthResponse
from ...services.data_service import data_service
from ...services.rag_service import rag_service
from ...agents.coordinator import agent_coordinator

router = APIRouter()


@router.get("/", response_model=HealthResponse)
async def health_check():
    """Comprehensive health check of the system."""
    try:
        # Get data statistics
        data_stats = data_service.get_data_statistics()

        # Check agent statuses
        agent_statuses = agent_coordinator.get_agent_status()

        # Determine overall health
        services_status = {
            "data_service": "✅ Disponible" if data_stats["pqrs_total"] > 0 else "❌ Sin datos",
            "rag_service": "✅ Disponible" if rag_service._initialized else "❌ No inicializado",
            "assignment_agent": "✅ Activo" if agent_statuses.get("assignment_agent", {}).get("status") == "active" else "❌ Inactivo",
            "query_agent": "✅ Activo" if agent_statuses.get("query_agent", {}).get("status") == "active" else "❌ Inactivo",
            "data_agent": "✅ Activo" if agent_statuses.get("data_agent", {}).get("status") == "active" else "❌ Inactivo",
        }

        # Overall status
        all_healthy = all("✅" in status for status in services_status.values())

        return HealthResponse(
            status="healthy" if all_healthy else "degraded",
            version="1.0.0",
            services=services_status,
            data_stats=data_stats
        )

    except Exception as e:
        return HealthResponse(
            status="unhealthy",
            services={"error": f"Health check failed: {str(e)}"}
        )


@router.get("/agents")
async def get_agents_status():
    """Get status of all agents."""
    try:
        return agent_coordinator.get_agent_status()

    except Exception as e:
        return {"error": str(e)}


@router.get("/data")
async def get_data_status():
    """Get data loading status."""
    try:
        return data_service.get_data_statistics()

    except Exception as e:
        return {"error": str(e)}


@router.get("/capabilities")
async def get_system_capabilities():
    """Get system capabilities."""
    try:
        return agent_coordinator.get_capabilities()

    except Exception as e:
        return {"error": str(e)}