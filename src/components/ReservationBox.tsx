import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { CalendarClock } from 'lucide-react';

interface ReservationBoxProps {
    productId: string;
    maxQuantity: number;
    className?: string;
}

export function ReservationBox({ productId, maxQuantity, className = '' }: ReservationBoxProps) {
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleReserve = async () => {
        if (!user) {
            setMessage({ type: 'error', text: 'Debes iniciar sesión para reservar.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const code = 'RES-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            
            const { error } = await supabase
                .from('reservas')
                .insert({
                    cliente_id: user.id,
                    producto_id: productId,
                    cantidad: quantity,
                    codigo: code,
                    estado: 'PENDIENTE'
                });

            if (error) throw error;

            setMessage({ 
                type: 'success', 
                text: `Reserva realizada con éxito. Tu código es: ${code}` 
            });
        } catch (error) {
            console.error('Error creating reservation:', error);
            setMessage({ type: 'error', text: 'Error al realizar la reserva.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`p-6 border rounded-lg bg-blue-50 border-blue-100 flex flex-col justify-center ${className}`}>
            <div className="flex items-center gap-2 mb-3 text-blue-800">
                <CalendarClock className="h-5 w-5" />
                <h3 className="font-semibold">Reservar en tienda</h3>
            </div>
            
            <p className="text-sm text-blue-600 mb-4">
                Reserva este producto y recógelo en tienda. Te guardaremos el producto durante 7 días.
            </p>

            <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-blue-800">Cantidad</label>
                    <input 
                        type="number" 
                        min="1" 
                        max={maxQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-20 p-2 border rounded-md text-sm"
                    />
                </div>
                
                <Button 
                    onClick={handleReserve} 
                    disabled={loading || !user}
                    variant="outline"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-blue-200"
                >
                    {loading ? 'Reservando...' : 'Reservar ahora'}
                </Button>
            </div>

            {message && (
                <div className={`mt-3 text-sm p-2 rounded ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}
            
            {!user && (
                <p className="mt-2 text-xs text-red-500">
                    * Inicia sesión para reservar
                </p>
            )}
        </div>
    );
}
