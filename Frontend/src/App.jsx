import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import Notification from './components/Notification';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AddToCartPage from './pages/AddToCartPage';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import LoginPage from './pages/LoginPage';
import { useNotification } from './hooks/useNotification';

function App() {
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState(null);
  const [forceLogin, setForceLogin] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [orderSummary, setOrderSummary] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [orderState, setOrderState] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { notification, showNotification } = useNotification();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginPageOpen = () => {
    setLoginRole(null);
    setForceLogin(false);
    setIsLoginOpen(true);
  };

  const handleCustomerDashboard = () => {
    if (!user || user.role !== 'customer') {
      setLoginRole('customer');
      setForceLogin(true);
      setIsLoginOpen(true);
      return;
    }
    setCurrentPage('customerDashboard');
  };

  const handleRestaurantDashboard = () => {
    if (!user || user.role !== 'restaurant') {
      setLoginRole('restaurant');
      setForceLogin(true);
      setIsLoginOpen(true);
      return;
    }
    setCurrentPage('restaurantDashboard');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (loginRole === 'restaurant') {
      setCurrentPage('restaurantDashboard');
    } else if (loginRole === 'customer') {
      setCurrentPage('customerDashboard');
    } else {
      setCurrentPage('home');
    }
    setLoginRole(null);
    setForceLogin(false);
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

  const handleOrderPlace = (orderData) => {
    const placedAt = Date.now();
    const orderRecord = {
      ...orderData,
      placedAt,
      status: 'Preparing',
      stageIndex: 1,
      estimatedPrep: '10–20 minutes',
      estimatedDelivery: '30–45 minutes',
    };

    const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    localStorage.setItem('customerOrders', JSON.stringify([orderRecord, ...existingOrders]));

    setOrderState(orderRecord);
    setOrderSummary(null);
    setAppliedPromo(null);
    setCurrentPage('orderConfirmation');
  };

  const handleContinueHome = () => {
    setOrderState(null);
    setCurrentPage('home');
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
      case 'orderConfirmation':
        return <OrderConfirmationPage order={orderState} onContinue={handleContinueHome} />;
      case 'customerDashboard':
        return <CustomerDashboard user={user} onBack={handleBackToHome} />;
      case 'restaurantDashboard':
        return <RestaurantDashboard onBack={handleBackToHome} />;
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
          onCustomerDashboard={handleCustomerDashboard}
          onRestaurantDashboard={handleRestaurantDashboard}
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
        onLogin={handleLoginSuccess}
        user={user}
        loginRole={loginRole}
        forceLogin={forceLogin}
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