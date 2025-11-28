import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Order, Issue, Reservation } from '../types';
import { Button } from '../components/ui/button';
import { Package, AlertCircle, Clock, CheckCircle, Calendar } from 'lucide-react';

export function Profile() {
    const { profile } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile) {
            fetchUserData();
        }
    }, [profile]);

    const fetchUserData = async () => {
        try {
            // Fetch Orders
            const { data: ordersData } = await supabase
                .from('pedidos')
                .select('*')
                .eq('usuario_id', profile!.id)
                .order('created_at', { ascending: false });

            setOrders(ordersData || []);

            // Fetch Issues
            const { data: issuesData } = await supabase
                .from('incidencias')
                .select('*')
                .eq('usuario_id', profile!.id)
                .order('created_at', { ascending: false });

            setIssues(issuesData || []);

            // Fetch Reservations
            const { data: reservationsData } = await supabase
                .from('reservas')
                .select('*, productos(*)')
                .eq('usuario_id', profile!.id)
                .order('created_at', { ascending: false });

            setReservations(reservationsData || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ENTREGADO': return 'text-green-600 bg-green-50';
            case 'CANCELADO': return 'text-red-600 bg-red-50';
            case 'PAGADO': return 'text-blue-600 bg-blue-50';
            case 'RECOGIDA': return 'text-purple-600 bg-purple-50';
            default: return 'text-yellow-600 bg-yellow-50';
        }
    };

    if (!profile) return <div>Cargando perfil...</div>;

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-2">Mi Perfil</h1>
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
                        <p className="font-medium">{profile.telefono}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">DNI</p>
                        <p className="font-medium">{profile.dni}</p>
                    </div>
                </div>
            </div>

            {/* Orders */}
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
                                        {new Date(order.fecha).toLocaleDateString()} - {order.tipo_entrega}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-lg">{order.total.toFixed(2)} €</span>
                                    <Button variant="outline" size="sm">Ver Detalles</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No has realizado pedidos aún.</p>
                )}
            </div>

            {/* Reservations */}
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
                                        Fecha: {new Date(res.fecha_reserva).toLocaleDateString()}
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

            {/* Issues */}
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
                                    <span className="font-medium">{issue.tipo}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${issue.estado === 'RESUELTA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
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
        </div>
    );
}
