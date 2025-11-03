// services/appwriteService.js - FIXED VERSION
const { databases, DATABASE_ID, INVOICES_COLLECTION_ID, USERS_COLLECTION_ID } = require('../config/appwrite');

class AppwriteService {
  async createInvoice(invoiceData) {
    return await databases.createDocument(
      DATABASE_ID,
      INVOICES_COLLECTION_ID,
      'unique()',
      invoiceData
    );
  }

  async getInvoices(userId, filters = {}) {
    try {
      console.log('🔄 [AppwriteService] Getting invoices with manual filtering...');
      
      // Get ALL invoices without any queries (empty array instead of undefined)
      const allInvoices = await databases.listDocuments(
        DATABASE_ID,
        INVOICES_COLLECTION_ID,
        [] // Empty array instead of undefined
      );
      
      console.log('✅ [AppwriteService] Raw invoices fetched:', allInvoices.total);
      
      // Filter manually in JavaScript
      let filteredInvoices = allInvoices.documents.filter(invoice => 
        invoice.userId === userId
      );
      
      console.log('👤 Filtered by user:', filteredInvoices.length);
      
      // Apply additional filters
      if (filters.status) {
        filteredInvoices = filteredInvoices.filter(invoice => 
          invoice.status === filters.status
        );
        console.log('📋 Filtered by status:', filteredInvoices.length);
      }
      
      if (filters.clientName) {
        filteredInvoices = filteredInvoices.filter(invoice =>
          invoice.clientName.toLowerCase().includes(filters.clientName.toLowerCase())
        );
        console.log('🔍 Filtered by client name:', filteredInvoices.length);
      }
      
      return {
        documents: filteredInvoices,
        total: filteredInvoices.length
      };
      
    } catch (error) {
      console.error('❌ [AppwriteService] Error in getInvoices:', error);
      throw error;
    }
  }

  async getInvoiceById(invoiceId) {
    return await databases.getDocument(
      DATABASE_ID,
      INVOICES_COLLECTION_ID,
      invoiceId
    );
  }

  async updateInvoice(invoiceId, updateData) {
    return await databases.updateDocument(
      DATABASE_ID,
      INVOICES_COLLECTION_ID,
      invoiceId,
      updateData
    );
  }

  async getUserProfile(userId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId
      );
    } catch (error) {
      // Return a mock user if the user doesn't exist in database
      console.log('⚠️ User not found in database, using mock user');
      return {
        $id: userId,
        email: 'dev@example.com',
        name: 'Development User'
      };
    }
  }
}

module.exports = new AppwriteService();