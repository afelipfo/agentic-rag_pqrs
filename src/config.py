"""Configuration settings for the unified PQRS system."""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # OpenAI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

    # Application
    app_name: str = "Sistema Unificado PQRS con Agentic RAG"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Data paths
    data_dir: str = "data"
    pqrs_data_file: str = "data-pqrs.xlsx"
    personnel_data_file: str = "data-personal.xlsx"
    transport_data_file: str = "data-transporte.xlsx"
    zoning_data_file: str = "data-zonificacion.xlsx"

    # Vector store
    chroma_persist_directory: str = "rag/chroma_db"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"

    # API
    host: str = "0.0.0.0"
    port: int = 8000

    # Agent settings
    max_steps: int = 5
    temperature: float = 0.1

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()