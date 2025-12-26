import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Building2, Eye, EyeOff, ArrowRight, Loader2, HardHat } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            if (isLogin) {
                const { error } = await signIn(email, password)
                if (error) throw error
                navigate('/dashboard')
            } else {
                if (!companyName.trim()) {
                    throw new Error('Nome da empresa é obrigatório')
                }
                const { error } = await signUp(email, password, companyName)
                if (error) throw error
                setSuccess('Conta criada com sucesso! Verifique seu e-mail para confirmar.')
                setIsLogin(true)
            }
        } catch (err) {
            // Translate common Supabase errors
            let errorMessage = err.message
            if (err.message?.includes('Invalid login credentials')) {
                errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.'
            } else if (err.message?.includes('Email not confirmed')) {
                errorMessage = 'E-mail não confirmado. Verifique sua caixa de entrada.'
            } else if (err.message?.includes('User already registered')) {
                errorMessage = 'Este e-mail já está cadastrado.'
            } else if (err.message?.includes('Password should be')) {
                errorMessage = 'A senha deve ter no mínimo 6 caracteres.'
            } else if (err.message?.includes('sending confirmation')) {
                errorMessage = 'Erro ao enviar e-mail de confirmação. Tente novamente.'
            }
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[var(--color-bg-base)] relative overflow-hidden">
            {/* Tech Grid Background */}
            <div className="absolute inset-0 pointer-events-none tech-grid opacity-100"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md z-10"
            >
                {/* System Status Header */}
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center gap-3 mb-6"
                    >
                        <div className="p-3 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)]">
                            <HardHat size={32} className="text-[var(--color-accent-primary)]" strokeWidth={1.5} />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-medium tracking-tight text-[var(--color-text-primary)] leading-none">
                                DASH<span className="text-[var(--color-accent-primary)]">.OS</span>
                            </h1>
                            <p className="text-[10px] text-[var(--color-text-secondary)] font-mono tracking-widest uppercase mt-1">
                                SISTEMA_RH_V2.0
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Main Auth Panel */}
                <div className="factory-panel p-8 auth-flicker-border bg-[var(--color-bg-panel)] shadow-sm">
                    <div className="flex items-center justify-between mb-8 border-b border-[var(--color-border-subtle)] pb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[var(--color-status-success)] rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono text-[var(--color-text-secondary)] tracking-widest uppercase">Acesso_Sistema</span>
                        </div>
                        <span className="text-xs font-mono text-[var(--color-text-tertiary)] uppercase">Conexao_Segura</span>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-8 border-b border-[var(--color-border-subtle)]">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 pb-3 text-xs font-mono font-bold uppercase tracking-widest transition-all ${isLogin
                                ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
                                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] border-b-2 border-transparent'
                                }`}
                        >
                            ENTRAR
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 pb-3 text-xs font-mono font-bold uppercase tracking-widest transition-all ${!isLogin
                                ? 'text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
                                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] border-b-2 border-transparent'
                                }`}
                        >
                            REGISTRAR
                        </button>
                    </div>

                    {/* Feedback Messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-3 border border-[var(--color-status-alert)] bg-red-50 dark:bg-red-900/10 text-[var(--color-status-alert)] font-mono text-xs rounded-[var(--radius-sm)]"
                            >
                                <span className="font-bold mr-2">[ERRO]:</span>
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-3 border border-[var(--color-status-success)] bg-green-50 dark:bg-green-900/10 text-[var(--color-status-success)] font-mono text-xs rounded-[var(--radius-sm)]"
                            >
                                <span className="font-bold mr-2">[SUCESSO]:</span>
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence>
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <label className="block text-[10px] text-[var(--color-text-secondary)] font-mono uppercase mb-2 ml-1">
                                        NOME_ORGANIZACAO
                                    </label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-3 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={16} />
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="factory-input !pl-12"
                                            placeholder="INSIRA_NOME_ORG..."
                                            autoComplete="off"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-[10px] text-[var(--color-text-secondary)] font-mono uppercase mb-2 ml-1">
                                EMAIL_USUARIO
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="factory-input !pl-12"
                                    placeholder="USUARIO@DOMINIO.COM"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] text-[var(--color-text-secondary)] font-mono uppercase mb-2 ml-1">
                                CHAVE_ACESSO
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-accent-primary)] transition-colors" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="factory-input !pl-12 pr-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="factory-btn factory-btn-primary w-full mt-8 justify-between group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <>
                                    <span>{isLogin ? 'INICIAR_SESSAO' : 'REGISTRAR_PERFIL'}</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-[var(--color-text-tertiary)] font-mono">ACESSO_TERMINAL_SEGURO_V2.1</p>
                </div>
            </motion.div>
        </div>
    )
}

export default Auth
