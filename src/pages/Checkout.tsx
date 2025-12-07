import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type DeliveryType = 'DOMICILIO' | 'RECOGIDA';
type PaymentMethod = 'TARJETA' | 'EFECTIVO' | 'BIZUM';

export function Checkout() {
    const { t } = useTranslation();
    const { items, total, removeItem, updateQuantity, clearCart } = useCart();
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    const [deliveryType, setDeliveryType] = useState<DeliveryType>('DOMICILIO');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TARJETA');
    const [address, setAddress] = useState(profile?.direccion || '');
    const [loading, setLoading] = useState(false);

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center max-w-md">
                    <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
                    <p className="text-gray-600 mb-6">Explora nuestro catálogo y añade productos a tu carrito</p>
                    <Button onClick={() => navigate('/')} className="px-6">
                        Volver al catálogo
                    </Button>
                </div>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (deliveryType === 'DOMICILIO' && !address) {
            alert(t('checkout.addressRequired'));
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('pedidos_cliente')
                .insert({
                    cliente_id: user.id,
                    total: total,
                    estado: paymentMethod === 'TARJETA' || paymentMethod === 'BIZUM' ? 'EN_PREPARACION' : 'EN_PREPARACION', // Default state
                    pagado: paymentMethod === 'TARJETA' || paymentMethod === 'BIZUM',
                    a_domicilio: deliveryType === 'DOMICILIO',
                    metodo_pago: paymentMethod,
                    direccion_envio: deliveryType === 'DOMICILIO' ? address : null,
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map((item) => ({
                pedido_cliente_id: order.id,
                producto_id: item.id,
                cantidad: item.quantity,
                precio_unitario: item.precio_venta,
            }));

            const { error: itemsError } = await supabase
                .from('lineas_pedido')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Update Stock (Critical)
            for (const item of items) {
                const { error: stockError } = await supabase.rpc('decrement_stock', {
                    product_id: item.id,
                    quantity: item.quantity
                });

                // Fallback if RPC not exists (though RPC is better for concurrency)
                // For this demo, we'll do a direct update which is less safe but standard for simple apps
                if (stockError) {
                    const { error: updateError } = await supabase
                        .from('productos')
                        .update({ cantidad_en_tienda: item.cantidad_en_tienda - item.quantity })
                        .eq('id', item.id);

                    if (updateError) console.error('Error updating stock for', item.nombre, updateError);
                }
            }

            clearCart();
            alert(t('checkout.success'));
            navigate('/profile');
        } catch (error) {
            console.error('Error creating order:', error);
            alert(t('checkout.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('checkout.summary')}</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                        {t('checkout.continueShopping')}
                    </Button>
                </div>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 border-b dark:border-gray-700 pb-4">
                            <img
                                src={item.imagen_producto || ''}
                                alt={item.nombre}
                                className="h-16 w-16 rounded object-cover bg-gray-100 dark:bg-gray-700"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 dark:text-white">{item.nombre || 'Producto'}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{(item.precio_venta || 0).toFixed(2)} € / ud</p>
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
                                <span className="w-8 text-center text-gray-900 dark:text-white">{item.quantity || 0}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= (item.cantidad_en_tienda || 0)}
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
                    <span>{t('checkout.total')}</span>
                    <span>{total.toFixed(2)} €</span>
                </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-fit border dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('checkout.shippingData')}</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('checkout.deliveryType')}</label>
                        <div className="flex gap-4">
                            <button
                                className={`flex-1 py-2 px-4 rounded border ${deliveryType === 'DOMICILIO' ? 'bg-black text-white border-black' : 'bg-white text-gray-700'
                                    }`}
                                onClick={() => setDeliveryType('DOMICILIO')}
                            >
                                {t('checkout.homeDelivery')}
                            </button>
                            <button
                                className={`flex-1 py-2 px-4 rounded border ${deliveryType === 'RECOGIDA' ? 'bg-black text-white border-black' : 'bg-white text-gray-700'
                                    }`}
                                onClick={() => setDeliveryType('RECOGIDA')}
                            >
                                {t('checkout.storePickup')}
                            </button>
                        </div>
                    </div>

                    {deliveryType === 'DOMICILIO' && (
                        <Input
                            label={t('checkout.addressLabel')}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={t('checkout.addressPlaceholder')}
                            required
                        />
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">{t('checkout.paymentMethod')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['TARJETA', 'BIZUM', 'EFECTIVO'] as PaymentMethod[]).map((method) => {
                                let label: string = method;
                                if (method === 'TARJETA') label = t('checkout.types.card');
                                if (method === 'BIZUM') label = t('checkout.types.bizum');
                                if (method === 'EFECTIVO') label = t('checkout.types.cash');

                                return (
                                    <button
                                        key={method}
                                        disabled={method === 'EFECTIVO' && deliveryType === 'DOMICILIO'}
                                        className={`py-2 px-2 text-sm rounded border ${paymentMethod === method
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-gray-700'
                                            } ${method === 'EFECTIVO' && deliveryType === 'DOMICILIO' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => setPaymentMethod(method)}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                        {paymentMethod === 'EFECTIVO' && deliveryType === 'DOMICILIO' && (
                            <p className="text-xs text-red-500 mt-1">{t('checkout.cashWarning')}</p>
                        )}
                    </div>

                    <Button
                        className="w-full mt-6"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? t('checkout.processing') : `${t('checkout.pay')} ${total.toFixed(2)} €`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
