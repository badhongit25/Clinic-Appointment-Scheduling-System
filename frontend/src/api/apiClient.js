// API Client for Clinic Appointment Scheduling System
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('clinic_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err.message);
    throw err;
  }
}

// Authentication APIs
export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me', { method: 'GET' }),
};

// Doctors APIs
export const doctorApi = {
  getAll: () => request('/doctors', { method: 'GET' }),
  create: (doc) => request('/doctors', { method: 'POST', body: JSON.stringify(doc) }),
  delete: (id) => request(`/doctors/${id}`, { method: 'DELETE' }),
};

// Appointments APIs
export const appointmentApi = {
  getAll: (email) => request(email ? `/appointments?email=${encodeURIComponent(email)}` : '/appointments', { method: 'GET' }),
  create: (appt) => request('/appointments', { method: 'POST', body: JSON.stringify(appt) }),
  updateStatus: (id, status) => request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),
};
