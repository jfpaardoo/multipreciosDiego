import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Type, Settings, X } from 'lucide-react';

export function AccessibilityMenu() {
    const { t } = useTranslation();
    const { theme, fontSize, toggleTheme, setFontSize } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Floating Button */}
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label={t('accessibility.openMenu')}
                >
                    <Settings className="h-6 w-6" />
                </button>
            ) : (
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-2xl p-6 w-80 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            {t('accessibility.title')}
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            aria-label={t('accessibility.close')}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Theme Toggle */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('accessibility.theme')}
                        </label>
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label={t('accessibility.toggleTheme')}
                        >
                            <span className="flex items-center gap-2 text-gray-900 dark:text-white">
                                {theme === 'light' ? (
                                    <>
                                        <Sun className="h-5 w-5" />
                                        {t('accessibility.lightMode')}
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-5 w-5" />
                                        {t('accessibility.darkMode')}
                                    </>
                                )}
                            </span>
                            <div className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                                } relative`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                                    }`} />
                            </div>
                        </button>
                    </div>

                    {/* Font Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            {t('accessibility.fontSize')}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['small', 'medium', 'large'] as const).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setFontSize(size)}
                                    className={`p-2 rounded-lg border-2 transition-all ${fontSize === size
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                                        }`}
                                    aria-label={t(`accessibility.${size}`)}
                                    aria-pressed={fontSize === size}
                                >
                                    <span className={`font-medium ${size === 'small' ? 'text-xs' :
                                            size === 'medium' ? 'text-sm' :
                                                'text-base'
                                        }`}>
                                        {t(`accessibility.${size}`)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
