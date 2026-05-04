/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { isValidCardNumber, isValidCvv, isValidExpiry, isValidUpi } from '../utils/paymentValidation';

const CheckoutPage = ({ orderSummary, appliedPromo, onBack, onOrderPlace, user }) => {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentDetails, setPaymentDetails] = useState({ upiId: '', cardNumber: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [deliveryDetails, setDeliveryDetails] = useState({ address: '', phone: '' });
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const validatePayment = () => {
    const nextErrors = {};

    if (paymentMethod === 'upi') {
      if (!isValidUpi(paymentDetails.upiId)) {
        nextErrors.upiId = 'Invalid UPI ID';
      }
    }

    if (paymentMethod === 'card') {
      if (!isValidCardNumber(paymentDetails.cardNumber)) {
        nextErrors.cardNumber = 'Invalid Card Details';
      }
      if (!isValidExpiry(paymentDetails.expiry)) {
        nextErrors.expiry = 'Invalid Card Details';
      }
      if (!isValidCvv(paymentDetails.cvv)) {
        nextErrors.cvv = 'Invalid Card Details';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateDelivery = () => {
    const nextErrors = {};

    if (!deliveryDetails.address.trim()) {
      nextErrors.address = 'Delivery address is required';
    }

    if (!/^\d{10}$/.test(deliveryDetails.phone)) {
      nextErrors.phone = 'Phone number must be 10 digits';
    }

    setDeliveryErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setPaymentSuccess('');
  };

  const handleDeliveryChange = (field, value) => {
    setDeliveryDetails((prev) => ({ ...prev, [field]: value }));
    setDeliveryErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    setErrors({});
    setPaymentSuccess('');
    setOrderPlaced(false);
  };

  const canPay = useMemo(() => {
    if (paymentMethod === 'cod') return true;
    if (paymentMethod === 'upi') {
      return isValidUpi(paymentDetails.upiId);
    }
    if (paymentMethod === 'card') {
      return (
        isValidCardNumber(paymentDetails.cardNumber) &&
        isValidExpiry(paymentDetails.expiry) &&
        isValidCvv(paymentDetails.cvv)
      );
    }
    return false;
  }, [paymentMethod, paymentDetails]);

  const handlePayNow = () => {
    if (!user) {
      alert('Please login first');
      return;
    }

    if (paymentMethod !== 'cod' && !validatePayment()) {
      return;
    }

    setOrderPlaced(true);
    setPaymentSuccess('Order placed successfully');
  };

  const handleConfirmOrder = () => {
    if (!validateDelivery()) {
      return;
    }

    const orderData = {
      orderSummary,
      paymentMethod,
      deliveryAddress: deliveryDetails.address.trim(),
      phone: deliveryDetails.phone.trim(),
      items: cart,
    };

    setIsPlacing(true);
    setTimeout(() => {
      clearCart();
      onOrderPlace(orderData);
      setIsPlacing(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to cart</span>
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{orderSummary.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₹{orderSummary.tax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹{orderSummary.deliveryFee}</span>
              </div>
              {orderSummary.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{orderSummary.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{orderSummary.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                className="text-primary-600"
              />
              <Banknote className="w-5 h-5 text-gray-500" />
              <span>Cash on Delivery</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                className="text-primary-600"
              />
              <Smartphone className="w-5 h-5 text-gray-500" />
              <span>UPI (Mock)</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                className="text-primary-600"
              />
              <CreditCard className="w-5 h-5 text-gray-500" />
              <span>Credit/Debit Card (Mock)</span>
            </label>
          </div>
        </div>

        {paymentMethod === 'upi' && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">UPI Details</h2>
            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
            <input
              id="upiId"
              type="text"
              value={paymentDetails.upiId}
              onChange={(e) => handleChange('upiId', e.target.value)}
              placeholder="name@upi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            {errors.upiId && <p className="mt-2 text-sm text-red-600">{errors.upiId}</p>}
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Card Details</h2>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                maxLength={19}
                value={paymentDetails.cardNumber}
                onChange={(e) => handleChange('cardNumber', e.target.value.replaceAll(/\D/g, ''))}
                placeholder="1234123412341234"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {errors.cardNumber && <p className="mt-2 text-sm text-red-600">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">Expiry (MM/YY)</label>
                <input
                  id="expiry"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={paymentDetails.expiry}
                  onChange={(e) => handleChange('expiry', e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                {errors.expiry && <p className="mt-2 text-sm text-red-600">{errors.expiry}</p>}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  id="cvv"
                  type="password"
                  inputMode="numeric"
                  maxLength={3}
                  value={paymentDetails.cvv}
                  onChange={(e) => handleChange('cvv', e.target.value.replaceAll(/\D/g, ''))}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                {errors.cvv && <p className="mt-2 text-sm text-red-600">{errors.cvv}</p>}
              </div>
            </div>

            {errors.cardNumber && errors.expiry && errors.cvv && (
              <p className="text-sm text-red-600">Invalid Card Details</p>
            )}
          </div>
        )}

        {paymentSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            {paymentSuccess}
          </div>
        )}

        {orderPlaced ? (
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  value={deliveryDetails.address}
                  onChange={(e) => handleDeliveryChange('address', e.target.value)}
                  rows={3}
                  placeholder="Enter your delivery address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                {deliveryErrors.address && <p className="mt-2 text-sm text-red-600">{deliveryErrors.address}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={deliveryDetails.phone}
                  onChange={(e) => handleDeliveryChange('phone', e.target.value.replaceAll(/\D/g, ''))}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                {deliveryErrors.phone && <p className="mt-2 text-sm text-red-600">{deliveryErrors.phone}</p>}
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={isPlacing}
              className={`mt-6 w-full py-4 rounded-lg font-semibold text-lg ${
                isPlacing
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isPlacing ? 'Confirming Order...' : 'Confirm Order'}
            </button>
          </div>
        ) : (
          <button
            onClick={handlePayNow}
            disabled={!canPay}
            className={`w-full py-4 rounded-lg font-semibold text-lg ${
              canPay
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            Pay Now - ₹{orderSummary.total}
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;