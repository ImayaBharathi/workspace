import api from './api';

export interface Lead {
  _id: string;
  brandName: string;
  brandLogo?: string;
  collaborationType: string;
  budgetRange: string;
  status: 'new' | 'qualified' | 'negotiating' | 'accepted' | 'rejected';
  lastActivity: string;
  aiConfidence: number;
  messages: Message[];
  extractedInfo: {
    industry?: string;
    deliverables?: string[];
    timeline?: string;
    specialRequirements?: string[];
  };
}

export interface Message {
  _id: string;
  sender: 'brand' | 'influencer';
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Description: Get all leads for the current user
// Endpoint: GET /api/leads
// Request: {}
// Response: { success: boolean, leads: Lead[] }
export const getLeads = async () => {
  try {
    const response = await api.get('/api/leads');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Get a specific lead by ID
// Endpoint: GET /api/leads/:id
// Request: {}
// Response: { success: boolean, lead: Lead }
export const getLeadById = async (id: string) => {
  try {
    const response = await api.get(`/api/leads/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Create a new lead
// Endpoint: POST /api/leads
// Request: { brandName: string, collaborationType: string, budgetRange: string, brandLogo?: string, aiConfidence?: number, messages?: Message[], extractedInfo?: object }
// Response: { success: boolean, message: string, lead: Lead }
export const createLead = async (leadData: Partial<Lead>) => {
  try {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Update a lead
// Endpoint: PUT /api/leads/:id
// Request: { brandName?: string, collaborationType?: string, budgetRange?: string, status?: string, brandLogo?: string, aiConfidence?: number, extractedInfo?: object }
// Response: { success: boolean, message: string, lead: Lead }
export const updateLead = async (id: string, updateData: Partial<Lead>) => {
  try {
    const response = await api.put(`/api/leads/${id}`, updateData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Update lead status
// Endpoint: PUT /api/leads/:id/status
// Request: { status: string }
// Response: { success: boolean, message: string, lead: Lead }
export const updateLeadStatus = async (id: string, status: string) => {
  try {
    const response = await api.put(`/api/leads/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Send response to lead
// Endpoint: POST /api/leads/:id/respond
// Request: { message: string, templateId?: string }
// Response: { success: boolean, message: string, lead: Lead }
export const respondToLead = async (id: string, message: string, templateId?: string) => {
  try {
    const response = await api.post(`/api/leads/${id}/respond`, { message, templateId });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}

// Description: Delete a lead
// Endpoint: DELETE /api/leads/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteLead = async (id: string) => {
  try {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
}