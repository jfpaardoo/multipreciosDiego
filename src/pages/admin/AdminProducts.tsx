import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash, X } from 'lucide-react';

export function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setProducts(data || []);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentProduct.id) {
                // Update
                const { error } = await supabase
                    .from('productos')
                    .update(currentProduct)
                    .eq('id', currentProduct.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('productos')
                    .insert([{ ...currentProduct, referencia: currentProduct.referencia || `REF${Date.now()}` }]);
                if (error) throw error;
            }
            setIsEditing(false);
            setCurrentProduct({});
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        const { error } = await supabase
            .from('productos')
            .delete()
            .eq('id', id);

        if (!error) fetchProducts();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Gestión de Productos</h1>
                <Button onClick={() => { setCurrentProduct({}); setIsEditing(true); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                </Button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentProduct.id ? 'Editar' : 'Crear'} Producto</h2>
                            <button onClick={() => setIsEditing(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <Input
                                label="Nombre"
                                value={currentProduct.nombre || ''}
                                onChange={e => setCurrentProduct({ ...currentProduct, nombre: e.target.value })}
                                required
                            />
                            <Input
                                label="Referencia"
                                value={currentProduct.referencia || ''}
                                onChange={e => setCurrentProduct({ ...currentProduct, referencia: e.target.value })}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    className="w-full border rounded-md p-2 text-sm"
                                    rows={3}
                                    value={currentProduct.descripcion || ''}
                                    onChange={e => setCurrentProduct({ ...currentProduct, descripcion: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Precio"
                                    type="number"
                                    step="0.01"
                                    value={currentProduct.precio || ''}
                                    onChange={e => setCurrentProduct({ ...currentProduct, precio: parseFloat(e.target.value) })}
                                    required
                                />
                                <Input
                                    label="Stock"
                                    type="number"
                                    value={currentProduct.stock || ''}
                                    onChange={e => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <Input
                                label="Categoría"
                                value={currentProduct.categoria || ''}
                                onChange={e => setCurrentProduct({ ...currentProduct, categoria: e.target.value })}
                            />
                            <Input
                                label="URL Imagen"
                                value={currentProduct.imagen_url || ''}
                                onChange={e => setCurrentProduct({ ...currentProduct, imagen_url: e.target.value })}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    checked={currentProduct.activo ?? true}
                                    onChange={e => setCurrentProduct({ ...currentProduct, activo: e.target.checked })}
                                />
                                <label htmlFor="activo" className="text-sm font-medium">Activo</label>
                            </div>
                            <Button type="submit" className="w-full">Guardar</Button>
                        </form>
                    </div>
                </div>
            )}

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
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.imagen_url || ''} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                                            <div className="text-sm text-gray-500">{product.categoria}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.referencia}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.precio} €</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => { setCurrentProduct(product); setIsEditing(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
