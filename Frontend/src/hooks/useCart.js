import { useState, useEffect } from 'react';

export const useCart = () => {
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
    const existing = cart.find(c => c.id === item.id);
    
    if (existing) {
      saveCart(cart.map(c => 
        c.id === item.id ? {...c, quantity: c.quantity + (item.quantity || 1)} : c
      ));
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

  return { cart, addToCart, updateQuantity, clearCart, getTotal, getCount, getItemQuantity };
};