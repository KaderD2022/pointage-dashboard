import { api } from './api';

export interface DashboardStats {
  total_employees: number;
  present_today: number;
  late_this_month: number;
  current_leaves: number;
  presence_rate: number;
  period: string;
}

export interface AttendanceTrend {
  period: string;
  data: {
    date: string;
    present: number;
    late: number;
    absent: number;
  }[];
}

export interface ActivityItem {
  type: 'attendance' | 'leave';
  employee_name: string;
  timestamp: string;
  details: string;
  status: string;
}

export const dashboardService = {
  getStats: async (period: string = 'month'): Promise<DashboardStats> => {
    const response = await api.get(`/stats/dashboard?period=${period}`);
    return response;
  },

  getAttendanceTrend: async (days: number = 7): Promise<AttendanceTrend> => {
    const response = await api.get(`/stats/attendance-trend?days=${days}`);
    return response;
  },

  getRecentActivity: async (limit: number = 10): Promise<ActivityItem[]> => {
    const response = await api.get(`/activity/recent?limit=${limit}`);
    return response;
  },

  generateReport: async (reportType: string, period: string = 'month') => {
    const response = await api.get(`/reports/${reportType}?period=${period}`);
    return response;
  }
};