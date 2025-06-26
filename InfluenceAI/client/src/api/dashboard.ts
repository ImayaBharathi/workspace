import api from './api';

export interface DashboardStats {
  totalLeads: number;
  totalLeadsChange: number;
  qualifiedPercentage: number;
  qualifiedPercentageChange: number;
  averageResponseTime: number;
  averageResponseTimeChange: number;
  conversionRate: number;
  conversionRateChange: number;
}

export interface ChartData {
  date: string;
  leads: number;
  accepted: number;
}

export interface Alert {
  _id: string;
  type: 'high-value' | 'pending-response' | 'follow-up';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  leadId?: string;
}

// Description: Get dashboard statistics
// Endpoint: GET /api/dashboard/stats
// Request: {}
// Response: { stats: DashboardStats }
export const getDashboardStats = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          totalLeads: 47,
          totalLeadsChange: 12,
          qualifiedPercentage: 73,
          qualifiedPercentageChange: 5,
          averageResponseTime: 2.4,
          averageResponseTimeChange: -0.8,
          conversionRate: 68,
          conversionRateChange: 8
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/dashboard/stats');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Get chart data for dashboard
// Endpoint: GET /api/dashboard/chart
// Request: { days?: number }
// Response: { data: ChartData[] }
export const getChartData = (days: number = 30) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          leads: Math.floor(Math.random() * 10) + 1,
          accepted: Math.floor(Math.random() * 5) + 1
        });
      }
      resolve({ data });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/dashboard/chart?days=${days}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Get dashboard alerts
// Endpoint: GET /api/dashboard/alerts
// Request: {}
// Response: { alerts: Alert[] }
export const getDashboardAlerts = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        alerts: [
          {
            _id: '1',
            type: 'high-value',
            title: 'High-value opportunity from Apple',
            description: '$8,000+ budget for product review campaign',
            priority: 'high',
            timestamp: '2024-01-15T10:30:00Z',
            leadId: '3'
          },
          {
            _id: '2',
            type: 'pending-response',
            title: '3 leads awaiting response',
            description: 'Starbucks, Samsung, and Adidas campaigns need attention',
            priority: 'medium',
            timestamp: '2024-01-15T09:15:00Z'
          },
          {
            _id: '3',
            type: 'follow-up',
            title: 'Follow-up scheduled in 2 hours',
            description: 'Nike collaboration follow-up reminder',
            priority: 'low',
            timestamp: '2024-01-15T08:00:00Z',
            leadId: '1'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/dashboard/alerts');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}