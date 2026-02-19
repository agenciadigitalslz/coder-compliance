import { Routes, Route } from "react-router-dom"
import { PageContainer } from "./components/layout/PageContainer"
import { ProjectsPage } from "./pages/ProjectsPage"
import { ProjectDetailPage } from "./pages/ProjectDetailPage"
import { ExecutionDetailPage } from "./pages/ExecutionDetailPage"

function App() {
  return (
    <Routes>
      <Route element={<PageContainer />}>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/executions/:id" element={<ExecutionDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
