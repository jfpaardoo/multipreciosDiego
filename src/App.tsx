import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { ProductDetails } from './pages/ProductDetails';
import { FAQ } from './pages/FAQ';
import { Issues } from './pages/Issues';
import { AdminSetup } from './pages/AdminSetup';
import { PrivacyPolicy, LegalNotice, Terms } from './pages/LegalPages';
import { Wishlist } from './pages/Wishlist';

// Admin Pages
import { AdminIssues } from './pages/admin/AdminIssues';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminPanel } from './pages/admin/AdminPanel';

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <Routes>
                                <Route path="/" element={<Layout />}>
                                    {/* Public Routes */}
                                    <Route index element={<Home />} />
                                    <Route path="login" element={<Login />} />
                                    <Route path="register" element={<Register />} />
                                    <Route path="admin-setup" element={<AdminSetup />} />
                                    <Route path="privacidad" element={<PrivacyPolicy />} />
                                    <Route path="aviso-legal" element={<LegalNotice />} />
                                    <Route path="terminos" element={<Terms />} />

                                    {/* Customer Routes */}
                                    <Route element={<ProtectedRoute />}>
                                        <Route path="product/:id" element={<ProductDetails />} />
                                        <Route path="faq" element={<FAQ />} />
                                        <Route path="checkout" element={<Checkout />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="cart" element={<Checkout />} />
                                        <Route path="issues" element={<Issues />} />
                                        <Route path="wishlist" element={<Wishlist />} />
                                    </Route>

                                    {/* Admin Routes */}
                                    <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ENCARGADO']} />}>
                                        <Route path="admin" element={<AdminPanel />} />
                                        <Route path="admin/users" element={<AdminUsers />} />
                                        <Route path="admin/issues" element={<AdminIssues />} />
                                    </Route>
                                </Route>
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
