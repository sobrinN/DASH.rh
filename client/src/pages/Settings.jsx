import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    User,
    Building2,
    Mail,
    Save,
    Loader2,
    CheckCircle,
    Crown,
    Settings as SettingsIcon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { companies } from '../lib/api'

const Settings = () => {
    const { user, company, refreshCompany } = useAuth()
    const [companyName, setCompanyName] = useState(company?.name || '')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSave = async () => {
        if (!companyName.trim()) return

        setLoading(true)
        try {
            const { error } = await companies.updateName(companyName)

            if (error) throw error

            await refreshCompany()
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            console.error('Error updating company:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto pt-12 lg:pt-0">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 border-b border-[#222] pb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#111] border border-[#333]">
                        <SettingsIcon size={24} className="text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-widest font-mono">
                        CONFIGURACAO_SISTEMA
                    </h1>
                </div>
                <p className="text-gray-500 text-xs font-mono">
                    GERENCIE PARAMETROS E PREFERENCIAS DO SISTEMA.
                </p>
            </motion.div>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="factory-panel p-6 lg:p-8 mb-6 relative"
            >
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <User size={60} className="text-white" />
                </div>

                <div className="flex items-center gap-3 mb-8 border-b border-[#222] pb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
                        PERFIL_USUARIO
                    </h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono">
                            EMAIL_REGISTRADO
                        </label>
                        <div className="flex items-center gap-3 p-4 bg-[#111] border border-[#333] group hover:border-gray-600 transition-colors">
                            <Mail size={16} className="text-orange-500" />
                            <span className="text-gray-300 font-mono text-sm">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Company Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="factory-panel p-6 lg:p-8 mb-6 relative"
            >
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Building2 size={60} className="text-white" />
                </div>

                <div className="flex items-center gap-3 mb-8 border-b border-[#222] pb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
                        DADOS_EMPRESA
                    </h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-mono">
                            NOME_ORGANIZACAO
                        </label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="factory-input"
                            placeholder="INSIRA NOME DA EMPRESA"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading || !companyName.trim()}
                        className="factory-btn factory-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : success ? (
                            <>
                                <CheckCircle size={16} />
                                ALTERACOES_SALVAS
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                SALVAR_CONFIGURACAO
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Plan Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="factory-panel p-6 lg:p-8 relative"
            >
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Crown size={60} className="text-white" />
                </div>

                <div className="flex items-center gap-3 mb-8 border-b border-[#222] pb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
                        STATUS_ASSINATURA
                    </h2>
                </div>

                <div className="p-6 bg-[#111] border border-[#333] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="font-bold text-white uppercase font-mono text-lg mb-1">
                            {company?.plan === 'pro' ? 'ACESSO_PLANO_PRO' : 'ACESSO_PLANO_GRATUITO'}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                            {company?.plan === 'pro'
                                ? 'CAPACIDADE ILIMITADA DE PESSOAL'
                                : 'CAPACIDADE LIMITADA A 20 UNIDADES'}
                        </p>
                    </div>
                    {company?.plan !== 'pro' && (
                        <a
                            href="/pricing"
                            className="px-6 py-3 bg-orange-500 text-black font-bold text-xs uppercase hover:bg-orange-400 transition-colors font-mono tracking-wider border border-orange-500"
                        >
                            ATUALIZAR_SISTEMA
                        </a>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default Settings
