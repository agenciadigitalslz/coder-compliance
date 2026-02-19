import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Execution, TestResult } from "../types"
import { getExecution, getExecutionResults } from "../services/api"
import { Header } from "../components/layout/Header"
import { ScoreCard } from "../components/dashboard/ScoreCard"
import { ResultsTable } from "../components/dashboard/ResultsTable"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"
import { Spinner } from "../components/ui/Spinner"

export function ExecutionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [execution, setExecution] = useState<Execution | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return

    Promise.all([getExecution(id), getExecutionResults(id)])
      .then(([exec, res]) => {
        setExecution(exec)
        setResults(res)
        document.title = `Execucao ${exec.projeto_nome} — Coder Compliance`
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center" role="status">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !execution) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-500/5 p-6 text-red-400" role="alert">
        <p className="font-semibold">Erro ao carregar execucao</p>
        <p className="mt-1 text-sm text-red-400/70">{error || "Execucao nao encontrada"}</p>
      </div>
    )
  }

  const failedResults = results.filter((r) => r.status === "fail" || r.status === "error")

  return (
    <>
      <Header
        title={`Execucao — ${execution.projeto_nome || "Projeto"}`}
        subtitle={`${execution.ambiente} · ${new Date(execution.started_at).toLocaleString("pt-BR")}`}
        actions={
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-slate-800 hover:text-white"
          >
            Voltar
          </button>
        }
      />

      {/* Score */}
      <div className="mb-6">
        <ScoreCard
          score={execution.score}
          total={execution.total}
          passed={execution.passed}
          failed={execution.failed}
        />
      </div>

      {/* Metricas */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Duracao Total
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold text-white">
            {(execution.duracao_ms / 1000).toFixed(2)}
            <span className="ml-0.5 text-sm font-normal text-[var(--text-muted)]">s</span>
          </div>
        </Card>
        <Card>
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Erros
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold text-orange-400">
            {execution.errors}
          </div>
        </Card>
        <Card>
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Ignorados
          </div>
          <div className="mt-1.5 font-mono text-xl font-bold text-slate-400">
            {execution.skipped}
          </div>
        </Card>
      </div>

      {/* Falhas */}
      {failedResults.length > 0 && (
        <div className="mb-6">
          <Card className="border-red-500/20">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Falhas ({failedResults.length})
            </h3>
            <div className="space-y-2">
              {failedResults.map((r) => (
                <div key={r.id} className="rounded-lg border border-red-500/10 bg-red-500/5 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium text-slate-200">{r.nome}</div>
                    <Badge variant={r.status === "fail" ? "danger" : "warning"}>
                      {r.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    {r.tipo} · {r.severidade}
                  </div>
                  {r.detalhes && (
                    <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900/80 p-2.5 font-mono text-xs leading-relaxed text-slate-400">
                      {r.detalhes}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tabela completa */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-300">Todos os Resultados</h3>
        <ResultsTable results={results} />
      </section>
    </>
  )
}
