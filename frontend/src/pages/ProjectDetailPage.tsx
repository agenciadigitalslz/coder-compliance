import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Execution, Project, ScoreHistory } from "../types"
import { getProject, getProjectExecutions, getProjectHistory } from "../services/api"
import { Header } from "../components/layout/Header"
import { ScoreCard } from "../components/dashboard/ScoreCard"
import { RunnerBars } from "../components/dashboard/RunnerBars"
import { ScoreChart } from "../components/dashboard/ScoreChart"
import { Card } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Spinner } from "../components/ui/Spinner"
import { classifyScore } from "../types"

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [executions, setExecutions] = useState<Execution[]>([])
  const [history, setHistory] = useState<ScoreHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return

    Promise.all([
      getProject(id),
      getProjectExecutions(id),
      getProjectHistory(id),
    ])
      .then(([proj, execs, hist]) => {
        setProject(proj)
        setExecutions(execs)
        setHistory(hist)
        document.title = `${proj.nome} — Coder Compliance`
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

  if (error || !project) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-500/5 p-6 text-red-400" role="alert">
        <p className="font-semibold">Erro ao carregar projeto</p>
        <p className="mt-1 text-sm text-red-400/70">{error || "Projeto nao encontrado"}</p>
      </div>
    )
  }

  const lastExec = executions[0] ?? null

  return (
    <>
      <Header
        title={project.nome}
        subtitle={project.descricao || project.stack || undefined}
        actions={
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-slate-800 hover:text-white"
          >
            Voltar
          </button>
        }
      />

      {/* Score + Runner Bars */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <ScoreCard
          score={lastExec?.score ?? project.last_score}
          total={lastExec?.total ?? 0}
          passed={lastExec?.passed ?? 0}
          failed={lastExec?.failed ?? 0}
        />
        <RunnerBars scores={history} />
      </div>

      {/* Grafico de historico */}
      <div className="mb-6">
        <ScoreChart history={history} />
      </div>

      {/* Execucoes recentes */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-slate-300">Execucoes Recentes</h3>
        {executions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--text-muted)]">Nenhuma execucao registrada</p>
          </div>
        ) : (
          <div className="space-y-2">
            {executions.map((exec) => {
              const cls = classifyScore(exec.score)
              return (
                <div
                  key={exec.id}
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--border-subtle)] p-3 transition-all duration-[var(--transition-fast)] hover:border-[var(--border-default)] hover:bg-slate-800/40"
                  onClick={() => navigate(`/executions/${exec.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter") navigate(`/executions/${exec.id}`) }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cls.bg}`}>
                      <span className="font-mono text-sm font-bold text-white">
                        {Math.round(exec.score)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">
                        {exec.passed}/{exec.total} testes
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {new Date(exec.started_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" · "}
                        {exec.ambiente}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={exec.failed > 0 ? "danger" : "success"}>
                      {exec.failed > 0 ? `${exec.failed} falha${exec.failed > 1 ? "s" : ""}` : "OK"}
                    </Badge>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {exec.duracao_ms.toFixed(0)}ms
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </>
  )
}
