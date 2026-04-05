import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import Notification from './components/Notification';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import CheckoutPage from './pages/CheckoutPage';
import AddToCartPage from './pages/AddToCartPage';
import LoginPage from './pages/LoginPage';
import { useNotification } from './hooks/useNotification';

function App() {
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [orderSummary, setOrderSummary] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { notification, showNotification } = useNotification();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginPageOpen = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentPage('restaurant');
  };

  const handleItemSelect = (item, restaurant) => {
    setSelectedItem(item);
    setSelectedRestaurant(restaurant);
    setCurrentPage('addToCart');
  };

  const handleBackToHome = () => {
    setSelectedRestaurant(null);
    setSelectedItem(null);
    setCurrentPage('home');
  };

  const handleBackToRestaurant = () => {
    setSelectedItem(null);
    setCurrentPage('restaurant');
  };

  const handleCheckout = (summary, promo) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    setOrderSummary(summary);
    setAppliedPromo(promo);
    setCurrentPage('checkout');
    setIsCartOpen(false);
  };

  const handleOrderPlace = () => {
    const deliveryTime = new Date();
    deliveryTime.setMinutes(deliveryTime.getMinutes() + 30);
    const timeString = deliveryTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    localStorage.setItem('deliveryTime', timeString);
    localStorage.setItem('orderStatus', 'Order Placed');
    localStorage.setItem('orderTimestamp', Date.now());
    
    alert(`Order placed successfully! Your food will arrive by ${timeString}`);
    setCurrentPage('home');
    setOrderSummary(null);
    setAppliedPromo(null);
  };

  const renderCurrentPage = () => {
    if (!user && currentPage !== 'login') {
      return <LoginPage onLogin={handleLoginSuccess} onBack={() => setCurrentPage('login')} />;
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLoginSuccess} onBack={handleBackToHome} />;
      case 'restaurant':
        return <RestaurantPage restaurant={selectedRestaurant} onBack={handleBackToHome} onItemSelect={handleItemSelect} showNotification={showNotification} />;
      case 'addToCart':
        return <AddToCartPage item={selectedItem} restaurant={selectedRestaurant} onBack={handleBackToRestaurant} showNotification={showNotification} />;
      case 'checkout':
        return (
          <CheckoutPage
            orderSummary={orderSummary}
            appliedPromo={appliedPromo}
            onBack={() => { setCurrentPage('home'); setIsCartOpen(true); }}
            onOrderPlace={handleOrderPlace}
            user={user}
          />
        );
      default:
        return <HomePage onRestaurantSelect={handleRestaurantSelect} searchQuery={searchQuery} showNotification={showNotification} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <Navbar
          onCartOpen={() => setIsCartOpen(true)}
          onLoginOpen={handleLoginPageOpen}
          user={user}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />
      )}

      <main className="pb-16 min-h-screen">
        {renderCurrentPage()}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={setUser}
        user={user}
      />

      <Notification 
        notification={notification} 
        onClose={() => showNotification(null)} 
      />

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FoodieExpress</h3>
            <p className="text-gray-600 text-sm">Delicious food delivered fast.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;