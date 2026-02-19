/* Serviço HTTP para a API Coder Compliance */

import type { Execution, Project, RunRequest, RunResponse, ScoreHistory, TestResult } from "../types"

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
  return fetchJson<Project[]>(`${BASE}/projects`)
}

export async function getProject(id: string): Promise<Project> {
  return fetchJson<Project>(`${BASE}/projects/${id}`)
}

export async function getProjectExecutions(id: string, limit = 20): Promise<Execution[]> {
  return fetchJson<Execution[]>(`${BASE}/projects/${id}/executions?limit=${limit}`)
}

export async function getProjectHistory(id: string, limit = 30): Promise<ScoreHistory[]> {
  return fetchJson<ScoreHistory[]>(`${BASE}/projects/${id}/history?limit=${limit}`)
}

/* ── Execuções ─────────────────────────────────────────────── */

export async function getExecutions(projectId?: string, limit = 20): Promise<Execution[]> {
  const params = new URLSearchParams({ limit: String(limit) })
  if (projectId) params.set("project_id", projectId)
  return fetchJson<Execution[]>(`${BASE}/executions?${params}`)
}

export async function getExecution(id: string): Promise<Execution> {
  return fetchJson<Execution>(`${BASE}/executions/${id}`)
}

export async function getExecutionResults(id: string): Promise<TestResult[]> {
  return fetchJson<TestResult[]>(`${BASE}/executions/${id}/results`)
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
  return fetchJson<{ status: string }>(`${BASE}/health`)
}
