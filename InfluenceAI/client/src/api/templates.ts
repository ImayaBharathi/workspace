import api from './api';

export interface Template {
  _id: string;
  name: string;
  category: 'initial' | 'qualifying' | 'negotiation' | 'acceptance' | 'decline';
  subject?: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

// Description: Get all templates
// Endpoint: GET /api/templates
// Request: {}
// Response: { templates: Template[] }
export const getTemplates = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        templates: [
          {
            _id: '1',
            name: 'Initial Interest Response',
            category: 'initial',
            content: 'Hi {{brand_name}}! Thank you for reaching out. I\'m interested in learning more about this collaboration opportunity. Could you please share more details about the campaign requirements and timeline?',
            variables: ['brand_name'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: '2',
            name: 'Rate Card Request',
            category: 'qualifying',
            content: 'Thank you for your interest in collaborating with me! I\'d love to work with {{brand_name}}. Please find my rate card attached. For {{collaboration_type}}, my rate is typically in the range mentioned. Let me know if you\'d like to discuss further! {rate_card}',
            variables: ['brand_name', 'collaboration_type'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: '3',
            name: 'Counter Offer',
            category: 'negotiation',
            content: 'Hi {{brand_name}}, thank you for the offer! I\'m very interested in this collaboration. Based on the scope of work and deliverables, I would like to propose a rate of {{proposed_rate}}. This includes {{deliverables}}. Looking forward to your response!',
            variables: ['brand_name', 'proposed_rate', 'deliverables'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: '4',
            name: 'Collaboration Acceptance',
            category: 'acceptance',
            content: 'Hi {{brand_name}}! I\'m excited to confirm our collaboration for {{collaboration_type}}. I accept the terms discussed and look forward to creating amazing content for your brand. When would you like to schedule a brief call to discuss the next steps?',
            variables: ['brand_name', 'collaboration_type'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            _id: '5',
            name: 'Polite Decline',
            category: 'decline',
            content: 'Hi {{brand_name}}, thank you for thinking of me for this collaboration opportunity. Unfortunately, this doesn\'t align with my current content strategy and brand partnerships. I appreciate your interest and wish you the best with your campaign!',
            variables: ['brand_name'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/templates');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Create a new template
// Endpoint: POST /api/templates
// Request: { name: string, category: string, content: string, variables: string[] }
// Response: { success: boolean, template: Template }
export const createTemplate = (templateData: Omit<Template, '_id' | 'createdAt' | 'updatedAt'>) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        template: {
          ...templateData,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/templates', templateData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Update a template
// Endpoint: PUT /api/templates/:id
// Request: { name?: string, category?: string, content?: string, variables?: string[] }
// Response: { success: boolean, template: Template }
export const updateTemplate = (id: string, templateData: Partial<Template>) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        template: {
          _id: id,
          ...templateData,
          updatedAt: new Date().toISOString()
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/templates/${id}`, templateData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Delete a template
// Endpoint: DELETE /api/templates/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteTemplate = (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Template deleted successfully' });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/templates/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}