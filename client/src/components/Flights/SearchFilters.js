import React from 'react';
import { FiX } from 'react-icons/fi';

const SearchFilters = ({ filters, onFilterChange, onClose }) => {
  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    onFilterChange({ priceRange: newPriceRange });
  };

  const handleAirlineChange = (airline) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    onFilterChange({ airlines: newAirlines });
  };

  const airlines = [
    'American Airlines',
    'Delta Air Lines',
    'United Airlines',
    'Southwest Airlines',
    'JetBlue Airways',
    'Alaska Airlines',
    'Spirit Airlines',
    'Frontier Airlines'
  ];

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price Range */}
        <div>
          <label className="label">Price Range</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">$</span>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="input"
                placeholder="Min"
              />
              <span className="text-sm text-gray-600">to</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="input"
                placeholder="Max"
              />
            </div>
            <div className="text-xs text-gray-500">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </div>
          </div>
        </div>

        {/* Airlines */}
        <div>
          <label className="label">Airlines</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {airlines.map((airline) => (
              <label key={airline} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineChange(airline)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{airline}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration & Stops */}
        <div>
          <label className="label">Duration</label>
          <select
            value={filters.duration}
            onChange={(e) => onFilterChange({ duration: e.target.value })}
            className="input"
          >
            <option value="">Any Duration</option>
            <option value="0-3">Under 3 hours</option>
            <option value="3-6">3-6 hours</option>
            <option value="6-12">6-12 hours</option>
            <option value="12+">Over 12 hours</option>
          </select>

          <label className="label mt-4">Stops</label>
          <select
            value={filters.stops}
            onChange={(e) => onFilterChange({ stops: e.target.value })}
            className="input"
          >
            <option value="">Any Stops</option>
            <option value="0">Non-stop only</option>
            <option value="1">1 stop</option>
            <option value="2+">2+ stops</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => onFilterChange({
            priceRange: [0, 2000],
            airlines: [],
            duration: '',
            stops: ''
          })}
          className="btn btn-outline btn-sm"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="btn btn-primary btn-sm"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
