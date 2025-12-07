import React from 'react';

import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, Instagram, Facebook, Store, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from './ui/button';
import { LanguageSelector } from './LanguageSelector';


export function Layout() {
    const { t } = useTranslation();
    const { user, profile, signOut, isAdmin, isEncargado } = useAuth();
    const { itemCount } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
        setShowLogoutModal(false);
    };

    // Redirect admin users to dashboard on initial load
    React.useEffect(() => {
        if (profile?.rol === 'ADMIN' && window.location.pathname === '/') {
            navigate('/admin');
        }
    }, [profile, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold tracking-tight relative z-10 flex items-center gap-2">
                        <img src="/logo.png" alt="MD Logo" className="h-14 w-auto object-contain" />
                        Multiprecios Diego
                    </Link>

                    <div className="hidden md:flex items-center gap-6 ml-6">
                        <a href="https://www.instagram.com/multipreciosdiego/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="https://www.facebook.com/people/Multiprecios-Diego/100063796103056/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                            <Facebook className="h-5 w-5" />
                        </a>
                    </div>

                    <div className="flex-1" />

                    <div className="hidden md:flex items-center gap-6 mr-4">
                        {user && !isAdmin && (
                            <Link to="/faq" className="text-sm font-medium hover:underline">{t('layout.nav.faq')}</Link>
                        )}
                        {isAdmin && (
                            <>
                                {location.pathname !== '/admin' && (
                                    <Link to="/admin" className="text-sm font-medium hover:underline">{t('layout.nav.adminPanel')}</Link>
                                )}
                                {location.pathname !== '/admin/users' && (
                                    <Link to="/admin/users" className="text-sm font-medium hover:underline">{t('layout.nav.users')}</Link>
                                )}
                            </>
                        )}
                        <LanguageSelector />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Cart - Hidden for admin users and logged out users */}
                        {user && !isAdmin && (
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
                        )}

                        {!isAdmin && user && (
                            <Link to="/wishlist">
                                <Button variant="ghost" size="icon" className="relative">
                                    <Heart className="h-5 w-5" />
                                    {wishlist.length > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                            {wishlist.length}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        )}

                        {/* User Menu */}
                        {user ? (
                            <div className="relative group">
                                <Button variant="ghost" className="gap-2 h-auto py-2 px-3">
                                    {profile?.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt={profile.nombre || 'Usuario'}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                    <span className="hidden md:inline text-sm font-medium">
                                        {profile?.nombre || user.email?.split('@')[0]}
                                    </span>
                                </Button>
                                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                                    <div className="bg-white rounded-md shadow-lg py-1 border">
                                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                                            {profile?.nombre || user.email}
                                        </div>
                                        {!isAdmin && location.pathname !== '/profile' && (
                                            <>
                                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    {t('layout.userMenu.profile')}
                                                </Link>
                                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    {t('layout.userMenu.orders')}
                                                </Link>
                                            </>
                                        )}
                                        {isAdmin && location.pathname !== '/profile' && (
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                {t('layout.userMenu.profile')}
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => setShowLogoutModal(true)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            {t('layout.userMenu.logout')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/register">
                                    <Button variant="ghost" size="sm">{t('layout.auth.register')}</Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="primary" size="sm">{t('layout.auth.login')}</Button>
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
                                {t('layout.nav.catalog')}
                            </Link>
                            {(isAdmin || isEncargado) && (
                                <>
                                    {isAdmin && (
                                        <>
                                            {location.pathname !== '/admin' && (
                                                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                                    {t('layout.nav.adminPanel')}
                                                </Link>
                                            )}
                                            {location.pathname !== '/admin/users' && (
                                                <Link to="/admin/users" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                                    {t('layout.nav.users')}
                                                </Link>
                                            )}
                                        </>
                                    )}
                                    <Link to="/admin/issues" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                        {t('layout.nav.issues')}
                                    </Link>
                                </>
                            )}
                            {user && !isAdmin && (
                                <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="py-2 text-sm font-medium">
                                    {t('layout.nav.faq')}
                                </Link>
                            )}
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
                    {!isAdmin && (
                        <div className="text-center space-y-4">
                            <h3 className="font-bold text-gray-900">{t('layout.footer.contact')}</h3>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p>
                                    <span className="font-medium">{t('layout.footer.address')}:</span>{' '}
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Calle+Ronda+67,+Puerto+Serrano+(Cádiz)"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline hover:text-blue-600"
                                    >
                                        Calle Ronda 67, Puerto Serrano (Cádiz)
                                    </a>
                                </p>
                                <p>
                                    <span className="font-medium">{t('layout.footer.email')}:</span>{' '}
                                    <a
                                        href="mailto:multipreciosdiego@gmail.com"
                                        className="hover:underline hover:text-blue-600"
                                    >
                                        multipreciosdiego@gmail.com
                                    </a>
                                </p>
                                <p><span className="font-medium">{t('layout.footer.phone')}:</span> 635 48 59 43</p>
                            </div>
                        </div>
                    )}
                    <div className={`${!isAdmin ? 'mt-8 pt-8 border-t border-gray-200' : ''} text-center text-sm text-gray-500`}>
                        <div className="flex justify-center gap-6 mb-4">
                            <Link to="/privacidad" className="hover:underline">{t('layout.footer.privacy')}</Link>
                            <Link to="/aviso-legal" className="hover:underline">{t('layout.footer.legal')}</Link>
                            <Link to="/terminos" className="hover:underline">{t('layout.footer.terms')}</Link>
                        </div>
                        © {new Date().getFullYear()} Multiprecios Diego. {t('layout.footer.rights')}.
                    </div>
                </div>
            </footer>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Confirmación</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            ¿Estás seguro de que quieres cerrar sesión?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSignOut}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Sí, cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
