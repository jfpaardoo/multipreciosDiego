import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('wishlist')
                .select('producto_id, productos(*)')
                .eq('cliente_id', user!.id);

            if (error) throw error;

            // @ts-ignore
            const products = data.map(item => item.productos) as Product[];
            setWishlist(products);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product: Product) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('wishlist')
                .insert({ cliente_id: user.id, producto_id: product.id });

            if (error) throw error;
            setWishlist([...wishlist, product]);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('wishlist')
                .delete()
                .match({ cliente_id: user.id, producto_id: productId });

            if (error) throw error;
            setWishlist(wishlist.filter(p => p.id !== productId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(p => p.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
