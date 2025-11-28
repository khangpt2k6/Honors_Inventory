export interface Location {
  id: number;
  room_name: string;
  building_type: 'Warehouse' | 'Classroom' | 'Office';
}

export interface Equipment {
  id: number;
  model: string;
  equipment_type: string;
  location_id: number;
  room_name: string;
  building_type: 'Warehouse' | 'Classroom' | 'Office';
  created_at: string;
  updated_at: string;
}

export interface Stats {
  total: number;
  byLocation: { building_type: string; count: number }[];
  byType: { equipment_type: string; count: number }[];
}

export interface EquipmentFormData {
  model: string;
  equipment_type: string;
}

export type BuildingType = 'Warehouse' | 'Classroom' | 'Office' | 'All';

