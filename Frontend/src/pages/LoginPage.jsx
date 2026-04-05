import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

const LoginPage = ({ onLogin, onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email, phone, address };
    onLogin(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Load existing user data if available
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setAddress(userData.address || '');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">User Information</h1>
            <p className="text-gray-600 mt-2">Update your details anytime</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your address"
                  rows="3"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3 text-lg">
              Save & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;