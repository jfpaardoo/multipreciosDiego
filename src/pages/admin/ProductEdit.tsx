import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductForm } from '../../components/admin/ProductForm';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';

export function ProductEdit() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Partial<Product>>({});
    const [loading, setLoading] = useState(!!id);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    const fetchProduct = async (productId: string) => {
        try {
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) throw error;
            if (data) setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Cargando...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{id ? 'Editar Producto' : 'Nuevo Producto'}</h1>
            <ProductForm initialData={product} isEditing={!!id} />
        </div>
    );
}
