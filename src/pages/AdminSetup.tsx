import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';

export function AdminSetup() {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        nombre: formData.nombre,
                        apellidos: formData.apellidos,
                        telefono: formData.telefono,
                        dni: formData.dni,
                        rol: 'ADMIN', // Hardcoded ADMIN role
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                alert('Administrador creado exitosamente. Por favor inicia sesión.');
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-12 bg-red-50">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg border-2 border-red-200">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-red-900">Setup Admin</h2>
                    <p className="mt-2 text-sm text-red-600 font-bold">
                        USO EXCLUSIVO INTERNO
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Nombre"
                                name="nombre"
                                required
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            <Input
                                label="Apellidos"
                                name="apellidos"
                                required
                                value={formData.apellidos}
                                onChange={handleChange}
                            />
                        </div>
                        <Input
                            label="DNI"
                            name="dni"
                            required
                            value={formData.dni}
                            onChange={handleChange}
                        />
                        <Input
                            label="Teléfono"
                            name="telefono"
                            type="tel"
                            required
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        <Input
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Input
                            label="Contraseña"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={loading}
                    >
                        {loading ? 'Creando Admin...' : 'Crear Administrador'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
