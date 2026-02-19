"""Database — SQLAlchemy async engine para Supabase PostgreSQL."""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

engine = None
async_session_factory = None

if settings.db_url:
    engine = create_async_engine(
        settings.db_url,
        echo=False,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,
    )
    async_session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False,
    )


async def get_db():
    """Dependency FastAPI que fornece uma sessão async do banco."""
    if async_session_factory is None:
        raise RuntimeError("DB_URL não configurada. Verifique o .env")
    async with async_session_factory() as session:
        yield session
