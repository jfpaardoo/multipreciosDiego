import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/alert';
import { LogIn } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Mensajes de error más amigables
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Correo o contraseña incorrectos. Por favor verifica tus datos.');
                }
                if (error.message.includes('Email not confirmed')) {
                    throw new Error('Tu cuenta aún no ha sido confirmada. Revisa tu correo electrónico.');
                }
                if (error.message.includes('Email') || error.message.includes('email')) {
                    throw new Error('Por favor ingresa un correo electrónico válido.');
                }
                throw new Error(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
            }

            // Check user profile to determine redirect
            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('rol')
                    .eq('id', data.user.id)
                    .single();

                // Redirect admin users to dashboard
                if (profile?.rol === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Error al iniciar sesión. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Bienvenido de nuevo</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa a tu cuenta para gestionar tus pedidos
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <Input
                            label="Correo electrónico"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <Alert
                            type="error"
                            title="Error al iniciar sesión"
                            message={error}
                            onClose={() => setError(null)}
                        />
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Iniciando sesión...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <LogIn className="h-4 w-4" />
                                Iniciar Sesión
                            </span>
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">¿No tienes cuenta? </span>
                        <Link to="/register" className="font-medium text-black hover:underline">
                            Regístrate aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
