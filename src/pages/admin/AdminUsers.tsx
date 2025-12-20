import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Profile, UserRole } from '../../types';
import { Input } from '../../components/ui/Input';
import { Search, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminUsers() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [searchUser, setSearchUser] = useState('');
    const { user: currentUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();

        // Check if there's a search parameter from navigation
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search) {
            setSearchUser(search);
        }
    }, [location]);

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            // Exclude current admin user
            const filteredUsers = data.filter(u => u.id !== currentUser?.id);
            setUsers(filteredUsers);
        }
    };

    const updateUserRole = async (userId: string, newRole: UserRole) => {
        const { error } = await supabase
            .from('profiles')
            .update({ rol: newRole })
            .eq('id', userId);

        if (!error) fetchUsers();
    };

    const filteredUsers = users.filter(user => {
        const searchLower = searchUser.toLowerCase();
        const fullName = `${user.nombre || ''} ${user.apellidos || ''}`.toLowerCase();
        return (
            fullName.includes(searchLower) ||
            (user.email || '').toLowerCase().includes(searchLower) ||
            (user.dni || '').toLowerCase().includes(searchLower) ||
            (user.telefono || '').toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de usuarios</h1>
            </div>

            {/* Users Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900">
                <div className="p-6">
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre, email, DNI, teléfono..."
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="pl-10 w-80"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Teléfono
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        DNI
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Dirección
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Rol
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {user.avatar_url ? (
                                                    <img
                                                        src={user.avatar_url}
                                                        alt={`${user.nombre || 'Usuario'}`}
                                                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold flex-shrink-0">
                                                        {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                )}
                                                <span className="text-sm text-gray-900 dark:text-white">{user.nombre} {user.apellidos || ''}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            {user.email ? (
                                                <a
                                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    {user.email}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                                            {user.telefono || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                                            {user.dni || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 text-center">
                                            {user.direccion ? `${user.direccion}, ${user.codigo_postal || ''}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <select
                                                value={user.rol}
                                                onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                                                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="CLIENTE">Cliente</option>
                                                <option value="ENCARGADO">Encargado</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No hay usuarios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
