import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { query, queryOne, execute } from '../db/duckdb.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dash-rh-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

/**
 * Sign up - Create new user and company
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
    try {
        const { email, password, companyName } = req.body

        if (!email || !password || !companyName) {
            return res.status(400).json({
                error: 'Email, senha e nome da empresa são obrigatórios'
            })
        }

        // Check if user already exists
        const existingUser = await queryOne(
            'SELECT id FROM users WHERE email = ?',
            [email.toLowerCase()]
        )

        if (existingUser) {
            return res.status(409).json({
                error: 'Este email já está cadastrado'
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        // Create user
        const userId = uuidv4()
        await execute(
            `INSERT INTO users (id, email, password_hash, created_at, updated_at) 
             VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [userId, email.toLowerCase(), passwordHash]
        )

        // Create company
        const companyId = uuidv4()
        await execute(
            `INSERT INTO companies (id, name, owner_id, plan, created_at, updated_at) 
             VALUES (?, ?, ?, 'free', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [companyId, companyName, userId]
        )

        // Create JWT token
        const token = jwt.sign(
            { userId, email: email.toLowerCase() },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        // Fetch created company
        const company = await queryOne(
            'SELECT * FROM companies WHERE id = ?',
            [companyId]
        )

        res.status(201).json({
            data: {
                user: { id: userId, email: email.toLowerCase() },
                company,
                session: { access_token: token }
            },
            error: null
        })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({
            data: null,
            error: { message: 'Erro ao criar conta. Tente novamente.' }
        })
    }
})

/**
 * Sign in - Authenticate user
 * POST /api/auth/signin
 */
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email e senha são obrigatórios'
            })
        }

        // Find user
        const user = await queryOne(
            'SELECT * FROM users WHERE email = ?',
            [email.toLowerCase()]
        )

        if (!user) {
            return res.status(401).json({
                data: null,
                error: { message: 'Email ou senha incorretos' }
            })
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash)

        if (!validPassword) {
            return res.status(401).json({
                data: null,
                error: { message: 'Email ou senha incorretos' }
            })
        }

        // Find company
        const company = await queryOne(
            'SELECT * FROM companies WHERE owner_id = ?',
            [user.id]
        )

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        res.json({
            data: {
                user: { id: user.id, email: user.email },
                company,
                session: { access_token: token }
            },
            error: null
        })
    } catch (error) {
        console.error('Signin error:', error)
        res.status(500).json({
            data: null,
            error: { message: 'Erro ao fazer login. Tente novamente.' }
        })
    }
})

/**
 * Get session - Verify JWT and return user data
 * GET /api/auth/session
 */
router.get('/session', async (req, res) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({
                data: { session: null },
                error: null
            })
        }

        const token = authHeader.split(' ')[1]

        try {
            const decoded = jwt.verify(token, JWT_SECRET)

            // Fetch user
            const user = await queryOne(
                'SELECT id, email, created_at FROM users WHERE id = ?',
                [decoded.userId]
            )

            if (!user) {
                return res.json({
                    data: { session: null },
                    error: null
                })
            }

            // Fetch company
            const company = await queryOne(
                'SELECT * FROM companies WHERE owner_id = ?',
                [user.id]
            )

            res.json({
                data: {
                    session: {
                        user: { id: user.id, email: user.email },
                        access_token: token
                    },
                    company
                },
                error: null
            })
        } catch (jwtError) {
            // Invalid token
            res.json({
                data: { session: null },
                error: null
            })
        }
    } catch (error) {
        console.error('Session error:', error)
        res.status(500).json({
            data: null,
            error: { message: 'Erro ao verificar sessão' }
        })
    }
})

/**
 * Sign out - Client handles token removal
 * POST /api/auth/signout
 */
router.post('/signout', (req, res) => {
    // JWT is stateless - client removes token
    res.json({ error: null })
})

/**
 * Update company plan
 * PUT /api/auth/company/plan
 */
router.put('/company/plan', async (req, res) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Não autorizado' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)

        const { plan } = req.body

        if (!plan || !['free', 'pro'].includes(plan)) {
            return res.status(400).json({ error: 'Plano inválido' })
        }

        await execute(
            `UPDATE companies SET plan = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE owner_id = ?`,
            [plan, decoded.userId]
        )

        const company = await queryOne(
            'SELECT * FROM companies WHERE owner_id = ?',
            [decoded.userId]
        )

        res.json({ data: company, error: null })
    } catch (error) {
        console.error('Update plan error:', error)
        res.status(500).json({ error: 'Erro ao atualizar plano' })
    }
})

/**
 * Update company name
 * PUT /api/auth/company/name
 */
router.put('/company/name', async (req, res) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Não autorizado' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET)

        const { name } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Nome da empresa é obrigatório' })
        }

        await execute(
            `UPDATE companies SET name = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE owner_id = ?`,
            [name.trim(), decoded.userId]
        )

        const company = await queryOne(
            'SELECT * FROM companies WHERE owner_id = ?',
            [decoded.userId]
        )

        res.json({ data: company, error: null })
    } catch (error) {
        console.error('Update company name error:', error)
        res.status(500).json({ error: 'Erro ao atualizar nome da empresa' })
    }
})

export default router
