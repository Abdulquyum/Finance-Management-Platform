// controllers/invoiceController.js - FIXED VERSION
const appwriteService = require('../services/simpleAppwriteService');
const vatService = require('../services/vatService');
const emailService = require('../services/simpleEmailService');

class InvoiceController {
  async createInvoice(req, res) {
    try {
      const { clientName, amount, description, dueDate, vatRateType = 'standard' } = req.body;
      const userId = req.userId;

      // Calculate VAT
      const vatCalculation = vatService.calculateVAT(parseFloat(amount), vatRateType);

      const invoiceData = {
        userId,
        clientName,
        description: description || '',
        netAmount: vatCalculation.netAmount,
        vatRate: vatCalculation.vatRate,
        vatAmount: vatCalculation.vatAmount,
        totalAmount: vatCalculation.totalAmount,
        vatRateType: vatCalculation.vatRateType,
        status: 'unpaid',
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const invoice = await appwriteService.createInvoice(invoiceData);

      // Send notification (async - don't await)
      try {
        const userProfile = await appwriteService.getUserProfile(userId);
        emailService.sendInvoiceCreatedNotification(
          userProfile.email,
          clientName,
          invoiceData.totalAmount,
          invoiceData.dueDate
        );
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the request if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: invoice
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create invoice',
        error: error.message
      });
    }
  }

  async getInvoices(req, res) {
    try {
      const userId = req.userId;
      const { status, clientName } = req.query;
      
      console.log('🔄 Getting invoices for user:', userId);
      
      const filters = {};
      if (status) filters.status = status;
      if (clientName) filters.clientName = clientName;

      const invoices = await appwriteService.getInvoices(userId, filters);
      
      console.log('✅ Invoices retrieved successfully');
      console.log('📊 Number of invoices:', invoices.total);

      res.json({
        success: true,
        data: invoices.documents,
        total: invoices.total
      });
    } catch (error) {
      console.error('❌ Error fetching invoices:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch invoices',
        error: error.message
      });
    }
  }

  async markAsPaid(req, res) {
    try {
      const { invoiceId } = req.params;
      const userId = req.userId;

      console.log(`🔄 Marking invoice ${invoiceId} as paid for user ${userId}`);

      // Get the invoice first
      const invoice = await appwriteService.getInvoiceById(invoiceId);
      
      // Verify ownership
      if (invoice.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      if (invoice.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Invoice is already paid'
        });
      }

      // Update invoice status
      const updatedInvoice = await appwriteService.updateInvoice(invoiceId, {
        status: 'paid',
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Get user profile for notification - MOVED HERE, AFTER invoice operations
      const userProfile = await appwriteService.getUserProfile(userId);

      // Send payment notification (async)
      try {
        await emailService.sendInvoicePaidNotification(
          userProfile.email,
          invoice.clientName,
          invoice.totalAmount,
          invoiceId
        );
        console.log('✅ Payment notification sent');
      } catch (emailError) {
        console.error('Payment notification failed:', emailError);
        // Don't fail the request if email fails
      }

      res.json({
        success: true,
        message: 'Invoice marked as paid successfully',
        data: updatedInvoice
      });
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark invoice as paid',
        error: error.message
      });
    }
  }
}

module.exports = new InvoiceController();