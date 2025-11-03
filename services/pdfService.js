// services/pdfService.js
const PDFDocument = require('pdfkit');
const { storage } = require('../config/appwrite');

class PDFService {
  async generateInvoicePDF(invoiceData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks = [];
        
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        
        // PDF content
        doc.fontSize(20).text('INVOICE', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Invoice ID: ${invoiceData.$id}`);
        doc.text(`Client: ${invoiceData.clientName}`);
        doc.text(`Amount: $${invoiceData.totalAmount}`);
        doc.text(`Status: ${invoiceData.status}`);
        doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`);
        
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async savePDFToStorage(invoiceId, pdfBuffer) {
    try {
      const file = await storage.createFile(
        process.env.APPWRITE_STORAGE_BUCKET_ID,
        'unique()',
        pdfBuffer,
        [`invoice:${invoiceId}`, `user:${invoiceData.userId}`]
      );
      return file;
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw error;
    }
  }
}

module.exports = new PDFService();
