"""RAG service for semantic search and retrieval of PQRS data."""

import logging
from typing import List, Dict, Any, Optional
from pathlib import Path

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document

from ..config import settings
from ..models.pqrs import PQRSRecord
from .data_service import data_service

logger = logging.getLogger(__name__)


class RAGService:
    """Service for RAG-based search and retrieval."""

    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            model=settings.embedding_model,
            openai_api_key=settings.openai_api_key
        )
        self.persist_directory = Path(settings.chroma_persist_directory)
        self.persist_directory.mkdir(parents=True, exist_ok=True)
        self.vectorstore: Optional[Chroma] = None
        self._initialized = False

    def initialize_vectorstore(self):
        """Initialize or load the vector store."""
        try:
            # Try to load existing vectorstore
            self.vectorstore = Chroma(
                persist_directory=str(self.persist_directory),
                embedding_function=self.embeddings
            )

            # Check if it's empty
            if self.vectorstore._collection.count() == 0:
                logger.info("Vector store is empty, building from data...")
                self._build_vectorstore()
            else:
                logger.info("Loaded existing vector store")

        except Exception as e:
            logger.warning(f"Could not load existing vector store: {e}")
            logger.info("Building new vector store...")
            self._build_vectorstore()

        self._initialized = True

    def _build_vectorstore(self):
        """Build vector store from PQRS data."""
        documents = []

        # Get PQRS records
        pqrs_records = data_service.get_pqrs_records()
        logger.info(f"Building vector store from {len(pqrs_records)} PQRS records")

        for record in pqrs_records:
            # Create searchable text from relevant fields
            text_parts = []

            if record.asunto:
                text_parts.append(f"Asunto: {record.asunto}")
            if record.tema_principal:
                text_parts.append(f"Tema principal: {record.tema_principal}")
            if record.direccion_hecho:
                text_parts.append(f"Dirección: {record.direccion_hecho}")
            if record.barrio_hecho:
                text_parts.append(f"Barrio: {record.barrio_hecho}")
            if record.comuna_hecho:
                text_parts.append(f"Comuna: {record.comuna_hecho}")
            if record.tipo_solicitud:
                text_parts.append(f"Tipo de solicitud: {record.tipo_solicitud}")
            if record.nombre_peticionario:
                text_parts.append(f"Peticionario: {record.nombre_peticionario}")

            content = " | ".join(text_parts)

            if content.strip():  # Only add if there's content
                doc = Document(
                    page_content=content,
                    metadata={
                        "radicado": record.numero_radicado_entrada,
                        "estado": record.estado,
                        "tipo_solicitud": record.tipo_solicitud,
                        "comuna": record.comuna_hecho,
                        "barrio": record.barrio_hecho,
                        "fecha_radicacion": record.fecha_radicacion.isoformat() if record.fecha_radicacion else None,
                    }
                )
                documents.append(doc)

        if documents:
            # Split documents if they're too long
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            split_docs = text_splitter.split_documents(documents)

            # Create vector store
            self.vectorstore = Chroma.from_documents(
                documents=split_docs,
                embedding=self.embeddings,
                persist_directory=str(self.persist_directory)
            )

            logger.info(f"Created vector store with {len(split_docs)} document chunks")
        else:
            logger.warning("No documents to add to vector store")

    def semantic_search(self, query: str, limit: int = 10, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Perform semantic search on PQRS data."""
        if not self._initialized:
            self.initialize_vectorstore()

        if not self.vectorstore:
            logger.error("Vector store not available")
            return []

        try:
            # Perform similarity search
            docs = self.vectorstore.similarity_search(query, k=limit)

            results = []
            for doc in docs:
                # Get full PQRS record by radicado
                radicado = doc.metadata.get("radicado")
                if radicado:
                    pqrs_record = data_service.get_pqrs_by_radicado(radicado)
                    if pqrs_record:
                        result = {
                            "record": pqrs_record,
                            "relevance_score": doc.metadata.get("score", 0),
                            "matched_content": doc.page_content[:200] + "..."
                        }
                        results.append(result)

            return results

        except Exception as e:
            logger.error(f"Error in semantic search: {e}")
            return []

    def search_by_filters(self, filters: Dict[str, Any], limit: int = 10) -> List[PQRSRecord]:
        """Search PQRS records by structured filters."""
        return data_service.get_pqrs_records(filters)[:limit]

    def hybrid_search(self, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Perform hybrid search combining semantic and structured filters."""
        # First, get semantic search results
        semantic_results = self.semantic_search(query, limit * 2, filters)

        # Apply additional filters if provided
        if filters:
            filtered_results = []
            for result in semantic_results:
                record = result["record"]
                match = True

                for key, value in filters.items():
                    record_value = getattr(record, key, None)
                    if record_value != value:
                        match = False
                        break

                if match:
                    filtered_results.append(result)

            semantic_results = filtered_results

        return semantic_results[:limit]

    def get_search_suggestions(self, partial_query: str, limit: int = 5) -> List[str]:
        """Get search suggestions based on partial query."""
        if not self._initialized:
            self.initialize_vectorstore()

        if not self.vectorstore:
            return []

        try:
            # Get similar documents for suggestions
            docs = self.vectorstore.similarity_search(partial_query, k=limit * 2)

            suggestions = []
            seen = set()

            for doc in docs:
                # Extract key terms from the content
                content = doc.page_content.lower()
                words = content.split()

                # Look for phrases that might be relevant
                for i in range(len(words) - 1):
                    phrase = f"{words[i]} {words[i+1]}"
                    if partial_query.lower() in phrase and phrase not in seen:
                        suggestions.append(phrase.title())
                        seen.add(phrase)
                        if len(suggestions) >= limit:
                            break

                if len(suggestions) >= limit:
                    break

            return suggestions[:limit]

        except Exception as e:
            logger.error(f"Error getting search suggestions: {e}")
            return []

    def rebuild_index(self):
        """Rebuild the vector index from current data."""
        logger.info("Rebuilding vector index...")
        try:
            # Clear existing index
            if self.vectorstore:
                self.vectorstore.delete_collection()

            # Rebuild
            self._build_vectorstore()
            logger.info("Vector index rebuilt successfully")

        except Exception as e:
            logger.error(f"Error rebuilding index: {e}")
            raise


# Global instance
rag_service = RAGService()