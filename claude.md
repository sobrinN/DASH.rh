# DASH.rh - AI Assistant Context

## Project Overview

DASH.rh is a full-stack **HR management dashboard** for companies to track candidates through their hiring pipeline. Built with a modern React/Express architecture and an **industrial design aesthetic** inspired by Factory.ai.

**Key Features:**
- Multi-tenant architecture with company isolation
- Kanban board for visual hiring pipeline management
- Real-time analytics dashboard with stage metrics
- Talent requisition forms with multi-step wizard
- Free/Pro plan system with employee limits

## Tech Stack

### Frontend (`client/`)
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI Framework with hooks |
| Vite | 7.2 | Build tool & dev server |
| TailwindCSS | 4.1 | Utility-first styling |
| Framer Motion | 12 | Animations & transitions |
| dnd-kit | 6.3/10.0 | Drag-and-drop (Kanban) |
| Lucide React | 0.562 | Icon library |
| React Router DOM | 7.11 | Client-side routing |

### Backend (`server/`)
| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 4.21 | HTTP framework |
| DuckDB | 1.1 | Embedded OLAP database |
| JWT | 9.0 | Stateless authentication |
| bcryptjs | 2.4 | Password hashing |
| uuid | 10.0 | ID generation |
| Helmet | 7.1 | Security headers |
| express-rate-limit | 7.4 | Rate limiting |

## Architecture

### State Management
```
AuthContext ──────────────────────────────────────────
  ├── user        : User object (id, email)
  ├── company     : Company object (id, name, plan)
  ├── loading     : Boolean for auth state
  ├── signUp()    : Register + create company
  ├── signIn()    : Login with credentials
  ├── signOut()   : Clear session
  └── updateCompanyPlan() : Upgrade/downgrade plan

EmployeesContext ─────────────────────────────────────
  ├── employees   : Array of employee records
  ├── loading     : Boolean for fetch state
  ├── canAddEmployee()     : Check plan limits
  ├── addEmployee()        : Create new employee
  ├── updateEmployee()     : Edit employee details
  ├── updateEmployeeStage(): Move in pipeline
  ├── deleteEmployee()     : Remove employee
  ├── getEmployeesByStage(): Filter by stage
  └── getStats()           : Aggregate metrics
```

### Hiring Pipeline Stages
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   CAPTAÇÃO   │ →  │  ENTREVISTA  │ →  │   PROPOSTA   │ →  │    ATIVO     │
│  (Sourcing)  │    │ (Interview)  │    │  (Proposal)  │    │   (Hired)    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

### Database Schema (DuckDB)
```sql
users(id, email, password_hash, created_at, updated_at)
companies(id, name, owner_id, plan['free'|'pro'], created_at, updated_at)
employees(id, company_id, name, email, phone, position, department, stage, notes, created_at, updated_at)
talent_requests(id, company_id, form_data[JSON], status['pending'|'active'|'closed'], created_at, updated_at)
```

## Design System

**Factory.ai Industrial Theme** - Minimalist, high-contrast interface with tight typography.

```css
/* Typography */
Font: Geist / Geist Mono
Letter-spacing: -0.03em (tight tracking)
Base size: 112.5% (18px)

/* Colors */
Background: #EEEEEE (light) / #050505 (dark)
Accent: #F97316 (orange)
Text: #020202 / #EDEDED

/* Shapes */
Border radius: 2px (sharp corners)
```

**CSS Utility Classes:**
- `factory-panel` - Card/container style
- `factory-btn` / `factory-btn-primary` - Buttons
- `factory-input` - Form inputs
- `factory-badge` - Status badges
- `factory-icon-btn` - Icon buttons
- `stage-{captacao|entrevista|proposta|ativo}` - Pipeline colors

## File Structure

### Frontend
```
client/src/
├── App.jsx                 # Routes: ProtectedRoute, PublicRoute
├── main.jsx                # React DOM entry
├── index.css               # Design system tokens
├── components/
│   ├── Layout.jsx          # Sidebar + Outlet wrapper
│   └── Sidebar.jsx         # Navigation with Framer Motion
├── contexts/
│   ├── AuthContext.jsx     # Auth state & methods
│   └── EmployeesContext.jsx # Employee CRUD + stats
├── lib/
│   └── api.js              # Fetch wrapper, token handling
└── pages/
    ├── Auth.jsx            # Login/Register forms
    ├── Dashboard.jsx       # Analytics cards & metrics
    ├── Employees.jsx       # Kanban + List views
    ├── TalentRequest.jsx   # Multi-step form wizard
    ├── Settings.jsx        # Company/user settings
    └── Pricing.jsx         # Plan comparison
```

### Backend
```
server/src/
├── index.js                # Express app, middleware, routes
├── db/
│   ├── duckdb.js           # Database connection & helpers
│   └── schema.sql          # Table definitions
└── routes/
    ├── auth.js             # /api/auth/* endpoints
    ├── employees.js        # /api/employees/* CRUD
    └── talent-requests.js  # /api/talent-requests/*
```

## Common Patterns

### API Calls
```javascript
import { auth, employees, companies, talentRequests } from '../lib/api'

// All methods return { data, error }
const { data, error } = await employees.select()
await employees.insert({ name, position, stage: 'captacao' })
await employees.update(id, { stage: 'entrevista' })
await employees.delete(id)
```

### Protected Routes
```jsx
<ProtectedRoute>
  <Layout />  {/* Renders Outlet for nested routes */}
</ProtectedRoute>
```

### Employee Plan Limits
```javascript
const FREE_PLAN_LIMIT = 20

if (!canAddEmployee()) {
  throw new Error('Limite de funcionários atingido')
}
await addEmployee(data)
```

### Authentication Flow
```javascript
// Sign up creates user + company + JWT
const { data, error } = await auth.signUp({ email, password, options: { data: { company_name } } })

// JWT stored in localStorage
setToken(data.session.access_token)
```

## Development

```bash
# Frontend (port 5173)
cd client && npm install && npm run dev

# Backend (port 3001)
cd server && npm install && npm run dev
```

## Environment Variables

**Client** (`.env`):
```
VITE_API_URL=http://localhost:3001
```

**Server** (`.env`):
```
PORT=3001
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register + create company |
| POST | `/api/auth/signin` | Login, returns JWT |
| POST | `/api/auth/signout` | Logout (client-side token removal) |
| GET | `/api/auth/session` | Verify JWT, get user/company |
| PUT | `/api/auth/company/plan` | Update subscription plan |
| PUT | `/api/auth/company/name` | Update company name |
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/talent-requests` | List talent requests |
| POST | `/api/talent-requests` | Create request |
| PUT | `/api/talent-requests/:id` | Update request |
| DELETE | `/api/talent-requests/:id` | Delete request |
| GET | `/api/health` | Health check |

## Security

- **JWT Authentication**: 7-day expiration, stateless
- **Password Hashing**: bcrypt with auto-generated salt
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: CSP, XSS protection, HSTS headers
- **CORS**: Configured origin whitelist
- **Input Sanitization**: XSS prevention middleware
- **Body Size Limit**: 10kb max request body

## Code Conventions

| Aspect | Convention |
|--------|------------|
| Language | Portuguese for UI, English for code |
| Components | PascalCase, functional with hooks |
| Context hooks | `useAuth()`, `useEmployees()` |
| CSS | Utility-first with `factory-*` classes |
| Animations | Framer Motion |
| State | React Context (no Redux) |

## Plan Limits

| Feature | Free | Pro |
|---------|------|-----|
| Employees | 20 max | Unlimited |
| Dashboard | ✓ | ✓ |
| Kanban | ✓ | ✓ |
| Talent Requests | ✓ | ✓ |
| Advanced Reports | ✗ | ✓ |
