import { Toaster, toast } from 'react-hot-toast';

// Export the toaster component
export { Toaster };

// Success toast
export const showSuccess = (message: string) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#10B981',
            color: '#fff',
        },
        icon: '✓',
    });
};

// Error toast
export const showError = (message: string) => {
    toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#EF4444',
            color: '#fff',
        },
        icon: '✕',
    });
};

// Info toast
export const showInfo = (message: string) => {
    toast(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#3B82F6',
            color: '#fff',
        },
        icon: 'ℹ',
    });
};

// Loading toast
export const showLoading = (message: string) => {
    return toast.loading(message, {
        position: 'top-right',
    });
};

// Dismiss specific toast
export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
    toast.dismiss();
};
