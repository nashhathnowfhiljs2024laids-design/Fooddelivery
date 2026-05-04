import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, BarChart3, Flame, Layers, ShieldCheck, Wallet } from 'lucide-react';
import { restaurants as defaultRestaurants } from '../data/mockData';

const RestaurantDashboard = ({ onBack }) => {
  const restaurants = useMemo(() => defaultRestaurants, []);
  const totalRestaurants = restaurants.length;
  const totalMenuItems = restaurants.reduce((sum, rest) => sum + rest.menu.length, 0);
  const totalRevenue = restaurants.reduce((sum, rest) => sum + rest.menu.length * 1100, 0);
  const activeOrders = 24;
  const topRestaurants = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const topDishes = restaurants
    .flatMap((restaurant) => restaurant.menu.map((item) => ({
      ...item,
      restaurant: restaurant.name,
    })))
    .sort((a, b) => (b.isBestseller === true) - (a.isBestseller === true) || b.price - a.price)
    .slice(0, 6);

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
                <p className="text-sm uppercase tracking-[0.2em] text-primary-600">Restaurant Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold text-gray-900">Manage restaurant performance</h1>
                <p className="mt-2 text-sm text-gray-600">See order flow, revenue, and top-selling dishes at a glance.</p>
              </div>
              <div className="rounded-3xl bg-primary-600 px-5 py-4 text-white shadow-lg">
                <p className="text-sm uppercase tracking-[0.2em] text-primary-100">Live Orders</p>
                <p className="mt-3 text-3xl font-semibold">{activeOrders}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-primary-600">
                <BarChart3 className="w-5 h-5" />
                <p className="text-sm font-semibold">Active Restaurants</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-gray-900">{totalRestaurants}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-primary-600">
                <Layers className="w-5 h-5" />
                <p className="text-sm font-semibold">Menu Items</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-gray-900">{totalMenuItems}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 text-primary-600">
                <Wallet className="w-5 h-5" />
                <p className="text-sm font-semibold">Estimated Revenue</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Top Restaurants</h2>
                <p className="text-sm text-gray-600">High performing locations based on customer favorites.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">Top picks</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {topRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="rounded-3xl border border-gray-200 p-5 bg-slate-50">
                  <p className="text-sm font-semibold text-gray-900">{restaurant.name}</p>
                  <p className="mt-2 text-sm text-gray-600">{restaurant.cuisine}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-gray-700">
                    <span>{restaurant.rating} ★</span>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Top Selling Dishes</h2>
                <p className="text-sm text-gray-600">Most ordered menu items across the app.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">Trending</span>
            </div>

            <div className="space-y-4">
              {topDishes.map((dish, index) => (
                <div key={`${dish.id}-${index}`} className="rounded-3xl border border-gray-200 p-5 bg-slate-50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{dish.name}</p>
                      <p className="mt-1 text-sm text-gray-600">{dish.restaurant}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary-700">₹{dish.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-primary-600 p-6 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-primary-100">Performance Summary</p>
            <h2 className="mt-4 text-2xl font-semibold">Overview</h2>
            <p className="mt-3 text-sm leading-6 text-primary-100">Keep the restaurant running smoothly by monitoring order volume and dish popularity.</p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Order Growth</p>
                <p className="mt-1 text-sm text-gray-600">7.4% last 7 days</p>
              </div>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Customer Satisfaction</p>
                <p className="mt-1 text-sm text-gray-600">94% positive reviews</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

RestaurantDashboard.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default RestaurantDashboard;
