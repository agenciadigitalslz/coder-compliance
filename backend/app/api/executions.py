"""Endpoints de execuções."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.responses import ExecutionResponse, TestResultResponse
from app.services import history_service

router = APIRouter()


@router.get("", response_model=list[ExecutionResponse])
async def list_executions(
    project_id: UUID | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Lista execuções, opcionalmente filtradas por projeto."""
    executions = await history_service.get_executions(
        db, project_id=project_id, limit=limit,
    )
    result = []
    for e in executions:
        projeto_nome = ""
        if e.project:
            projeto_nome = e.project.nome
        result.append(
            ExecutionResponse(
                id=e.id,
                project_id=e.project_id,
                projeto_nome=projeto_nome,
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
        )
    return result


@router.get("/{execution_id}", response_model=ExecutionResponse)
async def get_execution(execution_id: UUID, db: AsyncSession = Depends(get_db)):
    """Detalhes de uma execução."""
    execution = await history_service.get_execution_by_id(db, execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="Execução não encontrada")

    projeto_nome = ""
    if execution.project:
        projeto_nome = execution.project.nome

    return ExecutionResponse(
        id=execution.id,
        project_id=execution.project_id,
        projeto_nome=projeto_nome,
        ambiente=execution.ambiente,
        started_at=execution.started_at,
        finished_at=execution.finished_at,
        score=execution.score or 0.0,
        total=execution.total or 0,
        passed=execution.passed or 0,
        failed=execution.failed or 0,
        errors=execution.errors or 0,
        skipped=execution.skipped or 0,
        duracao_ms=execution.duracao_ms or 0.0,
    )


@router.get("/{execution_id}/results", response_model=list[TestResultResponse])
async def get_execution_results(
    execution_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Resultados individuais de uma execução."""
    execution = await history_service.get_execution_by_id(db, execution_id)
    if not execution:
        raise HTTPException(status_code=404, detail="Execução não encontrada")

    results = await history_service.get_test_results(db, execution_id)
    return [
        TestResultResponse(
            id=r.id,
            nome=r.nome,
            tipo=r.tipo,
            status=r.status,
            duracao_ms=r.duracao_ms or 0.0,
            detalhes=r.detalhes or "",
            severidade=r.severidade or "info",
            grupo=r.grupo or "",
        )
        for r in results
    ]
