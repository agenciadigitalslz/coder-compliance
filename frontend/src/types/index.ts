/* Tipos do Coder Compliance Dashboard */

export interface Project {
  id: string
  nome: string
  descricao: string
  stack: string
  last_score: number | null
  last_execution_at: string | null
  created_at: string | null
}

export interface Execution {
  id: string
  project_id: string
  projeto_nome: string
  ambiente: string
  started_at: string
  finished_at: string | null
  score: number
  total: number
  passed: number
  failed: number
  errors: number
  skipped: number
  duracao_ms: number
}

export interface TestResult {
  id: string
  nome: string
  tipo: string
  status: "pass" | "fail" | "skip" | "error"
  duracao_ms: number
  detalhes: string
  severidade: string
  grupo: string
}

export interface ScoreHistory {
  execution_id: string
  runner_type: string
  score: number
  total: number
  passed: number
  recorded_at: string | null
}

export interface RunRequest {
  project_name: string
  types: string[]
  environment: string
  confirm: boolean
}

export interface RunResponse {
  execution_id: string | null
  score: number
  total: number
  passed: number
  failed: number
  message: string
}

export interface ScoreClassification {
  label: string
  color: string
  bg: string
  text: string
}

export function classifyScore(score: number | null): ScoreClassification {
  if (score === null || score === undefined) {
    return { label: "N/A", color: "gray", bg: "bg-gray-700", text: "text-gray-400" }
  }
  if (score >= 90) {
    return { label: "Excelente", color: "green", bg: "bg-emerald-600", text: "text-emerald-400" }
  }
  if (score >= 75) {
    return { label: "Bom", color: "yellow", bg: "bg-yellow-600", text: "text-yellow-400" }
  }
  if (score >= 50) {
    return { label: "Atenção", color: "orange", bg: "bg-orange-600", text: "text-orange-400" }
  }
  return { label: "Crítico", color: "red", bg: "bg-red-600", text: "text-red-400" }
}
