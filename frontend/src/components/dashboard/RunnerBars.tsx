import { Card } from "../ui/Card"
import type { ScoreHistory } from "../../types"

interface RunnerBarsProps {
  scores: ScoreHistory[]
}

const RUNNER_LABELS: Record<string, string> = {
  api: "API",
  security: "Seguranca",
  lgpd: "LGPD",
  performance: "Performance",
  ui: "UI",
  regression: "Regressao",
}

function barColor(score: number): string {
  if (score >= 90) return "bg-emerald-500"
  if (score >= 75) return "bg-yellow-500"
  if (score >= 50) return "bg-orange-500"
  return "bg-red-500"
}

export function RunnerBars({ scores }: RunnerBarsProps) {
  const latest = new Map<string, ScoreHistory>()
  for (const s of scores) {
    if (!latest.has(s.runner_type)) {
      latest.set(s.runner_type, s)
    }
  }

  const runners = Array.from(latest.values())

  if (runners.length === 0) {
    return null
  }

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-300">Score por Runner</h3>
      <div className="space-y-4">
        {runners.map((r) => (
          <div key={r.runner_type}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-400">
                {RUNNER_LABELS[r.runner_type] ?? r.runner_type}
              </span>
              <span className="font-mono font-medium text-slate-300">
                {Math.round(r.score)}%
                <span className="ml-1 text-slate-500">({r.passed}/{r.total})</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-2 rounded-full transition-all duration-700 ease-out ${barColor(r.score)}`}
                style={{ width: `${Math.min(r.score, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
