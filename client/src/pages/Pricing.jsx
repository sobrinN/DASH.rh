import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Check,
    Crown,
    Users,
    Shield,
    Zap,
    Star,
    Loader2,
    HardHat
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const plans = [
    {
        id: 'free',
        name: 'Gratuito',
        price: 'R$ 0',
        period: '/mês',
        description: 'Perfeito para pequenas empresas começando',
        features: [
            { text: 'Até 20 funcionários', included: true },
            { text: 'Painel completo', included: true },
            { text: 'Formulário de Solicitação', included: true },
            { text: 'Kanban de etapas', included: true },
            { text: 'Suporte por e-mail', included: true },
            { text: 'Funcionários ilimitados', included: false },
            { text: 'Relatórios avançados', included: false },
            { text: 'Integrações', included: false },
        ],
        icon: Users,
        color: 'from-gray-600 to-gray-700',
        borderColor: 'border-gray-600',
        buttonText: 'Plano Atual',
        disabled: true
    },
    {
        id: 'pro',
        name: 'PRO',
        price: 'R$ 99',
        period: '/mês',
        description: 'Para empresas em crescimento',
        features: [
            { text: 'Funcionários ilimitados', included: true },
            { text: 'Painel completo', included: true },
            { text: 'Formulário de Solicitação', included: true },
            { text: 'Kanban de etapas', included: true },
            { text: 'Suporte prioritário', included: true },
            { text: 'Relatórios avançados', included: true },
            { text: 'Exportação de dados', included: true },
            { text: 'Integrações futuras', included: true },
        ],
        icon: Crown,
        color: 'from-orange-500 to-orange-600',
        borderColor: 'border-orange-500',
        buttonText: 'Fazer Upgrade',
        popular: true
    }
]

const Pricing = () => {
    const { company, updateCompanyPlan } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async (planId) => {
        if (planId === 'free' || company?.plan === planId) return

        setLoading(true)
        try {
            // In a real app, this would integrate with a payment provider
            await updateCompanyPlan(planId)
            alert('Plano atualizado com sucesso! Em produção, você seria redirecionado para o checkout.')
        } catch (err) {
            console.error('Error upgrading plan:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto pt-12 lg:pt-0">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 font-mono">
                    <Zap size={12} />
                    ATUALIZACAO_DISPONIVEL
                </span>
                <h1 className="text-3xl font-bold text-white uppercase tracking-[0.2em] mb-4 font-mono">
                    PLANOS_<span className="text-orange-500 underline decoration-2 decoration-orange-500 underline-offset-8">ASSINATURA</span>
                </h1>
                <p className="text-gray-500 max-w-xl mx-auto font-mono text-xs">
                    SELECIONE O NÍVEL DE CAPACIDADE. ARQUITETURA ESCALÁVEL.
                </p>
            </motion.div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto relative">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent -z-10 hidden md:block"></div>

                {plans.map((plan, index) => {
                    const isCurrentPlan = company?.plan === plan.id
                    const Icon = plan.icon

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative factory-panel p-8 ${plan.popular ? `border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.1)]` : ''
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 bg-orange-500 text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 font-mono border border-orange-400">
                                        <Star size={10} fill="black" />
                                        RECOMENDADO
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="flex items-center gap-4 mb-8 border-b border-[#222] pb-6">
                                <div className={`w-12 h-12 flex items-center justify-center border ${plan.id === 'pro' ? 'bg-[#111] border-orange-500 text-orange-500' : 'bg-[#111] border-[#333] text-gray-500'
                                    }`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase font-mono tracking-widest">{plan.name}</h3>
                                    <p className="text-[10px] text-gray-500 font-mono uppercase">{plan.description}</p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <span className="text-4xl font-bold text-white font-mono tracking-tighter">{plan.price}</span>
                                <span className="text-gray-600 font-mono text-sm uppercase">{plan.period}</span>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className={`w-4 h-4 flex items-center justify-center border ${feature.included
                                            ? 'bg-green-900/10 border-green-900/50 text-green-500'
                                            : 'bg-red-900/5 border-red-900/20 text-red-900/50'
                                            }`}>
                                            {feature.included ? <Check size={10} /> : <div className="w-1 h-1 bg-red-900/50 rounded-full" />}
                                        </div>
                                        <span className={`text-[10px] uppercase font-mono tracking-wide ${feature.included ? 'text-gray-300' : 'text-gray-700 decoration-line-through'}`}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={isCurrentPlan || loading || plan.id === 'free'}
                                className={`w-full py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 font-mono border ${isCurrentPlan
                                    ? 'bg-[#111] text-gray-600 border-[#222] cursor-not-allowed'
                                    : plan.popular
                                        ? 'bg-orange-500 text-black border-orange-500 hover:bg-orange-400 hover:border-orange-400'
                                        : 'bg-[#0f0f0f] text-gray-400 border-[#333] hover:border-gray-500 hover:text-white'
                                    }`}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : isCurrentPlan ? (
                                    <>
                                        <Check size={14} />
                                        STATUS_ATUAL_ATIVO
                                    </>
                                ) : (
                                    <>
                                        {plan.popular && <Crown size={14} />}
                                        {plan.id === 'free' ? 'PLANO_ATUAL' : 'INICIAR_UPGRADE'}
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )
                })}
            </div>

            {/* Guarantee */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 text-center"
            >
                <div className="factory-panel p-6 max-w-xl mx-auto border-t border-t-green-500/30">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Shield size={18} className="text-green-500" />
                        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">PROTOCOLO_GARANTIA_SATISFACAO</h3>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wide">
                        14 DIAS TESTE // 100% REEMBOLSO // SEM PERGUNTAS
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Pricing
