/**
 * DADOS DEMO — PERMANENTES (NAO DELETAR!)
 *
 * Estes dados sao usados no repositorio academico Coder Compliance (UEMA — PPS).
 * Apresentados no dashboard quando o backend nao esta disponivel.
 *
 * 3 empresas demo: Conduit, HealthTrack, EduConnect
 * 6 execucoes por empresa com tendencia de melhoria
 * 18 testes por execucao (10 API + 8 seguranca)
 *
 * AVISO: Nao remover este arquivo! Ele garante que o dashboard funcione
 * independentemente do backend/Supabase para apresentacoes academicas.
 */

import type { Execution, Project, ScoreHistory, TestResult } from "../types"

// ── Seeded PRNG (deterministic) ──────────────────────────────

function createRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function hashStr(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// ── IDs fixos ────────────────────────────────────────────────

const P = {
  conduit: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  healthtrack: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  educonnect: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
}

const E = {
  conduit: [
    "e1a00001-0001-4000-8000-000000000001",
    "e1a00001-0002-4000-8000-000000000002",
    "e1a00001-0003-4000-8000-000000000003",
    "e1a00001-0004-4000-8000-000000000004",
    "e1a00001-0005-4000-8000-000000000005",
    "e1a00001-0006-4000-8000-000000000006",
  ],
  healthtrack: [
    "e2b00001-0001-4000-8000-000000000001",
    "e2b00001-0002-4000-8000-000000000002",
    "e2b00001-0003-4000-8000-000000000003",
    "e2b00001-0004-4000-8000-000000000004",
    "e2b00001-0005-4000-8000-000000000005",
    "e2b00001-0006-4000-8000-000000000006",
  ],
  educonnect: [
    "e3c00001-0001-4000-8000-000000000001",
    "e3c00001-0002-4000-8000-000000000002",
    "e3c00001-0003-4000-8000-000000000003",
    "e3c00001-0004-4000-8000-000000000004",
    "e3c00001-0005-4000-8000-000000000005",
    "e3c00001-0006-4000-8000-000000000006",
  ],
}

// ── Projetos ─────────────────────────────────────────────────

export const DEMO_PROJECTS: Project[] = [
  {
    id: P.conduit,
    nome: "Conduit",
    descricao: "RealWorld API — Blog platform com autenticacao JWT",
    stack: "node-express",
    last_score: 88.9,
    last_execution_at: "2026-02-17T14:30:00Z",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: P.healthtrack,
    nome: "HealthTrack",
    descricao: "Sistema de monitoramento de pacientes — API REST",
    stack: "python-fastapi",
    last_score: 77.8,
    last_execution_at: "2026-02-16T16:45:00Z",
    created_at: "2026-01-12T09:00:00Z",
  },
  {
    id: P.educonnect,
    nome: "EduConnect",
    descricao: "Plataforma educacional com gestao de cursos e alunos",
    stack: "react-django",
    last_score: 94.4,
    last_execution_at: "2026-02-18T11:20:00Z",
    created_at: "2026-01-08T08:30:00Z",
  },
]

// ── Templates de testes ──────────────────────────────────────

const API_TESTS = [
  { nome: "GET /api/users — lista usuarios", grupo: "usuarios", severidade: "medium" },
  { nome: "POST /api/users — criar usuario", grupo: "usuarios", severidade: "high" },
  { nome: "GET /api/users/:id — buscar por ID", grupo: "usuarios", severidade: "medium" },
  { nome: "PUT /api/users/:id — atualizar usuario", grupo: "usuarios", severidade: "medium" },
  { nome: "DELETE /api/users/:id — remover usuario", grupo: "usuarios", severidade: "high" },
  { nome: "POST /api/auth/login — autenticacao", grupo: "autenticacao", severidade: "critical" },
  { nome: "POST /api/auth/register — registro", grupo: "autenticacao", severidade: "critical" },
  { nome: "GET /api/articles — listar artigos", grupo: "artigos", severidade: "low" },
  { nome: "POST /api/articles — criar artigo", grupo: "artigos", severidade: "medium" },
  { nome: "GET /api/health — healthcheck", grupo: "infraestrutura", severidade: "low" },
]

const SEC_TESTS = [
  { nome: "SQL Injection — login endpoint", grupo: "injection", severidade: "critical" },
  { nome: "XSS — campo de busca", grupo: "injection", severidade: "critical" },
  { nome: "CSRF — formulario de edicao", grupo: "csrf", severidade: "high" },
  { nome: "Security Headers — X-Frame-Options", grupo: "headers", severidade: "medium" },
  { nome: "Security Headers — Content-Security-Policy", grupo: "headers", severidade: "medium" },
  { nome: "Security Headers — X-Content-Type-Options", grupo: "headers", severidade: "low" },
  { nome: "CORS — origens permitidas", grupo: "cors", severidade: "high" },
  { nome: "Rate Limiting — brute force login", grupo: "rate-limit", severidade: "high" },
]

const FAIL_DETAILS = [
  "Expected status 200, got 500 — Internal Server Error",
  "Expected status 201, got 422 — Validation Error: field 'email' required",
  "Response time 3200ms exceeded threshold 2000ms",
  "Header 'X-Frame-Options' not found in response",
  "Header 'Content-Security-Policy' not found in response",
  "Endpoint vulneravel a SQL injection — payload: ' OR 1=1 --",
  "CORS misconfiguration — wildcard origin accepted",
  "Rate limit not enforced — 100 requests in 2s without block",
]

// ── Execucoes (6 por projeto, scores melhorando) ─────────────

function buildExecutions(): Execution[] {
  const results: Execution[] = []
  const baseDate = new Date("2026-02-19T00:00:00Z")

  const configs = [
    {
      ids: E.conduit, projectId: P.conduit, nome: "Conduit",
      scores: [61.1, 66.7, 72.2, 77.8, 83.3, 88.9],
      days: [28, 24, 19, 14, 8, 3],
    },
    {
      ids: E.healthtrack, projectId: P.healthtrack, nome: "HealthTrack",
      scores: [50.0, 55.6, 61.1, 66.7, 72.2, 77.8],
      days: [30, 25, 20, 15, 9, 4],
    },
    {
      ids: E.educonnect, projectId: P.educonnect, nome: "EduConnect",
      scores: [72.2, 77.8, 83.3, 88.9, 88.9, 94.4],
      days: [27, 22, 17, 12, 7, 2],
    },
  ]

  for (const cfg of configs) {
    for (let i = 0; i < 6; i++) {
      const total = 18
      const passed = Math.round((cfg.scores[i] / 100) * total)
      const failed = total - passed
      const startMs = baseDate.getTime() - cfg.days[i] * 86400000 + (10 + i) * 3600000
      const durMs = 1200 + i * 400 + (i % 3) * 200

      results.push({
        id: cfg.ids[i],
        project_id: cfg.projectId,
        projeto_nome: cfg.nome,
        ambiente: "local",
        started_at: new Date(startMs).toISOString(),
        finished_at: new Date(startMs + durMs).toISOString(),
        score: cfg.scores[i],
        total,
        passed,
        failed,
        errors: 0,
        skipped: 0,
        duracao_ms: durMs,
      })
    }
  }

  return results
}

export const DEMO_EXECUTIONS = buildExecutions()

// ── Resultados de testes (deterministicos por execution ID) ──

export function getDemoTestResults(executionId: string): TestResult[] {
  const exec = DEMO_EXECUTIONS.find((e) => e.id === executionId)
  if (!exec) return []

  const rng = createRng(hashStr(executionId))
  const results: TestResult[] = []

  const allTests = [
    ...API_TESTS.map((t) => ({ ...t, tipo: "api" })),
    ...SEC_TESTS.map((t) => ({ ...t, tipo: "security" })),
  ]

  // Shuffle indices and pick first N as fails
  const indices = Array.from({ length: 18 }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const failSet = new Set(indices.slice(0, exec.failed))

  for (let i = 0; i < allTests.length; i++) {
    const t = allTests[i]
    const status = failSet.has(i) ? "fail" : "pass"
    const detailIdx = Math.floor(rng() * FAIL_DETAILS.length)

    results.push({
      id: `tr-${executionId.slice(0, 8)}-${String(i).padStart(3, "0")}`,
      nome: t.nome,
      tipo: t.tipo,
      status: status as "pass" | "fail",
      duracao_ms: Math.round((50 + rng() * 750) * 10) / 10,
      detalhes: status === "fail" ? FAIL_DETAILS[detailIdx] : "",
      severidade: t.severidade,
      grupo: t.grupo,
    })
  }

  return results
}

// ── Score History (derivado das execucoes) ────────────────────

export function getDemoScoreHistory(projectId: string): ScoreHistory[] {
  const projExecs = DEMO_EXECUTIONS
    .filter((e) => e.project_id === projectId)
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())

  const history: ScoreHistory[] = []

  for (const exec of projExecs) {
    const results = getDemoTestResults(exec.id)
    const apiResults = results.filter((r) => r.tipo === "api")
    const secResults = results.filter((r) => r.tipo === "security")
    const apiPassed = apiResults.filter((r) => r.status === "pass").length
    const secPassed = secResults.filter((r) => r.status === "pass").length

    history.push({
      execution_id: exec.id,
      runner_type: "api",
      score: Math.round((apiPassed / apiResults.length) * 1000) / 10,
      total: apiResults.length,
      passed: apiPassed,
      recorded_at: exec.finished_at,
    })
    history.push({
      execution_id: exec.id,
      runner_type: "security",
      score: Math.round((secPassed / secResults.length) * 1000) / 10,
      total: secResults.length,
      passed: secPassed,
      recorded_at: exec.finished_at,
    })
  }

  return history
}

// ── Helpers de lookup ────────────────────────────────────────

export function getDemoProject(id: string): Project | undefined {
  return DEMO_PROJECTS.find((p) => p.id === id)
}

export function getDemoProjectExecutions(projectId: string, limit = 20): Execution[] {
  return DEMO_EXECUTIONS
    .filter((e) => e.project_id === projectId)
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, limit)
}

export function getDemoExecution(id: string): Execution | undefined {
  return DEMO_EXECUTIONS.find((e) => e.id === id)
}

export function getDemoExecutions(projectId?: string, limit = 20): Execution[] {
  let execs = [...DEMO_EXECUTIONS]
  if (projectId) {
    execs = execs.filter((e) => e.project_id === projectId)
  }
  return execs
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, limit)
}
