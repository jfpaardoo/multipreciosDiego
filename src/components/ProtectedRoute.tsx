import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: ('ADMIN' | 'ENCARGADO' | 'CLIENTE')[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && profile && !allowedRoles.includes(profile.rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
