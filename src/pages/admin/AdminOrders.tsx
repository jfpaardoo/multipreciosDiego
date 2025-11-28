import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PedidoCliente, EstadoPedidoCliente } from '../../types';


export function AdminOrders() {
    const [orders, setOrders] = useState<PedidoCliente[]>([]);


    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('pedidos_cliente')
            .select('*, profiles(nombre, apellidos)')
            .order('created_at', { ascending: false });

        if (!error) setOrders(data || []);

    };

    const updateStatus = async (orderId: string, newStatus: EstadoPedidoCliente) => {
        const { error } = await supabase
            .from('pedidos_cliente')
            .update({ estado: newStatus })
            .eq('id', orderId);

        if (!error) fetchOrders();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>#{order.id.slice(0, 8)}</div>
                                    <div className="text-xs">{new Date(order.fecha_hora_pedido).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {/* @ts-ignore joined data */}
                                    {order.profiles?.nombre} {order.profiles?.apellidos || ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {order.total.toFixed(2)} €
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {order.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <select
                                        value={order.estado}
                                        onChange={(e) => updateStatus(order.id, e.target.value as EstadoPedidoCliente)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                                        <option value="ENVIADO">ENVIADO</option>
                                        <option value="EN_REPARTO">EN REPARTO</option>
                                        <option value="ENTREGADO">ENTREGADO</option>
                                        <option value="CANCELADO">CANCELADO</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
