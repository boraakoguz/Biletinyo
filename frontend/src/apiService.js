// API service utility for handling authenticated requests
const API_BASE_URL = 'http://localhost:8080/api';

// Generic fetch function with authentication
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Handle unauthorized errors (token expired, invalid)
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  
  return response;
};

// API methods
export const apiService = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  
  // Events
  getEvents: async () => {
    const res = await fetch(`${API_BASE_URL}/events/`);
    return res.json();
  },
  
  getEventById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`);
    return res.json();
  },
  
  createEvent: async (eventData) => {
    const res = await fetchWithAuth('/events/', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return res.json();
  },
  
  updateEvent: async (id, eventData) => {
    const res = await fetchWithAuth(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    return res.json();
  },
  
  deleteEvent: async (id) => {
    const res = await fetchWithAuth(`/events/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
  
  // User
  getUserProfile: async (id) => {
    const res = await fetchWithAuth(`/users/${id}`);
    return res.json();
  },
  
  updateUserProfile: async (id, userData) => {
    const res = await fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  
  // Tickets
  getTickets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetchWithAuth(`/tickets/?${queryString}`);
    return res.json();
  },
  
  getTicketById: async (id) => {
    const res = await fetchWithAuth(`/tickets/${id}`);
    return res.json();
  },
  
  createTicket: async (ticketData) => {
    const res = await fetchWithAuth('/tickets/', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
    return res.json();
  },
  
  // Payments
  createPayment: async (paymentData) => {
    const res = await fetchWithAuth('/payments/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return res.json();
  },
  
  // Comments
  getComments: async (eventId) => {
    const res = await fetch(`${API_BASE_URL}/comments/?event_id=${eventId}`);
    return res.json();
  },
  
  addComment: async (commentData) => {
    const res = await fetchWithAuth('/comments/', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
    return res.json();
  },
  
  // Venues
  getVenues: async () => {
    const res = await fetch(`${API_BASE_URL}/venues/`);
    return res.json();
  },
  
  getVenueById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/venues/${id}`);
    return res.json();
  },
  
  createVenue: async (venueData) => {
    const res = await fetchWithAuth('/venues/', {
      method: 'POST',
      body: JSON.stringify(venueData),
    });
    return res.json();
  },
  
  updateVenue: async (id, venueData) => {
    const res = await fetchWithAuth(`/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(venueData),
    });
    return res.json();
  },
  
  // Reports
  getSalesReport: async (organizerId) => {
    const res = await fetchWithAuth(`/reports/sales/${organizerId}`);
    return res.json();
  },
};

export default apiService; 