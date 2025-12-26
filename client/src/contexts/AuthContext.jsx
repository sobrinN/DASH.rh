import { createContext, useContext, useState, useEffect } from 'react'
import { auth, companies, getToken } from '../lib/api'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            try {
                const result = await auth.getSession()
                const session = result.data?.session

                setUser(session?.user ?? null)

                if (session?.user) {
                    // Company is included in session response
                    setCompany(result.data?.company ?? null)
                }
            } catch (error) {
                console.error('Error getting session:', error)
            } finally {
                setLoading(false)
            }
        }

        getSession()
    }, [])

    const fetchCompany = async () => {
        try {
            const result = await auth.getSession()
            setCompany(result.data?.company ?? null)
        } catch (error) {
            console.error('Error fetching company:', error)
        }
    }

    const signUp = async (email, password, companyName) => {
        try {
            const result = await auth.signUp({
                email,
                password,
                options: {
                    data: {
                        company_name: companyName
                    }
                }
            })

            if (result.error) throw result.error

            // Set user and company from response
            setUser(result.data?.user ?? null)
            setCompany(result.data?.company ?? null)

            return { data: result.data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    const signIn = async (email, password) => {
        try {
            const result = await auth.signInWithPassword({
                email,
                password,
            })

            if (result.error) throw result.error

            // Set user and company from response
            setUser(result.data?.user ?? null)
            setCompany(result.data?.company ?? null)

            return { data: result.data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    const signOut = async () => {
        const result = await auth.signOut()
        if (result.error) throw result.error
        setUser(null)
        setCompany(null)
    }

    const updateCompanyPlan = async (plan) => {
        if (!company) return

        try {
            const result = await companies.updatePlan(plan)

            if (result.error) throw result.error

            setCompany(prev => ({ ...prev, plan }))
        } catch (error) {
            console.error('Error updating plan:', error)
        }
    }

    const value = {
        user,
        company,
        loading,
        signUp,
        signIn,
        signOut,
        updateCompanyPlan,
        refreshCompany: fetchCompany
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
