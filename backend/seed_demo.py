"""Seed de dados demo — popula o Supabase com dados fake para o dashboard."""

from __future__ import annotations

import asyncio
import random
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.db_models import Base, Execution, Project, ScoreHistory, TestResultRow

# ── Dados Demo ────────────────────────────────────────────────

PROJECTS = [
    {
        "nome": "Conduit",
        "descricao": "RealWorld API — Blog platform com autenticacao JWT",
        "stack": "node-express",
    },
    {
        "nome": "HealthTrack",
        "descricao": "Sistema de monitoramento de pacientes — API REST",
        "stack": "python-fastapi",
    },
    {
        "nome": "EduConnect",
        "descricao": "Plataforma educacional com gestao de cursos e alunos",
        "stack": "react-django",
    },
]

API_TESTS = [
    ("GET /api/users — lista usuarios", "api", "usuarios", "medium"),
    ("POST /api/users — criar usuario", "api", "usuarios", "high"),
    ("GET /api/users/:id — buscar por ID", "api", "usuarios", "medium"),
    ("PUT /api/users/:id — atualizar usuario", "api", "usuarios", "medium"),
    ("DELETE /api/users/:id — remover usuario", "api", "usuarios", "high"),
    ("POST /api/auth/login — autenticacao", "api", "autenticacao", "critical"),
    ("POST /api/auth/register — registro", "api", "autenticacao", "critical"),
    ("GET /api/articles — listar artigos", "api", "artigos", "low"),
    ("POST /api/articles — criar artigo", "api", "artigos", "medium"),
    ("GET /api/health — healthcheck", "api", "infraestrutura", "low"),
]

SECURITY_TESTS = [
    ("SQL Injection — login endpoint", "security", "injection", "critical"),
    ("XSS — campo de busca", "security", "injection", "critical"),
    ("CSRF — formulario de edicao", "security", "csrf", "high"),
    ("Security Headers — X-Frame-Options", "security", "headers", "medium"),
    ("Security Headers — Content-Security-Policy", "security", "headers", "medium"),
    ("Security Headers — X-Content-Type-Options", "security", "headers", "low"),
    ("CORS — origens permitidas", "security", "cors", "high"),
    ("Rate Limiting — brute force login", "security", "rate-limit", "high"),
]

FAIL_DETAILS = [
    "Expected status 200, got 500 — Internal Server Error",
    "Expected status 201, got 422 — Validation Error: field 'email' required",
    "Response time 3200ms exceeded threshold 2000ms",
    "Header 'X-Frame-Options' not found in response",
    "Header 'Content-Security-Policy' not found in response",
    "Endpoint vulneravel a SQL injection — payload: ' OR 1=1 --",
    "CORS misconfiguration — wildcard origin accepted",
    "Rate limit not enforced — 100 requests in 2s without block",
]


def _utcnow():
    return datetime.now(timezone.utc)


def _random_score_evolution(base: float, variation: float = 10) -> float:
    """Gera score com variacao natural."""
    score = base + random.uniform(-variation, variation)
    return max(0, min(100, round(score, 1)))


async def seed():
    """Popula o banco com dados demo."""
    if not settings.db_url:
        print("ERRO: DB_URL nao configurado no .env")
        return

    engine = create_async_engine(settings.db_url, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        # Limpar dados existentes (na ordem correta por FK)
        print("Limpando dados existentes...")
        await db.execute(ScoreHistory.__table__.delete())
        await db.execute(TestResultRow.__table__.delete())
        await db.execute(Execution.__table__.delete())
        await db.execute(Project.__table__.delete())
        await db.commit()

        # Criar projetos
        print("Criando projetos...")
        project_ids = {}
        for p_data in PROJECTS:
            project = Project(
                id=uuid.uuid4(),
                nome=p_data["nome"],
                descricao=p_data["descricao"],
                stack=p_data["stack"],
            )
            db.add(project)
            project_ids[p_data["nome"]] = project.id
            print(f"  + {p_data['nome']} ({p_data['stack']})")

        await db.flush()

        # Para cada projeto, gerar 5-8 execuções ao longo de 30 dias
        print("\nGerando execucoes...")
        now = _utcnow()

        for proj_name, proj_id in project_ids.items():
            num_executions = random.randint(5, 8)
            base_api_score = random.uniform(65, 95)
            base_sec_score = random.uniform(50, 85)

            for i in range(num_executions):
                exec_id = uuid.uuid4()
                days_ago = (num_executions - i) * random.randint(3, 5)
                started_at = now - timedelta(days=days_ago, hours=random.randint(8, 18))
                duracao_ms = random.uniform(800, 4500)
                finished_at = started_at + timedelta(milliseconds=duracao_ms)

                # Scores melhoram ao longo do tempo (tendencia positiva)
                improvement = i * random.uniform(1, 3)
                api_score = _random_score_evolution(base_api_score + improvement, 8)
                sec_score = _random_score_evolution(base_sec_score + improvement, 12)

                # Gerar resultados de testes
                all_results = []
                api_passed = 0
                api_total = len(API_TESTS)

                for test_name, tipo, grupo, severidade in API_TESTS:
                    # Taxa de falha diminui com o tempo
                    fail_chance = max(0.05, 0.3 - (i * 0.04))
                    status = "fail" if random.random() < fail_chance else "pass"
                    if status == "pass":
                        api_passed += 1

                    result = TestResultRow(
                        id=uuid.uuid4(),
                        execution_id=exec_id,
                        nome=test_name,
                        tipo=tipo,
                        status=status,
                        duracao_ms=round(random.uniform(50, 800), 1),
                        detalhes=random.choice(FAIL_DETAILS) if status == "fail" else "",
                        severidade=severidade,
                        grupo=grupo,
                    )
                    all_results.append(result)
                    db.add(result)

                sec_passed = 0
                sec_total = len(SECURITY_TESTS)

                for test_name, tipo, grupo, severidade in SECURITY_TESTS:
                    fail_chance = max(0.08, 0.4 - (i * 0.05))
                    status = "fail" if random.random() < fail_chance else "pass"
                    if status == "pass":
                        sec_passed += 1

                    result = TestResultRow(
                        id=uuid.uuid4(),
                        execution_id=exec_id,
                        nome=test_name,
                        tipo=tipo,
                        status=status,
                        duracao_ms=round(random.uniform(30, 500), 1),
                        detalhes=random.choice(FAIL_DETAILS) if status == "fail" else "",
                        severidade=severidade,
                        grupo=grupo,
                    )
                    all_results.append(result)
                    db.add(result)

                total = api_total + sec_total
                passed = api_passed + sec_passed
                failed = total - passed
                score = round((passed / total) * 100, 1) if total > 0 else 0

                execution = Execution(
                    id=exec_id,
                    project_id=proj_id,
                    ambiente="local",
                    started_at=started_at,
                    finished_at=finished_at,
                    score=score,
                    total=total,
                    passed=passed,
                    failed=failed,
                    errors=0,
                    skipped=0,
                    duracao_ms=round(duracao_ms, 1),
                )
                db.add(execution)

                # Score history por runner
                real_api_score = round((api_passed / api_total) * 100, 1)
                real_sec_score = round((sec_passed / sec_total) * 100, 1)

                for runner_type, r_score, r_total, r_passed in [
                    ("api", real_api_score, api_total, api_passed),
                    ("security", real_sec_score, sec_total, sec_passed),
                ]:
                    sh = ScoreHistory(
                        id=uuid.uuid4(),
                        execution_id=exec_id,
                        project_id=proj_id,
                        runner_type=runner_type,
                        score=r_score,
                        total=r_total,
                        passed=r_passed,
                        recorded_at=finished_at,
                    )
                    db.add(sh)

                print(f"  [{proj_name}] Exec {i+1}/{num_executions}: score={score}% ({passed}/{total})")

        await db.commit()

    await engine.dispose()
    print("\nSeed concluido com sucesso!")
    print(f"  {len(PROJECTS)} projetos")
    print(f"  ~{sum(random.randint(5, 8) for _ in PROJECTS)} execucoes com resultados")


if __name__ == "__main__":
    asyncio.run(seed())
