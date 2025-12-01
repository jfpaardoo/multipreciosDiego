
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
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

// Admin Pages
import { AdminIssues } from './pages/admin/AdminIssues';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminPanel } from './pages/admin/AdminPanel';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            {/* Public Routes */}
                            <Route index element={<Home />} />
                            <Route path="product/:id" element={<ProductDetails />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="faq" element={<FAQ />} />
                            <Route path="admin-setup" element={<AdminSetup />} />

                            {/* Customer Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="checkout" element={<Checkout />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="cart" element={<Checkout />} /> {/* Cart is handled in Checkout page for simplicity */}
                                <Route path="issues" element={<Issues />} />
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
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
