import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Building2,
    Briefcase,
    Target,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Send,
    AlertCircle,
    Loader2,
    FileText,
    ClipboardList
} from 'lucide-react'
import { talentRequests } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const STEPS = [
    { id: 1, title: 'Identificação', icon: User, description: 'Dados do solicitante' },
    { id: 2, title: 'Vaga', icon: Briefcase, description: 'Detalhes da posição' },
    { id: 3, title: 'Perfil', icon: Target, description: 'Perfil do candidato' },
    { id: 4, title: 'Responsabilidades', icon: ClipboardList, description: 'Atividades e metas' },
]

const PRAZOS = ['Imediato', '15 Dias', '30 Dias']
const MOTIVOS = ['Novo cargo', 'Substituição de colaborador', 'Aumento da equipe']
const LOCAIS = ['Escritório', 'Obra', 'Ambos', 'Outro']
const REGIMES = ['CLT', 'Estágio', 'Temporário', 'Terceirizado', 'Outro']

const TalentRequest = () => {
    const { company } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        // Step 1 - Identificação
        email: '',
        nomeCompleto: '',
        cargo: '',
        setorObra: '',
        dataSolicitacao: new Date().toISOString().split('T')[0],
        prazo: '',

        // Step 2 - Vaga
        tituloVaga: '',
        motivoContratacao: '',
        localTrabalho: '',
        localTrabalhoOutro: '',
        regimeTrabalho: '',
        regimeTrabalhoOutro: '',
        beneficios: '',

        // Step 3 - Perfil
        faixaIdade: '',
        habilidadesTecnicas: '',
        atitudesComportamentos: '',
        caracteristicasPessoais: '',

        // Step 4 - Responsabilidades
        atividadesResponsabilidades: '',
        metasIndicadores: '',
        exigeTestePratico: '',
        habilidadesTestadas: '',
        observacoes: ''
    })

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return formData.email && formData.nomeCompleto && formData.cargo &&
                    formData.setorObra && formData.prazo
            case 2:
                return formData.tituloVaga && formData.motivoContratacao &&
                    formData.localTrabalho && formData.regimeTrabalho && formData.beneficios
            case 3:
                return formData.faixaIdade && formData.habilidadesTecnicas &&
                    formData.atitudesComportamentos && formData.caracteristicasPessoais
            case 4:
                return formData.atividadesResponsabilidades && formData.metasIndicadores &&
                    formData.exigeTestePratico
            default:
                return true
        }
    }

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            setError('Por favor, preencha todos os campos obrigatórios.')
            return
        }
        setError('')
        setCurrentStep(prev => Math.min(prev + 1, 4))
    }

    const handlePrev = () => {
        setError('')
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep(4)) {
            setError('Por favor, preencha todos os campos obrigatórios.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const { error: dbError } = await talentRequests.insert({
                form_data: formData,
                status: 'pending'
            })

            if (dbError) throw dbError

            setSuccess(true)
        } catch (err) {
            console.error('Error submitting form:', err)
            setError('Erro ao enviar solicitação. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            email: '',
            nomeCompleto: '',
            cargo: '',
            setorObra: '',
            dataSolicitacao: new Date().toISOString().split('T')[0],
            prazo: '',
            tituloVaga: '',
            motivoContratacao: '',
            localTrabalho: '',
            localTrabalhoOutro: '',
            regimeTrabalho: '',
            regimeTrabalhoOutro: '',
            beneficios: '',
            faixaIdade: '',
            habilidadesTecnicas: '',
            atitudesComportamentos: '',
            caracteristicasPessoais: '',
            atividadesResponsabilidades: '',
            metasIndicadores: '',
            exigeTestePratico: '',
            habilidadesTestadas: '',
            observacoes: ''
        })
        setCurrentStep(1)
        setSuccess(false)
        setError('')
    }

    if (success) {
        return (
            <div className="max-w-3xl mx-auto pt-12 lg:pt-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="factory-panel p-12 text-center border-t-2 border-t-green-500 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <CheckCircle2 size={120} className="text-green-500/10" />
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 mx-auto mb-8 bg-[#111] border border-green-500/50 flex items-center justify-center relative z-10"
                    >
                        <CheckCircle2 size={40} className="text-green-500" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-mono mb-4">
                        SOLICITACAO_PROCESSADA_COM_SUCESSO
                    </h2>

                    <div className="w-16 h-1 bg-green-500 mx-auto mb-6"></div>

                    <p className="text-gray-400 mb-8 max-w-md mx-auto font-mono text-xs leading-relaxed">
                        PACOTE DE DADOS TRANSMITIDO AO MAINFRAME RH.
                        A ANÁLISE DOS PARÂMETROS COMEÇARÁ EM BREVE.
                    </p>

                    <div className="inline-block p-4 border border-green-500/20 bg-green-900/10 mb-8">
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-[0.2em]">
                            STATUS_MISSAO: CONCLUIDO
                        </p>
                    </div>

                    <br />

                    <button
                        onClick={resetForm}
                        className="factory-btn factory-btn-primary"
                    >
                        INICIAR_NOVA_SOLICITACAO
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pt-12 lg:pt-0">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 border-b border-[#222] pb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#111] border border-[#333]">
                        <FileText size={24} className="text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-widest font-mono">
                        REQUISICAO_PESSOAL
                    </h1>
                </div>
                <p className="text-gray-500 text-xs font-mono">
                    INICIE UM NOVO PROTOCOLO DE AQUISIÇÃO DE TALENTOS. TODOS OS CAMPOS SÃO OBRIGATÓRIOS EXCETO SE INDICADO.
                </p>
            </motion.div>

            {/* Progress Steps */}
            <div className="mb-10">
                <div className="flex items-center justify-between relative">
                    {/* Connecting Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-[#333] -z-10" />

                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center bg-[#050505] px-2">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className={`relative w-10 h-10 flex items-center justify-center border transition-all duration-300 ${currentStep >= step.id
                                    ? 'bg-orange-500 border-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                                    : 'bg-[#111] border-[#333] text-gray-600'
                                    }`}
                            >
                                <step.icon size={18} />
                                {currentStep === step.id && (
                                    <div className="absolute -inset-1 border border-orange-500/30 animate-pulse"></div>
                                )}
                            </motion.div>
                            <span className={`mt-3 text-[10px] font-bold uppercase tracking-widest font-mono hidden sm:block ${currentStep >= step.id ? 'text-orange-500' : 'text-gray-600'
                                }`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 border border-red-900/50 bg-red-900/10 text-red-500 font-mono text-xs flex items-center gap-3"
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="factory-panel p-6 lg:p-10 border-t-2 border-t-orange-500 relative"
            >
                {/* Tech decorations */}
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1 h-1 bg-orange-500/50"></div>
                    <div className="w-1 h-1 bg-orange-500/30"></div>
                    <div className="w-1 h-1 bg-orange-500/10"></div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1 - Identificação */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-8 border-b border-[#222] pb-4">
                                <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-1">
                                    ETAPA_01 // IDENTIFICACAO_SOLICITANTE
                                </h2>
                                <p className="text-[10px] text-gray-500 font-mono">
                                    IDENTIFIQUE A ORIGEM DA SOLICITACAO E ZONA DE IMPLANTACAO.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">EMAIL_CONTATO *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className="factory-input"
                                        placeholder="USUARIO@ORG.COM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">NOME_COMPLETO *</label>
                                    <input
                                        type="text"
                                        value={formData.nomeCompleto}
                                        onChange={(e) => updateField('nomeCompleto', e.target.value)}
                                        className="factory-input"
                                        placeholder="NOME SOBRENOME"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">CARGO_ATUAL *</label>
                                    <input
                                        type="text"
                                        value={formData.cargo}
                                        onChange={(e) => updateField('cargo', e.target.value)}
                                        className="factory-input"
                                        placeholder="GERENTE DE PROJETO"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">DEPARTAMENTO / LOCAL *</label>
                                    <input
                                        type="text"
                                        value={formData.setorObra}
                                        onChange={(e) => updateField('setorObra', e.target.value)}
                                        className="factory-input"
                                        placeholder="SECAO A / SEDE"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">DATA_SOLICITACAO *</label>
                                    <input
                                        type="date"
                                        value={formData.dataSolicitacao}
                                        onChange={(e) => updateField('dataSolicitacao', e.target.value)}
                                        className="factory-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">NIVEL_PRIORIDADE *</label>
                                    <div className="flex gap-2">
                                        {PRAZOS.map((prazo) => (
                                            <button
                                                key={prazo}
                                                type="button"
                                                onClick={() => updateField('prazo', prazo)}
                                                className={`flex-1 py-3 text-[10px] font-bold uppercase transition-all font-mono border ${formData.prazo === prazo
                                                    ? 'bg-orange-500 text-black border-orange-500'
                                                    : 'bg-[#111] text-gray-500 border-[#333] hover:border-gray-500'
                                                    }`}
                                            >
                                                {prazo}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2 - Vaga */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-8 border-b border-[#222] pb-4">
                                <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-1">
                                    ETAPA_02 // ESPECIFICACAO_CARGO
                                </h2>
                                <p className="text-[10px] text-gray-500 font-mono">
                                    DEFINA OS PARAMETROS OPERACIONAIS PARA A NOVA UNIDADE.
                                </p>
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">TITULO_CARGO *</label>
                                <input
                                    type="text"
                                    value={formData.tituloVaga}
                                    onChange={(e) => updateField('tituloVaga', e.target.value)}
                                    className="factory-input"
                                    placeholder="TECNICO SENIOR"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">MOTIVO_REQUISICAO *</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    {MOTIVOS.map((motivo) => (
                                        <button
                                            key={motivo}
                                            type="button"
                                            onClick={() => updateField('motivoContratacao', motivo)}
                                            className={`py-3 px-4 text-[10px] font-bold uppercase transition-all font-mono border ${formData.motivoContratacao === motivo
                                                ? 'bg-orange-500 text-black border-orange-500'
                                                : 'bg-[#111] text-gray-500 border-[#333] hover:border-gray-500'
                                                }`}
                                        >
                                            {motivo}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">LOCAL_TRABALHO *</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {LOCAIS.map((local) => (
                                            <button
                                                key={local}
                                                type="button"
                                                onClick={() => updateField('localTrabalho', local)}
                                                className={`py-2 text-[10px] font-bold uppercase transition-all font-mono border ${formData.localTrabalho === local
                                                    ? 'bg-orange-500 text-black border-orange-500'
                                                    : 'bg-[#111] text-gray-500 border-[#333] hover:border-gray-500'
                                                    }`}
                                            >
                                                {local}
                                            </button>
                                        ))}
                                    </div>
                                    {formData.localTrabalho === 'Outro' && (
                                        <input
                                            type="text"
                                            value={formData.localTrabalhoOutro}
                                            onChange={(e) => updateField('localTrabalhoOutro', e.target.value)}
                                            className="factory-input mt-2"
                                            placeholder="ESPECIFIQUE O LOCAL..."
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">TIPO_CONTRATO *</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {REGIMES.slice(0, 4).map((regime) => (
                                            <button
                                                key={regime}
                                                type="button"
                                                onClick={() => updateField('regimeTrabalho', regime)}
                                                className={`py-2 text-[10px] font-bold uppercase transition-all font-mono border ${formData.regimeTrabalho === regime
                                                    ? 'bg-orange-500 text-black border-orange-500'
                                                    : 'bg-[#111] text-gray-500 border-[#333] hover:border-gray-500'
                                                    }`}
                                            >
                                                {regime}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">PACOTE_BENEFICIOS *</label>
                                <textarea
                                    value={formData.beneficios}
                                    onChange={(e) => updateField('beneficios', e.target.value)}
                                    className="factory-input resize-none h-24"
                                    placeholder="LISTE BENEFICIOS E VALORES..."
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3 - Perfil */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-8 border-b border-[#222] pb-4">
                                <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-1">
                                    ETAPA_03 // PERFIL_CANDIDATO
                                </h2>
                                <p className="text-[10px] text-gray-500 font-mono">
                                    DEFINA AS ESPECIFICACOES E VETORES DE ATITUDE REQUERIDOS.
                                </p>
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">FAIXA_ETARIA *</label>
                                <input
                                    type="text"
                                    value={formData.faixaIdade}
                                    onChange={(e) => updateField('faixaIdade', e.target.value)}
                                    className="factory-input"
                                    placeholder="EX. 25-35 ANOS"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">HABILIDADES_TECNICAS *</label>
                                <textarea
                                    value={formData.habilidadesTecnicas}
                                    onChange={(e) => updateField('habilidadesTecnicas', e.target.value)}
                                    className="factory-input resize-none h-24"
                                    placeholder="HABILIDADES TECNICAS NECESSARIAS..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">VETORES_COMPORTAMENTAIS *</label>
                                <textarea
                                    value={formData.atitudesComportamentos}
                                    onChange={(e) => updateField('atitudesComportamentos', e.target.value)}
                                    className="factory-input resize-none h-24"
                                    placeholder="ATITUDE ESPERADA..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">CARACTERISTICAS_PESSOAIS *</label>
                                <textarea
                                    value={formData.caracteristicasPessoais}
                                    onChange={(e) => updateField('caracteristicasPessoais', e.target.value)}
                                    className="factory-input resize-none h-24"
                                    placeholder="TIPO DE PERSONALIDADE..."
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4 - Responsabilidades */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-8 border-b border-[#222] pb-4">
                                <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-1">
                                    ETAPA_04 // RESPONSABILIDADES
                                </h2>
                                <p className="text-[10px] text-gray-500 font-mono">
                                    DEFINA AS TAREFAS PRINCIPAIS E METRICAS DE DESEMPENHO.
                                </p>
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">TAREFAS_PRINCIPAIS *</label>
                                <textarea
                                    value={formData.atividadesResponsabilidades}
                                    onChange={(e) => updateField('atividadesResponsabilidades', e.target.value)}
                                    className="factory-input resize-none h-24"
                                    placeholder="LISTE AS FUNCOES PRINCIPAIS..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">METRICAS_SUCESSO *</label>
                                <textarea
                                    value={formData.metasIndicadores}
                                    onChange={(e) => updateField('metasIndicadores', e.target.value)}
                                    className="factory-input resize-none h-24"
                                    placeholder="KPIs / METAS..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">EXIGE_TESTE_PRATICO? *</label>
                                <div className="flex gap-4">
                                    {['Sim', 'Não'].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => updateField('exigeTestePratico', opt)}
                                            className={`flex-1 py-3 text-[10px] font-bold uppercase transition-all font-mono border ${formData.exigeTestePratico === opt
                                                ? 'bg-orange-500 text-black border-orange-500'
                                                : 'bg-[#111] text-gray-500 border-[#333] hover:border-gray-500'
                                                }`}
                                        >
                                            {opt === 'Sim' ? 'SIM' : 'NAO'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.exigeTestePratico === 'Sim' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1 mt-4">PARAMETROS_TESTE</label>
                                    <textarea
                                        value={formData.habilidadesTestadas}
                                        onChange={(e) => updateField('habilidadesTestadas', e.target.value)}
                                        className="factory-input resize-none h-20"
                                        placeholder="DEFINA O ESCOPO DO TESTE..."
                                    />
                                </motion.div>
                            )}

                            <div>
                                <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">DADOS_ADICIONAIS</label>
                                <textarea
                                    value={formData.observacoes}
                                    onChange={(e) => updateField('observacoes', e.target.value)}
                                    className="factory-input resize-none h-24"
                                    placeholder="OUTROS DETALHES..."
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-[#222]">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-6 py-3 font-bold uppercase transition-all font-mono text-xs border ${currentStep === 1
                            ? 'bg-[#111] text-gray-700 border-[#222] cursor-not-allowed'
                            : 'bg-[#111] text-gray-300 border-[#333] hover:border-gray-500'
                            }`}
                    >
                        <ChevronLeft size={16} />
                        VOLTAR
                    </button>

                    {currentStep < 4 ? (
                        <button
                            onClick={handleNext}
                            className="factory-btn factory-btn-primary flex items-center gap-2"
                        >
                            PROXIMA_ETAPA
                            <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="factory-btn factory-btn-primary flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                <>
                                    ENVIAR_SOLICITACAO
                                    <Send size={16} />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default TalentRequest
