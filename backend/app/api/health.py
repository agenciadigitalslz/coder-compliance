"""Health check endpoint."""

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health():
    """Status da API."""
    return {"status": "ok", "service": "coder-compliance-api"}
