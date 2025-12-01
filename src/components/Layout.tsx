import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';


export function Layout() {
    const { user, profile, signOut, isAdmin, isEncargado } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    // Redirect admin users to dashboard on initial load
    React.useEffect(() => {
        if (profile?.rol === 'ADMIN' && window.location.pathname === '/') {
            navigate('/admin/dashboard');
        }
    }, [profile, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold tracking-tight relative z-10">
                        Multiprecios Diego
                    </Link>

                    <div className="flex-1" />

                    <div className="hidden md:flex items-center gap-6 mr-4">
                        <Link to="/faq" className="text-sm font-medium hover:underline">FAQ</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Admin/Encargado Links */}
                        {(isAdmin || isEncargado) && (
                            <div className="hidden md:flex gap-2 mr-2">
                                {isAdmin && (
                                    <Link to="/admin/dashboard">
                                        <Button variant="ghost" size="sm">Dashboard</Button>
                                    </Link>
                                )}
                                <Link to="/admin/products">
                                    <Button variant="ghost" size="sm">Productos</Button>
                                </Link>
                                <Link to="/admin/orders">
                                    <Button variant="ghost" size="sm">Pedidos</Button>
                                </Link>
                            </div>
                        )}

                        {/* Cart */}
                        <Link to="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-600 text-xs text-white flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative group">
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                                    <div className="bg-white rounded-md shadow-lg py-1 border">
                                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                                            {profile?.nombre || user.email}
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Mi Perfil
                                        </Link>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Mis Pedidos
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/register">
                                    <Button variant="ghost" size="sm">Registrarse</Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="primary" size="sm">Iniciar Sesión</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t p-4 space-y-4 bg-white">
                        <nav className="flex flex-col gap-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                Catálogo
                            </Link>
                            {(isAdmin || isEncargado) && (
                                <>
                                    {isAdmin && (
                                        <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link to="/admin/products" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                        Gestión Productos
                                    </Link>
                                    <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                        Gestión Pedidos
                                    </Link>
                                    <Link to="/admin/issues" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                        Gestión Incidencias
                                    </Link>
                                </>
                            )}
                            <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                FAQ
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-4">
                        <h3 className="font-bold text-gray-900">Datos de contacto</h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p><span className="font-medium">Dirección:</span> Calle Ronda 67, Puerto Serrano (Cádiz)</p>
                            <p><span className="font-medium">Correo:</span> multipreciosdiego@gmail.com</p>
                            <p><span className="font-medium">Teléfono:</span> 635 48 59 43</p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Multiprecios Diego. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}
