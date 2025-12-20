import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    showToastAfterReload: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_STORAGE_KEY = 'pending_toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Check for pending toast on mount
    useEffect(() => {
        const pendingToast = localStorage.getItem(TOAST_STORAGE_KEY);
        if (pendingToast) {
            try {
                const { message, type } = JSON.parse(pendingToast);
                showToast(message, type);
                localStorage.removeItem(TOAST_STORAGE_KEY);
            } catch (e) {
                localStorage.removeItem(TOAST_STORAGE_KEY);
            }
        }
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const showToastAfterReload = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        localStorage.setItem(TOAST_STORAGE_KEY, JSON.stringify({ message, type }));
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, showToastAfterReload }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-20 right-4 z-[200] space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-md
                            animate-slide-in cursor-pointer transition-all duration-300
                            ${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
                            ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
                            ${toast.type === 'info' ? 'bg-blue-600 text-white' : ''}
                        `}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="flex-1">{toast.message}</span>
                        <button className="text-white/80 hover:text-white text-lg font-bold">
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
