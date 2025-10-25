import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    flights: {
      from: '',
      to: '',
      departureDate: '',
      returnDate: '',
      passengers: 1,
      class: 'economy'
    },
    hotels: {
      city: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      rooms: 1
    },
    cabs: {
      pickup: null,
      dropoff: null,
      passengers: 1,
      luggage: 0,
      vehicleType: ''
    },
    packages: {
      destination: '',
      category: '',
      duration: '',
      travelers: 1
    }
  });

  const [selectedItems, setSelectedItems] = useState({
    flight: null,
    hotel: null,
    cab: null,
    package: null
  });

  const updateSearchParams = (type, params) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: { ...prev[type], ...params }
    }));
  };

  const setSelectedItem = (type, item) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: item
    }));
  };

  const clearSearch = (type) => {
    setSearchParams(prev => ({
      ...prev,
      [type]: {
        flights: { from: '', to: '', departureDate: '', returnDate: '', passengers: 1, class: 'economy' },
        hotels: { city: '', checkIn: '', checkOut: '', guests: 1, rooms: 1 },
        cabs: { pickup: null, dropoff: null, passengers: 1, luggage: 0, vehicleType: '' },
        packages: { destination: '', category: '', duration: '', travelers: 1 }
      }[type]
    }));
  };

  const value = {
    searchParams,
    selectedItems,
    updateSearchParams,
    setSelectedItem,
    clearSearch
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
