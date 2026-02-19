import { clsx } from "clsx"

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-5 backdrop-blur-sm",
        "transition-all duration-[var(--transition-base)]",
        hover && "cursor-pointer hover:border-[var(--border-hover)] hover:bg-[var(--surface-raised)] hover:shadow-lg hover:shadow-black/20",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick() } : undefined}
    >
      {children}
    </div>
  )
}
