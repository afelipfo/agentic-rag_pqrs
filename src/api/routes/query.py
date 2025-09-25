"""Query API routes."""

from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException

from ...models.api import QueryRequest, QueryResponse
from ...agents.query_agent import query_agent

router = APIRouter()


@router.post("/pqrs", response_model=QueryResponse)
async def query_pqrs(request: QueryRequest):
    """Query PQRS database with various search types."""
    try:
        result = query_agent.process_query(
            request.query,
            request.query_type,
            request.filters,
            request.limit
        )

        return QueryResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@router.get("/pqrs/{radicado}")
async def get_pqrs_by_radicado(radicado: str):
    """Get PQRS by radicado number."""
    try:
        result = query_agent.process_query(radicado, "radicado")
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Radicado query failed: {str(e)}")


@router.get("/search-content")
async def search_content(q: str, limit: int = 10, filters: Optional[str] = None):
    """Search PQRS content semantically."""
    try:
        # Parse filters if provided
        parsed_filters = None
        if filters:
            import json
            parsed_filters = json.loads(filters)

        result = query_agent.process_query(q, "semantic", parsed_filters, limit)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Content search failed: {str(e)}")


@router.get("/suggestions")
async def get_search_suggestions(q: str, limit: int = 5):
    """Get search suggestions for partial queries."""
    try:
        result = query_agent.get_search_suggestions(q, limit)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Suggestions failed: {str(e)}")


@router.get("/statistics")
async def get_query_statistics():
    """Get query statistics."""
    try:
        result = query_agent.get_query_statistics()
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Statistics failed: {str(e)}")


@router.get("/status")
async def get_query_status():
    """Get query agent status."""
    try:
        return query_agent.get_status()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")