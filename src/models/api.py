"""API request/response models."""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AssignmentRequest(BaseModel):
    """Request model for assignment operations."""

    pqrs_ids: List[str] = Field(..., description="List of PQRS IDs to assign")
    zone_filter: Optional[str] = Field(None, description="Filter by specific zone")
    priority_filter: Optional[str] = Field(None, description="Filter by priority level")


class AssignmentResponse(BaseModel):
    """Response model for assignment operations."""

    assignments: List[Dict[str, Any]] = Field(..., description="Assignment details")
    total_assigned: int = Field(..., description="Total assignments made")
    unassigned: List[str] = Field(default_factory=list, description="Unassigned PQRS IDs")


class QueryRequest(BaseModel):
    """Request model for PQRS queries."""

    query: str = Field(..., description="Search query or radicado number")
    query_type: str = Field("semantic", description="Type: 'radicado', 'semantic', 'advanced'")
    filters: Optional[Dict[str, Any]] = Field(None, description="Additional filters")
    limit: int = Field(10, description="Maximum results to return")


class PQRSResponse(BaseModel):
    """Standardized PQRS response."""

    numero_radicado_entrada: str
    estado: str
    asunto: Optional[str]
    direccion_hecho: Optional[str]
    barrio_hecho: Optional[str]
    comuna_hecho: Optional[str]
    nombre_peticionario: Optional[str]
    telefono_peticionario: Optional[str]
    correo_peticionario: Optional[str]
    tipo_solicitud: Optional[str]
    tema_principal: Optional[str]
    fecha_radicacion: Optional[str]
    dias_transcurridos: Optional[int]
    unidad_responsable: Optional[str]
    fecha_vencimiento: Optional[str]


class QueryResponse(BaseModel):
    """Response model for queries."""

    results: List[PQRSResponse] = Field(default_factory=list)
    total_found: int = Field(0, description="Total matching records")
    query_type: str = Field(..., description="Type of query performed")
    search_metadata: Optional[Dict[str, Any]] = Field(None, description="Search metadata")


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = "healthy"
    version: str = "1.0.0"
    services: Dict[str, Any] = Field(default_factory=dict)
    data_stats: Optional[Dict[str, Any]] = Field(None, description="Data statistics")


class AgentTaskRequest(BaseModel):
    """Request model for agent tasks."""

    task_type: str = Field(..., description="Type of agent task")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Task parameters")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")


class AgentTaskResponse(BaseModel):
    """Response model for agent tasks."""

    task_id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    execution_time: Optional[float] = None