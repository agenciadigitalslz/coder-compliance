import { classifyScore } from "../../types"
import { Card } from "../ui/Card"

interface ScoreCardProps {
  score: number | null
  total: number
  passed: number
  failed: number
}

const STROKE_COLORS: Record<string, string> = {
  green: "#10b981",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
  gray: "#6b7280",
}

const GLOW_COLORS: Record<string, string> = {
  green: "drop-shadow(0 0 6px rgba(16,185,129,0.4))",
  yellow: "drop-shadow(0 0 6px rgba(234,179,8,0.4))",
  orange: "drop-shadow(0 0 6px rgba(249,115,22,0.4))",
  red: "drop-shadow(0 0 6px rgba(239,68,68,0.4))",
  gray: "none",
}

export function ScoreCard({ score, total, passed, failed }: ScoreCardProps) {
  const cls = classifyScore(score)
  const pct = score ?? 0
  const strokeColor = STROKE_COLORS[cls.color] ?? STROKE_COLORS.gray

  return (
    <Card>
      <div className="flex items-center gap-6">
        {/* Score circle */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
          <svg
            className="h-28 w-28 -rotate-90"
            viewBox="0 0 100 100"
            style={{ filter: GLOW_COLORS[cls.color] ?? "none" }}
          >
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="#1e293b"
              strokeWidth="6"
            />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${pct * 2.64} 264`}
              className="score-circle"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-3xl font-bold text-white">
              {score !== null ? Math.round(pct) : "--"}
            </span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${cls.text}`}>
              {cls.label}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-slate-800/50 p-3">
              <div className="font-mono text-xl font-bold text-white">{total}</div>
              <div className="text-[11px] font-medium text-slate-500">Total</div>
            </div>
            <div className="rounded-lg bg-emerald-500/5 p-3">
              <div className="font-mono text-xl font-bold text-emerald-400">{passed}</div>
              <div className="text-[11px] font-medium text-slate-500">Passou</div>
            </div>
            <div className="rounded-lg bg-red-500/5 p-3">
              <div className="font-mono text-xl font-bold text-red-400">{failed}</div>
              <div className="text-[11px] font-medium text-slate-500">Falhou</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
