import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export function PageContainer() {
  return (
    <div className="flex min-h-screen bg-[var(--surface-base)]">
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-6 lg:p-8">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
