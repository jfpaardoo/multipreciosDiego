import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Incidencia } from '../../types';
import { Button } from '../../components/ui/button';

export function AdminIssues() {
    const [issues, setIssues] = useState<Incidencia[]>([]);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        const { data, error } = await supabase
            .from('incidencias')
            .select('*, profiles(nombre, apellidos, avatar_url)')
            .order('created_at', { ascending: false });

        if (!error) setIssues(data || []);
    };

    const resolveIssue = async (id: string) => {
        const { error } = await supabase
            .from('incidencias')
            .update({ estado: 'ACEPTADA' })
            .eq('id', id);

        if (!error) fetchIssues();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gestión de Incidencias</h1>

            <div className="grid gap-4">
                {issues.map((issue) => (
                    <div key={issue.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${issue.tipo_incidencia === 'DAÑADO' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {issue.tipo_incidencia}
                                </span>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>Reportado por:</span>
                                    {(() => {
                                        // @ts-ignore
                                        const userProfile = issue.profiles;
                                        const avatarUrl = userProfile?.avatar_url;
                                        const userName = userProfile?.nombre;
                                        
                                        return avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={userName || 'Usuario'}
                                                className="h-6 w-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-semibold">
                                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                        );
                                    })()}
                                    {/* @ts-ignore */}
                                    <span className="font-medium">{issue.profiles?.nombre || 'Usuario'} {issue.profiles?.apellidos || ''}</span>
                                </div>
                            </div>
                            <p className="text-gray-900">{issue.descripcion}</p>
                        </div>
                        <div className="flex-shrink-0">
                            {issue.estado === 'PENDIENTE' ? (
                                <Button size="sm" onClick={() => resolveIssue(issue.id)}>
                                    Marcar Resuelta
                                </Button>
                            ) : (
                                <span className="text-green-600 font-medium text-sm">{issue.estado}</span>
                            )}
                        </div>
                    </div>
                ))}
                {issues.length === 0 && <p className="text-gray-500">No hay incidencias.</p>}
            </div>
        </div>
    );
}
