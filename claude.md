# DASH.rh - AI Assistant Context

## Project Overview

DASH.rh is a full-stack HR management dashboard for companies to track candidates through their hiring pipeline. The application follows a Factory.ai-inspired industrial design aesthetic.

## Tech Stack

### Frontend (client/)
- **React 19.2** with functional components and hooks
- **Vite 7.2** as the build tool
- **TailwindCSS 4.1** for styling
- **Framer Motion 12** for animations
- **dnd-kit** for drag-and-drop Kanban functionality
- **Lucide React** for icons
- **React Router DOM 7** for routing

### Backend (server/)
- **Express 4.21** on Node.js
- **DuckDB 1.1** embedded database (OLAP)
- **JWT** for stateless authentication
- **bcryptjs** for password hashing
- **uuid** for ID generation

## Architecture

### State Management
- `AuthContext` - User authentication and company data
- `EmployeesContext` - Employee CRUD operations and statistics

### Database Schema
- `users` - Authentication (email, password_hash)
- `companies` - Multi-tenant support (name, owner_id, plan)
- `employees` - Candidates/employees with hiring stages
- `talent_requests` - Job requisition forms

### Hiring Stages
Employees progress through: `captacao` → `entrevista` → `proposta` → `ativo`

## Design System

The UI follows Factory.ai's industrial minimalist aesthetic:

- **Typography**: Geist/Geist Mono fonts with tight letter-spacing (-0.03em)
- **Colors**: 
  - Background: `#EEEEEE` (light) / `#050505` (dark)
  - Accent: `#F97316` (orange)
  - Text: High contrast black/white
- **Border Radius**: 2px (sharp corners)
- **CSS Classes**: `factory-panel`, `factory-btn`, `factory-input`, `factory-badge`

## Key Files

### Frontend
- `client/src/App.jsx` - Routes and providers (ProtectedRoute, PublicRoute)
- `client/src/contexts/AuthContext.jsx` - Auth state (signIn, signUp, signOut)
- `client/src/contexts/EmployeesContext.jsx` - Employee operations
- `client/src/lib/api.js` - HTTP client wrapper
- `client/src/index.css` - Design system tokens and utilities
- `client/src/pages/Dashboard.jsx` - Main analytics dashboard
- `client/src/pages/Employees.jsx` - Kanban and list views
- `client/src/pages/TalentRequest.jsx` - Multi-step form wizard

### Backend
- `server/src/index.js` - Express server with middleware
- `server/src/db/duckdb.js` - Database connection and query helpers
- `server/src/db/schema.sql` - Table definitions
- `server/src/routes/auth.js` - Authentication endpoints
- `server/src/routes/employees.js` - Employee CRUD
- `server/src/routes/talent-requests.js` - Job requisitions

## Common Patterns

### API Calls
```javascript
import { auth, employees, companies } from '../lib/api'
const { data, error } = await employees.select()
```

### Protected Routes
```jsx
<ProtectedRoute>
  <Layout />
</ProtectedRoute>
```

### Adding Employees (with plan limits)
```javascript
if (!canAddEmployee()) {
  throw new Error('Limite de funcionários atingido')
}
await addEmployee({ name, position, stage: 'captacao' })
```

## Development Commands

```bash
# Frontend
cd client && npm run dev   # Dev server on :5173
cd client && npm run build # Production build

# Backend  
cd server && npm run dev   # Dev server on :3001 (with --watch)
cd server && npm start     # Production
```

## Environment Variables

### Client (.env)
- `VITE_API_URL` - Backend API URL

### Server (.env)
- `PORT` - Server port (default: 3001)
- `CLIENT_URL` - Frontend URL for CORS
- `JWT_SECRET` - Secret for JWT signing

## Code Conventions

- **Language**: Portuguese for UI text, English for code
- **Components**: PascalCase, functional with hooks
- **Context Hooks**: `useAuth()`, `useEmployees()`
- **CSS**: Utility-first with custom `factory-*` classes
- **Animations**: Framer Motion for transitions

## Plan Limits

- **Free**: Max 20 employees (`FREE_PLAN_LIMIT`)
- **Pro**: Unlimited employees
