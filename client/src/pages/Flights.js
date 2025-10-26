import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import { FiSearch, FiFilter, FiSortAsc, FiClock, FiMapPin } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import FlightCard from '../components/Flights/FlightCard';
import SearchFilters from '../components/Flights/SearchFilters';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

const Flights = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    airlines: [],
    duration: '',
    stops: '',
    sortBy: 'price'
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: flightsData, isLoading, error, refetch } = useQuery(
    ['flights', searchParams],
    () => api.get(endpoints.flightSearch, { params: searchParams }),
    {
      enabled: !!(searchParams.from && searchParams.to && searchParams.departureDate),
      retry: 1
    }
  );

  const { data: airportsData } = useQuery(
    'airports',
    () => api.get(endpoints.airports, { params: { limit: 50 } }),
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );

  const handleSearch = (newParams) => {
    setSearchParams(prev => ({ ...prev, ...newParams }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const flights = flightsData?.data?.data?.outbound || [];
  const returnFlights = flightsData?.data?.data?.return || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Flight</h1>
          <p className="text-gray-600">Search and compare flights from hundreds of airlines</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Flights</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="label">From</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchParams.from}
                      onChange={(e) => handleSearch({ from: e.target.value })}
                      placeholder="Departure city or airport"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">To</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchParams.to}
                      onChange={(e) => handleSearch({ to: e.target.value })}
                      placeholder="Destination city or airport"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Departure Date</label>
                  <input
                    type="date"
                    value={searchParams.departureDate}
                    onChange={(e) => handleSearch({ departureDate: e.target.value })}
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="label">Return Date (Optional)</label>
                  <input
                    type="date"
                    value={searchParams.returnDate}
                    onChange={(e) => handleSearch({ returnDate: e.target.value })}
                    className="input"
                    min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Passengers</label>
                    <select
                      value={searchParams.passengers}
                      onChange={(e) => handleSearch({ passengers: parseInt(e.target.value) })}
                      className="input"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Class</label>
                    <select
                      value={searchParams.class}
                      onChange={(e) => handleSearch({ class: e.target.value })}
                      className="input"
                    >
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => refetch()}
                  className="btn btn-primary w-full"
                  disabled={!searchParams.from || !searchParams.to || !searchParams.departureDate}
                >
                  <FiSearch className="w-5 h-5" />
                  Search Flights
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
                  <FaPlane className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : flights.length > 0 ? (
              <div>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {flights.length} flights found
                    </h2>
                    <p className="text-gray-600">
                      {searchParams.from} → {searchParams.to}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="btn btn-outline btn-sm"
                    >
                      <FiFilter className="w-4 h-4" />
                      Filters
                    </button>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                      className="input"
                    >
                      <option value="price">Sort by Price</option>
                      <option value="duration">Sort by Duration</option>
                      <option value="departure">Sort by Departure Time</option>
                    </select>
                  </div>
                </div>

                {/* Filters */}
                {showFilters && (
                  <SearchFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClose={() => setShowFilters(false)}
                  />
                )}

                {/* Flight Results */}
                <div className="space-y-4">
                  {flights.map((flight) => (
                    <FlightCard key={flight._id} flight={flight} searchParams={searchParams} />
                  ))}
                </div>

                {/* Return Flights */}
                {returnFlights.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Return Flights</h3>
                    <div className="space-y-4">
                      {returnFlights.map((flight) => (
                        <FlightCard key={flight._id} flight={flight} searchParams={searchParams} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FaPlane className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600">Enter your travel details to find the best flights</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flights;
