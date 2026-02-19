-- Coder Compliance — Schema PostgreSQL (Supabase)
-- Executar no SQL Editor do Supabase

-- ══════════════════════════════════════════════════════
-- 1. Tabela: projects
-- ══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(100) NOT NULL UNIQUE,
    descricao   TEXT DEFAULT '',
    stack       VARCHAR(50) DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_nome ON projects(nome);

-- ══════════════════════════════════════════════════════
-- 2. Tabela: executions
-- ══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS executions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ambiente    VARCHAR(50) NOT NULL,
    started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    score       FLOAT DEFAULT 0.0,
    total       INTEGER DEFAULT 0,
    passed      INTEGER DEFAULT 0,
    failed      INTEGER DEFAULT 0,
    errors      INTEGER DEFAULT 0,
    skipped     INTEGER DEFAULT 0,
    duracao_ms  FLOAT DEFAULT 0.0
);

CREATE INDEX IF NOT EXISTS idx_executions_project ON executions(project_id);
CREATE INDEX IF NOT EXISTS idx_executions_started ON executions(started_at DESC);

-- ══════════════════════════════════════════════════════
-- 3. Tabela: test_results
-- ══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS test_results (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
    nome         VARCHAR(200) NOT NULL,
    tipo         VARCHAR(50) NOT NULL,
    status       VARCHAR(20) NOT NULL,
    duracao_ms   FLOAT DEFAULT 0.0,
    detalhes     TEXT DEFAULT '',
    severidade   VARCHAR(20) DEFAULT 'info',
    grupo        VARCHAR(100) DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_test_results_execution ON test_results(execution_id);

-- ══════════════════════════════════════════════════════
-- 4. Tabela: score_history
-- ══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS score_history (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    runner_type  VARCHAR(50) NOT NULL,
    score        FLOAT DEFAULT 0.0,
    total        INTEGER DEFAULT 0,
    passed       INTEGER DEFAULT 0,
    recorded_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_score_history_project ON score_history(project_id);
CREATE INDEX IF NOT EXISTS idx_score_history_execution ON score_history(execution_id);

-- ══════════════════════════════════════════════════════
-- 5. Trigger: updated_at automatico em projects
-- ══════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projects_updated ON projects;
CREATE TRIGGER trg_projects_updated
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════
-- 6. Row Level Security (RLS) — desabilitado para MVP
-- ══════════════════════════════════════════════════════
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;

-- Politica aberta para MVP (sem auth)
CREATE POLICY IF NOT EXISTS "allow_all_projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "allow_all_executions" ON executions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "allow_all_test_results" ON test_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "allow_all_score_history" ON score_history FOR ALL USING (true) WITH CHECK (true);
