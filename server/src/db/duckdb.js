import duckdb from 'duckdb'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Database file path
const DATA_DIR = join(__dirname, '../../data')
const DB_PATH = join(DATA_DIR, 'dash_rh.duckdb')

let db = null
let connection = null

/**
 * Execute a single statement and wait for completion
 */
function runStatement(conn, sql) {
    return new Promise((resolve, reject) => {
        conn.run(sql, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

/**
 * Initialize DuckDB connection and schema
 */
export async function initDatabase() {
    try {
        // Ensure data directory exists
        if (!existsSync(DATA_DIR)) {
            mkdirSync(DATA_DIR, { recursive: true })
        }

        // Create database instance (creates file if doesn't exist)
        db = new duckdb.Database(DB_PATH)
        connection = db.connect()

        // Read and execute schema
        const schemaPath = join(__dirname, 'schema.sql')
        const schema = readFileSync(schemaPath, 'utf-8')

        // Remove comments and split into statements
        const statements = schema
            .replace(/--.*$/gm, '') // Remove single-line comments
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0)

        // Execute each statement sequentially
        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`)
            await runStatement(connection, statement + ';')
        }

        console.log('✅ DuckDB initialized successfully')
    } catch (error) {
        console.error('❌ Failed to initialize DuckDB:', error)
        throw error
    }
}

/**
 * Get the database connection
 */
export function getConnection() {
    if (!connection) {
        throw new Error('Database not initialized. Call initDatabase() first.')
    }
    return connection
}

/**
 * Execute a query and return all results
 */
export function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        const conn = getConnection()
        conn.all(sql, ...params, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result || [])
            }
        })
    })
}

/**
 * Execute a query and return a single row
 */
export function queryOne(sql, params = []) {
    return new Promise((resolve, reject) => {
        const conn = getConnection()
        conn.all(sql, ...params, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result?.[0] || null)
            }
        })
    })
}

/**
 * Execute a statement (INSERT, UPDATE, DELETE)
 */
export function execute(sql, params = []) {
    return new Promise((resolve, reject) => {
        const conn = getConnection()
        conn.run(sql, ...params, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve({ success: true })
            }
        })
    })
}

/**
 * Close the database connection
 */
export function closeDatabase() {
    if (connection) {
        connection.close()
        connection = null
    }
    if (db) {
        db.close()
        db = null
    }
    console.log('🔒 DuckDB connection closed')
}

export default {
    initDatabase,
    getConnection,
    query,
    queryOne,
    execute,
    closeDatabase
}
