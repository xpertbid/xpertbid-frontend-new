'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  image: string;
  variations?: {
    size?: string;
    color?: string;
  };
  vendor: string;
  sku: string;
}

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
    const price = item.salePrice || item.price;
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

const generateCartItemId = (productId: string, variations?: any): string => {
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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
        console.log('Cart loaded from localStorage:', cartItems);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const cartItem: CartItem = {
      ...item,
      id: generateCartItemId(item.productId, item.variations),
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    setIsDrawerOpen(true); // Open drawer when item is added
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemTotal = (item: CartItem): number => {
    const price = item.salePrice || item.price;
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
