import { Equipment, Location, Stats, EquipmentFormData } from './types';

const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const response = await fetch(`${API_BASE}/locations`);
    return handleResponse<Location[]>(response);
  },

  getById: async (id: number): Promise<Location> => {
    const response = await fetch(`${API_BASE}/locations/${id}`);
    return handleResponse<Location>(response);
  },

  create: async (data: Omit<Location, 'id'>): Promise<Location> => {
    const response = await fetch(`${API_BASE}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Location>(response);
  },
};

export const equipmentApi = {
  getAll: async (filters?: {
    location_id?: number;
    equipment_type?: string;
    building_type?: string;
  }): Promise<Equipment[]> => {
    const params = new URLSearchParams();
    if (filters?.location_id) params.append('location_id', String(filters.location_id));
    if (filters?.equipment_type) params.append('equipment_type', filters.equipment_type);
    if (filters?.building_type) params.append('building_type', filters.building_type);

    const query = params.toString();
    const response = await fetch(`${API_BASE}/equipment${query ? `?${query}` : ''}`);
    return handleResponse<Equipment[]>(response);
  },

  getById: async (id: number): Promise<Equipment> => {
    const response = await fetch(`${API_BASE}/equipment/${id}`);
    return handleResponse<Equipment>(response);
  },

  create: async (data: EquipmentFormData): Promise<Equipment> => {
    const response = await fetch(`${API_BASE}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Equipment>(response);
  },

  update: async (id: number, data: Partial<EquipmentFormData>): Promise<Equipment> => {
    const response = await fetch(`${API_BASE}/equipment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Equipment>(response);
  },

  transfer: async (id: number, location_id: number): Promise<Equipment> => {
    const response = await fetch(`${API_BASE}/equipment/${id}/transfer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location_id }),
    });
    return handleResponse<Equipment>(response);
  },

  delete: async (id: number): Promise<{ message: string; id: number }> => {
    const response = await fetch(`${API_BASE}/equipment/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string; id: number }>(response);
  },

  getTypes: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE}/equipment-types`);
    return handleResponse<string[]>(response);
  },
};

// stats api
export const statsApi = {
  get: async (): Promise<Stats> => {
    const response = await fetch(`${API_BASE}/stats`);
    return handleResponse<Stats>(response);
  },
};

