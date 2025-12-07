import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { CalendarClock } from 'lucide-react';

interface ReservationBoxProps {
    productId: string;
    maxQuantity: number;
    className?: string;
}

export function ReservationBox({ productId, maxQuantity, className = '' }: ReservationBoxProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleReserve = async () => {
        if (!user) {
            setMessage({ type: 'error', text: t('reservation.loginRequired') });
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
                text: t('reservation.successMessage', { code })
            });
        } catch (error) {
            console.error('Error creating reservation:', error);
            setMessage({ type: 'error', text: t('reservation.error') });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`p-6 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 flex flex-col justify-center ${className}`}>
            <div className="flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
                <CalendarClock className="h-5 w-5" />
                <h3 className="font-semibold">{t('reservation.title')}</h3>
            </div>

            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                {t('reservation.description')}
            </p>

            <div className="flex gap-4 items-end">
                <div className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-blue-800 dark:text-blue-300">{t('reservation.quantity')}</label>
                    <input
                        type="number"
                        min="1"
                        max={maxQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-20 p-2 border dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <Button
                    onClick={handleReserve}
                    disabled={loading || !user}
                    variant="outline"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-blue-200"
                >
                    {loading ? t('reservation.reserving') : t('reservation.reserveNow')}
                </Button>
            </div>

            {message && (
                <div className={`mt-3 text-sm p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            {!user && (
                <p className="mt-2 text-xs text-red-500">
                    * {t('reservation.loginHint')}
                </p>
            )}
        </div>
    );
}
