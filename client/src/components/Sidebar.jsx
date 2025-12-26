import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Crown,
    Menu,
    X,
    HardHat,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useEmployees } from '../contexts/EmployeesContext'
import { useState } from 'react'

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
    { path: '/employees', icon: Users, label: 'Funcionários' },
    { path: '/talent-request', icon: FileText, label: 'Solicitação de Talento' },
    { path: '/settings', icon: Settings, label: 'Configurações' },
]

const SidebarContent = ({ company, isPro, employeeCount, FREE_PLAN_LIMIT, navigate, handleSignOut, setMobileOpen }) => (
    <div className="flex flex-col h-full bg-[var(--color-bg-panel)] text-[var(--color-text-primary)]">
        {/* Logo */}
        <div className="p-6 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-[var(--color-text-primary)] rounded-[var(--radius-sm)]">
                    <HardHat size={16} className="text-[var(--color-text-inverse)]" strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-xl font-medium tracking-tight leading-none">
                        DASH<span className="text-[var(--color-accent-primary)]">.rh</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 bg-[var(--color-status-success)] rounded-full"></div>
                        <span className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase tracking-wider">Sistema Online</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Company Info */}
        <div className="px-6 py-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
            <p className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase mb-1">Org Atual</p>
            <p className="font-medium text-[var(--color-text-primary)] truncate text-sm mb-3">{company?.name || '...'}</p>

            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono border border-[var(--color-border-strong)] px-1.5 py-0.5 rounded-[var(--radius-sm)] ${isPro ? 'bg-[var(--color-accent-primary)] text-white border-transparent' : 'bg-transparent text-[var(--color-text-secondary)]'}`}>
                    {isPro ? 'PLANO_PRO' : 'PLANO_GRATUITO'}
                </span>
                <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">
                    {isPro ? 'ILIMITADO' : `${employeeCount}/${FREE_PLAN_LIMIT}`} NET
                </span>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-200 border border-transparent rounded-[var(--radius-sm)] ${isActive
                            ? 'bg-[var(--color-bg-base)] text-[var(--color-text-primary)] font-medium border-[var(--color-border-subtle)]'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]'
                        }`
                    }
                >
                    <item.icon size={18} strokeWidth={1.5} />
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>

        {/* Upgrade Banner (Free Plan) */}
        {!isPro && (
            <div className="mx-4 mb-6 p-4 rounded-[var(--radius-sm)] border border-[var(--color-border-accent)] bg-[var(--color-accent-subtle)]">
                <div className="flex items-center gap-2 mb-2 text-[var(--color-accent-primary)]">
                    <Crown size={16} />
                    <span className="font-medium uppercase text-xs tracking-wider">Upgrade Pro</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-3 leading-relaxed">
                    Acesso ilimitado e recursos exclusivos.
                </p>
                <button
                    onClick={() => navigate('/pricing')}
                    className="w-full py-2 text-xs font-medium uppercase rounded-[var(--radius-sm)] bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                    Ver Planos
                </button>
            </div>
        )}

        {/* Sign Out */}
        <div className="p-4 border-t border-[var(--color-border-subtle)]">
            <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-status-alert)] hover:bg-[var(--color-bg-base)] rounded-[var(--radius-sm)] text-sm transition-colors"
            >
                <LogOut size={18} strokeWidth={1.5} />
                <span>Encerrar Sessão</span>
            </button>
        </div>
    </div>
)

const Sidebar = () => {
    const { company, signOut } = useAuth()
    const { getEmployeeCount, FREE_PLAN_LIMIT } = useEmployees()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        navigate('/auth')
    }

    const employeeCount = getEmployeeCount()
    const isPro = company?.plan === 'pro'

    const sidebarProps = {
        company,
        isPro,
        employeeCount,
        FREE_PLAN_LIMIT,
        navigate,
        handleSignOut,
        setMobileOpen
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-[var(--radius-sm)] bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] lg:hidden shadow-sm"
            >
                {mobileOpen ? <X size={20} className="text-[var(--color-text-primary)]" /> : <Menu size={20} className="text-[var(--color-text-primary)]" />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 w-[280px] h-screen bg-[var(--color-bg-panel)] border-r border-[var(--color-border-subtle)] z-40 lg:hidden transform transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <SidebarContent {...sidebarProps} />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col sticky top-0 h-screen w-[260px] border-r border-[var(--color-border-subtle)] shadow-[1px_0_0_0_rgba(0,0,0,0.02)] flex-shrink-0">
                <SidebarContent {...sidebarProps} />
            </aside>
        </>
    )
}

export default Sidebar
