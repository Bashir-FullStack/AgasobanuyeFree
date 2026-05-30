const API_BASE_URL = 'http://localhost:4000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }
  return { 'Content-Type': 'application/json' };
};

const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Request failed');
    }
    return res.json();
  },
  post: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const headers = getAuthHeaders();
    if (isFormData) delete headers['Content-Type'];
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Request failed');
    }
    return res.json();
  },
  put: async (endpoint, body) => {
    const isFormData = body instanceof FormData;
    const headers = getAuthHeaders();
    if (isFormData) delete headers['Content-Type'];
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Request failed');
    }
    return res.json();
  },
  delete: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Request failed');
    }
    return res.json();
  },
};

export { API_BASE_URL, getAuthHeaders, api };
