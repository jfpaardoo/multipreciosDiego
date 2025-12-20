import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface ComparisonContextType {
    selectedProducts: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: string) => void;
    clearComparison: () => void;
    isInComparison: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('comparison_products');
        if (stored) {
            try {
                setSelectedProducts(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing comparison products', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('comparison_products', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    const addToCompare = (product: Product) => {
        if (selectedProducts.length >= 4) {
            // Max 4 products allowed
            return;
        }
        if (!isInComparison(product.id)) {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const removeFromCompare = (productId: string) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    const clearComparison = () => {
        setSelectedProducts([]);
    };

    const isInComparison = (productId: string) => {
        return selectedProducts.some(p => p.id === productId);
    };

    return (
        <ComparisonContext.Provider value={{
            selectedProducts,
            addToCompare,
            removeFromCompare,
            clearComparison,
            isInComparison
        }}>
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
}
