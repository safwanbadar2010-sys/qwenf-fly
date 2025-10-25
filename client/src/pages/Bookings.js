import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import { FiSearch, FiFilter, FiCalendar, FiPlane, FiHome, FiCar, FiPackage, FiEye, FiX } from 'react-icons/fi';
import BookingCard from '../components/Bookings/BookingCard';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

const Bookings = () => {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  const { data: bookingsData, isLoading, error, refetch } = useQuery(
    ['bookings', filters],
    () => api.get(endpoints.bookings, { params: filters }),
    { retry: 1 }
  );

  const { data: statsData } = useQuery(
    'booking-stats',
    () => api.get(`${endpoints.bookings}/stats/summary`),
    { staleTime: 5 * 60 * 1000 }
  );

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const bookings = bookingsData?.data?.data?.bookings || [];
  const stats = statsData?.data?.data || {};

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      completed: 'text-blue-600 bg-blue-100',
      refunded: 'text-gray-600 bg-gray-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      flight: FiPlane,
      hotel: FiHome,
      cab: FiCar,
      package: FiPackage
    };
    return iconMap[type] || FiCalendar;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track all your travel bookings</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings || 0}</p>
                </div>
                <FiCalendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalSpent || 0}</p>
                </div>
                <FiCalendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flights</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.bookingsByType?.find(b => b._id === 'flight')?.count || 0}
                  </p>
                </div>
                <FiPlane className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hotels</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.bookingsByType?.find(b => b._id === 'hotel')?.count || 0}
                  </p>
                </div>
                <FiHome className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Search</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange({ search: e.target.value })}
                      placeholder="Search bookings..."
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange({ type: e.target.value })}
                    className="input"
                  >
                    <option value="">All Types</option>
                    <option value="flight">Flights</option>
                    <option value="hotel">Hotels</option>
                    <option value="cab">Cabs</option>
                    <option value="package">Packages</option>
                  </select>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange({ status: e.target.value })}
                    className="input"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <button
                  onClick={() => handleFilterChange({ type: '', status: '', search: '' })}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Bookings List */}
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
                  <FiCalendar className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading bookings</h3>
                <p className="text-gray-600">Please try again later</p>
              </div>
            ) : bookings.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {bookings.length} bookings found
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FiCalendar className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {filters.type || filters.status || filters.search 
                    ? 'Try adjusting your filters' 
                    : 'Start by booking your first trip'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
