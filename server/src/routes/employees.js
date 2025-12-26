import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { query, queryOne, execute } from '../db/duckdb.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dash-rh-secret-key-change-in-production'

/**
 * Middleware to verify JWT and attach user to request
 */
async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Não autorizado' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)

        // Fetch company for user
        const company = await queryOne(
            'SELECT * FROM companies WHERE owner_id = ?',
            [decoded.userId]
        )

        if (!company) {
            return res.status(401).json({ error: 'Empresa não encontrada' })
        }

        req.userId = decoded.userId
        req.company = company
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' })
    }
}

/**
 * Get all employees for user's company
 * GET /api/employees
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const employees = await query(
            `SELECT * FROM employees 
             WHERE company_id = ? 
             ORDER BY created_at DESC`,
            [req.company.id]
        )

        res.json({ data: employees, error: null })
    } catch (error) {
        console.error('Get employees error:', error)
        res.status(500).json({ error: 'Erro ao buscar funcionários' })
    }
})

/**
 * Create new employee
 * POST /api/employees
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, position, department, stage, notes } = req.body

        if (!name || !position) {
            return res.status(400).json({
                error: 'Nome e cargo são obrigatórios'
            })
        }

        // Check free plan limit
        if (req.company.plan === 'free') {
            const [countResult] = await query(
                'SELECT COUNT(*) as count FROM employees WHERE company_id = ?',
                [req.company.id]
            )

            if (countResult.count >= 20) {
                return res.status(403).json({
                    error: 'Limite de funcionários atingido. Faça upgrade para o plano Pro.'
                })
            }
        }

        const employeeId = uuidv4()
        await execute(
            `INSERT INTO employees 
             (id, company_id, name, email, phone, position, department, stage, notes, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                employeeId,
                req.company.id,
                name,
                email || null,
                phone || null,
                position,
                department || null,
                stage || 'captacao',
                notes || null
            ]
        )

        const employee = await queryOne(
            'SELECT * FROM employees WHERE id = ?',
            [employeeId]
        )

        res.status(201).json({ data: employee, error: null })
    } catch (error) {
        console.error('Create employee error:', error)
        res.status(500).json({ error: 'Erro ao criar funcionário' })
    }
})

/**
 * Update employee
 * PUT /api/employees/:id
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, phone, position, department, stage, notes } = req.body

        // Verify employee belongs to company
        const existing = await queryOne(
            'SELECT * FROM employees WHERE id = ? AND company_id = ?',
            [id, req.company.id]
        )

        if (!existing) {
            return res.status(404).json({ error: 'Funcionário não encontrado' })
        }

        await execute(
            `UPDATE employees SET
                name = COALESCE(?, name),
                email = ?,
                phone = ?,
                position = COALESCE(?, position),
                department = ?,
                stage = COALESCE(?, stage),
                notes = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND company_id = ?`,
            [
                name,
                email !== undefined ? email : existing.email,
                phone !== undefined ? phone : existing.phone,
                position,
                department !== undefined ? department : existing.department,
                stage,
                notes !== undefined ? notes : existing.notes,
                id,
                req.company.id
            ]
        )

        const employee = await queryOne(
            'SELECT * FROM employees WHERE id = ?',
            [id]
        )

        res.json({ data: employee, error: null })
    } catch (error) {
        console.error('Update employee error:', error)
        res.status(500).json({ error: 'Erro ao atualizar funcionário' })
    }
})

/**
 * Delete employee
 * DELETE /api/employees/:id
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        // Verify employee belongs to company
        const existing = await queryOne(
            'SELECT * FROM employees WHERE id = ? AND company_id = ?',
            [id, req.company.id]
        )

        if (!existing) {
            return res.status(404).json({ error: 'Funcionário não encontrado' })
        }

        await execute(
            'DELETE FROM employees WHERE id = ? AND company_id = ?',
            [id, req.company.id]
        )

        res.json({ error: null })
    } catch (error) {
        console.error('Delete employee error:', error)
        res.status(500).json({ error: 'Erro ao excluir funcionário' })
    }
})

export default router
