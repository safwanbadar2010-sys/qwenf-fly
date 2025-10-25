import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import { FiSearch, FiFilter, FiMapPin, FiCalendar, FiUsers, FiHome, FiStar } from 'react-icons/fi';
import HotelCard from '../components/Hotels/HotelCard';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

const Hotels = () => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

  const { data: hotelsData, isLoading, error, refetch } = useQuery(
    ['hotels', searchParams],
    () => api.get(endpoints.hotelSearch, { params: searchParams }),
    {
      enabled: !!(searchParams.city && searchParams.checkIn && searchParams.checkOut),
      retry: 1
    }
  );

  const handleSearch = (newParams) => {
    setSearchParams(prev => ({ ...prev, ...newParams }));
  };

  const hotels = hotelsData?.data?.data?.hotels || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Hotel</h1>
          <p className="text-gray-600">Discover amazing accommodations around the world</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Hotels</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Destination</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchParams.city}
                      onChange={(e) => handleSearch({ city: e.target.value })}
                      placeholder="City or hotel name"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Check-in Date</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={searchParams.checkIn}
                      onChange={(e) => handleSearch({ checkIn: e.target.value })}
                      className="input pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Check-out Date</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={searchParams.checkOut}
                      onChange={(e) => handleSearch({ checkOut: e.target.value })}
                      className="input pl-10"
                      min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Guests</label>
                    <div className="relative">
                      <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={searchParams.guests}
                        onChange={(e) => handleSearch({ guests: parseInt(e.target.value) })}
                        className="input pl-10"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Rooms</label>
                    <select
                      value={searchParams.rooms}
                      onChange={(e) => handleSearch({ rooms: parseInt(e.target.value) })}
                      className="input"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => refetch()}
                  className="btn btn-primary w-full"
                  disabled={!searchParams.city || !searchParams.checkIn || !searchParams.checkOut}
                >
                  <FiSearch className="w-5 h-5" />
                  Search Hotels
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
                  <FiHome className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : hotels.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {hotels.length} hotels found
                    </h2>
                    <p className="text-gray-600">
                      {searchParams.city}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="btn btn-outline btn-sm">
                      <FiFilter className="w-4 h-4" />
                      Filters
                    </button>
                    <select className="input">
                      <option value="rating">Sort by Rating</option>
                      <option value="price">Sort by Price</option>
                      <option value="name">Sort by Name</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} searchParams={searchParams} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FiHome className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600">Enter your destination and dates to find the best hotels</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
