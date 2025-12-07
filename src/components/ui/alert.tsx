import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type = 'info', title, message, onClose }: AlertProps) {
  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      titleColor: 'text-green-900',
      textColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-600" />,
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700',
    },
  };

  const styles = config[type];

  return (
    <div className={`rounded-lg border p-4 ${styles.bg} ${styles.border}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1">
          {title && (
            <h3 className={`font-medium ${styles.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${styles.textColor}`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${styles.textColor} hover:opacity-70`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ type = 'info', message, duration = 3000, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      bg: 'bg-green-600',
      icon: <CheckCircle className="h-5 w-5 text-white" />,
    },
    error: {
      bg: 'bg-red-600',
      icon: <XCircle className="h-5 w-5 text-white" />,
    },
    warning: {
      bg: 'bg-yellow-600',
      icon: <AlertCircle className="h-5 w-5 text-white" />,
    },
    info: {
      bg: 'bg-blue-600',
      icon: <Info className="h-5 w-5 text-white" />,
    },
  };

  const styles = config[type];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className={`${styles.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}>
        {styles.icon}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="hover:opacity-70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
