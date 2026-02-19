import { NavLink } from "react-router-dom"
import { clsx } from "clsx"

const links = [
  {
    to: "/",
    label: "Projetos",
    icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
  },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[var(--sidebar-width)] flex-col border-r border-[var(--border-subtle)] bg-slate-900/95 backdrop-blur-md">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[var(--border-subtle)] px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
          </svg>
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-white">Coder Compliance</span>
          <span className="ml-1.5 inline-flex rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
            v0.1
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Menu principal">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                "transition-all duration-[var(--transition-fast)]",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
              )
            }
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
            </svg>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border-subtle)] px-5 py-3">
        <p className="text-[11px] font-medium text-slate-500">Coder Compliance</p>
        <p className="text-[10px] text-slate-600">UEMA — ADS</p>
      </div>
    </aside>
  )
}
