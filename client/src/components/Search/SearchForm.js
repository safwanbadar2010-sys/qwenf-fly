import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiHome, FiCar, FiPackage } from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import { useBooking } from '../../contexts/BookingContext';

const SearchForm = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const { updateSearchParams } = useBooking();

  const tabs = [
    { id: 'flights', name: 'Flights', icon: FaPlane, color: 'text-blue-600' },
    { id: 'hotels', name: 'Hotels', icon: FiHome, color: 'text-green-600' },
    { id: 'cabs', name: 'Cabs', icon: FiCar, color: 'text-purple-600' },
    { id: 'packages', name: 'Packages', icon: FiPackage, color: 'text-orange-600' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigation will be handled by the individual search pages
    const searchPath = `/${activeTab}`;
    window.location.href = searchPath;
  };

  return (
    <div className="card p-6 shadow-xl">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
              <span className="font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        {activeTab === 'flights' && <FlightSearchForm />}
        {activeTab === 'hotels' && <HotelSearchForm />}
        {activeTab === 'cabs' && <CabSearchForm />}
        {activeTab === 'packages' && <PackageSearchForm />}
      </form>
    </div>
  );
};

const FlightSearchForm = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">From</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="Departure city or airport"
              className="input pl-10"
              required
            />
          </div>
        </div>
        <div>
          <label className="label">To</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="Destination city or airport"
              className="input pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Departure Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              className="input pl-10"
              required
            />
          </div>
        </div>
        <div>
          <label className="label">Return Date (Optional)</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Passengers</label>
          <div className="relative">
            <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="input pl-10"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Class</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="input"
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        <FiSearch className="w-5 h-5" />
        Search Flights
      </button>
    </div>
  );
};

const HotelSearchForm = () => {
  const [formData, setFormData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Destination</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City or hotel name"
            className="input pl-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Check-in Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="input pl-10"
              required
            />
          </div>
        </div>
        <div>
          <label className="label">Check-out Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="input pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Guests</label>
          <div className="relative">
            <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
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
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            className="input"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        <FiSearch className="w-5 h-5" />
        Search Hotels
      </button>
    </div>
  );
};

const CabSearchForm = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    passengers: 1,
    luggage: 0,
    vehicleType: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Pickup Location</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="pickup"
            value={formData.pickup}
            onChange={handleChange}
            placeholder="Enter pickup address"
            className="input pl-10"
            required
          />
        </div>
      </div>

      <div>
        <label className="label">Dropoff Location</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="dropoff"
            value={formData.dropoff}
            onChange={handleChange}
            placeholder="Enter destination address"
            className="input pl-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Passengers</label>
          <div className="relative">
            <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
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
            name="luggage"
            value={formData.luggage}
            onChange={handleChange}
            className="input"
          >
            {[0, 1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Bag' : 'Bags'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="input"
          >
            <option value="">Any Type</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="luxury">Luxury</option>
            <option value="minivan">Minivan</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        <FiSearch className="w-5 h-5" />
        Search Cabs
      </button>
    </div>
  );
};

const PackageSearchForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    category: '',
    duration: '',
    travelers: 1
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Destination</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Where do you want to go?"
            className="input pl-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
          >
            <option value="">Any Category</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="beach">Beach</option>
            <option value="mountain">Mountain</option>
            <option value="city">City</option>
            <option value="wildlife">Wildlife</option>
            <option value="luxury">Luxury</option>
            <option value="family">Family</option>
          </select>
        </div>
        <div>
          <label className="label">Duration</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
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
      </div>

      <div>
        <label className="label">Travelers</label>
        <div className="relative">
          <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            name="travelers"
            value={formData.travelers}
            onChange={handleChange}
            className="input pl-10"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        <FiSearch className="w-5 h-5" />
        Search Packages
      </button>
    </div>
  );
};

export default SearchForm;
