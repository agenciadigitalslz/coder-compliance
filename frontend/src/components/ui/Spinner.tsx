export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6"
  return (
    <div
      className={`${dim} animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400`}
    />
  )
}
