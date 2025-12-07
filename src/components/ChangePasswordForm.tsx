import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { showSuccess, showError } from '../utils/toast';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/Input';

export function ChangePasswordForm() {
    const { t } = useTranslation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showError(t('changePassword.errorMismatch'));
            return;
        }

        if (newPassword.length < 6) {
            showError(t('changePassword.errorLength'));
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            showSuccess(t('changePassword.success'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            showError(error.message || t('changePassword.errorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {t('changePassword.title')}
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('changePassword.currentPassword')}
                    </label>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('changePassword.newPassword')}
                    </label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('changePassword.confirmPassword')}
                    </label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? t('changePassword.updating') : t('changePassword.button')}
                </Button>
            </form>
        </div>
    );
}
