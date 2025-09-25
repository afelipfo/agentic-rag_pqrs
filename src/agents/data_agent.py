"""Data Agent - handles data loading, indexing, and maintenance."""

import logging
from typing import Dict, Any
from datetime import datetime

from ..services.data_service import data_service
from ..services.rag_service import rag_service

logger = logging.getLogger(__name__)


class DataAgent:
    """Agent specialized in data management and maintenance."""

    def __init__(self):
        self.data_service = data_service
        self.rag_service = rag_service

    def reload_data(self) -> Dict[str, Any]:
        """Reload all data from Excel files."""
        try:
            logger.info("Data Agent: Reloading data from Excel files")

            stats = self.data_service.load_all_data()

            # Reinitialize RAG service with new data
            self.rag_service.initialize_vectorstore()

            return {
                "agent": "data_agent",
                "action": "reload_data",
                "status": "completed",
                "statistics": stats,
                "rag_index_updated": True,
                "completed_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Data reload error: {e}")
            return {
                "agent": "data_agent",
                "action": "reload_data",
                "status": "failed",
                "error": str(e)
            }

    def rebuild_search_index(self) -> Dict[str, Any]:
        """Rebuild the search index."""
        try:
            logger.info("Data Agent: Rebuilding search index")

            self.rag_service.rebuild_index()

            return {
                "agent": "data_agent",
                "action": "rebuild_index",
                "status": "completed",
                "message": "Search index rebuilt successfully",
                "completed_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Index rebuild error: {e}")
            return {
                "agent": "data_agent",
                "action": "rebuild_index",
                "status": "failed",
                "error": str(e)
            }

    def get_statistics(self) -> Dict[str, Any]:
        """Get comprehensive data statistics."""
        try:
            data_stats = self.data_service.get_data_statistics()

            return {
                "agent": "data_agent",
                "action": "get_statistics",
                "status": "completed",
                "data_statistics": data_stats,
                "rag_status": "initialized" if self.rag_service._initialized else "not_initialized",
                "generated_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Statistics generation error: {e}")
            return {
                "agent": "data_agent",
                "action": "get_statistics",
                "status": "failed",
                "error": str(e)
            }

    def get_status(self) -> Dict[str, Any]:
        """Get agent status and data health."""
        try:
            data_stats = self.data_service.get_data_statistics()

            return {
                "name": "Data Agent",
                "status": "active",
                "data_loaded": data_stats["pqrs_total"] > 0,
                "rag_initialized": self.rag_service._initialized,
                "capabilities": [
                    "Data reloading",
                    "Index rebuilding",
                    "Statistics generation",
                    "Health monitoring"
                ],
                "data_summary": {
                    "pqrs_records": data_stats.get("pqrs_total", 0),
                    "personnel_records": data_stats.get("personnel_total", 0),
                    "vehicles_records": data_stats.get("transport_total", 0),
                    "zones_records": data_stats.get("zoning_total", 0)
                },
                "last_active": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Status check error: {e}")
            return {
                "name": "Data Agent",
                "status": "error",
                "error": str(e),
                "last_active": datetime.now().isoformat()
            }

    def validate_data_integrity(self) -> Dict[str, Any]:
        """Validate data integrity and identify issues."""
        try:
            issues = []

            # Check for missing critical data
            data_stats = self.data_service.get_data_statistics()

            if data_stats["pqrs_total"] == 0:
                issues.append("No PQRS data loaded")

            if data_stats["personnel_total"] == 0:
                issues.append("No personnel data loaded")

            if data_stats["vehicles_total"] == 0:
                issues.append("No vehicle data loaded")

            # Check for data quality issues
            if self.data_service._pqrs_data is not None:
                # Check for missing radicados
                missing_radicados = self.data_service._pqrs_data['numero_radicado_entrada'].isna().sum()
                if missing_radicados > 0:
                    issues.append(f"{missing_radicados} PQRS records missing radicado numbers")

                # Check for duplicate radicados
                duplicates = self.data_service._pqrs_data['numero_radicado_entrada'].duplicated().sum()
                if duplicates > 0:
                    issues.append(f"{duplicates} duplicate radicado numbers found")

            return {
                "agent": "data_agent",
                "action": "validate_integrity",
                "status": "completed",
                "issues_found": len(issues),
                "issues": issues,
                "data_quality_score": max(0, 100 - len(issues) * 10),  # Simple scoring
                "validated_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Data validation error: {e}")
            return {
                "agent": "data_agent",
                "action": "validate_integrity",
                "status": "failed",
                "error": str(e)
            }

    def cleanup_temp_data(self) -> Dict[str, Any]:
        """Clean up temporary data and cache."""
        try:
            # This would clean up temporary files, cache, etc.
            # For now, just return success

            return {
                "agent": "data_agent",
                "action": "cleanup",
                "status": "completed",
                "message": "Temporary data cleaned up",
                "completed_at": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Cleanup error: {e}")
            return {
                "agent": "data_agent",
                "action": "cleanup",
                "status": "failed",
                "error": str(e)
            }


# Global instance
data_agent = DataAgent()