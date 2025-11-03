// services/simpleAppwriteService.js
const axios = require('axios');

class SimpleAppwriteService {
  constructor() {
    this.baseURL = 'https://fra.cloud.appwrite.io/v1';
    this.projectId = '6907958f002f3cc167a1';
    this.apiKey = 'standard_30239d788d929235eabfcf754df2c517e138367d746fa57503f23f56ddc3b6b0b37366827b2eae093e50576fc6ea491be498c6ab69c2309544372f24552288139e058b405303940ff8097943176e29a11608cc606e93aba473fd24908717dc8d5518ab4b19356dff1a344c79a0cc61ec83c940da2ca28dc33d67f4634793df17';
    this.databaseId = '690797e7001d88603fd1';
    this.invoicesCollectionId = 'invoices';
  }

  async createInvoice(invoiceData) {
    const response = await axios.post(
      `${this.baseURL}/databases/${this.databaseId}/collections/${this.invoicesCollectionId}/documents`,
      {
        documentId: 'unique()',
        data: invoiceData
      },
      {
        headers: {
          'X-Appwrite-Project': this.projectId,
          'X-Appwrite-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  async getAllInvoices() {
    const response = await axios.get(
      `${this.baseURL}/databases/${this.databaseId}/collections/${this.invoicesCollectionId}/documents`,
      {
        headers: {
          'X-Appwrite-Project': this.projectId,
          'X-Appwrite-Key': this.apiKey
        }
      }
    );
    return response.data;
  }

  async getInvoices(userId, filters = {}) {
    // Get ALL invoices and filter manually - 100% reliable
    const allData = await this.getAllInvoices();
    let documents = allData.documents;
    
    // Filter by user
    documents = documents.filter(doc => doc.userId === userId);
    
    // Apply filters
    if (filters.status) {
      documents = documents.filter(doc => doc.status === filters.status);
    }
    
    if (filters.clientName) {
      documents = documents.filter(doc => 
        doc.clientName.toLowerCase().includes(filters.clientName.toLowerCase())
      );
    }
    
    return {
      documents: documents,
      total: documents.length
    };
  }

  // ADD THIS MISSING METHOD
  async getInvoiceById(invoiceId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/databases/${this.databaseId}/collections/${this.invoicesCollectionId}/documents/${invoiceId}`,
        {
          headers: {
            'X-Appwrite-Project': this.projectId,
            'X-Appwrite-Key': this.apiKey
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice by ID:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateInvoice(invoiceId, updateData) {
    const response = await axios.patch(
      `${this.baseURL}/databases/${this.databaseId}/collections/${this.invoicesCollectionId}/documents/${invoiceId}`,
      {
        data: updateData
      },
      {
        headers: {
          'X-Appwrite-Project': this.projectId,
          'X-Appwrite-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  async getUserProfile(userId) {
    return {
      $id: userId,
      email: 'dev@example.com',
      name: 'Development User'
    };
  }
}

module.exports = new SimpleAppwriteService();