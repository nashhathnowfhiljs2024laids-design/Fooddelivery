import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const AddToCartPage = ({ item, restaurant, onBack, showNotification }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const sizes = [
    { name: 'Regular', price: 0 },
    { name: 'Large', price: 50 },
    { name: 'Extra Large', price: 100 }
  ];

  const addOns = [
    { name: 'Extra Cheese', price: 30 },
    { name: 'Extra Sauce', price: 20 },
    { name: 'Extra Spicy', price: 0 }
  ];

  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const handleAddOnToggle = (addOn) => {
    setSelectedAddOns(prev => 
      prev.find(a => a.name === addOn.name)
        ? prev.filter(a => a.name !== addOn.name)
        : [...prev, addOn]
    );
  };

  const calculatePrice = () => {
    const sizePrice = sizes.find(s => s.name === selectedSize)?.price || 0;
    const addOnPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return (item.price + sizePrice + addOnPrice) * quantity;
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      quantity,
      size: selectedSize,
      addOns: selectedAddOns,
      specialInstructions,
      totalPrice: calculatePrice(),
      restaurant: restaurant.name
    };
    
    addToCart(cartItem);
    showNotification('Food added to cart successfully');
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="card overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-64 object-cover"
        />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.5 (120 reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">₹{item.price}</div>
              {item.isVeg && (
                <span className="inline-block w-4 h-4 border-2 border-green-600 bg-green-100 rounded-sm mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full mx-auto mt-0.5"></div>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <label key={size.name} className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="size"
                        value={size.name}
                        checked={selectedSize === size.name}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="text-primary-600 mr-3"
                      />
                      <span className="font-medium">{size.name}</span>
                    </div>
                    {size.price > 0 && (
                      <span className="text-gray-600">+₹{size.price}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Add-ons</h3>
              <div className="space-y-2">
                {addOns.map((addOn) => (
                  <label key={addOn.name} className="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.find(a => a.name === addOn.name)}
                        onChange={() => handleAddOnToggle(addOn)}
                        className="text-primary-600 mr-3"
                      />
                      <span className="font-medium">{addOn.name}</span>
                    </div>
                    {addOn.price > 0 && (
                      <span className="text-gray-600">+₹{addOn.price}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (e.g., less spicy, no onions)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows="3"
              />
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium min-w-[2rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="btn-primary px-8 py-3 text-lg font-semibold"
              >
                Add to Cart - ₹{calculatePrice()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartPage;