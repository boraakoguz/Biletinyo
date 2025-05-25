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
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
  
    return data;
  },
  
  // Events
  getEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/events/${queryString ? `?${queryString}` : ""}`;
    
    const token = localStorage.getItem("token");
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
  
    return await res.json();
  },
  
  getEventById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}`);
    return res.json();
  },
  
  getEventCapacityById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/events/${id}/capacity`);
    if (!res.ok) {
      throw new Error("Failed to fetch event capacity");
    }
    return res.json();
  },

  getEventOccupiedSeatsById: async (event_id) => {
    const res = await fetch(`http://localhost:8080/api/events/${event_id}/occupied`);
    if (!res.ok) throw new Error("Failed to fetch occupied seat count");
    return res.json();
  },

  updateEventPrices: async (eventId, prices) => {
    const res = await fetch(`http://localhost:8080/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        default_ticket_price: prices.cat1,
        vip_ticket_price: prices.cat2,
        premium_ticket_price: prices.cat3,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to update prices");
    }
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
  
  getUserById: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },
  getUsers: async (params = {}) => {
    // params = { user_type: 1, search: "abc" }
    const qs = new URLSearchParams(params).toString();  // user_type=1&search=abc
    const res = await fetch(`${API_BASE_URL}/users/?${qs}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },


  getOrganizerRevenue: async (organizerId) => {
    const res = await fetch(`${API_BASE_URL}/users/organizer/${organizerId}/revenue`);
    if (!res.ok) throw new Error("Failed to fetch organizer revenue");
    return res.json();
  },

  getEventsByOrganizer: async (organizerId) => {
    const res = await fetch(`${API_BASE_URL}/events/?organizer_id=${organizerId}`);
    if (!res.ok) throw new Error("Failed to load organizer events");
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
  getTicketsByUserId: async (userId) => {
    const res = await fetchWithAuth(`/tickets/?attendee_id=${userId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || 'Failed to fetch tickets');
    }
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
    const token = localStorage.getItem("token");
  
    const res = await fetch("http://localhost:8080/api/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });
  
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData?.error || "Failed to post comment");
    }
  
    return res.json(); 
  },
  // Venues
  getVenues: async () => {
    const res = await fetch(`${API_BASE_URL}/venues/`);
    return res.json();
  },

  getAvailableVenues: async () => {
    const res = await fetch(`${API_BASE_URL}/venues/available`);
    return res.json();
  },

  getRequestedVenues: async () => {
    const res = await fetch(`${API_BASE_URL}/venues/request`);
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

  requestVenue: async (venueData) => {
    const res = await fetch("http://localhost:8080/api/venues/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(venueData),
    });
  
    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg);
    }
  
    return res.text();
  },

  getPendingVenueCount: async () => {
    const res = await fetch("http://localhost:8080/api/venues/request/count");
    if (!res.ok) throw new Error("Failed to fetch count");
    return res.json();
  },

  acceptVenueRequest: async (venueId) => {
    const res = await fetch(`http://localhost:8080/api/venues/accept/${venueId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to accept venue");
    return res.text();
  },

  rejectVenueRequest: async (venueId) => {
    const res = await fetch(`http://localhost:8080/api/venues/reject/${venueId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to reject venue");
    return res.text();
  },

  getVenueCapacity: async (venueId) => {
    const res = await fetch(`http://localhost:8080/api/venues/${venueId}/capacity`);
    if (!res.ok) throw new Error("Failed to get venue capacity");
    return res.json();
  },
  
  // Reports
  getSalesReport: async (organizerId) => {
    const res = await fetchWithAuth(`/reports/sales/${organizerId}`);
    return res.json();
  },

  getUserFollows: async (userId, organizerId = null) => {
    const url = organizerId
      ? `${API_BASE_URL}/follows/${userId}?organizer_id=${organizerId}`
      : `${API_BASE_URL}/follows/${userId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch follows");
    return res.json();
  },
  
  isFollowing: async (userId, organizerId) => {
    const data = await apiService.getUserFollows(userId, organizerId);
    return data !== null;
  },
  
  getEventsByOrganizer: async (organizerId) => {
    const res = await fetch(`${API_BASE_URL}/events/?organizer_id=${organizerId}`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  },
  
  followOrganizer: async (userId, organizerId) => {
    const res = await fetchWithAuth('/follows/', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, organizer_id: organizerId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || 'Failed to follow organizer');
    }
    return res.text();
  },

  unfollowOrganizer: async (userId, organizerId) => {
    const res = await fetchWithAuth(`/follows/${userId}/${organizerId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || 'Failed to unfollow organizer');
    }
    return res.text();
  },
  getFollowerCounts: async () => {
    const res = await fetchWithAuth("/follows/count");
    if (!res.ok) throw new Error("Failed to fetch follower counts");
    return res.json();
  },
  getFollowingCount: async (userId) => {
    const res = await fetchWithAuth(`/follows/count/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch following count");
    return res.json();
  },
  getPaymentsByUserId: async (userId) => {
    const res = await fetchWithAuth(`/payments/${userId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || 'Failed to fetch payments');
    }
    return res.json();
  },
  getImageById: async (id) => {
    const res = await fetchWithAuth(`/images/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch image');
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },
}; 


export default apiService; 