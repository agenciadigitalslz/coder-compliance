"""Configuracoes do backend via variaveis de ambiente."""

from __future__ import annotations

import json

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings carregados do .env."""

    # Database (Supabase PostgreSQL)
    db_url: str = ""

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_cors_origins: str = '["http://localhost:5173"]'

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def cors_origins(self) -> list[str]:
        """Parseia a lista de origens CORS."""
        try:
            return json.loads(self.api_cors_origins)
        except (json.JSONDecodeError, TypeError):
            return ["http://localhost:5173"]


settings = Settings()
