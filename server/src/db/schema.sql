-- =====================================================
-- DASH.rh - DuckDB Database Schema
-- =====================================================

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    owner_id VARCHAR NOT NULL REFERENCES users(id),
    plan VARCHAR NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR PRIMARY KEY,
    company_id VARCHAR NOT NULL REFERENCES companies(id),
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone VARCHAR,
    position VARCHAR NOT NULL,
    department VARCHAR,
    stage VARCHAR NOT NULL DEFAULT 'captacao' CHECK (stage IN ('captacao', 'entrevista', 'proposta', 'ativo')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Talent requests table
CREATE TABLE IF NOT EXISTS talent_requests (
    id VARCHAR PRIMARY KEY,
    company_id VARCHAR NOT NULL REFERENCES companies(id),
    form_data JSON NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_stage ON employees(stage);
CREATE INDEX IF NOT EXISTS idx_talent_requests_company ON talent_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_talent_requests_status ON talent_requests(status);
