import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
    productId: string;
    onReviewAdded: () => void;
}

export function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (rating === 0) {
            setError('Por favor selecciona una puntuación');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('valoraciones')
                .insert({
                    producto_id: productId,
                    cliente_id: user.id,
                    estrellas: rating,
                    comentario: comment,
                });

            if (error) throw error;

            setRating(0);
            setComment('');
            onReviewAdded();
        } catch (err: any) {
            console.error('Error submitting review:', err);
            setError(err.message || 'Error al enviar la valoración. Inténtalo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-gray-50 p-6 rounded-lg text-center border">
                <p className="text-gray-600 mb-4">Inicia sesión para dejar una valoración.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border p-4 rounded-lg space-y-4 shadow-sm">
            
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Puntuación</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`h-6 w-6 ${
                                    star <= (hoveredRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                } transition-colors`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="comment" className="text-sm font-medium text-gray-700">
                    Comentario (opcional)
                </label>
                <textarea
                    id="comment"
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
                    placeholder="¿Qué te ha parecido el producto?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Publicar valoración'}
            </Button>
        </form>
    );
}
