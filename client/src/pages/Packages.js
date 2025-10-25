import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { api, endpoints } from '../utils/api';
import { FiSearch, FiMapPin, FiUsers, FiPackage, FiStar, FiClock } from 'react-icons/fi';
import PackageCard from '../components/Packages/PackageCard';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

const Packages = () => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    category: '',
    duration: '',
    travelers: 1
  });

  const { data: packagesData, isLoading, error, refetch } = useQuery(
    ['packages', searchParams],
    () => api.get(endpoints.packageSearch, { params: searchParams }),
    {
      enabled: !!(searchParams.destination),
      retry: 1
    }
  );

  const { data: categoriesData } = useQuery(
    'package-categories',
    () => api.get(endpoints.packageCategories),
    { staleTime: 5 * 60 * 1000 }
  );

  const handleSearch = (newParams) => {
    setSearchParams(prev => ({ ...prev, ...newParams }));
  };

  const packages = packagesData?.data?.data?.packages || [];
  const categories = categoriesData?.data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Travel Packages</h1>
          <p className="text-gray-600">Complete travel experiences with everything included</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Packages</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Destination</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchParams.destination}
                      onChange={(e) => handleSearch({ destination: e.target.value })}
                      placeholder="Where do you want to go?"
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    value={searchParams.category}
                    onChange={(e) => handleSearch({ category: e.target.value })}
                    className="input"
                  >
                    <option value="">Any Category</option>
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Duration</label>
                  <select
                    value={searchParams.duration}
                    onChange={(e) => handleSearch({ duration: e.target.value })}
                    className="input"
                  >
                    <option value="">Any Duration</option>
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days</option>
                    <option value="10">10 Days</option>
                    <option value="14">14 Days</option>
                  </select>
                </div>

                <div>
                  <label className="label">Travelers</label>
                  <div className="relative">
                    <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={searchParams.travelers}
                      onChange={(e) => handleSearch({ travelers: parseInt(e.target.value) })}
                      className="input pl-10"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => refetch()}
                  className="btn btn-primary w-full"
                  disabled={!searchParams.destination}
                >
                  <FiSearch className="w-5 h-5" />
                  Search Packages
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <LoadingSkeleton key={i} height="300px" />
                ))}
              </div>
            ) : error ? (
              <div className="card p-8 text-center">
                <div className="text-red-500 mb-4">
                  <FiPackage className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : packages.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {packages.length} packages found
                    </h2>
                    <p className="text-gray-600">
                      {searchParams.destination}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select className="input">
                      <option value="rating">Sort by Rating</option>
                      <option value="price">Sort by Price</option>
                      <option value="duration">Sort by Duration</option>
                      <option value="name">Sort by Name</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  {packages.map((pkg) => (
                    <PackageCard key={pkg._id} package={pkg} searchParams={searchParams} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FiPackage className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600">Enter your destination to find amazing travel packages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
