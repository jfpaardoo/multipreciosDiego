import { useComparison } from '../context/ComparisonContext';
import { Link } from 'react-router-dom';
import { X, ArrowLeftRight } from 'lucide-react';
import { Button } from './ui/button';

export function ComparisonFloatingBar() {
    const { selectedProducts, removeFromCompare, clearComparison } = useComparison();

    if (selectedProducts.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mr-4 whitespace-nowrap">
                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                {selectedProducts.length}
                            </span>
                            Productos seleccionados
                        </div>
                        
                        <div className="flex gap-3">
                            {selectedProducts.map(product => (
                                <div key={product.id} className="relative group w-12 h-12 bg-gray-100 rounded border flex-shrink-0">
                                    {product.imagen_producto ? (
                                        <img 
                                            src={product.imagen_producto} 
                                            alt={product.nombre} 
                                            className="w-full h-full object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                            Img
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeFromCompare(product.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pl-4 border-l ml-4">
                        <button 
                            onClick={clearComparison}
                            className="text-sm text-gray-500 hover:text-red-600 hidden md:block"
                        >
                            Limpiar
                        </button>
                        <Link to="/compare">
                            <Button className="whitespace-nowrap">
                                <ArrowLeftRight className="w-4 h-4 mr-2" />
                                Comparar ahora
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
