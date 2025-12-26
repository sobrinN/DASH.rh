# DASH.rh - Sistema de Gestão de RH

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/DuckDB-1.1-FFF000?logo=duckdb&logoColor=black" alt="DuckDB">
  <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/JWT-Auth-purple" alt="JWT">
</p>

Sistema empresarial completo para gestão de contratações e recursos humanos. Acompanhe candidatos desde a captação inicial até a contratação efetiva, com um dashboard analítico e moderno inspirado no design industrial da Factory.ai.

## ✨ Funcionalidades

### Dashboard & Analytics
- **Dashboard Gerencial**: Estatísticas em tempo real por etapa do funil
- **Cards de Métricas**: Total de funcionários, conversões de etapa, progresso geral
- **UI Industrial**: Design moderno, limpo e minimalista com tema Factory.ai

### Gestão de Funcionários
- **Kanban Board**: Arraste e solte candidatos entre etapas (dnd-kit)
- **Visualização em Lista**: Tabela completa com filtros e busca
- **Etapas de Contratação**: 
  - `Captação` → Candidatos iniciais
  - `Entrevista` → Em processo de entrevista
  - `Proposta` → Proposta enviada
  - `Ativo` → Contratados

### Solicitação de Talentos
- **Formulário Multi-step**: Wizard completo para requisição de vagas
- **Histórico de Solicitações**: Acompanhe status (pending, active, closed)

### Sistema de Planos
| Funcionalidade | Free | Pro |
|----------------|------|-----|
| Funcionários | Até 20 | Ilimitados |
| Dashboard | ✅ | ✅ |
| Kanban Board | ✅ | ✅ |
| Solicitação de Talentos | ✅ | ✅ |
| Relatórios Avançados | ❌ | ✅ |

### Segurança & Autenticação
- **JWT Authentication**: Tokens stateless com expiração de 7 dias
- **Password Hashing**: bcrypt para senhas
- **Rate Limiting**: 100 requests/15min por IP
- **Helmet**: Headers de segurança (CSP, XSS Protection, etc.)
- **CORS**: Domínios autorizados
- **Input Sanitization**: Proteção contra XSS

## 🛠️ Stack Tecnológica

### Frontend
- **React 19.2** - Framework UI
- **Vite 7.2** - Build tool e dev server
- **TailwindCSS 4.1** - Styling
- **Framer Motion 12** - Animações
- **dnd-kit** - Drag and drop (Kanban)
- **Lucide React** - Ícones
- **React Router DOM 7** - Navegação

### Backend
- **Node.js** - Runtime
- **Express 4.21** - Framework HTTP
- **DuckDB 1.1** - Banco de dados embarcado (OLAP)
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **uuid** - IDs únicos

### Design System
- **Factory.ai Theme** - Design industrial minimalista
- **Geist/Geist Mono** - Tipografia primária
- **Sharp Corners** - Border radius de 2px
- **Orange Accent** - `#F97316` como cor de destaque
- **Dark Mode** - Suporte automático via `prefers-color-scheme`

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/DASH.rh.git
cd DASH.rh
```

### 2. Configure as variáveis de ambiente

**Frontend** (`client/.env`):
```bash
cd client
cp .env.example .env
```
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`server/.env`):
```bash
cd ../server
cp .env.example .env
```
```env
PORT=3001
CLIENT_URL=http://localhost:5173
JWT_SECRET=sua-chave-secreta-super-segura
```

### 3. Instale as dependências
```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 4. Execute em desenvolvimento
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Acesse: **http://localhost:5173**

> **Nota**: O DuckDB cria automaticamente o banco em `server/data/dash_rh.duckdb` na primeira execução.

## 📁 Estrutura do Projeto

```
DASH.rh/
├── client/                     # Frontend React + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── Layout.jsx      # Layout com sidebar
│   │   │   └── Sidebar.jsx     # Menu lateral
│   │   ├── contexts/           # Estado global
│   │   │   ├── AuthContext.jsx # Autenticação
│   │   │   └── EmployeesContext.jsx # Funcionários
│   │   ├── lib/
│   │   │   └── api.js          # Cliente HTTP
│   │   ├── pages/
│   │   │   ├── Auth.jsx        # Login/Registro
│   │   │   ├── Dashboard.jsx   # Dashboard principal
│   │   │   ├── Employees.jsx   # Gestão de funcionários
│   │   │   ├── TalentRequest.jsx # Solicitação de vagas
│   │   │   ├── Settings.jsx    # Configurações
│   │   │   └── Pricing.jsx     # Planos e preços
│   │   ├── App.jsx             # Rotas e providers
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Design system + Tailwind
│   ├── .env.example
│   └── package.json
├── server/                     # Backend Express + DuckDB
│   ├── data/                   # Arquivos do DuckDB
│   └── src/
│       ├── db/
│       │   ├── duckdb.js       # Conexão e helpers
│       │   └── schema.sql      # Schema do banco
│       ├── routes/
│       │   ├── auth.js         # Autenticação
│       │   ├── employees.js    # CRUD funcionários
│       │   └── talent-requests.js # Solicitações
│       └── index.js            # Server entry point
├── .gitignore
└── README.md
```

## 🗄️ Banco de Dados

O DuckDB é utilizado como banco embarcado. Schema principal:

```sql
-- Usuários (autenticação)
users(id, email, password_hash, created_at, updated_at)

-- Empresas (multi-tenant)
companies(id, name, owner_id, plan, created_at, updated_at)

-- Funcionários/Candidatos
employees(id, company_id, name, email, phone, position, department, stage, notes, created_at, updated_at)

-- Solicitações de Talentos
talent_requests(id, company_id, form_data, status, created_at, updated_at)
```

## 🚢 Deploy

### Frontend (Vercel/Netlify)
1. Conecte o repositório
2. Set build command: `npm run build`
3. Set output: `dist`
4. Configure: `VITE_API_URL`

### Backend (Railway/Render)
1. Conecte o repositório
2. Configure as env vars: `PORT`, `CLIENT_URL`, `JWT_SECRET`
3. **Volume persistente**: Monte `/server/data` para persistir o DuckDB
4. Deploy!

## 📝 API Endpoints

### Auth
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/signup` | Criar conta + empresa |
| POST | `/api/auth/signin` | Login |
| POST | `/api/auth/signout` | Logout |
| GET | `/api/auth/session` | Verificar sessão |
| PUT | `/api/auth/company/plan` | Atualizar plano |
| PUT | `/api/auth/company/name` | Atualizar nome empresa |

### Employees
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/employees` | Listar funcionários |
| POST | `/api/employees` | Adicionar funcionário |
| PUT | `/api/employees/:id` | Atualizar funcionário |
| DELETE | `/api/employees/:id` | Remover funcionário |

### Talent Requests
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/talent-requests` | Listar solicitações |
| POST | `/api/talent-requests` | Criar solicitação |
| PUT | `/api/talent-requests/:id` | Atualizar status |

## 📄 Licença

MIT © 2024 DASH.rh
