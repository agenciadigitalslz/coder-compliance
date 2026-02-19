import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Project } from "../types"
import { classifyScore } from "../types"
import { getProjects } from "../services/api"
import { Header } from "../components/layout/Header"
import { Card } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Spinner } from "../components/ui/Spinner"

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Projetos — Coder Compliance"
    getProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center" role="status" aria-label="Carregando projetos">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-500/5 p-6 text-red-400" role="alert">
        <p className="font-semibold">Erro ao carregar projetos</p>
        <p className="mt-1 text-sm text-red-400/70">{error}</p>
      </div>
    )
  }

  return (
    <>
      <Header
        title="Projetos"
        subtitle={`${projects.length} projeto${projects.length !== 1 ? "s" : ""} cadastrado${projects.length !== 1 ? "s" : ""}`}
      />

      {projects.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="mt-4 text-base font-medium text-slate-400">Nenhum projeto encontrado</p>
            <p className="mt-1 text-sm text-slate-500">
              Execute testes via API para criar projetos automaticamente.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const cls = classifyScore(project.last_score)
            return (
              <Card
                key={project.id}
                hover
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-white">
                      {project.nome}
                    </h3>
                    {project.stack && (
                      <Badge className="mt-1.5" variant="default">{project.stack}</Badge>
                    )}
                    {project.descricao && (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">
                        {project.descricao}
                      </p>
                    )}
                  </div>

                  {/* Score circle */}
                  <div className="flex shrink-0 flex-col items-center">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${cls.bg}`}>
                      <span className="font-mono text-lg font-bold text-white">
                        {project.last_score !== null ? Math.round(project.last_score) : "--"}
                      </span>
                    </div>
                    <span className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider ${cls.text}`}>
                      {cls.label}
                    </span>
                  </div>
                </div>

                {project.last_execution_at && (
                  <p className="mt-3 border-t border-[var(--border-subtle)] pt-3 text-[11px] text-[var(--text-muted)]">
                    Ultimo teste:{" "}
                    {new Date(project.last_execution_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
