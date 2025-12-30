import jwt from 'jsonwebtoken'
import { queryOne } from '../db/duckdb.js'

// Fail-fast if JWT_SECRET is not set
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable must be set')
}

export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES_IN = '7d'

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Minimum password length
 */
export const MIN_PASSWORD_LENGTH = 8

/**
 * Validate email format
 */
export function isValidEmail(email) {
    return EMAIL_REGEX.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password) {
    return password && password.length >= MIN_PASSWORD_LENGTH
}

/**
 * Middleware to verify JWT and attach user/company to request
 */
export async function authMiddleware(req, res, next) {
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

export default {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    EMAIL_REGEX,
    MIN_PASSWORD_LENGTH,
    isValidEmail,
    isValidPassword,
    authMiddleware
}
