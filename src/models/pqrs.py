"""Pydantic models for PQRS data."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class PQRSRecord(BaseModel):
    """Model for a PQRS record from the Excel data."""

    # Core identification
    numero_radicado_entrada: str = Field(..., description="Unique PQRS entry number")
    numero_radicado_respuesta: Optional[str] = Field(None, description="Response number")

    # Status and timing
    estado: str = Field(..., description="Current status of the PQRS")
    dias_transcurridos: Optional[int] = Field(None, description="Days elapsed")
    fecha_radicacion: Optional[datetime] = Field(None, description="Registration date")
    fecha_entrada_sif: Optional[datetime] = Field(None, description="SIF entry date")
    fecha_radicado_respuesta: Optional[datetime] = Field(None, description="Response date")
    fecha_vencimiento: Optional[datetime] = Field(None, description="Due date")

    # Content
    asunto: Optional[str] = Field(None, description="Subject of the PQRS")
    tema_principal: Optional[str] = Field(None, description="Main theme")
    tipo_solicitud: Optional[str] = Field(None, description="Request type")

    # Location
    direccion_hecho: Optional[str] = Field(None, description="Incident address")
    barrio_hecho: Optional[str] = Field(None, description="Incident neighborhood")
    comuna_hecho: Optional[str] = Field(None, description="Incident commune")

    # Petitioner information
    nombre_peticionario: Optional[str] = Field(None, description="Petitioner's name")
    telefono_peticionario: Optional[str] = Field(None, description="Petitioner's phone")
    correo_peticionario: Optional[str] = Field(None, description="Petitioner's email")

    # Assignment and processing
    unidad_responsable: Optional[str] = Field(None, description="Responsible unit")
    sistema_informacion: Optional[str] = Field(None, description="Information system")

    # Additional fields
    mes: Optional[float] = Field(None, description="Month")
    ano: Optional[float] = Field(None, description="Year")
    prorroga: Optional[str] = Field(None, description="Extension")

    class Config:
        from_attributes = True


class PersonnelRecord(BaseModel):
    """Model for personnel data."""

    id: Optional[int] = None
    employee_id: str
    first_name: str
    last_name: str
    role: str
    zone: str
    status: str = "available"
    certifications: List[str] = []
    shift_start: Optional[str] = None
    shift_end: Optional[str] = None

    class Config:
        from_attributes = True


class VehicleRecord(BaseModel):
    """Model for vehicle data."""

    id: Optional[int] = None
    license_plate: str
    vehicle_type: str
    zone: str
    status: str = "available"
    fuel_level: Optional[float] = None
    capacity: Optional[int] = None

    class Config:
        from_attributes = True


class ZoneRecord(BaseModel):
    """Model for zoning data."""

    id: Optional[int] = None
    name: str
    code: str
    commune: str
    priority_level: str = "medium"
    population: Optional[int] = None
    area_km2: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True