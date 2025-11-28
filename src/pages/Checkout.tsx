import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { DeliveryType, PaymentMethod } from '../types';
import { Trash2 } from 'lucide-react';

export function Checkout() {
    const { items, total, removeItem, updateQuantity, clearCart } = useCart();
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    const [deliveryType, setDeliveryType] = useState<DeliveryType>('DOMICILIO');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TARJETA');
    const [address, setAddress] = useState(profile?.direccion || '');
    const [loading, setLoading] = useState(false);

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                <Button onClick={() => navigate('/')}>Volver al catálogo</Button>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (deliveryType === 'DOMICILIO' && !address) {
            alert('Por favor ingresa una dirección de envío.');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('pedidos')
                .insert({
                    usuario_id: user.id,
                    total: total,
                    estado: paymentMethod === 'TARJETA' || paymentMethod === 'BIZUM' ? 'PAGADO' : 'PENDIENTE',
                    tipo_entrega: deliveryType,
                    metodo_pago: paymentMethod,
                    direccion_envio: deliveryType === 'DOMICILIO' ? address : null,
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map((item) => ({
                pedido_id: order.id,
                producto_id: item.id,
                cantidad: item.quantity,
                precio_unitario: item.precio,
            }));

            const { error: itemsError } = await supabase
                .from('lineas_pedido')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Update Stock (Critical)
            for (const item of items) {
                const { error: stockError } = await supabase.rpc('decrement_stock', {
                    row_id: item.id,
                    quantity: item.quantity
                });

                // Fallback if RPC not exists (though RPC is better for concurrency)
                // For this demo, we'll do a direct update which is less safe but standard for simple apps
                if (stockError) {
                    const { error: updateError } = await supabase
                        .from('productos')
                        .update({ stock: item.stock - item.quantity })
                        .eq('id', item.id);

                    if (updateError) console.error('Error updating stock for', item.nombre, updateError);
                }
            }

            clearCart();
            alert('¡Pedido realizado con éxito!');
            navigate('/profile');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Hubo un error al procesar tu pedido.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Resumen del Pedido</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                        Seguir comprando
                    </Button>
                </div>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                            <img
                                src={item.imagen_url || ''}
                                alt={item.nombre}
                                className="h-16 w-16 rounded object-cover bg-gray-100"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium">{item.nombre}</h3>
                                <p className="text-sm text-gray-500">{item.precio.toFixed(2)} € / ud</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                    -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.stock}
                                >
                                    +
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => removeItem(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-4">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm h-fit">
                <h2 className="text-2xl font-bold">Datos de Envío y Pago</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Tipo de Entrega</label>
                        <div className="flex gap-4">
                            <button
                                className={`flex-1 py-2 px-4 rounded border ${deliveryType === 'DOMICILIO' ? 'bg-black text-white border-black' : 'bg-white text-gray-700'
                                    }`}
                                onClick={() => setDeliveryType('DOMICILIO')}
                            >
                                A Domicilio
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded border ${deliveryType === 'RECOGIDA' ? 'bg-black text-white border-black' : 'bg-white text-gray-700'
                                    }`}
                                onClick={() => setDeliveryType('RECOGIDA')}
                            >
                                Recogida en Tienda
                            </button>
                        </div>
                    </div>

                    {deliveryType === 'DOMICILIO' && (
                        <Input
                            label="Dirección de Envío"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Calle, Número, Piso..."
                            required
                        />
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Método de Pago</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['TARJETA', 'BIZUM', 'EFECTIVO'] as PaymentMethod[]).map((method) => (
                                <button
                                    key={method}
                                    disabled={method === 'EFECTIVO' && deliveryType === 'DOMICILIO'}
                                    className={`py-2 px-2 text-sm rounded border ${paymentMethod === method
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-700'
                                        } ${method === 'EFECTIVO' && deliveryType === 'DOMICILIO' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => setPaymentMethod(method)}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                        {paymentMethod === 'EFECTIVO' && deliveryType === 'DOMICILIO' && (
                            <p className="text-xs text-red-500 mt-1">Efectivo solo disponible para recogida.</p>
                        )}
                    </div>

                    <Button
                        className="w-full mt-6"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : `Pagar ${total.toFixed(2)} €`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
