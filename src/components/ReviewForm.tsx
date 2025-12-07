import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface ReviewFormProps {
    productId: string;
    onReviewAdded: () => void;
}

export function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
    const { t } = useTranslation();
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
            setError(t('reviewForm.ratingRequired'));
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
            setError(err.message || t('reviewForm.error'));
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center border dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t('reviewForm.loginRequired')}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-lg space-y-4 shadow-sm">

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('reviewForm.rating')}</label>
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
                                className={`h-6 w-6 ${star <= (hoveredRating || rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                    } transition-colors`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="comment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('reviewForm.commentOptional')}
                </label>
                <textarea
                    id="comment"
                    rows={4}
                    className="w-full p-2 border dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder={t('reviewForm.placeholder')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={submitting}>
                {submitting ? t('reviewForm.submitting') : t('reviewForm.submit')}
            </Button>
        </form>
    );
}
