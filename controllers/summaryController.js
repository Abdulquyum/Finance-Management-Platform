// controllers/summaryController.js
const appwriteService = require('../services/simpleAppwriteService');
const vatService = require('../services/vatService');

class SummaryController {
  async getFinancialSummary(req, res) {
    try {
      const userId = req.userId;

      // Get all invoices for the user
      const allInvoices = await appwriteService.getInvoices(userId);
      const invoices = allInvoices.documents;

      // Separate paid and unpaid invoices
      const paidInvoices = invoices.filter(inv => inv.status === 'paid');
      const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid');

      // Calculate totals for paid invoices
      const paidSummary = vatService.recalculateVATForPaidInvoices(paidInvoices);

      // Calculate outstanding amounts
      const outstandingAmount = unpaidInvoices.reduce((sum, invoice) => {
        return sum + (invoice.totalAmount || 0);
      }, 0);

      const summary = {
        overview: {
          totalInvoices: invoices.length,
          paidInvoices: paidInvoices.length,
          unpaidInvoices: unpaidInvoices.length
        },
        revenue: {
          totalRevenue: paidSummary.totalRevenue,
          totalVAT: paidSummary.totalVAT,
          grandTotal: paidSummary.grandTotal
        },
        outstanding: {
          totalAmount: parseFloat(outstandingAmount.toFixed(2)),
          invoiceCount: unpaidInvoices.length
        },
        recentActivity: {
          lastPayment: paidInvoices.length > 0 
            ? paidInvoices.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))[0]
            : null,
          upcomingDue: unpaidInvoices.length > 0
            ? unpaidInvoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]
            : null
        }
      };

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch financial summary',
        error: error.message
      });
    }
  }
}

module.exports = new SummaryController();