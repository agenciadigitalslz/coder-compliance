"""Endpoints de projetos."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.responses import (
    ExecutionResponse,
    ProjectResponse,
    ScoreHistoryResponse,
)
from app.services import history_service

router = APIRouter()


@router.get("", response_model=list[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    """Lista todos os projetos com último score (query otimizada)."""
    rows = await history_service.get_projects_with_last_score(db)
    return [
        ProjectResponse(
            id=row["project"].id,
            nome=row["project"].nome,
            descricao=row["project"].descricao or "",
            stack=row["project"].stack or "",
            last_score=row["last_score"],
            last_execution_at=row["last_execution_at"],
            created_at=row["project"].created_at,
        )
        for row in rows
    ]


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: UUID, db: AsyncSession = Depends(get_db)):
    """Detalhes de um projeto."""
    project = await history_service.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    last_exec = await history_service.get_last_execution_for_project(db, project.id)
    return ProjectResponse(
        id=project.id,
        nome=project.nome,
        descricao=project.descricao or "",
        stack=project.stack or "",
        last_score=last_exec.score if last_exec else None,
        last_execution_at=last_exec.started_at if last_exec else None,
        created_at=project.created_at,
    )


@router.get("/{project_id}/executions", response_model=list[ExecutionResponse])
async def get_project_executions(
    project_id: UUID,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """Últimas execuções de um projeto."""
    project = await history_service.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    executions = await history_service.get_executions(db, project_id=project_id, limit=limit)
    return [
        ExecutionResponse(
            id=e.id,
            project_id=e.project_id,
            projeto_nome=project.nome,
            ambiente=e.ambiente,
            started_at=e.started_at,
            finished_at=e.finished_at,
            score=e.score or 0.0,
            total=e.total or 0,
            passed=e.passed or 0,
            failed=e.failed or 0,
            errors=e.errors or 0,
            skipped=e.skipped or 0,
            duracao_ms=e.duracao_ms or 0.0,
        )
        for e in executions
    ]


@router.get("/{project_id}/history", response_model=list[ScoreHistoryResponse])
async def get_project_history(
    project_id: UUID,
    limit: int = 30,
    db: AsyncSession = Depends(get_db),
):
    """Histórico de scores por runner (para gráfico)."""
    project = await history_service.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    history = await history_service.get_score_history(db, project_id=project_id, limit=limit)
    return [
        ScoreHistoryResponse(
            execution_id=h.execution_id,
            runner_type=h.runner_type,
            score=h.score or 0.0,
            total=h.total or 0,
            passed=h.passed or 0,
            recorded_at=h.recorded_at,
        )
        for h in history
    ]
