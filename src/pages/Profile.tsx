import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { PedidoCliente, Incidencia, Reserva, LineaPedido } from '../types';
import { Button } from '../components/ui/button';
import { Package, AlertCircle, Calendar, X, User, Pencil } from 'lucide-react';

export function Profile() {
    const { profile, isAdmin } = useAuth();
    const [orders, setOrders] = useState<PedidoCliente[]>([]);
    const [issues, setIssues] = useState<Incidencia[]>([]);
    const [reservations, setReservations] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<PedidoCliente | null>(null);
    const [orderItems, setOrderItems] = useState<LineaPedido[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        dni: '',
        direccion: '',
        codigo_postal: ''
    });

    // Edit Order State
    const [isEditingOrder, setIsEditingOrder] = useState(false);
    const [orderFormData, setOrderFormData] = useState({
        metodo_pago: '',
        a_domicilio: false,
        direccion_envio: ''
    });

    useEffect(() => {
        if (profile) {
            fetchUserData();
            setFormData({
                nombre: profile.nombre || '',
                apellidos: profile.apellidos || '',
                telefono: profile.telefono || '',
                dni: profile.dni || '',
                direccion: profile.direccion || '',
                codigo_postal: profile.codigo_postal || ''
            });
        }
    }, [profile]);

    const fetchUserData = async () => {
        try {
            // Fetch Orders
            const { data: ordersData } = await supabase
                .from('pedidos_cliente')
                .select('*')
                .eq('cliente_id', profile!.id)
                .order('created_at', { ascending: false });

            setOrders(ordersData || []);

            // Fetch Issues
            const { data: issuesData } = await supabase
                .from('incidencias')
                .select('*')
                .eq('cliente_id', profile!.id)
                .order('created_at', { ascending: false });

            setIssues(issuesData || []);

            // Fetch Reservations
            const { data: reservationsData } = await supabase
                .from('reservas')
                .select('*, productos(*)')
                .eq('cliente_id', profile!.id)
                .order('created_at', { ascending: false });

            setReservations(reservationsData || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderItems = async (orderId: string) => {
        setLoadingItems(true);
        const { data } = await supabase
            .from('lineas_pedido')
            .select('*, productos(nombre, imagen_producto)')
            .eq('pedido_cliente_id', orderId);

        setOrderItems(data || []);
        setLoadingItems(false);
    };

    const handleViewDetails = (order: PedidoCliente) => {
        setSelectedOrder(order);
        setOrderFormData({
            metodo_pago: order.metodo_pago,
            a_domicilio: order.a_domicilio,
            direccion_envio: order.direccion_envio || ''
        });
        setIsEditingOrder(false);
        fetchOrderItems(order.id);
    };

    const closeDetails = () => {
        setSelectedOrder(null);
        setOrderItems([]);
        setIsEditingOrder(false);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    nombre: formData.nombre,
                    apellidos: formData.apellidos,
                    telefono: formData.telefono,
                    dni: formData.dni,
                    direccion: formData.direccion,
                    codigo_postal: formData.codigo_postal
                })
                .eq('id', profile.id);

            if (error) throw error;

            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error al actualizar el perfil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        if (!confirm('¿Estás seguro de que quieres cancelar este pedido?')) return;

        try {
            const { error } = await supabase
                .from('pedidos_cliente')
                .update({ estado: 'CANCELADO' })
                .eq('id', selectedOrder.id);

            if (error) throw error;

            alert('Pedido cancelado correctamente');
            window.location.reload();
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Error al cancelar el pedido');
        }
    };

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;

        try {
            const { error } = await supabase
                .from('pedidos_cliente')
                .update({
                    metodo_pago: orderFormData.metodo_pago,
                    a_domicilio: orderFormData.a_domicilio,
                    direccion_envio: orderFormData.a_domicilio ? orderFormData.direccion_envio : null
                })
                .eq('id', selectedOrder.id);

            if (error) throw error;

            alert('Pedido actualizado correctamente');
            window.location.reload();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Error al actualizar el pedido');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ENTREGADO':
            case 'ACEPTADA':
            case 'PAGADA':
            case 'RECOGIDA':
                return 'text-green-600 bg-green-50';
            case 'CANCELADO':
            case 'RECHAZADA':
                return 'text-red-600 bg-red-50';
            case 'ENVIADO':
            case 'EN_REPARTO':
                return 'text-blue-600 bg-blue-50';
            case 'EN_PREPARACION':
            case 'PENDIENTE':
                return 'text-yellow-600 bg-yellow-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    if (!profile) return <div>Cargando perfil...</div>;

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <User className="h-6 w-6" />
                        Mi Perfil
                    </h1>
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar Perfil
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Nombre</p>
                        <p className="font-medium">{profile.nombre} {profile.apellidos}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Teléfono</p>
                        <p className="font-medium">{profile.telefono || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">DNI</p>
                        <p className="font-medium">{profile.dni || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Dirección</p>
                        <p className="font-medium">{profile.direccion || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Código Postal</p>
                        <p className="font-medium">{profile.codigo_postal || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Orders - Hidden for Admin */}
            {!isAdmin && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Mis Pedidos
                    </h2>
                    {orders.length > 0 ? (
                        <div className="grid gap-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.estado)}`}>
                                                {order.estado}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.fecha_hora_pedido).toLocaleDateString()} - {order.a_domicilio ? 'A Domicilio' : 'Recogida'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-lg">{order.total.toFixed(2)} €</span>
                                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>Ver Detalles</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No has realizado pedidos aún.</p>
                    )}
                </div>
            )}

            {/* Reservations - Hidden for Admin */}
            {!isAdmin && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Mis Reservas
                    </h2>
                    {reservations.length > 0 ? (
                        <div className="grid gap-4">
                            {reservations.map((res) => (
                                <div key={res.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm text-gray-500">Código: {res.codigo}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(res.estado)}`}>
                                                {res.estado}
                                            </span>
                                        </div>
                                        <p className="font-medium">{res.productos?.nombre}</p>
                                        <p className="text-sm text-gray-600">
                                            Fecha: {new Date(res.fecha_hora_reserva).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">Cant: {res.cantidad}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No tienes reservas activas.</p>
                    )}
                </div>
            )}

            {/* Issues - Hidden for Admin */}
            {!isAdmin && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Mis Incidencias
                    </h2>
                    {issues.length > 0 ? (
                        <div className="grid gap-4">
                            {issues.map((issue) => (
                                <div key={issue.id} className="bg-white p-4 rounded-lg shadow-sm border">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium">{issue.tipo_incidencia}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${issue.estado === 'ACEPTADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {issue.estado}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{issue.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No tienes incidencias reportadas.</p>
                    )}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold">Detalles del Pedido #{selectedOrder.id.slice(0, 8)}</h3>
                            <button onClick={closeDetails} className="text-gray-500 hover:text-black">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                <div>
                                    <p className="text-gray-500">Fecha</p>
                                    <p className="font-medium">{new Date(selectedOrder.fecha_hora_pedido).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Estado</p>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(selectedOrder.estado)}`}>
                                        {selectedOrder.estado}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-gray-500">Método de Pago</p>
                                    {isEditingOrder ? (
                                        <select
                                            value={orderFormData.metodo_pago}
                                            onChange={(e) => setOrderFormData({ ...orderFormData, metodo_pago: e.target.value })}
                                            className="w-full p-1 border rounded"
                                        >
                                            <option value="EFECTIVO">Efectivo</option>
                                            <option value="TARJETA">Tarjeta</option>
                                            <option value="TRANSFERENCIA">Transferencia</option>
                                            <option value="CONTRA_REEMBOLSO">Contra Reembolso</option>
                                            <option value="PAYPAL">PayPal</option>
                                            <option value="BIZUM">Bizum</option>
                                        </select>
                                    ) : (
                                        <p className="font-medium">{selectedOrder.metodo_pago}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-500">Entrega</p>
                                    {isEditingOrder ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={orderFormData.a_domicilio}
                                                onChange={(e) => setOrderFormData({ ...orderFormData, a_domicilio: e.target.checked })}
                                                id="a_domicilio"
                                            />
                                            <label htmlFor="a_domicilio">A Domicilio</label>
                                        </div>
                                    ) : (
                                        <p className="font-medium">{selectedOrder.a_domicilio ? 'A Domicilio' : 'Recogida en Tienda'}</p>
                                    )}
                                </div>
                                {(selectedOrder.direccion_envio || isEditingOrder) && (
                                    <div className="col-span-2">
                                        <p className="text-gray-500">Dirección de Envío</p>
                                        {isEditingOrder && orderFormData.a_domicilio ? (
                                            <input
                                                type="text"
                                                value={orderFormData.direccion_envio}
                                                onChange={(e) => setOrderFormData({ ...orderFormData, direccion_envio: e.target.value })}
                                                className="w-full p-1 border rounded"
                                            />
                                        ) : (
                                            <p className="font-medium">{selectedOrder.direccion_envio || '-'}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <h4 className="font-bold border-b pb-2">Productos</h4>
                            {loadingItems ? (
                                <p className="text-center py-4">Cargando productos...</p>
                            ) : (
                                <div className="space-y-3">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                {/* @ts-ignore */}
                                                {item.productos?.imagen_producto && (
                                                    <img
                                                        /* @ts-ignore */
                                                        src={item.productos.imagen_producto}
                                                        /* @ts-ignore */
                                                        alt={item.productos.nombre}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                {/* @ts-ignore */}
                                                <p className="font-medium">{item.productos?.nombre || 'Producto eliminado'}</p>
                                                <p className="text-sm text-gray-500">{item.cantidad} x {item.precio_unitario.toFixed(2)} €</p>
                                            </div>
                                            <p className="font-medium">{(item.cantidad * item.precio_unitario).toFixed(2)} €</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="border-t pt-4 flex justify-between items-center text-lg font-bold">
                                <span>Total Pagado</span>
                                <span>{selectedOrder.total.toFixed(2)} €</span>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                            <div>
                                {selectedOrder.estado === 'EN_PREPARACION' && (
                                    <div className="flex gap-2">
                                        {isEditingOrder ? (
                                            <>
                                                <Button variant="outline" onClick={() => setIsEditingOrder(false)}>Cancelar Edición</Button>
                                                <Button onClick={handleUpdateOrder}>Guardar Cambios</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="danger" onClick={handleCancelOrder}>Cancelar Pedido</Button>
                                                <Button variant="outline" onClick={() => setIsEditingOrder(true)}>Editar Pedido</Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <Button onClick={closeDetails}>Cerrar</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold">Editar Perfil</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-black">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Apellidos</label>
                                    <input
                                        type="text"
                                        value={formData.apellidos}
                                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">DNI</label>
                                    <input
                                        type="text"
                                        value={formData.dni}
                                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Dirección</label>
                                    <input
                                        type="text"
                                        value={formData.direccion}
                                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Código Postal</label>
                                    <input
                                        type="text"
                                        value={formData.codigo_postal}
                                        onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
