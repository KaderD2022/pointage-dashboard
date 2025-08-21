import { authService } from './authService';

const API_BASE = 'http://localhost:8000';

export const api = {
  get: async (url: string) => {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  post: async (url: string, data: any) => {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  postForm: async (url: string, formData: URLSearchParams) => {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    return handleResponse(response);
  },

  put: async (url: string, data: any) => {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (url: string) => {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = 'Erreur API';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      errorMessage = await response.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  // Pour les réponses sans contenu (204 No Content)
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}