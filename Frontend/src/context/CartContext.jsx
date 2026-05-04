import React, { createContext, useEffect, useMemo, useState } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  const saveCart = (nextCart) => {
    setCart(nextCart);
    try {
      localStorage.setItem('cart', JSON.stringify(nextCart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  };

  const addToCart = (item) => {
    const quantityToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      saveCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem
        )
      );
    } else {
      saveCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image || item.photo || '',
          quantity: quantityToAdd,
          ...(item.size ? { size: item.size } : {}),
          ...(item.addOns ? { addOns: item.addOns } : {}),
          ...(item.specialInstructions ? { specialInstructions: item.specialInstructions } : {}),
          ...(item.restaurant ? { restaurant: item.restaurant } : {}),
        },
      ]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      saveCart(cart.filter((cartItem) => cartItem.id !== id));
    } else {
      saveCart(
        cart.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, quantity } : cartItem
        )
      );
    }
  };

  const clearCart = () => saveCart([]);

  const getTotal = () => cart.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);

  const getCount = () => cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  const getItemQuantity = (id) => {
    const found = cart.find((cartItem) => cartItem.id === id);
    return found ? found.quantity : 0;
  };

  const value = useMemo(
    () => ({ cart, addToCart, updateQuantity, clearCart, getTotal, getCount, getItemQuantity }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
