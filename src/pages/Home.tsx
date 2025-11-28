import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../components/ui/Input';
import { Search } from 'lucide-react';

export function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('productos')
                .select('*, categorias(nombre)')
                .eq('activo', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setProducts(data || []);

            // Extract unique categories
            const uniqueCategories = Array.from(new Set(data?.map(p => p.categorias?.nombre).filter(Boolean) as string[]));
            setCategories(['Todos', ...uniqueCategories]);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'Todos' || product.categorias?.nombre === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return <div className="flex justify-center py-12">Cargando catálogo...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-black text-white rounded-2xl p-8 md:p-12 text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Bienvenido a Multiprecios Diego</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Encuentra todo lo que necesitas al mejor precio. Desde electrónica hasta artículos para el hogar.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${categoryFilter === cat
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No se encontraron productos.</p>
                    <p className="mt-2 text-sm">Prueba a ajustar los filtros o vuelve más tarde.</p>
                </div>
            )}
        </div>
    );
}
