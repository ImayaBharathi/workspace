const express = require('express');
const router = express.Router();
const LeadService = require('../services/leadService');
const { requireUser } = require('./middleware/auth');

// Apply authentication middleware to all routes
router.use(requireUser);

// GET /api/leads - Get all leads for the authenticated user
router.get('/', async (req, res) => {
  try {
    console.log(`GET /api/leads - User: ${req.user._id}`);
    const leads = await LeadService.getAll(req.user._id);
    
    res.json({
      success: true,
      leads
    });
  } catch (error) {
    console.error('Error in GET /api/leads:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/leads/:id - Get a specific lead by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`GET /api/leads/${req.params.id} - User: ${req.user._id}`);
    const lead = await LeadService.getById(req.user._id, req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      lead
    });
  } catch (error) {
    console.error(`Error in GET /api/leads/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/leads - Create a new lead
router.post('/', async (req, res) => {
  try {
    console.log(`POST /api/leads - User: ${req.user._id}`, req.body);
    
    const requiredFields = ['brandName', 'collaborationType', 'budgetRange'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const lead = await LeadService.create(req.user._id, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    console.error('Error in POST /api/leads:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/leads/:id - Update a lead
router.put('/:id', async (req, res) => {
  try {
    console.log(`PUT /api/leads/${req.params.id} - User: ${req.user._id}`, req.body);
    
    const lead = await LeadService.update(req.user._id, req.params.id, req.body);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    console.error(`Error in PUT /api/leads/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/leads/:id/status - Update lead status
router.put('/:id/status', async (req, res) => {
  try {
    console.log(`PUT /api/leads/${req.params.id}/status - User: ${req.user._id}`, req.body);
    
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['new', 'qualified', 'negotiating', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const lead = await LeadService.updateStatus(req.user._id, req.params.id, status);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead status updated successfully',
      lead
    });
  } catch (error) {
    console.error(`Error in PUT /api/leads/${req.params.id}/status:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/leads/:id/respond - Add a response message to a lead
router.post('/:id/respond', async (req, res) => {
  try {
    console.log(`POST /api/leads/${req.params.id}/respond - User: ${req.user._id}`, req.body);
    
    const { message, templateId } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const messageData = {
      sender: 'influencer',
      content: message,
      timestamp: new Date(),
      isRead: true
    };

    const lead = await LeadService.addMessage(req.user._id, req.params.id, messageData);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Response sent successfully',
      lead
    });
  } catch (error) {
    console.error(`Error in POST /api/leads/${req.params.id}/respond:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/leads/:id/message - Add a message to a lead (from brand or influencer)
router.post('/:id/message', async (req, res) => {
  try {
    console.log(`POST /api/leads/${req.params.id}/message - User: ${req.user._id}`, req.body);
    
    const { sender, content } = req.body;
    if (!sender || !content) {
      return res.status(400).json({
        success: false,
        error: 'Sender and content are required'
      });
    }

    const validSenders = ['brand', 'influencer'];
    if (!validSenders.includes(sender)) {
      return res.status(400).json({
        success: false,
        error: `Invalid sender. Must be one of: ${validSenders.join(', ')}`
      });
    }

    const messageData = {
      sender,
      content,
      timestamp: new Date(),
      isRead: true
    };

    const lead = await LeadService.addMessage(req.user._id, req.params.id, messageData);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Message added successfully',
      lead
    });
  } catch (error) {
    console.error(`Error in POST /api/leads/${req.params.id}/message:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/leads/:id - Delete a lead
router.delete('/:id', async (req, res) => {
  try {
    console.log(`DELETE /api/leads/${req.params.id} - User: ${req.user._id}`);
    
    const deleted = await LeadService.delete(req.user._id, req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error(`Error in DELETE /api/leads/${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;