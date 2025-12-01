import React, { useState, useEffect } from 'react';
import { Product, Categoria } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ProductFormProps {
    initialData?: Partial<Product>;
    isEditing?: boolean;
}

export function ProductForm({ initialData = {}, isEditing = false }: ProductFormProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<Product>>(initialData);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const fetchCategories = async () => {
        const { data } = await supabase
            .from('categorias')
            .select('*')
            .order('nombre');
        if (data) setCategories(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing && formData.id) {
                const { error } = await supabase
                    .from('productos')
                    .update(formData)
                    .eq('id', formData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('productos')
                    .insert([{ ...formData, referencia: formData.referencia || `REF${Date.now()}` }]);
                if (error) throw error;
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Nombre"
                    value={formData.nombre || ''}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    required
                />
                <Input
                    label="Referencia"
                    value={formData.referencia || ''}
                    onChange={e => setFormData({ ...formData, referencia: e.target.value })}
                    required
                    placeholder="Dejar vacío para autogenerar"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Descripción</label>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={formData.descripcion || ''}
                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Precio Venta (€)"
                    type="number"
                    step="0.01"
                    value={formData.precio_venta || ''}
                    onChange={e => setFormData({ ...formData, precio_venta: parseFloat(e.target.value) })}
                    required
                />
                <Input
                    label="Precio Mayor (€)"
                    type="number"
                    step="0.01"
                    value={formData.precio_por_mayor || ''}
                    onChange={e => setFormData({ ...formData, precio_por_mayor: parseFloat(e.target.value) })}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Stock (Tienda)"
                    type="number"
                    value={formData.cantidad_en_tienda || ''}
                    onChange={e => setFormData({ ...formData, cantidad_en_tienda: parseInt(e.target.value) })}
                    required
                />
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Categoría</label>
                    <select
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.categoria_id || ''}
                        onChange={e => setFormData({ ...formData, categoria_id: e.target.value })}
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            <Input
                label="URL Imagen"
                value={formData.imagen_producto || ''}
                onChange={e => setFormData({ ...formData, imagen_producto: e.target.value })}
                placeholder="https://..."
            />

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="activo"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.activo ?? true}
                    onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">Producto Activo</label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
                </Button>
            </div>
        </form>
    );
}
