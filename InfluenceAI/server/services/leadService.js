const Lead = require('../models/Lead');

class LeadService {
  static async create(userId, leadData) {
    try {
      console.log(`Creating new lead for user ${userId}:`, leadData);
      const lead = new Lead({
        ...leadData,
        userId
      });
      
      const savedLead = await lead.save();
      console.log(`Lead created successfully with ID: ${savedLead._id}`);
      return savedLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw new Error(`Failed to create lead: ${error.message}`);
    }
  }

  static async getAll(userId) {
    try {
      console.log(`Fetching all leads for user ${userId}`);
      const leads = await Lead.find({ userId }).sort({ lastActivity: -1 });
      console.log(`Found ${leads.length} leads for user ${userId}`);
      return leads;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw new Error(`Failed to fetch leads: ${error.message}`);
    }
  }

  static async getById(userId, leadId) {
    try {
      console.log(`Fetching lead ${leadId} for user ${userId}`);
      const lead = await Lead.findOne({ _id: leadId, userId });
      
      if (!lead) {
        console.log(`Lead ${leadId} not found for user ${userId}`);
        return null;
      }
      
      console.log(`Lead ${leadId} found successfully`);
      return lead;
    } catch (error) {
      console.error('Error fetching lead by ID:', error);
      throw new Error(`Failed to fetch lead: ${error.message}`);
    }
  }

  static async update(userId, leadId, updateData) {
    try {
      console.log(`Updating lead ${leadId} for user ${userId}:`, updateData);
      
      const lead = await Lead.findOneAndUpdate(
        { _id: leadId, userId },
        { ...updateData, lastActivity: new Date() },
        { new: true, runValidators: true }
      );

      if (!lead) {
        console.log(`Lead ${leadId} not found for user ${userId}`);
        return null;
      }

      console.log(`Lead ${leadId} updated successfully`);
      return lead;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw new Error(`Failed to update lead: ${error.message}`);
    }
  }

  static async delete(userId, leadId) {
    try {
      console.log(`Deleting lead ${leadId} for user ${userId}`);
      
      const result = await Lead.deleteOne({ _id: leadId, userId });
      
      if (result.deletedCount === 0) {
        console.log(`Lead ${leadId} not found for user ${userId}`);
        return false;
      }

      console.log(`Lead ${leadId} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw new Error(`Failed to delete lead: ${error.message}`);
    }
  }

  static async updateStatus(userId, leadId, status) {
    try {
      console.log(`Updating lead ${leadId} status to ${status} for user ${userId}`);
      
      const lead = await Lead.findOneAndUpdate(
        { _id: leadId, userId },
        { status, lastActivity: new Date() },
        { new: true, runValidators: true }
      );

      if (!lead) {
        console.log(`Lead ${leadId} not found for user ${userId}`);
        return null;
      }

      console.log(`Lead ${leadId} status updated to ${status} successfully`);
      return lead;
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw new Error(`Failed to update lead status: ${error.message}`);
    }
  }

  static async addMessage(userId, leadId, messageData) {
    try {
      console.log(`Adding message to lead ${leadId} for user ${userId}:`, messageData);
      
      const lead = await Lead.findOne({ _id: leadId, userId });
      
      if (!lead) {
        console.log(`Lead ${leadId} not found for user ${userId}`);
        return null;
      }

      lead.messages.push(messageData);
      lead.lastActivity = new Date();
      
      const updatedLead = await lead.save();
      console.log(`Message added to lead ${leadId} successfully`);
      return updatedLead;
    } catch (error) {
      console.error('Error adding message to lead:', error);
      throw new Error(`Failed to add message to lead: ${error.message}`);
    }
  }
}

module.exports = LeadService;