import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsedCart = JSON.parse(saved);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  const saveCart = (newCart) => {
    try {
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item) => {
    // Determine if item already exists based on id and potentially size/addons
    const existingIndex = cart.findIndex(c => 
      c.id === item.id && 
      c.size === item.size && 
      JSON.stringify(c.addOns) === JSON.stringify(item.addOns)
    );
    
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += (item.quantity || 1);
      saveCart(newCart);
    } else {
      const cartItem = {
        ...item,
        quantity: item.quantity || 1
      };
      saveCart([...cart, cartItem]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      saveCart(cart.filter(c => c.id !== id));
    } else {
      saveCart(cart.map(c => c.id === id ? {...c, quantity} : c));
    }
  };

  const clearCart = () => saveCart([]);

  const getTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const getItemQuantity = (id) => {
    const item = cart.find(c => c.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, getTotal, getCount, getItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
