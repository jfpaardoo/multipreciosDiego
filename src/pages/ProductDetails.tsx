import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Product, Valoracion } from '../types';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Star, Minus, Plus, ArrowLeft, Heart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export function ProductDetails() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Valoracion[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
            window.scrollTo(0, 0);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) throw error;

            setProduct(data);
            if (data) {
                fetchRelatedProducts(data.categoria_id, data.id);
                fetchReviews(data.id);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (category: string | null, currentId: string) => {
        if (!category) return;

        const { data } = await supabase
            .from('productos')
            .select('*')
            .eq('categoria_id', category)
            .neq('id', currentId)
            .limit(3);

        setRelatedProducts(data || []);
    };

    const fetchReviews = async (productId: string) => {
        const { data } = await supabase
            .from('valoraciones')
            .select('*, profiles(nombre)')
            .eq('producto_id', productId)
            .order('created_at', { ascending: false });

        setReviews(data || []);
    };

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
    };

    if (loading) return <div className="flex justify-center py-20">{t('common.loading')}</div>;
    if (!product) return <div className="text-center py-20">{t('common.noImage')}</div>; // Using generic placeholder, though maybe "Product not found" would be better if I had a key

    const isOutOfStock = product.cantidad_en_tienda <= 0;

    return (
        <div className="space-y-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('product.back')}
            </button>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {product.imagen_producto ? (
                        <img
                            src={product.imagen_producto}
                            alt={product.nombre}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {t('common.noImage')}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-gray-900">{product.nombre}</h1>

                    <div className="prose text-gray-500">
                        <p>{product.descripcion}</p>
                    </div>

                    <div className="text-3xl font-bold text-gray-900">
                        {t('common.price', { price: product.precio_venta.toFixed(2) })}
                    </div>

                    <div className="text-sm text-gray-500">
                        {t('product.reference')}: {product.referencia}
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="space-y-4 pt-6 border-t">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-md">
                                <button
                                    className="p-2 hover:bg-gray-100"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    className="p-2 hover:bg-gray-100"
                                    onClick={() => setQuantity(Math.min(product.cantidad_en_tienda, quantity + 1))}
                                    disabled={quantity >= product.cantidad_en_tienda}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <span className="text-sm text-gray-500">
                                {product.cantidad_en_tienda} {t('product.available')}
                            </span>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <Button
                                size="lg"
                                className="flex-1 md:w-auto min-w-[200px]"
                                disabled={isOutOfStock}
                                onClick={handleAddToCart}
                            >
                                {isOutOfStock ? t('common.outOfStock') : t('common.addToCart')}
                            </Button>

                            <button
                                onClick={() => product && (isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product))}
                                className={`p-3 rounded-lg border transition-colors ${product && isInWishlist(product.id)
                                    ? 'bg-red-50 border-red-200 text-red-500'
                                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500'
                                    }`}
                                title={product && isInWishlist(product.id) ? t('product.wishlist.remove') : t('product.wishlist.add')}
                            >
                                <Heart className={`h-6 w-6 ${product && isInWishlist(product.id) ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                        {isOutOfStock && (
                            <p className="text-red-500 font-medium">{t('product.tempOutOfStock')}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">{t('product.reviews.title')}</h2>
                {reviews.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border p-6 rounded-lg space-y-4">
                                <div className="flex gap-1 text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i <= review.estrellas ? 'fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                {review.comentario && <p className="text-gray-600">{review.comentario}</p>}
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-gray-500">
                                        {review.profiles?.nombre?.[0] || 'U'}
                                    </div>
                                    <span className="text-sm font-medium">{review.profiles?.nombre || 'Usuario'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">{t('product.reviews.empty')}</p>
                )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">{t('product.related')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
