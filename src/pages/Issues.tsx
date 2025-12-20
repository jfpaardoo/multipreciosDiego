import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Incidencia, PedidoCliente, TipoIncidencia } from '../types';
import { Button } from '../components/ui/button';
import { AlertCircle, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Issues() {
    const { t } = useTranslation();
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [issues, setIssues] = useState<Incidencia[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orders, setOrders] = useState<PedidoCliente[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Form State
    const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [issueType, setIssueType] = useState<TipoIncidencia>('CON_RETRASO');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Delete Issue Modal
    const [showDeleteIssueModal, setShowDeleteIssueModal] = useState(false);
    const [issueToDelete, setIssueToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            fetchIssues();
        }
    }, [profile]);

    const fetchIssues = async () => {
        try {
            const { data } = await supabase
                .from('incidencias')
                .select('*, pedidos_cliente(*)')
                .eq('cliente_id', profile!.id)
                .order('created_at', { ascending: false });

            setIssues(data || []);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const { data } = await supabase
                .from('pedidos_cliente')
                .select('*')
                .eq('cliente_id', profile!.id)
                .order('created_at', { ascending: false });
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        if (orders.length === 0) {
            fetchOrders();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIssueId(null);
        setSelectedOrderId('');
        setIssueType('CON_RETRASO');
        setDescription('');
    };

    const handleEdit = (issue: Incidencia) => {
        setEditingIssueId(issue.id);
        setSelectedOrderId(issue.pedido_cliente_id || '');
        setIssueType(issue.tipo_incidencia);
        setDescription(issue.descripcion);
        openModal();
    };

    const openDeleteModal = (id: string) => {
        setIssueToDelete(id);
        setShowDeleteIssueModal(true);
    };

    const handleDelete = async () => {
        if (!issueToDelete) return;

        try {
            const { error } = await supabase
                .from('incidencias')
                .delete()
                .eq('id', issueToDelete);

            if (error) throw error;
            setShowDeleteIssueModal(false);
            setIssueToDelete(null);
            await fetchIssues();
        } catch (error) {
            console.error('Error deleting issue:', error);
            alert(t('issues.deleteError'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrderId || !description) return;

        setSubmitting(true);
        try {
            if (editingIssueId) {
                // Update existing issue
                const { error } = await supabase
                    .from('incidencias')
                    .update({
                        pedido_cliente_id: selectedOrderId,
                        tipo_incidencia: issueType,
                        descripcion: description
                    })
                    .eq('id', editingIssueId);

                if (error) throw error;
            } else {
                // Create new issue
                const { error } = await supabase
                    .from('incidencias')
                    .insert({
                        cliente_id: profile!.id,
                        pedido_cliente_id: selectedOrderId,
                        tipo_incidencia: issueType,
                        descripcion: description,
                        estado: 'PENDIENTE',
                        resuelta: false
                    });

                if (error) throw error;
            }

            await fetchIssues();
            closeModal();
        } catch (error) {
            console.error('Error saving issue:', error);
            alert(t('issues.saveError'));
        } finally {
            setSubmitting(false);
        }
    };

    if (!profile) return <div>Cargando...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <AlertCircle className="h-6 w-6" />
                    {t('issues.title')}
                </h1>
                <Button onClick={openModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('issues.new')}
                </Button>
            </div>

            {loading ? (
                <p>{t('issues.loading')}</p>
            ) : issues.length > 0 ? (
                <div className="grid gap-4">
                    {issues.map((issue) => (
                        <div key={issue.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-medium block text-gray-900 dark:text-white">{issue.tipo_incidencia}</span>
                                    {issue.pedidos_cliente && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Pedido #{issue.pedidos_cliente.id.slice(0, 8)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${issue.estado === 'ACEPTADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {issue.estado}
                                    </span>
                                    {issue.estado === 'PENDIENTE' && (
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(issue)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => openDeleteModal(issue.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{issue.descripcion}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                Fecha: {new Date(issue.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <AlertCircle className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">{t('issues.empty')}</p>
                    <Button variant="ghost" onClick={() => navigate('/faq')} className="mt-2">
                        {t('issues.faqLink')}
                    </Button>
                </div>
            )}

            {/* Create/Edit Issue Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingIssueId ? t('issues.edit') : t('issues.new')}</h3>
                            <button onClick={closeModal} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('issues.selectOrder')}
                                </label>
                                {loadingOrders ? (
                                    <p className="text-sm text-gray-500">{t('issues.loadingOrders')}</p>
                                ) : (
                                    <select
                                        value={selectedOrderId}
                                        onChange={(e) => setSelectedOrderId(e.target.value)}
                                        className="w-full border dark:border-gray-600 rounded-md p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">{t('issues.selectPlaceholder')}</option>
                                        {orders.map((order) => (
                                            <option key={order.id} value={order.id}>
                                                #{order.id.slice(0, 8)} - {new Date(order.fecha_hora_pedido).toLocaleDateString()} ({order.total.toFixed(2)}€)
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('issues.typeLabel')}
                                </label>
                                <select
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value as TipoIncidencia)}
                                    className="w-full border dark:border-gray-600 rounded-md p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="CON_RETRASO">{t('issues.types.delay')}</option>
                                    <option value="DAÑADO">{t('issues.types.damaged')}</option>
                                    <option value="DEVUELTO">{t('issues.types.returned')}</option>
                                    <option value="PERDIDO">{t('issues.types.lost')}</option>
                                    <option value="FALLO_DE_PAGO">{t('issues.types.paymentError')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('issues.descriptionLabel')}
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border dark:border-gray-600 rounded-md p-2 text-sm h-32 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    placeholder={t('issues.descriptionPlaceholder')}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={closeModal}>
                                    {t('profile.cancel')}
                                </Button>
                                <Button type="submit" disabled={submitting || !selectedOrderId}>
                                    {submitting ? t('issues.submitting') : (editingIssueId ? t('issues.update') : t('issues.submit'))}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Issue Confirmation Modal */}
            {showDeleteIssueModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Eliminar incidencia</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            {t('issues.deleteConfirm')}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowDeleteIssueModal(false);
                                    setIssueToDelete(null);
                                }}
                            >
                                {t('profile.cancel')}
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
