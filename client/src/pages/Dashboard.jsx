import { motion } from 'framer-motion'
import {
    Users,
    UserSearch,
    MessageSquare,
    FileCheck,
    UserCheck,
    TrendingUp,
    Clock,
    Target,
    HardHat
} from 'lucide-react'
import { useEmployees } from '../contexts/EmployeesContext'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
    const { getStats, employees, loading } = useEmployees()
    const { company } = useAuth()
    const stats = getStats()

    const statCards = [
        {
            label: 'Total',
            value: stats.total,
            icon: Users,
            color: 'text-[var(--color-text-primary)]',
            borderColor: 'border-[var(--color-text-tertiary)]'
        },
        {
            label: 'Captação',
            value: stats.captacao,
            icon: UserSearch,
            color: 'text-[var(--color-text-secondary)]',
            borderColor: 'border-[var(--color-text-tertiary)]'
        },
        {
            label: 'Entrevista',
            value: stats.entrevista,
            icon: MessageSquare,
            color: 'text-[var(--color-status-waiting)]',
            borderColor: 'border-[var(--color-status-waiting)]'
        },
        {
            label: 'Proposta',
            value: stats.proposta,
            icon: FileCheck,
            color: 'text-[var(--color-accent-primary)]',
            borderColor: 'border-[var(--color-accent-primary)]'
        },
        {
            label: 'Ativo',
            value: stats.ativo,
            icon: UserCheck,
            color: 'text-[var(--color-status-success)]',
            borderColor: 'border-[var(--color-status-success)]'
        },
    ]

    const recentEmployees = employees.slice(0, 5)

    // Calculate conversion metrics
    const conversionRate = stats.total > 0
        ? Math.round((stats.ativo / stats.total) * 100)
        : 0

    const inPipeline = stats.captacao + stats.entrevista + stats.proposta

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="spinner text-[var(--color-accent-primary)]" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 border-b border-[var(--color-border-subtle)] pb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[var(--color-bg-panel)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)]">
                        <HardHat size={24} className="text-[var(--color-accent-primary)]" />
                    </div>
                    <h1 className="text-2xl font-medium text-[var(--color-text-primary)] tracking-tight uppercase font-mono">
                        Central_Comando
                    </h1>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-status-success)]">●</span>
                    <span>STATUS_SISTEMA: OPERACIONAL</span>
                    <span className="mx-2 text-[var(--color-border-subtle)]">|</span>
                    <span>ORG: <span className="text-[var(--color-accent-primary)] uppercase">{company?.name}</span></span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`factory-panel p-5 relative overflow-hidden group hover:border-[var(--color-border-strong)] transition-colors bg-[var(--color-bg-panel)]`}
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                            <stat.icon size={48} className={stat.color} />
                        </div>
                        <p className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-widest font-mono mb-2">{stat.label}</p>
                        <p className="text-3xl font-medium text-[var(--color-text-primary)] font-mono tracking-tight">{stat.value}</p>

                        <div className={`mt-4 h-0.5 w-full bg-[var(--color-bg-surface)]`}>
                            <div className={`h-full ${stat.borderColor.replace('border-', 'bg-')} w-full opacity-50`}></div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Metrics Row */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="factory-panel p-6 bg-[var(--color-bg-panel)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">TAXA_CONVERSAO</p>
                        <TrendingUp size={16} className="text-[var(--color-accent-primary)]" />
                    </div>
                    <p className="text-4xl font-medium text-[var(--color-text-primary)] font-mono mb-4 tracking-tight">{conversionRate}%</p>
                    <div className="h-1 bg-[var(--color-bg-surface)] w-full rounded-sm overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${conversionRate}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-[var(--color-accent-primary)]"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="factory-panel p-6 bg-[var(--color-bg-panel)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">PIPELINE_ATIVO</p>
                        <Clock size={16} className="text-[var(--color-status-waiting)]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-4xl font-medium text-[var(--color-text-primary)] font-mono tracking-tight">{inPipeline}</p>
                        <span className="text-xs text-[var(--color-text-secondary)] font-mono mb-2">CANDIDATOS</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="factory-panel p-6 bg-[var(--color-bg-panel)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest font-mono">TOTAL_CONTRATADOS</p>
                        <Target size={16} className="text-[var(--color-status-success)]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-4xl font-medium text-[var(--color-text-primary)] font-mono tracking-tight">{stats.ativo}</p>
                        <span className="text-xs text-[var(--color-text-secondary)] font-mono mb-2">FUNCIONARIOS</span>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="factory-panel p-6 bg-[var(--color-bg-panel)]"
            >
                <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border-subtle)] pb-4">
                    <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-widest font-mono">
                        LOG_ATIVIDADE_RECENTE
                    </h2>
                    <span className="text-xs text-[var(--color-text-secondary)] font-mono">TEMPO_REAL</span>
                </div>

                {recentEmployees.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--color-border-subtle)] rounded-[var(--radius-sm)]">
                        <Users size={32} className="mx-auto text-[var(--color-text-tertiary)] mb-3" />
                        <p className="text-[var(--color-text-secondary)] font-mono text-sm">SEM_DADOS_DISPONIVEIS</p>
                    </div>
                ) : (
                    <div className="space-y-px bg-[var(--color-border-subtle)]">
                        {recentEmployees.map((employee, index) => (
                            <motion.div
                                key={employee.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-panel)] transition-colors group border-l-2 border-transparent hover:border-[var(--color-accent-primary)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-[var(--color-bg-panel)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-mono text-xs font-bold">
                                        {employee.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--color-text-primary)] font-mono text-sm">{employee.name}</p>
                                        <p className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase">{employee.position}</p>
                                    </div>
                                </div>
                                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-[var(--radius-sm)] ${employee.stage === 'ativo' ? 'text-[var(--color-status-success)] bg-green-500/10' :
                                    employee.stage === 'proposta' ? 'text-[var(--color-accent-primary)] bg-orange-500/10' :
                                        'text-[var(--color-text-secondary)] bg-[var(--color-bg-base)]'
                                    }`}>
                                    {employee.stage}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default Dashboard
