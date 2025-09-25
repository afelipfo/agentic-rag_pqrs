"""Assignment Agent - handles AI-powered assignment of PQRS to resources."""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from ..services.assignment_service import assignment_service

logger = logging.getLogger(__name__)


class AssignmentAgent:
    """Agent specialized in assigning PQRS to personnel and vehicles."""

    def __init__(self):
        self.assignment_service = assignment_service

    def assign_resources(self, pqrs_ids: List[str], zone_filter: Optional[str] = None) -> Dict[str, Any]:
        """Assign resources to PQRS requests."""
        try:
            logger.info(f"Assignment Agent: Processing {len(pqrs_ids)} PQRS assignments")

            # Use the assignment service
            result = self.assignment_service.assign_pqrs_resources(pqrs_ids)

            # Add agent metadata
            result["agent"] = "assignment_agent"
            result["processed_at"] = datetime.now().isoformat()

            logger.info(f"Assignment Agent: Completed {result['total_assigned']} assignments")
            return result

        except Exception as e:
            logger.error(f"Assignment Agent error: {e}")
            return {
                "error": str(e),
                "agent": "assignment_agent",
                "assignments": [],
                "total_assigned": 0,
                "unassigned": pqrs_ids
            }

    def generate_schedule(self, zone: Optional[str] = None, days: int = 7) -> Dict[str, Any]:
        """Generate assignment schedule."""
        try:
            schedule = self.assignment_service.get_assignment_schedule(zone, days)

            return {
                "agent": "assignment_agent",
                "schedule": schedule,
                "generated_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Schedule generation error: {e}")
            return {
                "error": str(e),
                "agent": "assignment_agent"
            }

    def optimize_assignments(self, assignment_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Optimize existing assignments."""
        try:
            optimization = self.assignment_service.optimize_assignments(assignment_data)

            return {
                "agent": "assignment_agent",
                "optimization": optimization,
                "optimized_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Assignment optimization error: {e}")
            return {
                "error": str(e),
                "agent": "assignment_agent"
            }

    def get_status(self) -> Dict[str, Any]:
        """Get agent status."""
        return {
            "name": "Assignment Agent",
            "status": "active",
            "capabilities": [
                "AI-powered resource assignment",
                "Zone-based allocation",
                "Schedule generation",
                "Assignment optimization"
            ],
            "last_active": datetime.now().isoformat()
        }


# Global instance
assignment_agent = AssignmentAgent()