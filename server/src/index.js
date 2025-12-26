import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { initDatabase, closeDatabase } from './db/duckdb.js'
import authRoutes from './routes/auth.js'
import employeesRoutes from './routes/employees.js'
import talentRequestsRoutes from './routes/talent-requests.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}))

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Muitas requisições. Tente novamente em alguns minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(limiter)

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parser
app.use(express.json({ limit: '10kb' })) // Limit body size

// Request sanitization middleware
app.use((req, res, next) => {
    // Remove any potential XSS from request body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                // Basic XSS prevention
                req.body[key] = req.body[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+=/gi, '')
            }
        })
    }
    next()
})

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'duckdb'
    })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/employees', employeesRoutes)
app.use('/api/talent-requests', talentRequestsRoutes)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' })
})

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err)
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
})

// Initialize database and start server
async function startServer() {
    try {
        await initDatabase()

        app.listen(PORT, () => {
            console.log(`🚀 DASH.rh Server running on port ${PORT}`)
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
            console.log(`🦆 Using DuckDB as database`)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...')
    closeDatabase()
    process.exit(0)
})

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down...')
    closeDatabase()
    process.exit(0)
})

startServer()

export default app
