import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { employees as employeesApi } from '../lib/api'
import { useAuth } from './AuthContext'

const EmployeesContext = createContext({})

export const useEmployees = () => {
    const context = useContext(EmployeesContext)
    if (!context) {
        throw new Error('useEmployees must be used within EmployeesProvider')
    }
    return context
}

export const STAGES = {
    captacao: { label: 'Captação', color: 'neutral' },
    entrevista: { label: 'Entrevista', color: 'info' },
    proposta: { label: 'Proposta', color: 'warning' },
    ativo: { label: 'Ativo', color: 'success' }
}

const FREE_PLAN_LIMIT = 20

export const EmployeesProvider = ({ children }) => {
    const { company } = useAuth()
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchEmployees = useCallback(async () => {
        if (!company) {
            setEmployees([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const { data, error } = await employeesApi.select()

            if (error) throw error

            setEmployees(data || [])
        } catch (err) {
            console.error('Error fetching employees:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [company])

    useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const canAddEmployee = () => {
        if (!company) return false
        if (company.plan === 'pro') return true
        return employees.length < FREE_PLAN_LIMIT
    }

    const getEmployeeCount = () => employees.length

    const getRemainingSlots = () => {
        if (!company) return 0
        if (company.plan === 'pro') return Infinity
        return Math.max(0, FREE_PLAN_LIMIT - employees.length)
    }

    const addEmployee = async (employeeData) => {
        if (!company) throw new Error('No company found')
        if (!canAddEmployee()) {
            throw new Error('Limite de funcionários atingido. Faça upgrade para o plano Pro.')
        }

        try {
            const { data, error } = await employeesApi.insert({
                ...employeeData,
                stage: employeeData.stage || 'captacao'
            })

            if (error) throw error

            setEmployees(prev => [data, ...prev])
            return data
        } catch (err) {
            console.error('Error adding employee:', err)
            throw err
        }
    }

    const updateEmployee = async (id, updates) => {
        try {
            const { data, error } = await employeesApi.update(id, updates)

            if (error) throw error

            setEmployees(prev =>
                prev.map(emp => (emp.id === id ? data : emp))
            )
            return data
        } catch (err) {
            console.error('Error updating employee:', err)
            throw err
        }
    }

    const updateEmployeeStage = async (id, newStage) => {
        return updateEmployee(id, { stage: newStage })
    }

    const deleteEmployee = async (id) => {
        try {
            const { error } = await employeesApi.delete(id)

            if (error) throw error

            setEmployees(prev => prev.filter(emp => emp.id !== id))
        } catch (err) {
            console.error('Error deleting employee:', err)
            throw err
        }
    }

    const getEmployeesByStage = (stage) => {
        return employees.filter(emp => emp.stage === stage)
    }

    const getStats = () => {
        const stats = {
            total: employees.length,
            captacao: 0,
            entrevista: 0,
            proposta: 0,
            ativo: 0
        }

        employees.forEach(emp => {
            if (stats[emp.stage] !== undefined) {
                stats[emp.stage]++
            }
        })

        return stats
    }

    const value = {
        employees,
        loading,
        error,
        canAddEmployee,
        getEmployeeCount,
        getRemainingSlots,
        addEmployee,
        updateEmployee,
        updateEmployeeStage,
        deleteEmployee,
        getEmployeesByStage,
        getStats,
        refreshEmployees: fetchEmployees,
        STAGES,
        FREE_PLAN_LIMIT
    }

    return (
        <EmployeesContext.Provider value={value}>
            {children}
        </EmployeesContext.Provider>
    )
}
