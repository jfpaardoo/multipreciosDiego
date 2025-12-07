import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { useTranslation } from 'react-i18next';

export function Login() {
    const { t } = useTranslation();
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

            if (error) throw error;

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
            setError(err.message || t('auth.login.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t('auth.login.title')}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('auth.login.subtitle')}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <Input
                            label={t('auth.login.emailLabel')}
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('auth.login.emailPlaceholder')}
                        />
                        <Input
                            label={t('auth.login.passwordLabel')}
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth.login.passwordPlaceholder')}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? t('auth.login.submitting') : t('auth.login.submit')}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">{t('auth.login.noAccount')} </span>
                        <Link to="/register" className="font-medium text-black hover:underline">
                            {t('auth.login.registerLink')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
