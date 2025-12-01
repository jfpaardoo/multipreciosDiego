import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminSetup() {
    const navigate = useNavigate();
    const { user, profile, isAdmin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [seedLoading, setSeedLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nombre: name,
                        rol: 'ADMIN' // Hardcoded ADMIN role
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                setMessage({
                    type: 'success',
                    text: 'Administrador creado correctamente. Por favor verifica tu email si es necesario o inicia sesión.'
                });
                // Optional: clear form
                setEmail('');
                setPassword('');
                setName('');
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Error al crear administrador'
            });
        } finally {
            setLoading(false);
        }
    };

    const seedProducts = async () => {
        if (!isAdmin) {
            setMessage({ type: 'error', text: 'Debes iniciar sesión como administrador para añadir productos.' });
            return;
        }

        setSeedLoading(true);
        setMessage(null);
        try {
            // Fetch categories first
            const { data: categories } = await supabase.from('categorias').select('id, nombre');

            if (!categories || categories.length === 0) {
                throw new Error('No hay categorías. Crea categorías primero.');
            }

            const dummyProducts = [
                { nombre: 'Auriculares Bluetooth', descripcion: 'Auriculares inalámbricos con cancelación de ruido.', precio_venta: 29.99, cantidad_en_tienda: 50, imagen_producto: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Mochila Escolar', descripcion: 'Mochila resistente con compartimento para portátil.', precio_venta: 22.50, cantidad_en_tienda: 30, imagen_producto: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Árbol de Navidad', descripcion: 'Árbol artificial de 180cm, frondoso.', precio_venta: 45.50, cantidad_en_tienda: 10, imagen_producto: 'https://images.unsplash.com/photo-1544967082-d9d3fdd0136d?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Lámpara LED Escritorio', descripcion: 'Lámpara flexible con 3 modos de luz.', precio_venta: 15.99, cantidad_en_tienda: 25, imagen_producto: 'https://images.unsplash.com/photo-1534073828943-f801091a7d58?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Juego de Sábanas', descripcion: 'Sábanas de algodón 100% para cama de 135cm.', precio_venta: 19.99, cantidad_en_tienda: 40, imagen_producto: 'https://images.unsplash.com/photo-1522771753035-1a5b65dd2975?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Altavoz Inteligente', descripcion: 'Asistente de voz con sonido de alta calidad.', precio_venta: 39.99, cantidad_en_tienda: 15, imagen_producto: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Reloj de Pared', descripcion: 'Reloj moderno y silencioso para salón.', precio_venta: 12.50, cantidad_en_tienda: 20, imagen_producto: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Set de Tazas', descripcion: 'Pack de 6 tazas de cerámica de colores.', precio_venta: 9.99, cantidad_en_tienda: 60, imagen_producto: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Alfombra de Baño', descripcion: 'Alfombra antideslizante y absorbente.', precio_venta: 8.50, cantidad_en_tienda: 35, imagen_producto: 'https://images.unsplash.com/photo-1576426863863-10d786a30324?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Cojín Decorativo', descripcion: 'Cojín suave con diseño geométrico.', precio_venta: 7.99, cantidad_en_tienda: 45, imagen_producto: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Marco de Fotos', descripcion: 'Marco de madera para fotos 10x15.', precio_venta: 5.99, cantidad_en_tienda: 50, imagen_producto: 'https://images.unsplash.com/photo-1534349762913-96c22559aa9c?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Vela Aromática', descripcion: 'Vela con aroma a vainilla y lavanda.', precio_venta: 4.50, cantidad_en_tienda: 80, imagen_producto: 'https://images.unsplash.com/photo-1602825266977-1495807c1270?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Botella de Agua', descripcion: 'Botella reutilizable de acero inoxidable.', precio_venta: 11.99, cantidad_en_tienda: 25, imagen_producto: 'https://images.unsplash.com/photo-1602143407151-01114192003f?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Cuaderno de Notas', descripcion: 'Cuaderno de tapa dura con hojas rayadas.', precio_venta: 3.50, cantidad_en_tienda: 100, imagen_producto: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80', categoria_id: categories[0].id },
                { nombre: 'Bolígrafos de Gel', descripcion: 'Pack de 10 bolígrafos de colores.', precio_venta: 2.99, cantidad_en_tienda: 150, imagen_producto: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=80', categoria_id: categories[0].id },
            ];

            const { error } = await supabase.from('productos').insert(dummyProducts.map(p => ({
                ...p,
                referencia: `REF-${Math.floor(Math.random() * 10000)}`,
                activo: true
            })));

            if (error) throw error;

            setMessage({ type: 'success', text: 'Productos de prueba añadidos correctamente.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSeedLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center gap-2 text-amber-600 mb-6 bg-amber-50 p-4 rounded-md border border-amber-200">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                        Esta página es solo para desarrollo. Permite crear usuarios con rol ADMIN directamente.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Setup Administrador</h2>

                {message && (
                    <div className={`p-4 rounded-md mb-6 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <p className="text-sm">{message.text}</p>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Admin User"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="******"
                            minLength={6}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Administrador'}
                    </Button>
                </form>

                <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Herramientas de Desarrollo</h3>

                    {!isAdmin && (
                        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center gap-2 text-sm">
                            <Lock className="h-4 w-4" />
                            Debes iniciar sesión como ADMIN para usar estas herramientas.
                        </div>
                    )}

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={seedProducts}
                        disabled={seedLoading || !isAdmin}
                    >
                        {seedLoading ? 'Añadiendo...' : 'Añadir Productos de Prueba'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
