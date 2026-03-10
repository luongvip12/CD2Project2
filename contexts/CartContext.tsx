/**
 * CartContext - Quản lý giỏ hàng
 * Lưu trạng thái giỏ hàng vào localStorage
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    image: string | null;
    quantity: number;
    stock: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart phải dùng trong CartProvider');
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Sync localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === item.productId);
            if (existing) {
                const newQty = Math.min(existing.quantity + quantity, item.stock);
                return prev.map(i => i.productId === item.productId ? { ...i, quantity: newQty } : i);
            }
            return [...prev, { ...item, quantity: Math.min(quantity, item.stock) }];
        });
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setItems(prev => prev.filter(i => i.productId !== productId));
    }, []);

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(i => i.productId !== productId));
            return;
        }
        setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};
