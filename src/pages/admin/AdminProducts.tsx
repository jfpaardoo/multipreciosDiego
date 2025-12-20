import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export function AdminProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data: productsData, error: productsError } = await supabase
            .from('productos')
            .select('*, categorias(nombre)')
            .order('created_at', { ascending: false });

        if (!productsError) setProducts(productsData || []);
    };


    const openDeleteModal = (id: string) => {
        setProductToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        const { error } = await supabase
            .from('productos')
            .delete()
            .eq('id', productToDelete);

        if (!error) fetchProducts();
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Gestión de Productos</h1>
                <Button onClick={() => navigate('/admin/products/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                </Button>
            </div>



            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.imagen_producto || ''} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                                            <div className="text-sm text-gray-500">{product.categorias?.nombre}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.referencia}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.precio_venta} €</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.cantidad_en_tienda > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.cantidad_en_tienda}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => navigate(`/admin/products/${product.id}`)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => openDeleteModal(product.id)} className="text-red-600 hover:text-red-900">
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Product Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Eliminar producto</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setProductToDelete(null);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
