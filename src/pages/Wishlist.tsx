import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Wishlist() {
    const { t } = useTranslation();
    const { wishlist, loading } = useWishlist();

    if (loading) {
        return <div className="text-center py-20">{t('wishlist.loading')}</div>;
    }

    if (wishlist.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 p-6 rounded-full">
                        <Heart className="w-12 h-12 text-gray-400" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">{t('wishlist.empty.title')}</h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {t('wishlist.empty.subtitle')}
                </p>
                <Link
                    to="/"
                    className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    {t('wishlist.empty.explore')}
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                <h1 className="text-3xl font-bold">{t('wishlist.title')} ({wishlist.length})</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
