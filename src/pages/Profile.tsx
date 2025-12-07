import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { PedidoCliente, Incidencia, Reserva, LineaPedido } from '../types';
import { Button } from '../components/ui/button';
import { Package, AlertCircle, Calendar, X, User, Pencil, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Profile() {
    const { t } = useTranslation();
    const { profile, isAdmin, signOut } = useAuth();
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
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
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

    // Edit Issue State
    const [selectedIssue, setSelectedIssue] = useState<Incidencia | null>(null);
    const [issueFormData, setIssueFormData] = useState({
        descripcion: '',
        tipo_incidencia: ''
    });

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

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

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !profile) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no debe superar los 5MB');
            return;
        }

        setUploadingPhoto(true);
        try {
            // Subir nueva foto
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${profile.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            console.log('Public URL:', publicUrl);

            // Actualizar perfil con nueva URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', profile.id);

            if (updateError) {
                console.error('Update error:', updateError);
                throw updateError;
            }

            // Eliminar foto anterior si existe (después de subir la nueva)
            if (profile.avatar_url) {
                try {
                    const urlParts = profile.avatar_url.split('/avatars/');
                    if (urlParts.length > 1) {
                        const oldFilePath = urlParts[1];
                        await supabase.storage.from('avatars').remove([oldFilePath]);
                    }
                } catch (deleteError) {
                    console.log('No se pudo eliminar la foto anterior:', deleteError);
                    // No lanzamos error aquí, la nueva foto ya está guardada
                }
            }

            window.location.reload();
        } catch (error: any) {
            console.error('Error uploading photo:', error);
            alert(`Error al subir la foto: ${error.message || 'Inténtalo de nuevo'}`);
        } finally {
            setUploadingPhoto(false);
        }
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

    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;
        if (!confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.')) return;

        try {
            const { error } = await supabase
                .from('pedidos_cliente')
                .delete()
                .eq('id', selectedOrder.id);

            if (error) throw error;

            alert('Pedido eliminado correctamente');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Error al eliminar el pedido');
        }
    };

    const handleEditIssue = (issue: Incidencia) => {
        setSelectedIssue(issue);
        setIssueFormData({
            descripcion: issue.descripcion,
            tipo_incidencia: issue.tipo_incidencia
        });
    };

    const handleUpdateIssue = async () => {
        if (!selectedIssue) return;

        try {
            const { error } = await supabase
                .from('incidencias')
                .update({
                    descripcion: issueFormData.descripcion,
                    tipo_incidencia: issueFormData.tipo_incidencia
                })
                .eq('id', selectedIssue.id);

            if (error) throw error;

            alert('Incidencia actualizada correctamente');
            setSelectedIssue(null);
            fetchUserData();
        } catch (error) {
            console.error('Error updating issue:', error);
            alert('Error al actualizar la incidencia');
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

    const handleDeleteProfile = async () => {
        if (!profile) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase.rpc('delete_own_user');

            if (error) {
                console.error('Error deleting user:', error);
                alert('Error al eliminar la cuenta: ' + error.message);
                setIsDeleting(false);
                return;
            }

            await signOut();
        } catch (error: any) {
            console.error('Error deleting profile:', error);
            alert('Error al eliminar la cuenta: ' + error.message);
            setIsDeleting(false);
        }
    };

    if (!profile) return <div>{t('profile.saving') || 'Cargando...'}</div>;

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <User className="h-6 w-6" />
                        {t('profile.title')}
                    </h1>
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        {t('profile.edit')}
                    </Button>
                </div>

                {/* Profile Photo Section */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                    <div className="relative">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.nombre || 'Usuario'}
                                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-3xl font-semibold border-2 border-gray-300">
                                {profile.nombre ? profile.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <label
                            htmlFor="photo-upload"
                            className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                        >
                            <Camera className="h-4 w-4" />
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                disabled={uploadingPhoto}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{profile.nombre} {profile.apellidos}</h3>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {uploadingPhoto ? t('profile.uploading') : t('profile.uploadPhoto')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">{t('profile.fields.name')}</p>
                        <p className="font-medium">{profile.nombre} {profile.apellidos}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">{t('profile.fields.email')}</p>
                        <p className="font-medium">{profile.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">{t('profile.fields.phone')}</p>
                        <p className="font-medium">{profile.telefono || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">{t('profile.fields.dni')}</p>
                        <p className="font-medium">{profile.dni || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">{t('profile.fields.address')}</p>
                        <p className="font-medium">{profile.direccion || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">{t('profile.fields.postalCode')}</p>
                        <p className="font-medium">{profile.codigo_postal || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Orders - Hidden for Admin */}
            {!isAdmin && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {t('profile.orders.title')}
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
                                            {new Date(order.fecha_hora_pedido).toLocaleDateString()} - {order.a_domicilio ? t('checkout.homeDelivery') : t('checkout.storePickup')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-lg">{order.total.toFixed(2)} €</span>
                                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>{t('profile.orders.viewDetails')}</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('profile.orders.empty')}</p>
                    )}
                </div>
            )}

            {/* Reservations - Hidden for Admin */}
            {!isAdmin && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {t('profile.reservations.title')}
                    </h2>
                    {reservations.length > 0 ? (
                        <div className="grid gap-4">
                            {reservations.map((res) => (
                                <div key={res.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm text-gray-500">{t('profile.reservations.code')}: {res.codigo}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(res.estado)}`}>
                                                {res.estado}
                                            </span>
                                        </div>
                                        <p className="font-medium">{res.productos?.nombre}</p>
                                        <p className="text-sm text-gray-600">
                                            {t('profile.orders.date')}: {new Date(res.fecha_hora_reserva).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">{t('profile.reservations.qty')}: {res.cantidad}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('profile.reservations.empty')}</p>
                    )}
                </div>
            )}

            {!isAdmin && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {t('profile.issues.title')}
                    </h2>
                    {issues.length > 0 ? (
                        <div className="grid gap-4">
                            {issues.map((issue) => (
                                <div key={issue.id} className="bg-white p-4 rounded-lg shadow-sm border">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium">{issue.tipo_incidencia}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${issue.estado === 'ACEPTADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {issue.estado}
                                            </span>
                                            <Button variant="outline" size="sm" onClick={() => handleEditIssue(issue)}>
                                                <Pencil className="h-3 w-3 mr-1" />
                                                {t('profile.issues.edit')}
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{issue.descripcion}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t('profile.issues.empty')}</p>
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
                                    <p className="text-gray-500">{t('profile.orders.date')}</p>
                                    <p className="font-medium">{new Date(selectedOrder.fecha_hora_pedido).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">{t('profile.orders.status')}</p>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(selectedOrder.estado)}`}>
                                        {selectedOrder.estado}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-gray-500">{t('profile.orders.payment')}</p>
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
                                    <p className="text-gray-500">{t('profile.orders.delivery')}</p>
                                    {isEditingOrder ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={orderFormData.a_domicilio}
                                                onChange={(e) => setOrderFormData({ ...orderFormData, a_domicilio: e.target.checked })}
                                                id="a_domicilio"
                                            />
                                            <label htmlFor="a_domicilio">{t('checkout.homeDelivery')}</label>
                                        </div>
                                    ) : (
                                        <p className="font-medium">{selectedOrder.a_domicilio ? t('checkout.homeDelivery') : t('checkout.storePickup')}</p>
                                    )}
                                </div>
                                {(selectedOrder.direccion_envio || isEditingOrder) && (
                                    <div className="col-span-2">
                                        <p className="text-gray-500">{t('checkout.addressLabel')}</p>
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

                            <h4 className="font-bold border-b pb-2">{t('profile.orders.products')}</h4>
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
                                <span>{t('profile.orders.totalPaid')}</span>
                                <span>{selectedOrder.total.toFixed(2)} €</span>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                            <div>
                                {selectedOrder.estado === 'EN_PREPARACION' && (
                                    <div className="flex gap-2">
                                        {isEditingOrder ? (
                                            <>
                                                <Button variant="outline" onClick={() => setIsEditingOrder(false)}>{t('profile.cancel')}</Button>
                                                <Button onClick={handleUpdateOrder}>{t('profile.save')}</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="danger" onClick={handleCancelOrder}>{t('profile.orders.cancel')}</Button>
                                                <Button variant="danger" onClick={handleDeleteOrder}>{t('profile.orders.delete')}</Button>
                                                <Button variant="outline" onClick={() => setIsEditingOrder(true)}>Editar Pedido</Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <Button onClick={closeDetails}>{t('profile.cancel')}</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Danger Zone */}
            <div className="border-t pt-8 mt-8">
                <h2 className="text-xl font-bold text-red-600 mb-4">{t('profile.dangerZone.title')}</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-medium text-red-900">{t('profile.dangerZone.deleteAccount')}</h3>
                        <p className="text-sm text-red-700 mt-1">
                            {t('profile.dangerZone.warning')}
                        </p>
                    </div>
                    <Button
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        {t('profile.dangerZone.button')}
                    </Button>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Eliminar Cuenta</h3>
                                    <p className="text-sm text-gray-500">Esta acción es irreversible</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800">
                                    <strong>Advertencia:</strong> Al eliminar tu cuenta se perderán permanentemente:
                                </p>
                                <ul className="mt-2 ml-4 text-sm text-red-700 list-disc space-y-1">
                                    <li>Tu información personal y datos de perfil</li>
                                    <li>Historial de pedidos y reservas</li>
                                    <li>Incidencias reportadas</li>
                                    <li>Acceso a tu cuenta de usuario</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Para confirmar, escribe <span className="font-bold text-red-600">ELIMINAR</span> en el campo:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    placeholder="Escribe ELIMINAR"
                                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    disabled={isDeleting}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-b-lg flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText('');
                                }}
                                className="flex-1"
                                disabled={isDeleting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    if (deleteConfirmText === 'ELIMINAR') {
                                        handleDeleteProfile();
                                    }
                                }}
                                className="flex-1"
                                disabled={deleteConfirmText !== 'ELIMINAR' || isDeleting}
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar Cuenta'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold">{t('profile.edit')}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-black">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('profile.fields.name')}</label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('profile.fields.name')}</label>
                                    <input
                                        type="text"
                                        value={formData.apellidos}
                                        onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('profile.fields.phone')}</label>
                                    <input
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('profile.fields.dni')}</label>
                                    <input
                                        type="text"
                                        value={formData.dni}
                                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('profile.fields.address')}</label>
                                    <input
                                        type="text"
                                        value={formData.direccion}
                                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('profile.fields.postalCode')}</label>
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
                                    {t('profile.cancel')}
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? t('profile.saving') : t('profile.save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Issue Modal */}
            {selectedIssue && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">{t('issues.edit')}</h3>
                            <button onClick={() => setSelectedIssue(null)} className="text-gray-500 hover:text-black">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('issues.typeLabel')}</label>
                                <select
                                    value={issueFormData.tipo_incidencia}
                                    onChange={(e) => setIssueFormData({ ...issueFormData, tipo_incidencia: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="PRODUCTO_DEFECTUOSO">Producto Defectuoso</option>
                                    <option value="ENVIO_INCORRECTO">Envío Incorrecto</option>
                                    <option value="PRODUCTO_NO_RECIBIDO">Producto No Recibido</option>
                                    <option value="RETRASO_ENVIO">Retraso en Envío</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descripción</label>
                                <textarea
                                    value={issueFormData.descripcion}
                                    onChange={(e) => setIssueFormData({ ...issueFormData, descripcion: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setSelectedIssue(null)}>
                                    {t('profile.cancel')}
                                </Button>
                                <Button onClick={handleUpdateIssue}>
                                    {t('profile.save')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
