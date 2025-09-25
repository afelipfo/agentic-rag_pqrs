"""Data service for loading and processing PQRS data from Excel files."""

import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime

from ..config import settings
from ..models.pqrs import PQRSRecord, PersonnelRecord, VehicleRecord, ZoneRecord

logger = logging.getLogger(__name__)


class DataService:
    """Service for loading and managing PQRS-related data."""

    def __init__(self):
        self.data_dir = Path(settings.data_dir)
        self._pqrs_data: Optional[pd.DataFrame] = None
        self._personnel_data: Optional[pd.DataFrame] = None
        self._transport_data: Optional[pd.DataFrame] = None
        self._zoning_data: Optional[pd.DataFrame] = None

    def load_all_data(self) -> Dict[str, int]:
        """Load all Excel files and return statistics."""
        stats = {}

        try:
            # Load PQRS data
            pqrs_path = self.data_dir / settings.pqrs_data_file
            if pqrs_path.exists():
                self._pqrs_data = pd.read_excel(pqrs_path)
                # Clean column names
                self._pqrs_data.columns = self._pqrs_data.columns.str.strip().str.lower()
                stats['pqrs_records'] = len(self._pqrs_data)
                logger.info(f"Loaded {stats['pqrs_records']} PQRS records")
            else:
                logger.warning(f"PQRS data file not found: {pqrs_path}")

            # Load personnel data
            personnel_path = self.data_dir / settings.personnel_data_file
            if personnel_path.exists():
                self._personnel_data = pd.read_excel(personnel_path)
                self._personnel_data.columns = self._personnel_data.columns.str.strip().str.lower()
                stats['personnel_records'] = len(self._personnel_data)
                logger.info(f"Loaded {stats['personnel_records']} personnel records")

            # Load transport data
            transport_path = self.data_dir / settings.transport_data_file
            if transport_path.exists():
                self._transport_data = pd.read_excel(transport_path)
                self._transport_data.columns = self._transport_data.columns.str.strip().str.lower()
                stats['transport_records'] = len(self._transport_data)
                logger.info(f"Loaded {stats['transport_records']} transport records")

            # Load zoning data
            zoning_path = self.data_dir / settings.zoning_data_file
            if zoning_path.exists():
                self._zoning_data = pd.read_excel(zoning_path)
                self._zoning_data.columns = self._zoning_data.columns.str.strip().str.lower()
                stats['zoning_records'] = len(self._zoning_data)
                logger.info(f"Loaded {stats['zoning_records']} zoning records")

        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise

        return stats

    def get_pqrs_records(self, filters: Optional[Dict[str, Any]] = None) -> List[PQRSRecord]:
        """Get PQRS records with optional filtering."""
        if self._pqrs_data is None:
            return []

        df = self._pqrs_data.copy()

        # Apply filters
        if filters:
            for key, value in filters.items():
                if key in df.columns:
                    if isinstance(value, list):
                        df = df[df[key].isin(value)]
                    else:
                        df = df[df[key] == value]

        # Convert to Pydantic models
        records = []
        for _, row in df.iterrows():
            try:
                record = PQRSRecord(**row.to_dict())
                records.append(record)
            except Exception as e:
                logger.warning(f"Error parsing PQRS record: {e}")
                continue

        return records

    def get_active_pqrs(self) -> List[PQRSRecord]:
        """Get PQRS records with 'activo' status."""
        return self.get_pqrs_records({"estado": "activo"})

    def get_pqrs_by_radicado(self, radicado: str) -> Optional[PQRSRecord]:
        """Get a specific PQRS by radicado number."""
        records = self.get_pqrs_records({"numero_radicado_entrada": radicado})
        return records[0] if records else None

    def search_pqrs_semantic(self, query: str, limit: int = 10) -> List[PQRSRecord]:
        """Basic semantic search in PQRS data (placeholder for RAG integration)."""
        if self._pqrs_data is None:
            return []

        # Simple text search in asunto and tema_principal columns
        df = self._pqrs_data.copy()
        query_lower = query.lower()

        # Filter records that contain the query in relevant text fields
        mask = (
            df['asunto'].fillna('').str.lower().str.contains(query_lower, na=False) |
            df['tema_principal'].fillna('').str.lower().str.contains(query_lower, na=False) |
            df['direccion_hecho'].fillna('').str.lower().str.contains(query_lower, na=False)
        )

        df_filtered = df[mask].head(limit)

        records = []
        for _, row in df_filtered.iterrows():
            try:
                record = PQRSRecord(**row.to_dict())
                records.append(record)
            except Exception as e:
                logger.warning(f"Error parsing PQRS record: {e}")
                continue

        return records

    def get_personnel_by_zone(self, zone: str) -> List[PersonnelRecord]:
        """Get personnel available in a specific zone."""
        if self._personnel_data is None:
            return []

        df = self._personnel_data.copy()
        df_zone = df[df['zone'].str.lower() == zone.lower()]

        records = []
        for _, row in df_zone.iterrows():
            try:
                record = PersonnelRecord(**row.to_dict())
                records.append(record)
            except Exception as e:
                logger.warning(f"Error parsing personnel record: {e}")
                continue

        return records

    def get_vehicles_by_zone(self, zone: str) -> List[VehicleRecord]:
        """Get vehicles available in a specific zone."""
        if self._transport_data is None:
            return []

        df = self._transport_data.copy()
        df_zone = df[df['zone'].str.lower() == zone.lower()]

        records = []
        for _, row in df_zone.iterrows():
            try:
                record = VehicleRecord(**row.to_dict())
                records.append(record)
            except Exception as e:
                logger.warning(f"Error parsing vehicle record: {e}")
                continue

        return records

    def get_zones(self) -> List[ZoneRecord]:
        """Get all zoning information."""
        if self._zoning_data is None:
            return []

        records = []
        for _, row in self._zoning_data.iterrows():
            try:
                record = ZoneRecord(**row.to_dict())
                records.append(record)
            except Exception as e:
                logger.warning(f"Error parsing zone record: {e}")
                continue

        return records

    def get_data_statistics(self) -> Dict[str, Any]:
        """Get statistics about loaded data."""
        stats = {
            "pqrs_total": len(self._pqrs_data) if self._pqrs_data is not None else 0,
            "personnel_total": len(self._personnel_data) if self._personnel_data is not None else 0,
            "vehicles_total": len(self._transport_data) if self._transport_data is not None else 0,
            "zones_total": len(self._zoning_data) if self._zoning_data is not None else 0,
        }

        if self._pqrs_data is not None:
            stats["pqrs_by_status"] = self._pqrs_data['estado'].value_counts().to_dict()
            stats["pqrs_active"] = len(self._pqrs_data[self._pqrs_data['estado'] == 'activo'])

        return stats


# Global instance
data_service = DataService()