"""Schemas Pydantic para request/response da API."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


# ── Responses ──────────────────────────────────────────────────────────

class ProjectResponse(BaseModel):
    """Projeto com último score."""

    id: UUID
    nome: str
    descricao: str = ""
    stack: str = ""
    last_score: float | None = None
    last_execution_at: datetime | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class ExecutionResponse(BaseModel):
    """Metadados de uma execução."""

    id: UUID
    project_id: UUID
    projeto_nome: str = ""
    ambiente: str
    started_at: datetime
    finished_at: datetime | None = None
    score: float = 0.0
    total: int = 0
    passed: int = 0
    failed: int = 0
    errors: int = 0
    skipped: int = 0
    duracao_ms: float = 0.0

    model_config = {"from_attributes": True}


class TestResultResponse(BaseModel):
    """Resultado individual de um teste."""

    id: UUID
    nome: str
    tipo: str
    status: str
    duracao_ms: float = 0.0
    detalhes: str = ""
    severidade: str = "info"
    grupo: str = ""

    model_config = {"from_attributes": True}


class ScoreHistoryResponse(BaseModel):
    """Score por runner num ponto no tempo."""

    execution_id: UUID
    runner_type: str
    score: float = 0.0
    total: int = 0
    passed: int = 0
    recorded_at: datetime | None = None

    model_config = {"from_attributes": True}


# ── Requests ───────────────────────────────────────────────────────────

class RunRequest(BaseModel):
    """Body para POST /api/runs."""

    project_name: str = Field(..., min_length=1, max_length=100)
    types: list[str] = Field(default_factory=lambda: ["all"])
    environment: str = "local"
    confirm: bool = False


class RunResponse(BaseModel):
    """Resposta de POST /api/runs."""

    execution_id: UUID | None = None
    score: float = 0.0
    total: int = 0
    passed: int = 0
    failed: int = 0
    message: str = ""
