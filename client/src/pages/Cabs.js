import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import { FiSearch, FiMapPin, FiUsers, FiCar, FiClock } from 'react-icons/fi';
import CabCard from '../components/Cabs/CabCard';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

const Cabs = () => {
  const [searchParams, setSearchParams] = useState({
    pickup: '',
    dropoff: '',
    passengers: 1,
    luggage: 0,
    vehicleType: ''
  });

  const { data: cabsData, isLoading, error, refetch } = useQuery(
    ['cabs', searchParams],
    () => api.get(endpoints.cabSearch, { params: searchParams }),
    {
      enabled: !!(searchParams.pickup),
      retry: 1
    }
  );

  const handleSearch = (newParams) => {
    setSearchParams(prev => ({ ...prev, ...newParams }));
  };

  const cabs = cabsData?.data?.data?.cabs || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Ride</h1>
          <p className="text-gray-600">Reliable transportation at your fingertips</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book a Cab</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Pickup Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchParams.pickup}
                      onChange={(e) => handleSearch({ pickup: e.target.value })}
                      placeholder="Enter pickup address"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Dropoff Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchParams.dropoff}
                      onChange={(e) => handleSearch({ dropoff: e.target.value })}
                      placeholder="Enter destination address"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Passengers</label>
                    <div className="relative">
                      <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={searchParams.passengers}
                        onChange={(e) => handleSearch({ passengers: parseInt(e.target.value) })}
                        className="input pl-10"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Luggage</label>
                    <select
                      value={searchParams.luggage}
                      onChange={(e) => handleSearch({ luggage: parseInt(e.target.value) })}
                      className="input"
                    >
                      {[0, 1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Bag' : 'Bags'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Vehicle Type</label>
                  <select
                    value={searchParams.vehicleType}
                    onChange={(e) => handleSearch({ vehicleType: e.target.value })}
                    className="input"
                  >
                    <option value="">Any Type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Luxury</option>
                    <option value="minivan">Minivan</option>
                  </select>
                </div>

                <button
                  onClick={() => refetch()}
                  className="btn btn-primary w-full"
                  disabled={!searchParams.pickup}
                >
                  <FiSearch className="w-5 h-5" />
                  Find Cabs
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <LoadingSkeleton key={i} height="200px" />
                ))}
              </div>
            ) : error ? (
              <div className="card p-8 text-center">
                <div className="text-red-500 mb-4">
                  <FiCar className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No cabs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : cabs.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {cabs.length} cabs available
                    </h2>
                    <p className="text-gray-600">
                      {searchParams.pickup} → {searchParams.dropoff || 'Any destination'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cabs.map((cab) => (
                    <CabCard key={cab._id} cab={cab} searchParams={searchParams} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FiCar className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600">Enter your pickup location to find available cabs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cabs;
