# DASH.rh

<p align="center">
  <strong>Sistema de Gestão de Recursos Humanos e Pipeline de Contratação</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.2.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/DuckDB-1.1-FFF000?logo=duckdb&logoColor=black" alt="DuckDB">
  <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
</p>

---

Plataforma completa para gestão de contratações e recursos humanos. Acompanhe candidatos desde a captação inicial até a contratação efetiva, com um dashboard analítico e interface industrial inspirada no design da **Factory.ai**.

## ✨ Funcionalidades

### 📊 Dashboard Analítico
- Estatísticas em tempo real por etapa do funil de contratação
- Cards de métricas: total de funcionários, conversões, progresso
- Interface industrial com design minimalista e moderno

### 👥 Gestão de Funcionários
- **Kanban Board**: Arraste candidatos entre etapas com dnd-kit
- **Visualização em Lista**: Tabela com filtros e busca
- **Pipeline de Contratação**:

```
CAPTAÇÃO → ENTREVISTA → PROPOSTA → ATIVO
```

### 📝 Solicitação de Talentos
- Formulário wizard multi-step para requisição de vagas
- Histórico de solicitações com status (pendente, ativo, fechado)

### 🔐 Segurança
- Autenticação JWT com tokens de 7 dias
- Hash de senhas com bcrypt
- Rate limiting (100 req/15min por IP)
- Headers de segurança via Helmet
- Sanitização de inputs contra XSS

### 💼 Sistema de Planos

| Recurso | Free | Pro |
|---------|:----:|:---:|
| Funcionários | 20 | ∞ |
| Dashboard | ✓ | ✓ |
| Kanban Board | ✓ | ✓ |
| Solicitações | ✓ | ✓ |
| Relatórios Avançados | ✗ | ✓ |

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 19.2** - UI Framework
- **Vite 7.2** - Build tool ultra-rápido
- **TailwindCSS 4.1** - CSS utilitário
- **Framer Motion 12** - Animações fluidas
- **dnd-kit** - Drag and drop nativo
- **Lucide React** - Ícones modernos
- **React Router DOM 7** - Navegação SPA

### Backend
- **Express 4.21** - Framework HTTP
- **DuckDB 1.1** - Banco de dados embarcado OLAP
- **JWT** - Autenticação stateless
- **bcryptjs** - Hashing de senhas
- **Helmet** - Segurança de headers
- **express-rate-limit** - Proteção contra abuso

### Design System
- **Tema Factory.ai** - Industrial minimalista
- **Geist / Geist Mono** - Tipografia primária
- **Sharp Corners** - Border radius de 2px
- **Orange Accent** - `#F97316`
- **Dark Mode** - Suporte via `prefers-color-scheme`

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/DASH.rh.git
cd DASH.rh
```

### 2. Configure as variáveis de ambiente

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`server/.env`):
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

> 📌 O DuckDB cria automaticamente o banco em `server/data/dash_rh.duckdb`

---

## 📁 Estrutura do Projeto

```
DASH.rh/
├── client/                      # Frontend React + Vite
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── Layout.jsx       # Layout principal
│   │   │   └── Sidebar.jsx      # Navegação lateral
│   │   ├── contexts/            # Estado global React Context
│   │   │   ├── AuthContext.jsx  # Autenticação e empresa
│   │   │   └── EmployeesContext.jsx # Funcionários e estatísticas
│   │   ├── lib/
│   │   │   └── api.js           # Cliente HTTP com suporte JWT
│   │   ├── pages/
│   │   │   ├── Auth.jsx         # Login / Registro
│   │   │   ├── Dashboard.jsx    # Dashboard principal
│   │   │   ├── Employees.jsx    # Kanban + Lista
│   │   │   ├── TalentRequest.jsx # Wizard de vagas
│   │   │   ├── Settings.jsx     # Configurações
│   │   │   └── Pricing.jsx      # Planos e preços
│   │   ├── App.jsx              # Rotas + Providers
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Design system
│   └── package.json
├── server/                      # Backend Express + DuckDB
│   ├── data/                    # Arquivos do DuckDB
│   └── src/
│       ├── db/
│       │   ├── duckdb.js        # Conexão e queries
│       │   └── schema.sql       # Schema SQL
│       ├── routes/
│       │   ├── auth.js          # Auth endpoints
│       │   ├── employees.js     # CRUD funcionários
│       │   └── talent-requests.js # Solicitações
│       └── index.js             # Server principal
├── .gitignore
├── claude.md                    # Contexto para IA
└── README.md
```

---

## 🗄️ Banco de Dados

DuckDB é utilizado como banco embarcado de alto desempenho:

```sql
-- Usuários (autenticação)
users(id, email, password_hash, created_at, updated_at)

-- Empresas (multi-tenant)
companies(id, name, owner_id, plan['free'|'pro'], created_at, updated_at)

-- Funcionários/Candidatos
employees(id, company_id, name, email, phone, position, department, 
          stage['captacao'|'entrevista'|'proposta'|'ativo'], notes, created_at, updated_at)

-- Solicitações de Talentos
talent_requests(id, company_id, form_data[JSON], status['pending'|'active'|'closed'], 
                created_at, updated_at)
```

---

## 📡 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/signup` | Criar conta + empresa |
| POST | `/api/auth/signin` | Login |
| POST | `/api/auth/signout` | Logout |
| GET | `/api/auth/session` | Verificar sessão atual |
| PUT | `/api/auth/company/plan` | Atualizar plano |
| PUT | `/api/auth/company/name` | Atualizar nome empresa |

### Funcionários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/employees` | Listar funcionários |
| POST | `/api/employees` | Adicionar funcionário |
| PUT | `/api/employees/:id` | Atualizar funcionário |
| DELETE | `/api/employees/:id` | Remover funcionário |

### Solicitações de Talentos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/talent-requests` | Listar solicitações |
| POST | `/api/talent-requests` | Criar solicitação |
| PUT | `/api/talent-requests/:id` | Atualizar status |
| DELETE | `/api/talent-requests/:id` | Remover solicitação |

### Utilitários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |

---

## 🚢 Deploy

### Frontend (Vercel / Netlify)
1. Conecte o repositório
2. Configure:
   - Build command: `cd client && npm run build`
   - Output directory: `client/dist`
   - Env var: `VITE_API_URL`

### Backend (Railway / Render)
1. Conecte o repositório
2. Configure env vars: `PORT`, `CLIENT_URL`, `JWT_SECRET`
3. **Volume persistente**: Monte `/server/data` para persistir o DuckDB
4. Start command: `cd server && npm start`

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'Adiciona minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

MIT © 2024 DASH.rh

---

<p align="center">
  Desenvolvido com ☕ e 🎯
</p>
]]>
