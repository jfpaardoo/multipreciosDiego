import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
    const [categories, setCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter]);

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

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) {
        return <div className="flex justify-center py-12">Cargando catálogo...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 rounded-3xl p-1">
                <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 md:p-16">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium border border-white/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Nuevos productos cada semana
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-200">
                                Multiprecios Diego
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                            Encuentra todo lo que necesitas al <span className="text-cyan-300 font-semibold">mejor precio</span>.
                            Desde electrónica hasta artículos para el hogar, con la mejor calidad y servicio.
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <div className="text-3xl md:text-4xl font-bold text-white">{products.length}+</div>
                                <div className="text-cyan-200 text-sm md:text-base mt-1">Productos</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <div className="text-3xl md:text-4xl font-bold text-white">{categories.length - 1}</div>
                                <div className="text-cyan-200 text-sm md:text-base mt-1">Categorías</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
                                <div className="text-cyan-200 text-sm md:text-base mt-1">Atención</div>
                            </div>
                        </div>
                    </div>
                </div>
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
            {paginatedProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No se encontraron productos.</p>
                    <p className="mt-2 text-sm">Prueba a ajustar los filtros o vuelve más tarde.</p>
                </div>
            )}
        </div>
    );
}
