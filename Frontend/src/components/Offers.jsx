import React from 'react';
import { Tag, Clock, Percent } from 'lucide-react';

const Offers = () => {
  const offers = [
    {
      id: 1,
      title: "50% OFF",
      description: "On your first order",
      code: "FIRST50",
      icon: Percent,
      color: "bg-red-500"
    },
    {
      id: 2,
      title: "Free Delivery",
      description: "Orders above ₹299",
      code: "FREEDEL",
      icon: Tag,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Happy Hours",
      description: "20% off 2-5 PM",
      code: "HAPPY20",
      icon: Clock,
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
            <div key={offer.id} className={`${offer.color} text-white p-4 rounded-lg flex items-center space-x-3`}>
              <Icon className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">{offer.title}</h3>
                <p className="text-sm opacity-90">{offer.description}</p>
                <p className="text-xs font-mono bg-white bg-opacity-20 px-2 py-1 rounded mt-1 inline-block">
                  {offer.code}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Offers;