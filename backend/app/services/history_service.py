"""Persistencia de execucoes no PostgreSQL (Supabase)."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.db_models import Execution, Project, ScoreHistory, TestResultRow


# ── Helpers ────────────────────────────────────────────────────────────

def _mask_token(token: str, visible: int = 4) -> str:
    """Mascara um token, mantendo apenas os primeiros caracteres visiveis."""
    if len(token) <= visible:
        return token
    return token[:visible] + "*" * (len(token) - visible)


def _mask_detalhes(detalhes: str) -> str:
    """Mascara tokens que possam aparecer nos detalhes."""
    if not detalhes:
        return detalhes
    words = detalhes.split()
    masked = []
    for word in words:
        if len(word) > 30 and not word.startswith("http"):
            masked.append(_mask_token(word))
        else:
            masked.append(word)
    return " ".join(masked)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


# ── Projetos ───────────────────────────────────────────────────────────

async def get_or_create_project(
    db: AsyncSession,
    nome: str,
    descricao: str = "",
    stack: str = "",
) -> Project:
    """Busca projeto pelo nome ou cria se nao existe."""
    stmt = select(Project).where(Project.nome == nome)
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()

    if project is None:
        project = Project(
            id=uuid.uuid4(),
            nome=nome,
            descricao=descricao,
            stack=stack,
        )
        db.add(project)
        await db.flush()

    return project


async def get_projects(db: AsyncSession) -> list[Project]:
    """Lista todos os projetos."""
    stmt = select(Project).order_by(Project.nome)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_projects_with_last_score(db: AsyncSession) -> list[dict]:
    """Lista projetos com ultimo score em uma unica query (evita N+1).

    Retorna list de dicts com chaves: project, last_score, last_execution_at.
    """
    last_exec_sub = (
        select(
            Execution.project_id,
            func.max(Execution.started_at).label("max_started"),
        )
        .group_by(Execution.project_id)
        .subquery()
    )

    stmt = (
        select(Project, Execution.score, Execution.started_at)
        .outerjoin(last_exec_sub, Project.id == last_exec_sub.c.project_id)
        .outerjoin(
            Execution,
            (Execution.project_id == last_exec_sub.c.project_id)
            & (Execution.started_at == last_exec_sub.c.max_started),
        )
        .order_by(Project.nome)
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "project": row[0],
            "last_score": row[1],
            "last_execution_at": row[2],
        }
        for row in rows
    ]


async def get_project_by_id(db: AsyncSession, project_id: uuid.UUID) -> Project | None:
    """Busca projeto por ID."""
    stmt = select(Project).where(Project.id == project_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


# ── Execucoes ──────────────────────────────────────────────────────────

async def get_executions(
    db: AsyncSession,
    project_id: uuid.UUID | None = None,
    limit: int = 20,
) -> list[Execution]:
    """Lista execucoes, opcionalmente filtradas por projeto."""
    stmt = select(Execution).order_by(Execution.started_at.desc()).limit(limit)
    if project_id:
        stmt = stmt.where(Execution.project_id == project_id)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_execution_by_id(
    db: AsyncSession,
    execution_id: uuid.UUID,
) -> Execution | None:
    """Busca execucao por ID."""
    stmt = select(Execution).where(Execution.id == execution_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_test_results(
    db: AsyncSession,
    execution_id: uuid.UUID,
) -> list[TestResultRow]:
    """Lista resultados de uma execucao."""
    stmt = (
        select(TestResultRow)
        .where(TestResultRow.execution_id == execution_id)
        .order_by(TestResultRow.tipo, TestResultRow.nome)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


# ── Score History ──────────────────────────────────────────────────────

async def get_score_history(
    db: AsyncSession,
    project_id: uuid.UUID,
    limit: int = 30,
) -> list[ScoreHistory]:
    """Historico de scores por runner para um projeto."""
    stmt = (
        select(ScoreHistory)
        .where(ScoreHistory.project_id == project_id)
        .order_by(ScoreHistory.recorded_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_last_execution_for_project(
    db: AsyncSession,
    project_id: uuid.UUID,
) -> Execution | None:
    """Retorna a ultima execucao de um projeto."""
    stmt = (
        select(Execution)
        .where(Execution.project_id == project_id)
        .order_by(Execution.started_at.desc())
        .limit(1)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
