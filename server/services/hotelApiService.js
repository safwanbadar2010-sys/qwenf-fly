const axios = require('axios');

class HotelApiService {
  constructor() {
    this.apiKey = process.env.HOTEL_API_KEY;
    this.baseUrl = process.env.HOTEL_API_BASE_URL || 'https://api.makcorps.com';
  }

  /**
   * Search hotels by city
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} - Hotel search results
   */
  async searchByCity({ cityId, checkIn, checkOut, rooms = 1, adults = 2, children = 0, currency = 'USD', pagination = 0 }) {
    try {
      const url = `${this.baseUrl}/city?cityid=${cityId}&pagination=${pagination}&cur=${currency}&rooms=${rooms}&adults=${adults}&checkin=${checkIn}&checkout=${checkOut}&api_key=${this.apiKey}`;
      
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return this.formatHotelResponse(response.data);
    } catch (error) {
      console.error('Hotel City Search API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get hotel details
   * @param {Object} params - Hotel parameters
   * @returns {Promise<Object>} - Hotel details
   */
  async getHotelDetails({ hotelId, checkIn, checkOut, rooms = 1, adults = 1, children = 0 }) {
    try {
      const url = `${this.baseUrl}/hotel?hotelid=${hotelId}&rooms=${rooms}&adults=${adults}&checkin=${checkIn}&checkout=${checkOut}&api_key=${this.apiKey}`;
      
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return this.formatHotelDetailsResponse(response.data);
    } catch (error) {
      console.error('Hotel Details API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get booking information
   * @param {Object} params - Booking parameters
   * @returns {Promise<Object>} - Booking details
   */
  async getBookingInfo({ country = 'us', hotelId, checkIn, checkOut, rooms = 1, adults = 2, kids = 0, currency = 'USD' }) {
    try {
      const url = `${this.baseUrl}/booking?country=${country}&hotelid=${hotelId}&checkin=${checkIn}&checkout=${checkOut}&currency=${currency}&kids=${kids}&adults=${adults}&rooms=${rooms}&api_key=${this.apiKey}`;
      
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Hotel Booking API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get Expedia hotel data
   * @param {Object} params - Expedia search parameters
   * @returns {Promise<Object>} - Expedia hotel data
   */
  async getExpediaHotel({ hotelId, checkIn, checkOut, rooms = 1, adults = 2, currency = 'USD' }) {
    try {
      const url = `${this.baseUrl}/expedia?hotelid=${hotelId}&currency=${currency}&rooms=${rooms}&adults=${adults}&checkin=${checkIn}&checkout=${checkOut}&api_key=${this.apiKey}`;
      
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Expedia Hotel API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Map hotel name to ID
   * @param {Object} params - Mapping parameters
   * @returns {Promise<Object>} - Hotel mapping data
   */
  async mapHotelName({ name }) {
    try {
      const url = `${this.baseUrl}/mapping?api_key=${this.apiKey}&name=${encodeURIComponent(name)}`;
      
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Hotel Mapping API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get account information
   * @returns {Promise<Object>} - Account data
   */
  async getAccountInfo() {
    try {
      const url = `${this.baseUrl}/account?api_key=${this.apiKey}`;
      
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Account API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Search hotels by name or location
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} - Search results
   */
  async searchHotels({ query, checkIn, checkOut, rooms = 1, adults = 2, currency = 'USD' }) {
    try {
      // First, map the query to get hotel ID or city ID
      const mappingResult = await this.mapHotelName({ name: query });
      
      if (!mappingResult || !mappingResult.data) {
        return { success: false, hotels: [], message: 'No hotels found' };
      }

      // If we get a city ID, search by city
      if (mappingResult.data.cityId) {
        return await this.searchByCity({
          cityId: mappingResult.data.cityId,
          checkIn,
          checkOut,
          rooms,
          adults,
          currency
        });
      }

      // If we get a hotel ID, get hotel details
      if (mappingResult.data.hotelId) {
        return await this.getHotelDetails({
          hotelId: mappingResult.data.hotelId,
          checkIn,
          checkOut,
          rooms,
          adults
        });
      }

      return { success: false, hotels: [], message: 'Unable to find hotels for this search' };
    } catch (error) {
      console.error('Hotel Search Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Format hotel response to standardized structure
   * @param {Object} data - Raw API response
   * @returns {Object} - Formatted response
   */
  formatHotelResponse(data) {
    if (!data) {
      return { success: false, hotels: [], message: 'No data received' };
    }

    return {
      success: true,
      hotels: data.hotels || data.results || [],
      filters: data.filters || {},
      metadata: {
        total: data.total || 0,
        currency: data.currency || 'USD',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Format hotel details response
   * @param {Object} data - Raw API response
   * @returns {Object} - Formatted response
   */
  formatHotelDetailsResponse(data) {
    if (!data) {
      return { success: false, hotel: null, message: 'No data received' };
    }

    return {
      success: true,
      hotel: data.hotel || data,
      rooms: data.rooms || [],
      amenities: data.amenities || [],
      images: data.images || [],
      reviews: data.reviews || [],
      metadata: {
        currency: data.currency || 'USD',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Error} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      // API responded with error
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;
      
      switch (status) {
        case 400:
          return new Error(`Invalid request: ${message}`);
        case 401:
          return new Error('Invalid API key or unauthorized access');
        case 404:
          return new Error('No hotels found for this search');
        case 429:
          return new Error('API rate limit exceeded. Please try again later');
        case 500:
          return new Error('Hotel API service error. Please try again later');
        default:
          return new Error(`Hotel API error: ${message}`);
      }
    } else if (error.request) {
      // Request made but no response
      return new Error('Hotel API is not responding. Please try again later');
    } else {
      // Other errors
      return new Error(`Hotel search error: ${error.message}`);
    }
  }
}

module.exports = new HotelApiService();
