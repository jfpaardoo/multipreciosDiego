import { Toaster, toast } from 'react-hot-toast';

const PENDING_TOAST_KEY = 'pending_toast_message';

// Export the toaster component
export { Toaster };

// Check for pending toast message after page reload
export const checkPendingToast = () => {
    const pending = localStorage.getItem(PENDING_TOAST_KEY);
    if (pending) {
        try {
            const { message, type } = JSON.parse(pending);
            localStorage.removeItem(PENDING_TOAST_KEY);
            if (type === 'success') {
                showSuccess(message);
            } else if (type === 'error') {
                showError(message);
            } else {
                showInfo(message);
            }
        } catch {
            localStorage.removeItem(PENDING_TOAST_KEY);
        }
    }
};

// Schedule a toast to show after page reload
export const showSuccessAfterReload = (message: string) => {
    localStorage.setItem(PENDING_TOAST_KEY, JSON.stringify({ message, type: 'success' }));
};

export const showErrorAfterReload = (message: string) => {
    localStorage.setItem(PENDING_TOAST_KEY, JSON.stringify({ message, type: 'error' }));
};

// Success toast
export const showSuccess = (message: string) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#10B981',
            color: '#fff',
        },
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
