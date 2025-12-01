import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PedidoCliente, EstadoPedidoCliente, Product, Categoria } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/Input';
import { Plus, X } from 'lucide-react';

export function AdminDashboard() {
    // Orders state
    const [orders, setOrders] = useState<PedidoCliente[]>([]);
    const [searchOrder, setSearchOrder] = useState('');

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [searchProduct, setSearchProduct] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    // ===== ORDERS SECTION =====
    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('pedidos_cliente')
            .select('*, profiles(nombre, apellidos)')
            .order('created_at', { ascending: false });

        if (!error) setOrders(data || []);
    };

    const updateStatus = async (orderId: string, newStatus: EstadoPedidoCliente) => {
        const { error } = await supabase
            .from('pedidos_cliente')
            .update({ estado: newStatus })
            .eq('id', orderId);

        if (!error) fetchOrders();
    };

    const filteredOrders = orders.filter(order => {
        const searchLower = searchOrder.toLowerCase();
        const clientName = `${(order as any).profiles?.nombre || ''} ${(order as any).profiles?.apellidos || ''}`.toLowerCase();
        return (
            order.id.toLowerCase().includes(searchLower) ||
            clientName.includes(searchLower) ||
            order.estado.toLowerCase().includes(searchLower)
        );
    });

    // ===== PRODUCTS SECTION =====
    const fetchProducts = async () => {
        const { data: productsData, error: productsError } = await supabase
            .from('productos')
            .select('*, categorias(nombre)')
            .order('created_at', { ascending: false });

        const { data: categoriesData } = await supabase
            .from('categorias')
            .select('*')
            .order('nombre');

        if (!productsError) setProducts(productsData || []);
        if (categoriesData) setCategories(categoriesData);
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

    const filteredProducts = products.filter(product => {
        const searchLower = searchProduct.toLowerCase();
        return (
            product.nombre.toLowerCase().includes(searchLower) ||
            product.referencia.toLowerCase().includes(searchLower) ||
            (product.categorias?.nombre || '').toLowerCase().includes(searchLower)
        );
    });

    const getTipoLabel = (aDomicilio: boolean) => {
        return aDomicilio ? 'A domicilio' : 'Recogida';
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900">Gestión del negocio</h1>
            </div>

            {/* ===== ORDERS SECTION ===== */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Gestión de pedidos</h2>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="Buscar por pedido, cliente..."
                            value={searchOrder}
                            onChange={(e) => setSearchOrder(e.target.value)}
                            className="max-w-md"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nº pedido
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pago
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Método de pago
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.id.slice(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {(order as any).profiles?.nombre} {(order as any).profiles?.apellidos || ''}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.estado}
                                                onChange={(e) => updateStatus(order.id, e.target.value as EstadoPedidoCliente)}
                                                className="text-xs px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="EN_PREPARACION">En preparación</option>
                                                <option value="ENVIADO">Enviado</option>
                                                <option value="EN_REPARTO">En reparto</option>
                                                <option value="ENTREGADO">Entregado</option>
                                                <option value="CANCELADO">Cancelado</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                order.pagado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {order.pagado ? 'Pagado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.metodo_pago}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.fecha_hora_pedido).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getTipoLabel(order.a_domicilio)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ===== PRODUCTS SECTION ===== */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Gestión de productos</h2>
                </div>
                <div className="p-6">
                    <div className="mb-4 flex gap-4 items-center">
                        <Input
                            type="text"
                            placeholder="Buscar por artículo, categoría..."
                            value={searchProduct}
                            onChange={(e) => setSearchProduct(e.target.value)}
                            className="max-w-md flex-1"
                        />
                        <Button
                            onClick={() => {
                                setCurrentProduct({});
                                setIsEditing(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Añadir producto
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Referencia
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {product.imagen_producto ? (
                                                        <img
                                                            className="h-10 w-10 rounded object-cover"
                                                            src={product.imagen_producto}
                                                            alt={product.nombre}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                                                            Sin img
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.categorias?.nombre || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.referencia}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.precio_venta.toFixed(2)} €
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                product.cantidad_en_tienda > 0 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.cantidad_en_tienda}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setCurrentProduct(product);
                                                    setIsEditing(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Product Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentProduct.id ? 'Editar' : 'Crear'} Producto</h2>
                            <button onClick={() => setIsEditing(false)}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <Input
                                label="Nombre"
                                value={currentProduct.nombre || ''}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, nombre: e.target.value })}
                                required
                            />
                            <Input
                                label="Referencia"
                                value={currentProduct.referencia || ''}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, referencia: e.target.value })}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    className="w-full border rounded-md p-2 text-sm"
                                    rows={3}
                                    value={currentProduct.descripcion || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, descripcion: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Precio Venta"
                                    type="number"
                                    step="0.01"
                                    value={currentProduct.precio_venta || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, precio_venta: parseFloat(e.target.value) })}
                                    required
                                />
                                <Input
                                    label="Precio Mayor"
                                    type="number"
                                    step="0.01"
                                    value={currentProduct.precio_por_mayor || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, precio_por_mayor: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <Input
                                label="Stock (Tienda)"
                                type="number"
                                value={currentProduct.cantidad_en_tienda || ''}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, cantidad_en_tienda: parseInt(e.target.value) })}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium mb-1">Categoría</label>
                                <select
                                    className="w-full border rounded-md p-2 text-sm"
                                    value={currentProduct.categoria_id || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, categoria_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="URL Imagen"
                                value={currentProduct.imagen_producto || ''}
                                onChange={(e) => setCurrentProduct({ ...currentProduct, imagen_producto: e.target.value })}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    checked={currentProduct.activo ?? true}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, activo: e.target.checked })}
                                />
                                <label htmlFor="activo" className="text-sm font-medium">
                                    Activo
                                </label>
                            </div>
                            <Button type="submit" className="w-full">
                                Guardar
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
