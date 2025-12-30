import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { query, queryOne, execute } from '../db/duckdb.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

/**
 * Get all talent requests for user's company
 * GET /api/talent-requests
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const requests = await query(
            `SELECT * FROM talent_requests 
             WHERE company_id = ? 
             ORDER BY created_at DESC`,
            [req.company.id]
        )

        res.json({ data: requests, error: null })
    } catch (error) {
        console.error('Get talent requests error:', error)
        res.status(500).json({ error: 'Erro ao buscar solicitações' })
    }
})

/**
 * Create new talent request
 * POST /api/talent-requests
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { form_data, status } = req.body

        if (!form_data) {
            return res.status(400).json({
                error: 'Dados do formulário são obrigatórios'
            })
        }

        const requestId = uuidv4()
        await execute(
            `INSERT INTO talent_requests 
             (id, company_id, form_data, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                requestId,
                req.company.id,
                JSON.stringify(form_data),
                status || 'pending'
            ]
        )

        const request = await queryOne(
            'SELECT * FROM talent_requests WHERE id = ?',
            [requestId]
        )

        res.status(201).json({ data: request, error: null })
    } catch (error) {
        console.error('Create talent request error:', error)
        res.status(500).json({ error: 'Erro ao criar solicitação' })
    }
})

/**
 * Update talent request status
 * PUT /api/talent-requests/:id
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        // Verify request belongs to company
        const existing = await queryOne(
            'SELECT * FROM talent_requests WHERE id = ? AND company_id = ?',
            [id, req.company.id]
        )

        if (!existing) {
            return res.status(404).json({ error: 'Solicitação não encontrada' })
        }

        if (status && !['pending', 'active', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido' })
        }

        await execute(
            `UPDATE talent_requests SET
                status = COALESCE(?, status),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND company_id = ?`,
            [status, id, req.company.id]
        )

        const request = await queryOne(
            'SELECT * FROM talent_requests WHERE id = ?',
            [id]
        )

        res.json({ data: request, error: null })
    } catch (error) {
        console.error('Update talent request error:', error)
        res.status(500).json({ error: 'Erro ao atualizar solicitação' })
    }
})

/**
 * Delete talent request
 * DELETE /api/talent-requests/:id
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        // Verify request belongs to company
        const existing = await queryOne(
            'SELECT * FROM talent_requests WHERE id = ? AND company_id = ?',
            [id, req.company.id]
        )

        if (!existing) {
            return res.status(404).json({ error: 'Solicitação não encontrada' })
        }

        await execute(
            'DELETE FROM talent_requests WHERE id = ? AND company_id = ?',
            [id, req.company.id]
        )

        res.json({ error: null })
    } catch (error) {
        console.error('Delete talent request error:', error)
        res.status(500).json({ error: 'Erro ao excluir solicitação' })
    }
})

export default router
