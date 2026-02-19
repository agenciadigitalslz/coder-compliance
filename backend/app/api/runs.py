"""Endpoint para disparar auditorias via API.

Na versao academica, o motor de execucao nao esta incluido.
Este endpoint retorna uma mensagem informativa.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.schemas.responses import RunRequest, RunResponse

router = APIRouter()


@router.post("", response_model=RunResponse)
async def run_tests(request: RunRequest):
    """Dispara auditoria para um projeto (stub academico)."""
    raise HTTPException(
        status_code=501,
        detail="Motor de auditoria nao disponivel nesta versao. "
        "Consulte os dados existentes via GET /api/projects e /api/executions.",
    )
