import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, CreditCard, Heart, ShoppingBag, Star, Truck } from 'lucide-react';

const sampleOrders = [
  {
    id: 'OD-1001',
    restaurant: 'Pizza Palace',
    total: 749,
    date: 'Apr 26, 2026',
    status: 'Delivered',
    items: ['Margherita Pizza', 'Garlic Bread'],
  },
  {
    id: 'OD-1002',
    restaurant: 'Burger Junction',
    total: 498,
    date: 'Apr 28, 2026',
    status: 'On the Way',
    items: ['Classic Burger', 'French Fries'],
  },
  {
    id: 'OD-1003',
    restaurant: 'Spice Garden',
    total: 639,
    date: 'Apr 30, 2026',
    status: 'Preparing',
    items: ['Butter Chicken', 'Naan Bread'],
  },
];

const CustomerDashboard = ({ user, onBack }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('customerOrders') || '[]');
    setOrders(stored.length ? stored : sampleOrders);
  }, []);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeOrders = orders.filter(order => order.status !== 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-primary-600">Customer Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold text-gray-900">Welcome back, {user?.name || 'Foodie'}!</h1>
                <p className="mt-2 text-sm text-gray-600">Track your orders, favorites, and recent activity from one place.</p>
              </div>
              <div className="rounded-3xl bg-primary-600 px-5 py-4 text-white shadow-lg">
                <p className="text-sm uppercase tracking-[0.2em] text-primary-100">Loyalty Score</p>
                <p className="mt-3 text-3xl font-semibold">{Math.min(100, 62 + totalOrders * 3)}%</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-primary-600">
                <ShoppingBag className="w-5 h-5" />
                <p className="text-sm font-semibold">Total Orders</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-gray-900">{totalOrders}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-primary-600">
                <CreditCard className="w-5 h-5" />
                <p className="text-sm font-semibold">Spent</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-gray-900">₹{totalSpent}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-primary-600">
                <Truck className="w-5 h-5" />
                <p className="text-sm font-semibold">Active Orders</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-gray-900">{activeOrders}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <p className="text-sm text-gray-600">Review your last activity and order details.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">{orders.length} orders</span>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-gray-200 p-5 hover:shadow-lg transition-shadow bg-slate-50">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.restaurant}</p>
                      <p className="mt-1 text-sm text-gray-600">Order #{order.id} • {order.date}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-green-800">{order.status}</span>
                      <p className="text-sm text-gray-700">₹{order.total}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">Items: {order.items.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-primary-600 p-6 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-primary-100">Your Profile</p>
            <h2 className="mt-4 text-2xl font-semibold">{user?.name || 'Guest'}</h2>
            <p className="mt-2 text-sm text-primary-100">{user?.email || 'email@example.com'}</p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Favorites</p>
                <p className="mt-1 text-sm text-gray-600">Top picks saved for later</p>
              </div>
              <Heart className="w-5 h-5 text-primary-600" />
            </div>
            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <p>• Margherita Pizza</p>
              <p>• Classic Burger</p>
              <p>• Paneer Tikka Masala</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Loyalty Rewards</p>
                <p className="mt-1 text-sm text-gray-600">Earned with every order</p>
              </div>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <p className="font-semibold">You’re {totalOrders} orders away from free delivery.</p>
              <p>Keep ordering to level up your customer score.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

CustomerDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
};

export default CustomerDashboard;
