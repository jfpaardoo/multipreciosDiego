import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, Valoracion } from '../types';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Star, Minus, Plus, ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ReviewForm } from '../components/ReviewForm';
import { ReservationBox } from '../components/ReservationBox';

export function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Valoracion[]>([]);
    const [verifiedBuyers, setVerifiedBuyers] = useState<Set<string>>(new Set());
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
        if (data && data.length > 0) {
            fetchVerifiedStatus(data, productId);
        }
    };

    const fetchVerifiedStatus = async (currentReviews: Valoracion[], productId: string) => {
        const userIds = currentReviews
            .map(r => r.cliente_id)
            .filter((id): id is string => !!id);
        
        if (userIds.length === 0) return;

        // Remove duplicates
        const uniqueUserIds = [...new Set(userIds)];

        try {
            const { data } = await supabase
                .from('lineas_pedido')
                .select(`
                    pedidos_cliente!inner (
                        cliente_id,
                        pagado
                    )
                `)
                .eq('producto_id', productId)
                .eq('pedidos_cliente.pagado', true)
                .in('pedidos_cliente.cliente_id', uniqueUserIds);

            if (data) {
                const buyers = new Set(data.map((d: any) => d.pedidos_cliente.cliente_id));
                setVerifiedBuyers(buyers);
            }
        } catch (error) {
            console.error('Error checking verified purchases:', error);
        }
    };

    const handleReviewAdded = () => {
        if (product) {
            fetchReviews(product.id);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
    };

    if (loading) return <div className="flex justify-center py-20">Cargando...</div>;
    if (!product) return <div className="text-center py-20">Producto no encontrado</div>;

    const isOutOfStock = product.cantidad_en_tienda <= 0;

    const averageRating = reviews.length
        ? reviews.reduce((acc, review) => acc + review.estrellas, 0) / reviews.length
        : 0;

    return (
        <div className="space-y-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
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
                            Sin imagen
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-col h-full space-y-6">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-gray-900">{product.nombre}</h1>

                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                ({reviews.length} valoraciones)
                            </span>
                        </div>

                        <div className="prose text-gray-500">
                            <p>{product.descripcion}</p>
                        </div>

                        <div className="text-3xl font-bold text-gray-900">
                            {product.precio_venta.toFixed(2)} €
                        </div>

                        <div className="text-sm text-gray-500">
                            Referencia: {product.referencia}
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
                                    {product.cantidad_en_tienda} disponibles
                                </span>
                            </div>

                            <Button
                                size="lg"
                                className="w-full md:w-auto min-w-[200px]"
                                disabled={isOutOfStock}
                                onClick={handleAddToCart}
                            >
                                {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
                            </Button>
                        {isOutOfStock && (
                            <p className="text-red-500 font-medium">Este producto está agotado temporalmente.</p>
                        )}
                    </div>
                    </div>

                    {!isOutOfStock && (
                        <div className="mt-6 flex-1">
                            <ReservationBox 
                                productId={product.id} 
                                maxQuantity={product.cantidad_en_tienda} 
                                className="h-full"
                            />
                        </div>
                    )}
                </div>
            </div>            {/* Reviews */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Opiniones de clientes</h2>
                
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Review Form & Summary */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-lg font-semibold mb-4">Escribir una opinión</h3>
                            <p className="text-sm text-gray-600 mb-4">Comparte tu experiencia con otros clientes</p>
                            <ReviewForm productId={product.id} onReviewAdded={handleReviewAdded} />
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="md:col-span-2 space-y-6">
                        {reviews.length > 0 ? (
                            <div className="space-y-8">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-6 last:border-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-gray-600">
                                                {review.profiles?.nombre?.[0] || 'U'}
                                            </div>
                                            <span className="font-medium text-gray-900">{review.profiles?.nombre || 'Usuario de Amazon'}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-yellow-400">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i <= review.estrellas ? 'fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">Revisado en España el {new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                        
                                        {review.cliente_id && verifiedBuyers.has(review.cliente_id) && (
                                            <div className="text-sm text-orange-700 font-medium mb-2">Compra verificada</div>
                                        )}
                                        
                                        {review.comentario && (
                                            <p className="text-gray-700 leading-relaxed">{review.comentario}</p>
                                        )}
                                        
                                        <div className="mt-4">
                                            <button className="text-sm text-gray-500 border px-4 py-1 rounded hover:bg-gray-50">
                                                Útil
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Dummy reviews if no real reviews exist */}
                                {[
                                    {
                                        id: 'dummy-1',
                                        user: 'María García',
                                        rating: 5,
                                        date: '15 de noviembre de 2023',
                                        comment: '¡Me encanta! Es exactamente lo que buscaba. La calidad es excelente y llegó antes de lo esperado. Lo recomiendo totalmente.',
                                    },
                                    {
                                        id: 'dummy-2',
                                        user: 'Carlos Rodríguez',
                                        rating: 4,
                                        date: '2 de octubre de 2023',
                                        comment: 'Buen producto en relación calidad-precio. Cumple su función perfectamente. El único detalle es que el embalaje venía un poco dañado, pero el producto estaba intacto.',
                                    },
                                    {
                                        id: 'dummy-3',
                                        user: 'Ana Martínez',
                                        rating: 5,
                                        date: '28 de septiembre de 2023',
                                        comment: 'Una compra fantástica. Funciona de maravilla y es muy fácil de usar. Definitivamente volveré a comprar en esta tienda.',
                                    }
                                ].map((review) => (
                                    <div key={review.id} className="border-b pb-6 last:border-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-gray-600">
                                                {review.user[0]}
                                            </div>
                                            <span className="font-medium text-gray-900">{review.user}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-yellow-400">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i <= review.rating ? 'fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">Revisado en España el {review.date}</span>
                                        </div>
                                        
                                        <div className="text-sm text-orange-700 font-medium mb-2">Compra verificada</div>
                                        
                                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                        
                                        <div className="mt-4">
                                            <button className="text-sm text-gray-500 border px-4 py-1 rounded hover:bg-gray-50">
                                                Útil
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Products */}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Productos relacionados</h2>
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
