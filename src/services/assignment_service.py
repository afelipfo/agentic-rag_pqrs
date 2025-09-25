"""Assignment service for AI-powered PQRS assignment to personnel and vehicles."""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from ..config import settings
from ..models.pqrs import PQRSRecord, PersonnelRecord, VehicleRecord, ZoneRecord
from .data_service import data_service

logger = logging.getLogger(__name__)


class AssignmentService:
    """Service for AI-powered assignment of PQRS to resources."""

    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=settings.temperature,
            openai_api_key=settings.openai_api_key
        )

    def assign_pqrs_resources(self, pqrs_ids: List[str]) -> Dict[str, Any]:
        """Assign personnel and vehicles to PQRS requests using AI."""
        assignments = []
        unassigned = []

        # Get active PQRS
        active_pqrs = data_service.get_active_pqrs()

        # Filter to requested IDs
        pqrs_to_assign = [p for p in active_pqrs if p.numero_radicado_entrada in pqrs_ids]

        for pqrs in pqrs_to_assign:
            try:
                assignment = self._assign_single_pqrs(pqrs)
                if assignment:
                    assignments.append(assignment)
                else:
                    unassigned.append(pqrs.numero_radicado_entrada)
            except Exception as e:
                logger.error(f"Error assigning PQRS {pqrs.numero_radicado_entrada}: {e}")
                unassigned.append(pqrs.numero_radicado_entrada)

        return {
            "assignments": assignments,
            "total_assigned": len(assignments),
            "unassigned": unassigned
        }

    def _assign_single_pqrs(self, pqrs: PQRSRecord) -> Optional[Dict[str, Any]]:
        """Assign resources to a single PQRS using AI reasoning."""
        try:
            # Get zone information
            zone_name = pqrs.comuna_hecho or "Unknown"
            personnel = data_service.get_personnel_by_zone(zone_name)
            vehicles = data_service.get_vehicles_by_zone(zone_name)

            if not personnel:
                logger.warning(f"No personnel available in zone {zone_name}")
                return None

            # Prepare context for AI
            context = self._prepare_assignment_context(pqrs, personnel, vehicles)

            # Create assignment prompt
            prompt = ChatPromptTemplate.from_template("""
            You are an AI assignment system for the Medellín municipal government.
            Your task is to assign personnel and vehicles to PQRS (complaints, requests, claims, suggestions) based on:

            PQRS Details:
            - Radicado: {radicado}
            - Subject: {subject}
            - Type: {request_type}
            - Location: {location}
            - Priority: {priority}
            - Days elapsed: {days_elapsed}

            Available Resources:
            Personnel: {personnel_list}
            Vehicles: {vehicles_list}

            Consider:
            1. Personnel skills and certifications matching the request type
            2. Geographic proximity (zone matching)
            3. Current workload balance
            4. Vehicle capabilities for the task
            5. Urgency based on days elapsed and priority

            Return a JSON with:
            {{
                "assigned_personnel": ["personnel_id"],
                "assigned_vehicles": ["vehicle_id"],
                "estimated_duration_hours": number,
                "confidence_score": 0.0-1.0,
                "reasoning": "brief explanation"
            }}
            """)

            # Format the prompt
            formatted_prompt = prompt.format(
                radicado=pqrs.numero_radicado_entrada,
                subject=pqrs.asunto or "Not specified",
                request_type=pqrs.tipo_solicitud or "General",
                location=f"{pqrs.direccion_hecho or 'Unknown'}, {pqrs.barrio_hecho or 'Unknown'}, {zone_name}",
                priority=self._determine_priority(pqrs),
                days_elapsed=pqrs.dias_transcurridos or 0,
                personnel_list=self._format_personnel_list(personnel),
                vehicles_list=self._format_vehicles_list(vehicles)
            )

            # Get AI response
            response = self.llm.invoke(formatted_prompt)
            result = JsonOutputParser().parse(response.content)

            # Create assignment record
            assignment = {
                "pqrs_id": pqrs.numero_radicado_entrada,
                "assigned_personnel": result.get("assigned_personnel", []),
                "assigned_vehicles": result.get("assigned_vehicles", []),
                "estimated_duration_hours": result.get("estimated_duration_hours", 24),
                "confidence_score": result.get("confidence_score", 0.5),
                "reasoning": result.get("reasoning", "AI-generated assignment"),
                "assigned_at": datetime.now().isoformat(),
                "zone": zone_name
            }

            return assignment

        except Exception as e:
            logger.error(f"Error in AI assignment for PQRS {pqrs.numero_radicado_entrada}: {e}")
            return None

    def _prepare_assignment_context(self, pqrs: PQRSRecord, personnel: List[PersonnelRecord],
                                  vehicles: List[VehicleRecord]) -> Dict[str, Any]:
        """Prepare context information for AI assignment."""
        return {
            "pqrs": {
                "id": pqrs.numero_radicado_entrada,
                "subject": pqrs.asunto,
                "type": pqrs.tipo_solicitud,
                "location": pqrs.direccion_hecho,
                "zone": pqrs.comuna_hecho,
                "days_elapsed": pqrs.dias_transcurridos,
                "priority": self._determine_priority(pqrs)
            },
            "available_personnel": [
                {
                    "id": p.employee_id,
                    "name": f"{p.first_name} {p.last_name}",
                    "role": p.role,
                    "certifications": p.certifications,
                    "status": p.status
                } for p in personnel if p.status == "available"
            ],
            "available_vehicles": [
                {
                    "id": v.license_plate,
                    "type": v.vehicle_type,
                    "capacity": v.capacity,
                    "status": v.status
                } for v in vehicles if v.status == "available"
            ]
        }

    def _determine_priority(self, pqrs: PQRSRecord) -> str:
        """Determine priority level based on PQRS characteristics."""
        priority = "medium"

        # High priority if overdue
        if pqrs.dias_transcurridos and pqrs.dias_transcurridos > 30:
            priority = "high"

        # Check for urgent keywords in subject
        urgent_keywords = ["emergencia", "urgente", "inmediato", "peligro", "accidente"]
        if pqrs.asunto and any(keyword in pqrs.asunto.lower() for keyword in urgent_keywords):
            priority = "high"

        # Critical for certain types
        critical_types = ["queja", "reclamo", "denuncia"]
        if pqrs.tipo_solicitud and pqrs.tipo_solicitud.lower() in critical_types:
            priority = "high"

        return priority

    def _format_personnel_list(self, personnel: List[PersonnelRecord]) -> str:
        """Format personnel list for AI prompt."""
        formatted = []
        for p in personnel[:5]:  # Limit to 5 for prompt
            formatted.append(f"- {p.employee_id}: {p.first_name} {p.last_name} ({p.role}) - {p.status}")
        return "\n".join(formatted)

    def _format_vehicles_list(self, vehicles: List[VehicleRecord]) -> str:
        """Format vehicles list for AI prompt."""
        formatted = []
        for v in vehicles[:3]:  # Limit to 3 for prompt
            formatted.append(f"- {v.license_plate}: {v.vehicle_type} - {v.status}")
        return "\n".join(formatted)

    def get_assignment_schedule(self, zone: Optional[str] = None, days: int = 7) -> Dict[str, Any]:
        """Generate assignment schedule for planning."""
        # This would integrate with calendar systems in a full implementation
        # For now, return basic schedule structure

        schedule = {
            "zone": zone or "all",
            "period_days": days,
            "assignments": [],
            "workload_distribution": {},
            "generated_at": datetime.now().isoformat()
        }

        # Get assignments for the period
        # This would query assignment history in a full implementation

        return schedule

    def optimize_assignments(self, assignments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Optimize existing assignments for better resource utilization."""
        # AI-powered optimization logic would go here
        # For now, return basic optimization suggestions

        optimization = {
            "original_assignments": len(assignments),
            "optimized_assignments": len(assignments),
            "efficiency_gain": 0.0,
            "suggestions": [
                "Consider batching similar PQRS types",
                "Optimize travel routes between assignments",
                "Balance workload across personnel"
            ],
            "optimized_at": datetime.now().isoformat()
        }

        return optimization


# Global instance
assignment_service = AssignmentService()