import { clsx } from "clsx"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
}

const variants: Record<string, string> = {
  default: "bg-slate-700/60 text-slate-300 ring-slate-600/50",
  success: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
  danger: "bg-red-500/10 text-red-400 ring-red-500/20",
  info: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
