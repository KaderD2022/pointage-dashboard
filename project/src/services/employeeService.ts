import { api } from './api';
import { authService } from './authService';

export interface Employee {
  id: number;
  matricule: string;
  first_name: string;
  last_name: string;
  email: string;
  poste: string;
  service: string;
  date_embauche: string;
  is_active: boolean;
  is_admin: boolean;
  heures_mois?: number;
  retards_mois?: number;
  total_heures_annee?: number;
  penalites_heures?: number;
  conges_restants?: number;
}

export interface EmployeeStats {
  total_employees: number;
  active_employees: number;
  on_leave_employees: number;
  total_hours_month: number;
  total_penalties: number;
  total_remaining_leaves: number;
}

export interface CreateEmployeeData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  poste: string;
  service: string;
  date_embauche: string;
  matricule: string;
  is_admin?: boolean;
}

export interface UpdateEmployeeData {
  first_name?: string;
  last_name?: string;
  email?: string;
  poste?: string;
  service?: string;
  date_embauche?: string;
  is_active?: boolean;
  is_admin?: boolean;
}

export const employeeService = {
  // Récupérer tous les employés avec statistiques
  getAllEmployees: async (filters?: {
    service?: string;
    status?: string;
    search?: string;
  }): Promise<Employee[]> => {
    const params = new URLSearchParams();
    if (filters?.service) params.append('service', filters.service);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/employees?${queryString}` : '/employees';
    
    return api.get(url);
  },

  // Récupérer les statistiques globales
  getEmployeesStats: async (period?: string): Promise<EmployeeStats> => {
    const url = period ? `/employees/stats?period=${period}` : '/employees/stats';
    return api.get(url);
  },

  // Créer un nouvel employé
  createEmployee: async (employeeData: CreateEmployeeData): Promise<Employee> => {
    return api.post('/employees', employeeData);
  },

  // Mettre à jour un employé
  updateEmployee: async (id: number, employeeData: UpdateEmployeeData): Promise<Employee> => {
    return api.put(`/employees/${id}`, employeeData);
  },

  // Supprimer un employé
  deleteEmployee: async (id: number): Promise<void> => {
    return api.delete(`/employees/${id}`);
  },

  // Générer un QR code pour un employé
  generateEmployeeQRCode: async (id: number): Promise<{ qr_code: string }> => {
    return api.post(`/employees/${id}/qr-code`);
  },

  // Exporter les données des employés
  exportEmployees: async (format: 'pdf' | 'excel' | 'csv', filters?: any): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
    }
    
    const response = await fetch(`${api.getBaseUrl()}/employees/export?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'export');
    }
    
    return response.blob();
  }
};