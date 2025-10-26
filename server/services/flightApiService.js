const axios = require('axios');

class FlightApiService {
  constructor() {
    this.apiKey = process.env.FLIGHT_API_KEY;
    this.baseUrl = process.env.FLIGHT_API_BASE_URL || 'https://api.flightapi.io';
  }

  /**
   * Search one-way flights
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} - Flight search results
   */
  async searchOneWay({ from, to, date, adults = 1, children = 0, infants = 0, cabinClass = 'Economy', currency = 'USD' }) {
    try {
      const url = `${this.baseUrl}/onewaytrip/${this.apiKey}/${from}/${to}/${date}/${adults}/${children}/${infants}/${cabinClass}/${currency}`;
      
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return this.formatFlightResponse(response.data);
    } catch (error) {
      console.error('Flight API One-Way Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Search round-trip flights
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} - Flight search results
   */
  async searchRoundTrip({ from, to, departDate, returnDate, adults = 1, children = 0, infants = 0, cabinClass = 'Economy', currency = 'USD' }) {
    try {
      const url = `${this.baseUrl}/roundtrip/${this.apiKey}/${from}/${to}/${departDate}/${returnDate}/${adults}/${children}/${infants}/${cabinClass}/${currency}`;
      
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return this.formatFlightResponse(response.data);
    } catch (error) {
      console.error('Flight API Round-Trip Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Search multi-city flights
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} - Flight search results
   */
  async searchMultiCity({ airports, dates, adults = 1, children = 0, infants = 0, cabinClass = 'Economy', currency = 'USD' }) {
    try {
      let queryParams = new URLSearchParams();
      
      airports.forEach((airport, index) => {
        queryParams.append(`arp${index + 1}`, airport);
      });
      
      dates.forEach((date, index) => {
        queryParams.append(`date${index + 1}`, date);
      });

      queryParams.append('adults', adults);
      queryParams.append('children', children);
      queryParams.append('infants', infants);
      queryParams.append('cabinclass', cabinClass);
      queryParams.append('currency', currency);

      const url = `${this.baseUrl}/multitrip/${this.apiKey}?${queryParams.toString()}`;
      
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return this.formatFlightResponse(response.data);
    } catch (error) {
      console.error('Flight API Multi-City Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get airline information
   * @param {Object} params - Airline search parameters
   * @returns {Promise<Object>} - Airline information
   */
  async getAirlineInfo({ flightNumber, airlineCode, date }) {
    try {
      const url = `${this.baseUrl}/airline/${this.apiKey}?num=${flightNumber}&name=${airlineCode}&date=${date}`;
      
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Airline Info API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Track flight by route
   * @param {Object} params - Route tracking parameters
   * @returns {Promise<Object>} - Flight tracking data
   */
  async trackByRoute({ date, airport1, airport2 }) {
    try {
      const url = `${this.baseUrl}/trackbyroute/${this.apiKey}?date=${date}&airport1=${airport1}&airport2=${airport2}`;
      
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Track By Route API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Search IATA codes
   * @param {Object} params - IATA search parameters
   * @returns {Promise<Object>} - IATA code results
   */
  async searchIATA({ name, type = 'airline' }) {
    try {
      const url = `${this.baseUrl}/iata/${this.apiKey}?name=${encodeURIComponent(name)}&type=${type}`;
      
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('IATA Search API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get flight schedule
   * @param {Object} params - Schedule parameters
   * @returns {Promise<Object>} - Flight schedule data
   */
  async getSchedule({ mode = 'departures', iata, day = 1 }) {
    try {
      const url = `${this.baseUrl}/schedule/${this.apiKey}?mode=${mode}&iata=${iata}&day=${day}`;
      
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TravelBooking/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Schedule API Error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Format flight response to standardized structure
   * @param {Object} data - Raw API response
   * @returns {Object} - Formatted response
   */
  formatFlightResponse(data) {
    if (!data) {
      return { success: false, flights: [], message: 'No data received' };
    }

    // Handle different response structures from the API
    return {
      success: true,
      flights: data.itineraries || data.flights || data.results || [],
      airlines: data.airlines || [],
      airports: data.airports || [],
      filters: data.filters || {},
      metadata: {
        searchId: data.searchId || null,
        currency: data.currency || 'USD',
        total: data.total || 0,
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
          return new Error('No flights found for this search');
        case 429:
          return new Error('API rate limit exceeded. Please try again later');
        case 500:
          return new Error('Flight API service error. Please try again later');
        default:
          return new Error(`Flight API error: ${message}`);
      }
    } else if (error.request) {
      // Request made but no response
      return new Error('Flight API is not responding. Please try again later');
    } else {
      // Other errors
      return new Error(`Flight search error: ${error.message}`);
    }
  }
}

module.exports = new FlightApiService();
