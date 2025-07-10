'use client';

export function FeaturedDeals() {
  const deals = [
    {
      id: 1,
      destination: 'Tokyo, Japan',
      origin: 'New York',
      price: 589,
      originalPrice: 899,
      airline: 'ANA',
      duration: '14h 25m',
      stops: 'Non-stop',
      aiPrediction: 'Price likely to increase 15% in next 7 days',
      confidence: 85,
    },
    {
      id: 2,
      destination: 'Paris, France',
      origin: 'Los Angeles',
      price: 456,
      originalPrice: 678,
      airline: 'Air France',
      duration: '11h 45m',
      stops: 'Non-stop',
      aiPrediction: 'Good time to book - stable prices',
      confidence: 92,
    },
    {
      id: 3,
      destination: 'London, UK',
      origin: 'Chicago',
      price: 423,
      originalPrice: 599,
      airline: 'British Airways',
      duration: '8h 15m',
      stops: 'Non-stop',
      aiPrediction: 'Price may drop 8% in next 3 days',
      confidence: 78,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        🔥 AI-Curated Deals
      </h3>

      <div className="space-y-4">
        {deals.map(deal => (
          <div
            key={deal.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-lg text-gray-900">
                  {deal.origin} → {deal.destination}
                </h4>
                <p className="text-gray-600 text-sm">
                  {deal.airline} • {deal.duration} • {deal.stops}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    ${deal.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${deal.originalPrice}
                  </span>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  Save ${deal.originalPrice - deal.price}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-600 font-medium text-sm">
                  🤖 AI Insight
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {deal.confidence}% confidence
                </span>
              </div>
              <p className="text-blue-700 text-sm">{deal.aiPrediction}</p>
            </div>

            <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
