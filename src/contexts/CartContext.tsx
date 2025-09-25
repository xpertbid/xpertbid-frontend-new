'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, CartApiItem } from '@/types';
import { apiService } from '@/services/api';

interface CartState {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  itemCount: number;
}

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemTotal: (item: CartItem) => number;
  totalPrice: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isLoaded: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId &&
        JSON.stringify(item.variations) === JSON.stringify(action.payload.variations)
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      return calculateTotals({ ...state, items: newItems });
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: newItems });
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      return calculateTotals({ ...state, items: newItems });
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        itemCount: 0,
      };

    case 'LOAD_CART':
      return calculateTotals({ ...state, items: action.payload });

    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const subtotal = state.items.reduce((sum, item) => {
    const price = parseFloat((item.salePrice || item.price)?.toString() || '0');
    return sum + (price * item.quantity);
  }, 0);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate shipping (free over $150, otherwise $10)
  const shipping = subtotal >= 150 ? 0 : 10;
  
  // Calculate tax (5% of subtotal)
  const tax = subtotal * 0.05;
  
  const total = subtotal + shipping + tax;

  return {
    ...state,
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
  };
};

const generateCartItemId = (productId: string, variations?: Record<string, unknown>): string => {
  const variationString = variations ? JSON.stringify(variations) : '';
  return `${productId}_${variationString}`.replace(/[^a-zA-Z0-9_]/g, '_');
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    itemCount: 0,
  });

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [sessionId, setSessionId] = React.useState<string>('');

  // Generate or get session ID
  useEffect(() => {
    let currentSessionId = localStorage.getItem('cart_session_id');
    if (!currentSessionId) {
      currentSessionId = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cart_session_id', currentSessionId);
    }
    setSessionId(currentSessionId);
  }, []);

  // Load cart from backend on mount
  useEffect(() => {
    const loadCart = async () => {
      if (!sessionId) return;
      
      try {
        const response = await apiService.getCart(sessionId);
        if (response.success) {
          const cartItems: CartItem[] = response.data.map((item: CartApiItem) => ({
            id: item.id.toString(),
            productId: item.product_id.toString(),
            name: item.name,
            price: parseFloat(item.price.toString()),
            salePrice: item.sale_price ? parseFloat(item.sale_price.toString()) : undefined,
            quantity: item.quantity,
            variations: item.variations ? JSON.parse(item.variations) : {},
            image: item.images ? JSON.parse(item.images)[0] : '',
            slug: item.slug || '',
            vendor: item.vendor || '',
            sku: item.sku || '',
          }));
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        }
      } catch (error) {
        console.error('Error loading cart from backend:', error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart);
            dispatch({ type: 'LOAD_CART', payload: cartItems });
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
          }
        }
      }
      setIsLoaded(true);
    };

    loadCart();
  }, [sessionId]);

  // Save cart to localStorage whenever it changes (as backup)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    if (!sessionId) return;
    
    const cartItem: CartItem = {
      ...item,
      id: generateCartItemId(item.productId, item.variations),
    };
    
    try {
      await apiService.addToCart(sessionId, parseInt(item.productId), item.quantity, item.variations);
      dispatch({ type: 'ADD_TO_CART', payload: cartItem });
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local state
      dispatch({ type: 'ADD_TO_CART', payload: cartItem });
      setIsDrawerOpen(true);
    }
  };

  const removeFromCart = async (id: string) => {
    if (!sessionId) return;
    
    try {
      await apiService.removeFromCart(sessionId, parseInt(id));
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to local state
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    }
  };

  const removeItem = async (id: string) => {
    await removeFromCart(id);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!sessionId) return;
    
    try {
      await apiService.updateCartItem(sessionId, parseInt(id), quantity);
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    } catch (error) {
      console.error('Error updating cart:', error);
      // Fallback to local state
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = async () => {
    if (!sessionId) return;
    
    try {
      await apiService.clearCart(sessionId);
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Fallback to local state
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const getItemTotal = (item: CartItem): number => {
    const price = parseFloat((item.salePrice || item.price)?.toString() || '0');
    return price * item.quantity;
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        removeItem,
        updateQuantity,
        clearCart,
        getItemTotal,
        totalPrice: state.subtotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
