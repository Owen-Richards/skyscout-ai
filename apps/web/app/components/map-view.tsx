'use client';

import { useEffect, useRef } from 'react';

// Mock MapView component since Mapbox requires API keys
export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Initialize Mapbox map when API key is available
    // This is a placeholder implementation
  }, []);

  const mockDeals = [
    { city: 'Tokyo', price: 589, lat: 35.6762, lng: 139.6503 },
    { city: 'Paris', price: 456, lat: 48.8566, lng: 2.3522 },
    { city: 'London', price: 423, lat: 51.5074, lng: -0.1278 },
    { city: 'Sydney', price: 734, lat: -33.8688, lng: 151.2093 },
    { city: 'Dubai', price: 512, lat: 25.2048, lng: 55.2708 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">🗺️ Deal Heatmap</h3>

      {/* Placeholder for Mapbox integration */}
      <div
        ref={mapContainer}
        className="w-full h-96 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Interactive Map Coming Soon
            </h4>
            <p className="text-gray-600 text-sm max-w-xs">
              Mapbox integration will show real-time flight deals on an
              interactive world map
            </p>
          </div>
        </div>

        {/* Mock deal pins */}
        {mockDeals.map((deal, index) => (
          <div
            key={deal.city}
            className="absolute bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + index * 8}%`,
            }}
          >
            ${deal.price}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {mockDeals.map(deal => (
          <div
            key={deal.city}
            className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="font-semibold text-gray-900">{deal.city}</div>
            <div className="text-green-600 font-bold">${deal.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
