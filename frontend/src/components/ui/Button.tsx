import { clsx } from "clsx"
import { Spinner } from "./Spinner"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
  loading?: boolean
}

const base = [
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5",
  "text-sm font-semibold cursor-pointer",
  "transition-all duration-[var(--transition-fast)]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ")

const variants: Record<string, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-sm shadow-emerald-500/20 hover:shadow-emerald-500/30",
  secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-700",
  danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-sm shadow-red-500/20",
}

export function Button({
  children,
  variant = "primary",
  loading,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
