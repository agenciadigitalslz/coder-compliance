import type { TestResult } from "../../types"
import { Badge } from "../ui/Badge"
import { Table } from "../ui/Table"

interface ResultsTableProps {
  results: TestResult[]
}

function statusBadge(status: string) {
  switch (status) {
    case "pass":
      return <Badge variant="success">PASS</Badge>
    case "fail":
      return <Badge variant="danger">FAIL</Badge>
    case "error":
      return <Badge variant="warning">ERROR</Badge>
    case "skip":
      return <Badge variant="info">SKIP</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export function ResultsTable({ results }: ResultsTableProps) {
  const columns = [
    {
      key: "status",
      header: "Status",
      className: "w-20",
      render: (r: TestResult) => statusBadge(r.status),
    },
    {
      key: "nome",
      header: "Teste",
      render: (r: TestResult) => (
        <div>
          <div className="font-medium text-slate-200">{r.nome}</div>
          {r.grupo && (
            <div className="mt-0.5 text-xs text-[var(--text-muted)]">{r.grupo}</div>
          )}
        </div>
      ),
    },
    {
      key: "tipo",
      header: "Tipo",
      className: "w-28",
      render: (r: TestResult) => (
        <span className="text-[var(--text-secondary)]">{r.tipo}</span>
      ),
    },
    {
      key: "severidade",
      header: "Severidade",
      className: "w-24",
      render: (r: TestResult) => (
        <span className="text-[var(--text-secondary)]">{r.severidade}</span>
      ),
    },
    {
      key: "duracao",
      header: "Duracao",
      className: "w-24 text-right",
      render: (r: TestResult) => (
        <span className="font-mono text-[var(--text-muted)]">
          {r.duracao_ms.toFixed(0)}ms
        </span>
      ),
    },
  ]

  return <Table columns={columns} data={results} keyFn={(r) => r.id} />
}
