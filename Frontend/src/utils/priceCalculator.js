export const calculateTotal = (cart, deliveryFee = 49, promoCode = null) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  let discount = 0;

  // Simple promo codes
  if (promoCode === 'SAVE10' && subtotal >= 200) {
    discount = 50;
  } else if (promoCode === 'FIRST20' && subtotal >= 300) {
    discount = 100;
  }

  const total = subtotal + tax + deliveryFee - discount;
  return { subtotal, tax, deliveryFee, discount, total: Math.max(0, total) };
};

export const validatePromo = (code, amount) => {
  if (code === 'SAVE10') {
    if (amount < 200) return { valid: false, message: 'Minimum order ₹200 required' };
    return { valid: true };
  }
  if (code === 'FIRST20') {
    if (amount < 300) return { valid: false, message: 'Minimum order ₹300 required' };
    return { valid: true };
  }
  return { valid: false, message: 'Invalid promo code' };
};