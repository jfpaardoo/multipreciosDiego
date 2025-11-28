import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const isOutOfStock = product.stock <= 0;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
            <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-gray-100">
                    {product.imagen_url ? (
                        <img
                            src={product.imagen_url}
                            alt={product.nombre}
                            className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                            No imagen
                        </div>
                    )}
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
                                Agotado
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.nombre}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.descripcion}</p>
                </div>
            </Link>
            <div className="px-4 pb-4">
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">{product.precio.toFixed(2)} €</p>
                    <Button
                        size="sm"
                        disabled={isOutOfStock}
                        onClick={() => addItem(product)}
                        className={isOutOfStock ? 'opacity-50' : ''}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Añadir
                    </Button>
                </div>
            </div>
        </div>
    );
}
