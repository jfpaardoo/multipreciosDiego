import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
    theme: Theme;
    fontSize: FontSize;
    toggleTheme: () => void;
    setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'light';
    });

    const [fontSize, setFontSizeState] = useState<FontSize>(() => {
        const saved = localStorage.getItem('fontSize');
        return (saved as FontSize) || 'medium';
    });

    useEffect(() => {
        const root = document.documentElement;

        // Apply theme
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);

        // Apply font size
        root.classList.remove('font-small', 'font-medium', 'font-large');
        root.classList.add(`font-${fontSize}`);
        localStorage.setItem('fontSize', fontSize);
    }, [theme, fontSize]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setFontSize = (size: FontSize) => {
        setFontSizeState(size);
    };

    return (
        <ThemeContext.Provider value={{ theme, fontSize, toggleTheme, setFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
