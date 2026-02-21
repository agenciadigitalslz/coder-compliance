/**
 * Servico HTTP para a API Coder Compliance.
 *
 * Fallback automatico: quando o backend esta offline, retorna dados demo
 * embutidos no frontend (3 empresas de apresentacao academica).
 */

import type { Execution, Project, RunRequest, RunResponse, ScoreHistory, TestResult } from "../types"
import {
  DEMO_PROJECTS,
  getDemoExecution,
  getDemoExecutions,
  getDemoProject,
  getDemoProjectExecutions,
  getDemoScoreHistory,
  getDemoTestResults,
} from "../data/demo-data"

const BASE = "/api"

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HTTP ${res.status}: ${body}`)
  }
  return res.json() as Promise<T>
}

/* ── Projetos ──────────────────────────────────────────────── */

export async function getProjects(): Promise<Project[]> {
  try {
    return await fetchJson<Project[]>(`${BASE}/projects`)
  } catch {
    console.info("[CC] Backend offline — usando dados demo")
    return DEMO_PROJECTS
  }
}

export async function getProject(id: string): Promise<Project> {
  try {
    return await fetchJson<Project>(`${BASE}/projects/${id}`)
  } catch {
    const p = getDemoProject(id)
    if (!p) throw new Error("Projeto nao encontrado")
    return p
  }
}

export async function getProjectExecutions(id: string, limit = 20): Promise<Execution[]> {
  try {
    return await fetchJson<Execution[]>(`${BASE}/projects/${id}/executions?limit=${limit}`)
  } catch {
    return getDemoProjectExecutions(id, limit)
  }
}

export async function getProjectHistory(id: string, limit = 30): Promise<ScoreHistory[]> {
  try {
    return await fetchJson<ScoreHistory[]>(`${BASE}/projects/${id}/history?limit=${limit}`)
  } catch {
    return getDemoScoreHistory(id)
  }
}

/* ── Execucoes ─────────────────────────────────────────────── */

export async function getExecutions(projectId?: string, limit = 20): Promise<Execution[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) })
    if (projectId) params.set("project_id", projectId)
    return await fetchJson<Execution[]>(`${BASE}/executions?${params}`)
  } catch {
    return getDemoExecutions(projectId, limit)
  }
}

export async function getExecution(id: string): Promise<Execution> {
  try {
    return await fetchJson<Execution>(`${BASE}/executions/${id}`)
  } catch {
    const e = getDemoExecution(id)
    if (!e) throw new Error("Execucao nao encontrada")
    return e
  }
}

export async function getExecutionResults(id: string): Promise<TestResult[]> {
  try {
    return await fetchJson<TestResult[]>(`${BASE}/executions/${id}/results`)
  } catch {
    return getDemoTestResults(id)
  }
}

/* ── Runs ──────────────────────────────────────────────────── */

export async function runTests(request: RunRequest): Promise<RunResponse> {
  return fetchJson<RunResponse>(`${BASE}/runs`, {
    method: "POST",
    body: JSON.stringify(request),
  })
}

/* ── Health ────────────────────────────────────────────────── */

export async function checkHealth(): Promise<{ status: string }> {
  try {
    return await fetchJson<{ status: string }>(`${BASE}/health`)
  } catch {
    return { status: "demo" }
  }
}
