"""Agent Coordinator - orchestrates specialized agents for PQRS processing."""

import logging
from typing import Dict, Any, Optional
from datetime import datetime

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from ..config import settings
from ..models.api import AgentTaskRequest, AgentTaskResponse
from .assignment_agent import assignment_agent
from .query_agent import query_agent
from .data_agent import data_agent

logger = logging.getLogger(__name__)


class AgentCoordinator:
    """Coordinates specialized agents based on user requests."""

    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=settings.temperature,
            openai_api_key=settings.openai_api_key
        )

    def process_request(self, request: AgentTaskRequest) -> AgentTaskResponse:
        """Process a user request and coordinate appropriate agents."""
        start_time = datetime.now()

        try:
            # Analyze the request to determine which agent(s) to use
            analysis = self._analyze_request(request)

            # Route to appropriate agent
            result = self._route_to_agent(analysis, request)

            execution_time = (datetime.now() - start_time).total_seconds()

            return AgentTaskResponse(
                task_id=f"task_{int(start_time.timestamp())}",
                status="completed",
                result=result,
                execution_time=execution_time
            )

        except Exception as e:
            logger.error(f"Error processing request: {e}")
            execution_time = (datetime.now() - start_time).total_seconds()

            return AgentTaskResponse(
                task_id=f"task_{int(start_time.timestamp())}",
                status="failed",
                error=str(e),
                execution_time=execution_time
            )

    def _analyze_request(self, request: AgentTaskRequest) -> Dict[str, Any]:
        """Analyze the request to determine intent and required agents."""
        prompt = ChatPromptTemplate.from_template("""
        Analyze this user request for a PQRS management system and determine:
        1. The primary intent (assignment, query, data_management)
        2. Specific actions needed
        3. Which specialized agents should handle it
        4. Any additional context or parameters needed

        Request: {request_text}
        Context: {context}

        Return JSON with:
        {{
            "primary_intent": "assignment|query|data_management",
            "actions": ["list", "of", "actions"],
            "required_agents": ["agent", "names"],
            "parameters": {{"key": "value"}},
            "confidence": 0.0-1.0
        }}
        """)

        formatted_prompt = prompt.format(
            request_text=request.task_type + " " + str(request.parameters),
            context=str(request.context) if request.context else "No additional context"
        )

        response = self.llm.invoke(formatted_prompt)
        analysis = JsonOutputParser().parse(response.content)

        return analysis

    def _route_to_agent(self, analysis: Dict[str, Any], request: AgentTaskRequest) -> Dict[str, Any]:
        """Route the request to the appropriate agent(s)."""
        primary_intent = analysis.get("primary_intent", "query")
        required_agents = analysis.get("required_agents", [])

        results = {}

        # Route based on primary intent
        if primary_intent == "assignment" or "assignment_agent" in required_agents:
            results["assignment"] = self._handle_assignment(request, analysis)

        if primary_intent == "query" or "query_agent" in required_agents:
            results["query"] = self._handle_query(request, analysis)

        if primary_intent == "data_management" or "data_agent" in required_agents:
            results["data"] = self._handle_data_management(request, analysis)

        # If no specific intent detected, try query agent as fallback
        if not results:
            results["query"] = self._handle_query(request, analysis)

        return {
            "analysis": analysis,
            "results": results,
            "coordinator_notes": "Request processed by Agent Coordinator"
        }

    def _handle_assignment(self, request: AgentTaskRequest, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Handle assignment-related requests."""
        try:
            # Extract PQRS IDs from request
            pqrs_ids = request.parameters.get("pqrs_ids", [])
            zone_filter = request.parameters.get("zone_filter")

            if not pqrs_ids:
                return {"error": "No PQRS IDs provided for assignment"}

            result = assignment_agent.assign_resources(pqrs_ids, zone_filter)
            return result

        except Exception as e:
            logger.error(f"Assignment handling error: {e}")
            return {"error": str(e)}

    def _handle_query(self, request: AgentTaskRequest, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Handle query-related requests."""
        try:
            query_text = request.parameters.get("query", "")
            query_type = request.parameters.get("query_type", "semantic")
            filters = request.parameters.get("filters", {})
            limit = request.parameters.get("limit", 10)

            if not query_text:
                return {"error": "No query text provided"}

            result = query_agent.process_query(query_text, query_type, filters, limit)
            return result

        except Exception as e:
            logger.error(f"Query handling error: {e}")
            return {"error": str(e)}

    def _handle_data_management(self, request: AgentTaskRequest, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Handle data management requests."""
        try:
            action = request.parameters.get("action", "status")

            if action == "reload":
                result = data_agent.reload_data()
            elif action == "rebuild_index":
                result = data_agent.rebuild_search_index()
            elif action == "statistics":
                result = data_agent.get_statistics()
            else:
                result = data_agent.get_status()

            return result

        except Exception as e:
            logger.error(f"Data management error: {e}")
            return {"error": str(e)}

    def get_agent_status(self) -> Dict[str, Any]:
        """Get status of all coordinated agents."""
        return {
            "coordinator": "active",
            "assignment_agent": assignment_agent.get_status(),
            "query_agent": query_agent.get_status(),
            "data_agent": data_agent.get_status(),
            "last_check": datetime.now().isoformat()
        }

    def get_capabilities(self) -> Dict[str, Any]:
        """Get capabilities of the coordinated agent system."""
        return {
            "assignment": {
                "description": "AI-powered assignment of PQRS to personnel and vehicles",
                "capabilities": [
                    "Zone-based resource allocation",
                    "Priority-based assignment",
                    "Workload optimization",
                    "Schedule generation"
                ]
            },
            "query": {
                "description": "Intelligent querying of PQRS database",
                "capabilities": [
                    "Semantic search",
                    "Radicado lookup",
                    "Filtered search",
                    "Search suggestions"
                ]
            },
            "data_management": {
                "description": "Data loading, indexing, and maintenance",
                "capabilities": [
                    "Data reloading",
                    "Index rebuilding",
                    "Statistics generation",
                    "Health monitoring"
                ]
            }
        }


# Global instance
agent_coordinator = AgentCoordinator()