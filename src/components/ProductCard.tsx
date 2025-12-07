import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const isOutOfStock = product.cantidad_en_tienda <= 0;
    const inWishlist = isInWishlist(product.id);

    return (
        <div className="group relative flex flex-col h-full overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
            <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
                <div className="aspect-square overflow-hidden bg-gray-100">
                    {product.imagen_producto ? (
                        <img
                            src={product.imagen_producto}
                            alt={product.nombre}
                            className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                            {t('common.noImage')}
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full ${inWishlist ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'} shadow-sm transition-colors z-10`}
                        title={product && inWishlist ? t('product.wishlist.remove') : t('product.wishlist.add')}
                    >
                        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
                                {t('common.outOfStock')}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.nombre}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.descripcion}</p>
                </div>
            </Link >
            <div className="px-4 pb-4">
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">{t('common.price', { price: product.precio_venta.toFixed(2) })}</p>
                    <Button
                        size="sm"
                        disabled={isOutOfStock}
                        onClick={() => {
                            if (!user) {
                                navigate('/login');
                            } else {
                                navigate(`/product/${product.id}`);
                            }
                        }}
                        className={isOutOfStock ? 'opacity-50' : ''}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {t('common.addToCart')}
                    </Button>
                </div>
            </div>
        </div >
    );
}
