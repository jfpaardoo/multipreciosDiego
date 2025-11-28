import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Issue } from '../../types';
import { Button } from '../../components/ui/button';

export function AdminIssues() {
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        const { data, error } = await supabase
            .from('incidencias')
            .select('*, profiles(email)')
            .order('created_at', { ascending: false });

        if (!error) setIssues(data || []);
    };

    const resolveIssue = async (id: string) => {
        const { error } = await supabase
            .from('incidencias')
            .update({ estado: 'RESUELTA' })
            .eq('id', id);

        if (!error) fetchIssues();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gestión de Incidencias</h1>

            <div className="grid gap-4">
                {issues.map((issue) => (
                    <div key={issue.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${issue.tipo === 'DAÑADO' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {issue.tipo}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {/* @ts-ignore */}
                                    Reportado por: {issue.profiles?.email}
                                </span>
                            </div>
                            <p className="text-gray-900">{issue.descripcion}</p>
                        </div>
                        <div>
                            {issue.estado === 'PENDIENTE' ? (
                                <Button size="sm" onClick={() => resolveIssue(issue.id)}>
                                    Marcar Resuelta
                                </Button>
                            ) : (
                                <span className="text-green-600 font-medium text-sm">Resuelta</span>
                            )}
                        </div>
                    </div>
                ))}
                {issues.length === 0 && <p className="text-gray-500">No hay incidencias.</p>}
            </div>
        </div>
    );
}
