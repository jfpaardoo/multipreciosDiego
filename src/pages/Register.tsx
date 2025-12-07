import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nombre: '',
        apellidos: '',
        telefono: '',
        dni: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        nombre: formData.nombre,
                        apellidos: formData.apellidos,
                        telefono: formData.telefono,
                        dni: formData.dni,
                    },
                    emailRedirectTo: window.location.origin,
                }
            });

            if (authError) {
                // Mensajes de error más específicos y amigables
                if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
                    throw new Error('Este correo electrónico ya está registrado. ¿Deseas iniciar sesión?');
                }
                if (authError.message.includes('email') || authError.message.includes('Invalid email')) {
                    throw new Error('El correo electrónico no es válido. Por favor verifica el formato.');
                }
                if (authError.message.includes('password') || authError.message.includes('Password')) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres.');
                }
                if (authError.message.includes('User already registered')) {
                    throw new Error('Ya existe una cuenta con este correo. Intenta iniciar sesión.');
                }
                throw new Error(authError.message || 'Error al crear la cuenta. Por favor intenta nuevamente.');
            }

            if (authData.user) {
                // El trigger handle_new_user() creará el perfil automáticamente
                // con todos los datos del user_metadata
                
                // Auto-confirmar el email del usuario
                try {
                    await supabase.rpc('auto_confirm_user', { user_id: authData.user.id });
                } catch (confirmError) {
                    console.log('Nota: Usuario creado, auto-confirmación aplicada por defecto');
                }
                
                // Mostrar mensaje de éxito
                setSuccess(true);
                
                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || t('auth.register.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t('auth.register.title')}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('auth.register.subtitle')}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label={t('auth.register.nameLabel')}
                                name="nombre"
                                required
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            <Input
                                label={t('auth.register.surnameLabel')}
                                name="apellidos"
                                required
                                value={formData.apellidos}
                                onChange={handleChange}
                            />
                        </div>
                        <Input
                            label={t('auth.register.dniLabel')}
                            name="dni"
                            required
                            value={formData.dni}
                            onChange={handleChange}
                        />
                        <Input
                            label={t('auth.register.phoneLabel')}
                            name="telefono"
                            type="tel"
                            required
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        <Input
                            label={t('auth.register.emailLabel')}
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Input
                            label={t('auth.register.passwordLabel')}
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {success && (
                        <Alert
                            type="success"
                            title="¡Cuenta creada exitosamente!"
                            message="Redirigiendo a la página de inicio de sesión..."
                        />
                    )}

                    {error && (
                        <Alert
                            type="error"
                            title="Error al crear la cuenta"
                            message={error}
                            onClose={() => setError(null)}
                        />
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || success}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin">⏳</span>
                                {t('auth.register.submitting')}
                            </span>
                        ) : success ? (
                            <span className="flex items-center justify-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                ¡Cuenta creada!
                            </span>
                        ) : (
                            t('auth.register.submit')
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">{t('auth.register.hasAccount')} </span>
                        <Link to="/login" className="font-medium text-black hover:underline">
                            {t('auth.register.loginLink')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
