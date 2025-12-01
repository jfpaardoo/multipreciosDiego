import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Incidencia, PedidoCliente, TipoIncidencia } from '../types';
import { Button } from '../components/ui/button';
import { AlertCircle, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Issues() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [issues, setIssues] = useState<Incidencia[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orders, setOrders] = useState<PedidoCliente[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Form State
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [issueType, setIssueType] = useState<TipoIncidencia>('CON_RETRASO');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

    const openModal = async () => {
        setIsModalOpen(true);
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

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId('');
        setIssueType('CON_RETRASO');
        setDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrderId || !description) return;

        setSubmitting(true);
        try {
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

            await fetchIssues();
            closeModal();
        } catch (error) {
            console.error('Error creating issue:', error);
            alert('Error al crear la incidencia. Por favor, inténtalo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!profile) return <div>Cargando...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <AlertCircle className="h-6 w-6" />
                    Mis Incidencias
                </h1>
                <Button onClick={openModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Incidencia
                </Button>
            </div>

            {loading ? (
                <p>Cargando incidencias...</p>
            ) : issues.length > 0 ? (
                <div className="grid gap-4">
                    {issues.map((issue) => (
                        <div key={issue.id} className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-medium block">{issue.tipo_incidencia}</span>
                                    {issue.pedidos_cliente && (
                                        <span className="text-xs text-gray-500">
                                            Pedido #{issue.pedidos_cliente.id.slice(0, 8)}
                                        </span>
                                    )}
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${issue.estado === 'ACEPTADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {issue.estado}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{issue.descripcion}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                Fecha: {new Date(issue.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No tienes incidencias reportadas.</p>
                    <Button variant="ghost" onClick={() => navigate('/faq')} className="mt-2">
                        ¿Tienes un problema? Consulta las FAQ
                    </Button>
                </div>
            )}

            {/* Create Issue Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Nueva Incidencia</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-black">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Selecciona el Pedido
                                </label>
                                {loadingOrders ? (
                                    <p className="text-sm text-gray-500">Cargando pedidos...</p>
                                ) : (
                                    <select
                                        value={selectedOrderId}
                                        onChange={(e) => setSelectedOrderId(e.target.value)}
                                        className="w-full border rounded-md p-2 text-sm"
                                        required
                                    >
                                        <option value="">-- Selecciona un pedido --</option>
                                        {orders.map((order) => (
                                            <option key={order.id} value={order.id}>
                                                #{order.id.slice(0, 8)} - {new Date(order.fecha_hora_pedido).toLocaleDateString()} ({order.total.toFixed(2)}€)
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Incidencia
                                </label>
                                <select
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value as TipoIncidencia)}
                                    className="w-full border rounded-md p-2 text-sm"
                                    required
                                >
                                    <option value="CON_RETRASO">Pedido con retraso</option>
                                    <option value="DAÑADO">Producto dañado</option>
                                    <option value="DEVUELTO">Devolución</option>
                                    <option value="PERDIDO">Pedido perdido</option>
                                    <option value="FALLO_DE_PAGO">Fallo de pago</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción del Problema
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded-md p-2 text-sm h-32 resize-none"
                                    placeholder="Describe detalladamente el problema..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={closeModal}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting || !selectedOrderId}>
                                    {submitting ? 'Enviando...' : 'Crear Incidencia'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
