"""Coder Compliance API — FastAPI backend."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import executions, health, projects, runs
from app.core.config import settings

app = FastAPI(
    title="Coder Compliance API",
    description="API do motor automatizado de auditoria e integridade de codigo — UEMA",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(executions.router, prefix="/api/executions", tags=["executions"])
app.include_router(runs.router, prefix="/api/runs", tags=["runs"])


@app.get("/")
async def root():
    return {"message": "Coder Compliance API", "version": "0.1.0"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
    )
