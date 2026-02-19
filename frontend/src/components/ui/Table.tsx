interface Column<T> {
  key: string
  header: string
  render: (item: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyFn: (item: T) => string
}

export function Table<T>({ columns, data, keyFn }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-default)] bg-slate-800/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {data.map((item) => (
            <tr
              key={keyFn(item)}
              className="transition-colors duration-[var(--transition-fast)] hover:bg-slate-800/30"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-10 text-center text-sm text-[var(--text-muted)]">
          Nenhum dado encontrado
        </div>
      )}
    </div>
  )
}
