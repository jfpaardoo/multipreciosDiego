import { useComparison } from '../context/ComparisonContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { X, ShoppingCart, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function ComparePage() {
    const { selectedProducts, removeFromCompare, clearComparison } = useComparison();
    const { addItem } = useCart();

    if (selectedProducts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <SEO title="Comparador de Productos" description="Compara características de tus productos favoritos" />
                <div className="max-w-md mx-auto space-y-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">No hay productos para comparar</h1>
                    <p className="text-gray-500">
                        Añade productos a la lista de comparación mientras navegas por la tienda.
                    </p>
                    <Link to="/">
                        <Button className="mt-4">
                            Volver a la tienda
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO title="Comparador de Productos" description="Compara características de tus productos favoritos" />
            
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Comparador de Productos</h1>
                <Button variant="outline" onClick={clearComparison} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Limpiar todo
                </Button>
            </div>

            <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-left w-48 bg-gray-50">Características</th>
                            {selectedProducts.map(product => (
                                <th key={product.id} className="p-4 w-64 align-top border-l relative">
                                    <button
                                        onClick={() => removeFromCompare(product.id)}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                                        title="Eliminar"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                        {product.imagen_producto ? (
                                            <img
                                                src={product.imagen_producto}
                                                alt={product.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>
                                    <Link to={`/product/${product.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 block mb-2">
                                        {product.nombre}
                                    </Link>
                                    <div className="text-xl font-bold text-blue-600">
                                        {product.precio_venta.toFixed(2)} €
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr>
                            <td className="p-4 font-medium text-gray-700 bg-gray-50">Disponibilidad</td>
                            {selectedProducts.map(product => (
                                <td key={product.id} className="p-4 border-l">
                                    {product.cantidad_en_tienda > 0 ? (
                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                            En Stock ({product.cantidad_en_tienda})
                                        </span>
                                    ) : (
                                        <span className="text-red-500 font-medium flex items-center gap-1">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            Agotado
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-gray-700 bg-gray-50">Categoría</td>
                            {selectedProducts.map(product => (
                                <td key={product.id} className="p-4 border-l text-gray-600">
                                    {product.categorias?.nombre || '-'}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-gray-700 bg-gray-50">Descripción</td>
                            {selectedProducts.map(product => (
                                <td key={product.id} className="p-4 border-l text-sm text-gray-600">
                                    <p className="line-clamp-4">{product.descripcion || '-'}</p>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-medium text-gray-700 bg-gray-50">Acción</td>
                            {selectedProducts.map(product => (
                                <td key={product.id} className="p-4 border-l">
                                    <Button 
                                        className="w-full"
                                        disabled={product.cantidad_en_tienda <= 0}
                                        onClick={() => addItem(product)}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Añadir
                                    </Button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
