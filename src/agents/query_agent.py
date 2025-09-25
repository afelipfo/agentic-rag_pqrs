"""Query Agent - handles intelligent querying of PQRS data."""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from ..services.rag_service import rag_service
from ..services.data_service import data_service
from ..models.api import PQRSResponse

logger = logging.getLogger(__name__)


class QueryAgent:
    """Agent specialized in querying and retrieving PQRS information."""

    def __init__(self):
        self.rag_service = rag_service
        self.data_service = data_service

    def process_query(self, query: str, query_type: str = "semantic",
                     filters: Optional[Dict[str, Any]] = None, limit: int = 10) -> Dict[str, Any]:
        """Process a query and return relevant PQRS information."""
        try:
            logger.info(f"Query Agent: Processing {query_type} query: {query[:50]}...")

            if query_type == "radicado":
                result = self._query_by_radicado(query)
            elif query_type == "semantic":
                result = self._semantic_search(query, filters, limit)
            elif query_type == "advanced":
                result = self._advanced_search(query, filters, limit)
            else:
                result = self._semantic_search(query, filters, limit)

            # Format results as standardized PQRS responses
            formatted_results = self._format_results(result.get("results", []))

            return {
                "agent": "query_agent",
                "query": query,
                "query_type": query_type,
                "results": formatted_results,
                "total_found": result.get("total_found", len(formatted_results)),
                "search_metadata": result.get("metadata", {}),
                "processed_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Query Agent error: {e}")
            return {
                "error": str(e),
                "agent": "query_agent",
                "query": query,
                "results": [],
                "total_found": 0
            }

    def _query_by_radicado(self, radicado: str) -> Dict[str, Any]:
        """Query a specific PQRS by radicado number."""
        record = self.data_service.get_pqrs_by_radicado(radicado.strip())

        if record:
            return {
                "results": [record],
                "total_found": 1,
                "metadata": {"query_type": "exact_radicado"}
            }
        else:
            return {
                "results": [],
                "total_found": 0,
                "metadata": {"query_type": "exact_radicado", "not_found": True}
            }

    def _semantic_search(self, query: str, filters: Optional[Dict[str, Any]], limit: int) -> Dict[str, Any]:
        """Perform semantic search using RAG."""
        results = self.rag_service.semantic_search(query, limit, filters)

        return {
            "results": [r["record"] for r in results],
            "total_found": len(results),
            "metadata": {
                "query_type": "semantic",
                "relevance_scores": [r.get("relevance_score", 0) for r in results]
            }
        }

    def _advanced_search(self, query: str, filters: Optional[Dict[str, Any]], limit: int) -> Dict[str, Any]:
        """Perform advanced search combining semantic and structured filters."""
        results = self.rag_service.hybrid_search(query, filters, limit)

        return {
            "results": [r["record"] for r in results],
            "total_found": len(results),
            "metadata": {
                "query_type": "hybrid",
                "filters_applied": filters or {},
                "relevance_scores": [r.get("relevance_score", 0) for r in results]
            }
        }

    def _format_results(self, records: List[Any]) -> List[PQRSResponse]:
        """Format PQRS records into standardized response format."""
        formatted = []

        for record in records:
            try:
                # Convert to PQRSResponse format
                response = PQRSResponse(
                    numero_radicado_entrada=record.numero_radicado_entrada,
                    estado=record.estado,
                    asunto=record.asunto,
                    direccion_hecho=record.direccion_hecho,
                    barrio_hecho=record.barrio_hecho,
                    comuna_hecho=record.comuna_hecho,
                    nombre_peticionario=record.nombre_peticionario,
                    telefono_peticionario=record.telefono_peticionario,
                    correo_peticionario=record.correo_peticionario,
                    tipo_solicitud=record.tipo_solicitud,
                    tema_principal=record.tema_principal,
                    fecha_radicacion=record.fecha_radicacion.isoformat() if record.fecha_radicacion else None,
                    dias_transcurridos=record.dias_transcurridos,
                    unidad_responsable=record.unidad_responsable,
                    fecha_vencimiento=record.fecha_vencimiento.isoformat() if record.fecha_vencimiento else None
                )
                formatted.append(response)
            except Exception as e:
                logger.warning(f"Error formatting PQRS record: {e}")
                continue

        return formatted

    def get_search_suggestions(self, partial_query: str, limit: int = 5) -> Dict[str, Any]:
        """Get search suggestions for partial queries."""
        try:
            suggestions = self.rag_service.get_search_suggestions(partial_query, limit)

            return {
                "agent": "query_agent",
                "partial_query": partial_query,
                "suggestions": suggestions,
                "generated_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Error getting suggestions: {e}")
            return {
                "error": str(e),
                "agent": "query_agent",
                "suggestions": []
            }

    def get_query_statistics(self) -> Dict[str, Any]:
        """Get statistics about query patterns and performance."""
        # This would track query metrics in a full implementation
        return {
            "agent": "query_agent",
            "total_queries_today": 0,  # Would be tracked
            "popular_queries": [],     # Would be tracked
            "average_response_time": 0.0,
            "generated_at": datetime.now().isoformat()
        }

    def get_status(self) -> Dict[str, Any]:
        """Get agent status."""
        return {
            "name": "Query Agent",
            "status": "active",
            "capabilities": [
                "Semantic search",
                "Radicado lookup",
                "Advanced filtering",
                "Search suggestions",
                "Query statistics"
            ],
            "last_active": datetime.now().isoformat()
        }


# Global instance
query_agent = QueryAgent()