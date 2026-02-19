import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Card } from "../ui/Card"
import type { ScoreHistory } from "../../types"

interface ScoreChartProps {
  history: ScoreHistory[]
}

const COLORS: Record<string, string> = {
  api: "#3b82f6",
  security: "#ef4444",
  lgpd: "#a855f7",
  performance: "#f59e0b",
  ui: "#06b6d4",
  regression: "#6b7280",
}

const RUNNER_LABELS: Record<string, string> = {
  api: "API",
  security: "Seguranca",
  lgpd: "LGPD",
  performance: "Performance",
  ui: "UI",
  regression: "Regressao",
}

export function ScoreChart({ history }: ScoreChartProps) {
  if (history.length === 0) {
    return null
  }

  const execMap = new Map<string, Record<string, number>>()
  const execDates = new Map<string, string>()

  for (const h of history) {
    if (!execMap.has(h.execution_id)) {
      execMap.set(h.execution_id, {})
    }
    execMap.get(h.execution_id)![h.runner_type] = h.score
    if (h.recorded_at) {
      execDates.set(h.execution_id, h.recorded_at)
    }
  }

  const entries = Array.from(execMap.entries())
    .map(([id, scores]) => ({
      id,
      date: execDates.get(id) ?? "",
      ...scores,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const data = entries.map((e) => ({
    ...e,
    label: e.date
      ? new Date(e.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      : "",
  }))

  const runnerTypes = [...new Set(history.map((h) => h.runner_type))]

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-slate-300">Historico de Scores</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border-default)",
              borderRadius: "10px",
              color: "var(--text-primary)",
              fontSize: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
          {runnerTypes.map((rt) => (
            <Line
              key={rt}
              type="monotone"
              dataKey={rt}
              stroke={COLORS[rt] ?? "#94a3b8"}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 0, fill: COLORS[rt] ?? "#94a3b8" }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#0f172a" }}
              name={RUNNER_LABELS[rt] ?? rt.toUpperCase()}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
