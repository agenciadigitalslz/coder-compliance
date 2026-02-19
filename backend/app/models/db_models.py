"""Modelos SQLAlchemy para PostgreSQL (Supabase)."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship


def _utcnow():
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class Project(Base):
    """Projeto cadastrado no Coder Compliance."""

    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(100), unique=True, nullable=False, index=True)
    descricao = Column(Text, default="")
    stack = Column(String(50), default="")
    created_at = Column(DateTime(timezone=True), default=_utcnow)
    updated_at = Column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    executions = relationship("Execution", back_populates="project", lazy="selectin")


class Execution(Base):
    """Metadados de cada execução de testes."""

    __tablename__ = "executions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False, index=True,
    )
    ambiente = Column(String(50), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
    finished_at = Column(DateTime(timezone=True))
    score = Column(Float, default=0.0)
    total = Column(Integer, default=0)
    passed = Column(Integer, default=0)
    failed = Column(Integer, default=0)
    errors = Column(Integer, default=0)
    skipped = Column(Integer, default=0)
    duracao_ms = Column(Float, default=0.0)

    project = relationship("Project", back_populates="executions")
    test_results = relationship("TestResultRow", back_populates="execution", lazy="selectin")
    score_details = relationship("ScoreHistory", back_populates="execution", lazy="selectin")


class TestResultRow(Base):
    """Resultado individual de cada teste."""

    __tablename__ = "test_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id = Column(
        UUID(as_uuid=True), ForeignKey("executions.id"), nullable=False, index=True,
    )
    nome = Column(String(200), nullable=False)
    tipo = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False)
    duracao_ms = Column(Float, default=0.0)
    detalhes = Column(Text, default="")
    severidade = Column(String(20), default="info")
    grupo = Column(String(100), default="")

    execution = relationship("Execution", back_populates="test_results")


class ScoreHistory(Base):
    """Score por runner ao longo do tempo."""

    __tablename__ = "score_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id = Column(
        UUID(as_uuid=True), ForeignKey("executions.id"), nullable=False, index=True,
    )
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False, index=True,
    )
    runner_type = Column(String(50), nullable=False)
    score = Column(Float, default=0.0)
    total = Column(Integer, default=0)
    passed = Column(Integer, default=0)
    recorded_at = Column(DateTime(timezone=True), default=_utcnow)

    execution = relationship("Execution", back_populates="score_details")
