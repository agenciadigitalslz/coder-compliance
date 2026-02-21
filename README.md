# Coder Compliance

**Motor automatizado de auditoria e integridade de código.**

Dashboard full-stack para monitoramento de scores de qualidade, segurança e conformidade de projetos de software. Executa auditorias automatizadas e apresenta resultados em tempo real com classificação visual.

---

## 📋 Sobre o Projeto

O Coder Compliance é uma plataforma de auditoria contínua que avalia projetos de software em múltiplas dimensões:

- **API** — Testes de endpoints, contratos, autenticação e tempo de resposta
- **Segurança** — Headers OWASP, injeção (SQL/XSS), CORS, arquivos protegidos
- **Score 0-100** — Classificação ponderada com visual intuitivo (Excelente / Bom / Atenção / Crítico)

### Funcionalidades

- Dashboard interativo com gráficos de evolução temporal
- Detalhamento de execuções por projeto e por runner
- Histórico completo de auditorias com persistência em PostgreSQL
- API REST documentada (FastAPI + OpenAPI/Swagger)
- Interface responsiva com tema dark profissional

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
|---|---|
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2 (async), Pydantic |
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS 4, Recharts |
| **Banco de Dados** | PostgreSQL 17 (Supabase) |
| **Infra** | Supabase (BaaS), RLS, UUID PKs |

---

## 🚀 Como Executar

### Quick Start (apenas frontend — dados demo)

O dashboard funciona **sem backend** usando dados demo embutidos:

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173` — os 3 projetos demo serao exibidos automaticamente.

### Setup completo (com backend + Supabase)

#### Pre-requisitos

- Python 3.11+
- Node.js 20+
- Conta no [Supabase](https://supabase.com) (plano gratuito)

#### 1. Banco de Dados

1. Crie um projeto no Supabase
2. No **SQL Editor**, execute o conteudo de `backend/supabase_schema.sql`
3. Copie a connection string do Supabase (Settings → Database → URI)

#### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows

pip install -r requirements.txt

# Configurar variaveis de ambiente
cp .env.example .env
# Editar .env com a connection string do Supabase (DB_URL)

# Popular com dados demo (opcional)
python seed_demo.py

# Iniciar servidor
uvicorn main:app --reload --port 8000
```

A API estara disponivel em `http://localhost:8000` com documentacao em `/docs`.

#### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O dashboard estara disponivel em `http://localhost:5173`.

---

## 📁 Estrutura do Projeto

```
coder-compliance/
├── backend/
│   ├── main.py                    # App FastAPI + CORS + routers
│   ├── seed_demo.py               # Gerador de dados demo
│   ├── supabase_schema.sql        # DDL + indexes + RLS + trigger
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── api/                   # Endpoints (health, projects, executions, runs)
│       ├── core/                  # Config + Database engine
│       ├── models/                # SQLAlchemy models (4 tabelas)
│       ├── schemas/               # Pydantic request/response
│       └── services/              # Lógica de negócio + persistência
├── frontend/
│   ├── index.html                 # Entry point + meta tags
│   ├── vite.config.ts
│   ├── package.json
│   └── src/
│       ├── App.tsx                # Rotas (React Router)
│       ├── main.tsx               # Bootstrap + ErrorBoundary
│       ├── types/                 # Interfaces TypeScript
│       ├── data/                 # Dados demo embutidos (NAO DELETAR)
│       ├── services/              # Client HTTP (fetch wrapper + fallback demo)
│       ├── components/
│       │   ├── ui/                # Button, Card, Badge, Spinner, Table
│       │   ├── layout/            # Sidebar, Header, PageContainer
│       │   └── dashboard/         # ScoreCard, RunnerBars, ScoreChart, ResultsTable
│       └── pages/                 # ProjectsPage, ProjectDetailPage, ExecutionDetailPage
└── .gitignore
```

---

## 🗄️ Modelo de Dados

```
projects ──< executions ──< test_results
                  │
                  └──< score_history
```

| Tabela | Descrição |
|---|---|
| `projects` | Projetos cadastrados (nome, stack, timestamps) |
| `executions` | Metadados de cada auditoria (score, total, passed/failed) |
| `test_results` | Resultado individual de cada teste (status, severidade, grupo) |
| `score_history` | Score por runner ao longo do tempo (para gráficos de evolução) |

Todas as tabelas utilizam **UUID** como chave primária e **Row Level Security** habilitado.

---

## 📊 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status da API |
| `GET` | `/api/projects` | Lista projetos com último score |
| `GET` | `/api/projects/:id` | Detalhes de um projeto |
| `GET` | `/api/projects/:id/executions` | Histórico de execuções |
| `GET` | `/api/projects/:id/history` | Score por runner (gráfico) |
| `GET` | `/api/executions` | Lista execuções (filtro por projeto) |
| `GET` | `/api/executions/:id` | Detalhes de uma execução |
| `GET` | `/api/executions/:id/results` | Resultados individuais dos testes |
| `POST` | `/api/runs` | Dispara auditoria (v0.2) |

---

## 👥 Equipe

| Nome | Papel |
|---|---|
| **André da Silva Lopes** | Product Owner / Desenvolvedor |
| **Andressa de Jesus Nunes de Souza** | Scrum Master |
| **Pedro Aurélio** | Desenvolvedor / QA |

---

## 📚 Contexto Acadêmico

Projeto desenvolvido como trabalho prático da disciplina de **Engenharia de Software** do curso de **Análise e Desenvolvimento de Sistemas (ADS)** — UEMA.

---

## ⚠️ Dados Demo — NAO DELETAR

O dashboard inclui **dados demo permanentes** embutidos no frontend para garantir que o projeto funcione em apresentacoes academicas sem dependencia de backend ou banco de dados externo.

| Empresa | Stack | Score Final |
|---------|-------|-------------|
| **Conduit** | node-express | 88.9% (Bom) |
| **HealthTrack** | python-fastapi | 77.8% (Bom) |
| **EduConnect** | react-django | 94.4% (Excelente) |

**Arquivos protegidos** (NAO remover):
- `frontend/src/data/demo-data.ts` — Dados das 3 empresas, 18 execucoes, resultados de testes
- `backend/seed_demo.py` — Script para popular o Supabase com os mesmos dados

Estes dados sao utilizados na apresentacao do PPS (Pratica Profissional Supervisionada) da UEMA e devem permanecer intactos.

---

## 📄 Licenca

Projeto academico. Todos os direitos reservados.
