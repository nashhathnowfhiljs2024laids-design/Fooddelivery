<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 77150ab89e312f9b9a8920355d8dc4637ba508fd
import { ShoppingCart, User, Search, Menu, X, Clock } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Navbar = ({ onCartOpen, onLoginOpen, user, onSearch, searchQuery }) => {
  const { getCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
<<<<<<< HEAD
  const deliveryTime = localStorage.getItem('deliveryTime');
=======
  const [orderStatus, setOrderStatus] = useState(null);
  const deliveryTime = localStorage.getItem('deliveryTime');

  useEffect(() => {
    const updateOrderStatus = () => {
      const timestamp = localStorage.getItem('orderTimestamp');
      if (!timestamp) return;

      const elapsed = Date.now() - parseInt(timestamp);
      const minutes = elapsed / 60000;

      if (minutes < 5) {
        setOrderStatus('Order Placed');
      } else if (minutes < 15) {
        setOrderStatus('Preparing');
        localStorage.setItem('orderStatus', 'Preparing');
      } else if (minutes < 25) {
        setOrderStatus('On the Way');
        localStorage.setItem('orderStatus', 'On the Way');
      } else if (minutes < 30) {
        setOrderStatus('Arriving Soon');
        localStorage.setItem('orderStatus', 'Arriving Soon');
      } else {
        setOrderStatus('Delivered');
        localStorage.setItem('orderStatus', 'Delivered');
      }
    };

    updateOrderStatus();
    const interval = setInterval(updateOrderStatus, 10000);
    return () => clearInterval(interval);
  }, []);
>>>>>>> 77150ab89e312f9b9a8920355d8dc4637ba508fd

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-primary-600">FoodieExpress</h1>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
<<<<<<< HEAD
            {deliveryTime && (
              <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Arrives by {deliveryTime}</span>
=======
            {deliveryTime && orderStatus && (
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                  orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                  orderStatus === 'On the Way' ? 'bg-blue-100 text-blue-700' :
                  orderStatus === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{orderStatus}</span>
                </div>
                <span className="text-sm text-gray-600">by {deliveryTime}</span>
>>>>>>> 77150ab89e312f9b9a8920355d8dc4637ba508fd
              </div>
            )}
            
            <button onClick={onLoginOpen} className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>

            {user && (
              <button onClick={() => {
                localStorage.removeItem('user');
                window.location.reload();
              }} className="text-gray-700 hover:text-red-600 text-sm">
                Logout
              </button>
            )}

            <button onClick={onCartOpen} className="relative flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {getCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCount()}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-3">
<<<<<<< HEAD
              {deliveryTime && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Arrives by {deliveryTime}</span>
=======
              {deliveryTime && orderStatus && (
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                    orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                    orderStatus === 'On the Way' ? 'bg-blue-100 text-blue-700' :
                    orderStatus === 'Preparing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{orderStatus}</span>
                  </div>
                  <span className="text-xs text-gray-600">by {deliveryTime}</span>
>>>>>>> 77150ab89e312f9b9a8920355d8dc4637ba508fd
                </div>
              )}
              
              <button onClick={() => { onLoginOpen(); setIsMenuOpen(false); }} className="flex items-center space-x-2 text-gray-700">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button onClick={() => { onCartOpen(); setIsMenuOpen(false); }} className="flex items-center space-x-2 text-gray-700">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({getCount()})</span>
              </button>
              {user && (
                <button onClick={() => {
                  localStorage.removeItem('user');
                  window.location.reload();
                }} className="text-red-600 text-sm">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;