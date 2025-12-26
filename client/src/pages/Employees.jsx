import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Search,
    Grid3X3,
    List,
    UserPlus,
    X,
    Mail,
    Phone,
    Edit,
    Trash2,
    ChevronRight,
    AlertCircle,
    Users,
    HardHat
} from 'lucide-react'
import { useEmployees, STAGES } from '../contexts/EmployeesContext'
import { useAuth } from '../contexts/AuthContext'

const EmployeeCard = ({ employee, onEdit, onDelete, onStageChange }) => {
    const [showActions, setShowActions] = useState(false)

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`factory-panel p-4 relative group border-l-2`}
            style={{ borderLeftColor: STAGES[employee.stage]?.color || '#333' }}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#111] border border-[#333]">
                        <span className="text-gray-400 font-bold font-mono text-xs">
                            {employee.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-200 font-mono text-sm leading-tight">{employee.name}</h3>
                        <p className="text-[10px] text-gray-500 font-mono uppercase">{employee.position}</p>
                    </div>
                </div>
                {/* Actions overlay */}
                <div className={`flex gap-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={() => onEdit(employee)}
                        className="p-1.5 bg-[#222] hover:bg-orange-500 hover:text-black text-gray-400 transition-colors"
                    >
                        <Edit size={12} />
                    </button>
                    <button
                        onClick={() => onDelete(employee.id)}
                        className="p-1.5 bg-[#222] hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            {employee.email && (
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mb-1 truncate">
                    <Mail size={10} />
                    <span className="truncate">{employee.email}</span>
                </div>
            )}

            {employee.phone && (
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <Phone size={10} />
                    <span>{employee.phone}</span>
                </div>
            )}

            {/* Stage Change Buttons - Matrix Style */}
            <div className="grid grid-cols-4 gap-px bg-[#222] mt-4 border border-[#222]">
                {Object.keys(STAGES).map((stage) => (
                    <button
                        key={stage}
                        disabled={employee.stage === stage}
                        onClick={() => onStageChange(employee.id, stage)}
                        className={`py-1 text-[8px] font-bold uppercase transition-all font-mono ${employee.stage === stage
                            ? 'bg-orange-500 text-black cursor-default'
                            : 'bg-[#0a0a0a] text-gray-600 hover:bg-[#111] hover:text-gray-400'
                            }`}
                        title={STAGES[stage].label}
                    >
                        {stage.slice(0, 3)}
                    </button>
                ))}
            </div>
        </motion.div>
    )
}

const AddEmployeeModal = ({ isOpen, onClose, onAdd, editEmployee }) => {
    const [formData, setFormData] = useState(
        editEmployee || {
            name: '',
            email: '',
            phone: '',
            position: '',
            department: '',
            notes: '',
            stage: 'captacao'
        }
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await onAdd(formData)
            onClose()
            setFormData({
                name: '',
                email: '',
                phone: '',
                position: '',
                department: '',
                notes: '',
                stage: 'captacao'
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg factory-panel p-6 border-orange-500/20 shadow-2xl shadow-orange-500/5"
            >
                <div className="flex items-center justify-between mb-6 border-b border-[#222] pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-orange-500 text-black">
                            <UserPlus size={16} />
                        </div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
                            {editEmployee ? 'EDITAR_FICHA_PESSOAL' : 'NOVA_ENTRADA_PESSOAL'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:text-orange-500 transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 border border-red-900/50 bg-red-900/10 text-red-500 font-mono text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">NOME_COMPLETO *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                            className="factory-input"
                            placeholder="NOME SOBRENOME"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">EMAIL_CONTATO</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="factory-input"
                                placeholder="USUARIO@ORG.COM"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">TELEFONE</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className="factory-input"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">CARGO *</label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                required
                                className="factory-input"
                                placeholder="ENGENHEIRO SENIOR"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">DEPARTAMENTO</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                className="factory-input"
                                placeholder="ENGENHARIA"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">ETAPA_PIPELINE</label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(STAGES).map(([key, { label }]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, stage: key }))}
                                    className={`py-2 px-2 text-[10px] font-bold uppercase transition-all font-mono border ${formData.stage === key
                                        ? 'bg-orange-500 text-black border-orange-500'
                                        : 'bg-[#0a0a0a] text-gray-500 border-[#333] hover:border-gray-500'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">NOTAS_ADICIONAIS</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            className="factory-input resize-none h-20"
                            placeholder="Digite aqui..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[#222]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-[#111] hover:bg-[#222] text-gray-400 font-mono text-xs font-bold uppercase transition-colors border border-[#333]"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 factory-btn factory-btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    {editEmployee ? 'SALVAR_ALTERACOES' : 'ADICIONAR_ENTRADA'}
                                    <ChevronRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

const Employees = () => {
    const {
        employees,
        loading,
        addEmployee,
        updateEmployee,
        updateEmployeeStage,
        deleteEmployee,
        canAddEmployee,
        getRemainingSlots,
    } = useEmployees()
    const { company } = useAuth()

    const [showModal, setShowModal] = useState(false)
    const [editEmployee, setEditEmployee] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState('kanban')
    const [showLimitWarning, setShowLimitWarning] = useState(false)

    const handleAdd = async (data) => {
        if (editEmployee) {
            await updateEmployee(editEmployee.id, data)
        } else {
            await addEmployee(data)
        }
        setEditEmployee(null)
    }

    const handleEdit = (employee) => {
        setEditEmployee(employee)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (confirm('CONFIRMAR EXCLUSÃO? Esta ação não pode ser desfeita.')) {
            await deleteEmployee(id)
        }
    }

    const openAddModal = () => {
        if (!canAddEmployee()) {
            setShowLimitWarning(true)
            return
        }
        setEditEmployee(null)
        setShowModal(true)
    }

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const remainingSlots = getRemainingSlots()
    const isPro = company?.plan === 'pro'

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#222] pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#111] border border-[#333]">
                            <Users size={20} className="text-orange-500" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-widest uppercase font-mono">
                            DIRETORIO_PESSOAL
                        </h1>
                    </div>
                    <p className="text-gray-500 text-xs font-mono">
                        {isPro ? (
                            'ASSINATURA: PLANO_PRO [ILIMITADO]'
                        ) : (
                            `ASSINATURA: PLANO_GRATUITO [${remainingSlots} VAGAS RESTANTES]`
                        )}
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="factory-btn factory-btn-primary"
                >
                    <Plus size={16} />
                    NOVA_ENTRADA
                </button>
            </div>

            {/* Limit Warning Modal */}
            <AnimatePresence>
                {showLimitWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowLimitWarning(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md factory-panel p-6 text-center border-orange-500"
                        >
                            <h2 className="text-lg font-bold text-white uppercase font-mono mb-2">CAPACIDADE_ATINGIDA</h2>
                            <p className="text-gray-500 font-mono text-sm mb-6">
                                LIMITE DO SISTEMA ATINGIDO (20/20). ATUALIZE PARA PLANO_PRO PARA CAPACIDADE EXPANDIDA.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLimitWarning(false)}
                                    className="flex-1 py-3 bg-[#111] text-gray-400 font-mono text-xs font-bold uppercase border border-[#333] hover:bg-[#222]"
                                >
                                    DISPENSAR
                                </button>
                                <button
                                    onClick={() => {
                                        setShowLimitWarning(false)
                                        window.location.href = '/pricing'
                                    }}
                                    className="flex-1 factory-btn factory-btn-primary"
                                >
                                    ATUALIZAR_AGORA
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="PESQUISAR_BANCO..."
                        className="factory-input pl-12 uppercase placeholder:text-gray-700"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`p-3 transition-colors border ${viewMode === 'kanban'
                            ? 'bg-orange-500 text-black border-orange-500'
                            : 'bg-[#111] text-gray-500 border-[#333] hover:text-white'
                            }`}
                    >
                        <Grid3X3 size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-3 transition-colors border ${viewMode === 'list'
                            ? 'bg-orange-500 text-black border-orange-500'
                            : 'bg-[#111] text-gray-500 border-[#333] hover:text-white'
                            }`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Kanban View */}
            {viewMode === 'kanban' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(STAGES).map(([stage, { label, color }]) => {
                        const stageEmployees = filteredEmployees.filter(e => e.stage === stage)
                        return (
                            <div key={stage} className="bg-[#0f0f0f] border-t-2 p-4 min-h-[500px]" style={{ borderTopColor: color || '#333' }}>
                                <div className="flex items-center justify-between mb-6 border-b border-[#222] pb-2">
                                    <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px] font-mono">{label}</h3>
                                    <span className="text-[10px] font-mono text-gray-600">
                                        [{stageEmployees.length}]
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {stageEmployees.map((employee) => (
                                            <EmployeeCard
                                                key={employee.id}
                                                employee={employee}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                onStageChange={updateEmployeeStage}
                                            />
                                        ))}
                                    </AnimatePresence>
                                    {stageEmployees.length === 0 && (
                                        <div className="py-8 text-center text-gray-700 text-[10px] font-mono border border-dashed border-[#222]">
                                            SEM_ENTRADAS
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="factory-panel overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#222] bg-[#111]">
                                    <th className="text-left p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">IDENTIDADE</th>
                                    <th className="text-left p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">CARGO</th>
                                    <th className="text-left p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">CONTATO</th>
                                    <th className="text-left p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">STATUS</th>
                                    <th className="text-right p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">ACOES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredEmployees.map((employee) => (
                                        <motion.tr
                                            key={employee.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="border-b border-[#222] hover:bg-[#111] transition-colors group"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 flex items-center justify-center bg-[#111] border border-[#333]">
                                                        <span className="text-gray-400 font-bold font-mono text-xs">
                                                            {employee.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-gray-200 font-mono text-sm">{employee.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400 font-mono text-xs uppercase">{employee.position}</td>
                                            <td className="p-4 text-gray-500 font-mono text-xs text-lowercase">{employee.email || '-'}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 text-[10px] font-bold uppercase font-mono bg-[#111] border border-[#333] text-gray-400">
                                                    {STAGES[employee.stage]?.label}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(employee)}
                                                        className="p-1.5 hover:bg-orange-500 hover:text-black text-gray-500 transition-colors"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(employee.id)}
                                                        className="p-1.5 hover:bg-red-500 hover:text-white text-gray-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <AddEmployeeModal
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false)
                            setEditEmployee(null)
                        }}
                        onAdd={handleAdd}
                        editEmployee={editEmployee}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default Employees
