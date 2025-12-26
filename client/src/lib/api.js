/**
 * API Client for DASH.rh
 * Replaces Supabase client with fetch-based API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Token storage key
const TOKEN_KEY = 'dash_rh_token'

/**
 * Get stored auth token
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

/**
 * Store auth token
 */
export function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token)
    } else {
        localStorage.removeItem(TOKEN_KEY)
    }
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken()

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    return { data, response, ok: response.ok }
}

/**
 * Auth API
 */
export const auth = {
    /**
     * Sign up new user with company
     */
    async signUp({ email, password, options }) {
        const companyName = options?.data?.company_name || 'Minha Empresa'

        const { data, ok } = await apiRequest('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, companyName })
        })

        if (ok && data.data?.session?.access_token) {
            setToken(data.data.session.access_token)
        }

        return data
    },

    /**
     * Sign in with email and password
     */
    async signInWithPassword({ email, password }) {
        const { data, ok } = await apiRequest('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })

        if (ok && data.data?.session?.access_token) {
            setToken(data.data.session.access_token)
        }

        return data
    },

    /**
     * Get current session
     */
    async getSession() {
        const token = getToken()

        if (!token) {
            return { data: { session: null }, error: null }
        }

        const { data } = await apiRequest('/api/auth/session')

        // If session is invalid, clear token
        if (!data.data?.session) {
            setToken(null)
        }

        return data
    },

    /**
     * Sign out
     */
    async signOut() {
        await apiRequest('/api/auth/signout', { method: 'POST' })
        setToken(null)
        return { error: null }
    },

    /**
     * Subscribe to auth state changes
     * Note: This is a simplified version - client should poll or use websockets for real-time
     */
    onAuthStateChange(callback) {
        // Initial check
        this.getSession().then(result => {
            const user = result.data?.session?.user || null
            callback('INITIAL_SESSION', { user })
        })

        // Return mock subscription object
        return {
            data: {
                subscription: {
                    unsubscribe: () => { }
                }
            }
        }
    }
}

/**
 * Database-like API for employees
 */
export const employees = {
    /**
     * Get all employees
     */
    async select() {
        const { data } = await apiRequest('/api/employees')
        return { data: data.data || [], error: data.error }
    },

    /**
     * Create employee
     */
    async insert(employee) {
        const { data } = await apiRequest('/api/employees', {
            method: 'POST',
            body: JSON.stringify(employee)
        })
        return { data: data.data, error: data.error }
    },

    /**
     * Update employee
     */
    async update(id, updates) {
        const { data } = await apiRequest(`/api/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        })
        return { data: data.data, error: data.error }
    },

    /**
     * Delete employee
     */
    async delete(id) {
        const { data } = await apiRequest(`/api/employees/${id}`, {
            method: 'DELETE'
        })
        return { error: data.error }
    }
}

/**
 * Database-like API for companies
 */
export const companies = {
    /**
     * Get company by owner
     */
    async getByOwner(userId) {
        // Company is returned with session
        const { data } = await apiRequest('/api/auth/session')
        return { data: data.data?.company, error: data.error }
    },

    /**
     * Update company name
     */
    async updateName(name) {
        const { data } = await apiRequest('/api/auth/company/name', {
            method: 'PUT',
            body: JSON.stringify({ name })
        })
        return { data: data.data, error: data.error }
    },

    /**
     * Update company plan
     */
    async updatePlan(plan) {
        const { data } = await apiRequest('/api/auth/company/plan', {
            method: 'PUT',
            body: JSON.stringify({ plan })
        })
        return { data: data.data, error: data.error }
    }
}

/**
 * Database-like API for talent requests
 */
export const talentRequests = {
    /**
     * Get all talent requests
     */
    async select() {
        const { data } = await apiRequest('/api/talent-requests')
        return { data: data.data || [], error: data.error }
    },

    /**
     * Create talent request
     */
    async insert(request) {
        const { data } = await apiRequest('/api/talent-requests', {
            method: 'POST',
            body: JSON.stringify({
                form_data: request.form_data,
                status: request.status || 'pending'
            })
        })
        return { data: data.data, error: data.error }
    },

    /**
     * Update talent request
     */
    async update(id, updates) {
        const { data } = await apiRequest(`/api/talent-requests/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        })
        return { data: data.data, error: data.error }
    },

    /**
     * Delete talent request
     */
    async delete(id) {
        const { data } = await apiRequest(`/api/talent-requests/${id}`, {
            method: 'DELETE'
        })
        return { error: data.error }
    }
}

// Default export for backwards compatibility
export default {
    auth,
    employees,
    companies,
    talentRequests,
    getToken,
    setToken
}
