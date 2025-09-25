"""Assignment API routes."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException

from ...models.api import AssignmentRequest, AssignmentResponse
from ...agents.assignment_agent import assignment_agent

router = APIRouter()


@router.post("/assign-pqrs", response_model=AssignmentResponse)
async def assign_pqrs_resources(request: AssignmentRequest):
    """Assign personnel and vehicles to PQRS requests using AI."""
    try:
        result = assignment_agent.assign_resources(
            request.pqrs_ids,
            request.zone_filter
        )

        return AssignmentResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assignment failed: {str(e)}")


@router.get("/schedule")
async def get_assignment_schedule(zone: Optional[str] = None, days: int = 7):
    """Generate assignment schedule."""
    try:
        result = assignment_agent.generate_schedule(zone, days)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Schedule generation failed: {str(e)}")


@router.post("/optimize")
async def optimize_assignments(assignments: List[dict]):
    """Optimize existing assignments."""
    try:
        result = assignment_agent.optimize_assignments(assignments)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


@router.get("/status")
async def get_assignment_status():
    """Get assignment agent status."""
    try:
        return assignment_agent.get_status()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")