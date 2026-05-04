import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLogin, user, loginRole, forceLogin }) => {
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(loginRole || user?.role || 'customer');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isLoginMode = !user || forceLogin;

  useEffect(() => {
    if (isLoginMode) {
      setName('');
      setPhone('');
      setAddress('');
      setPassword('');
      setRole(loginRole || 'customer');
      setError('');
    } else {
      setName(user?.name || '');
      setPhone(user?.phone || '');
      setAddress(user?.address || '');
      setRole(user?.role || 'customer');
      setError('');
    }
  }, [user, loginRole, isLoginMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!isLoginMode && !phone.trim()) {
      setError('Phone is required');
      return;
    }
    if (!isLoginMode && !address.trim()) {
      setError('Address is required');
      return;
    }
    if (isLoginMode && !password.trim()) {
      setError('Password is required for login');
      return;
    }
    const userData = {
      name: name.trim(),
      role,
      phone: phone.trim(),
      address: address.trim(),
    };
    localStorage.setItem('user', JSON.stringify(userData));
    onLogin(userData);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogin(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {isLoginMode
                ? loginRole === 'restaurant'
                  ? 'Restaurant Login'
                  : loginRole === 'customer'
                  ? 'Customer Login'
                  : 'Login'
                : 'Profile'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="customer">Customer</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            )}

            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    required
                  />
                </div>
              </>
            )}

            {isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button type="submit" className="flex-1 btn-primary py-2">
                {isLoginMode ? 'Login' : 'Update Profile'}
              </button>
              {!isLoginMode && user && (
                <button type="button" onClick={handleLogout} className="flex-1 btn-secondary py-2">
                  Logout
                </button>
              )}
            </div>
          </form>

          {!user && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> Enter your name and password to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;