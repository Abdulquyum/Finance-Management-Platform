// services/emailService.js
class EmailService {
  async sendInvoicePaidNotification(userEmail, clientName, invoiceAmount, invoiceId) {
    try {
      console.log('\n📧 === INVOICE PAID NOTIFICATION ===');
      console.log(`To: ${userEmail}`);
      console.log(`Subject: Invoice #${invoiceId} Has Been Paid!`);
      console.log(`Body:`);
      console.log(`Hello!`);
      console.log(`Great news! Your invoice #${invoiceId} has been paid by ${clientName}.`);
      console.log(`Amount: $${invoiceAmount}`);
      console.log(`This payment has been recorded in your financial dashboard.`);
      console.log(`Thank you for using our platform!`);
      console.log(`📧 === END NOTIFICATION ===\n`);
      
      // In production, you would integrate with:
      // - Appwrite Messaging
      // - SendGrid
      // - Nodemailer
      // - AWS SES
      
      return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
      console.error('Error in email service:', error);
      return { success: false, error: error.message };
    }
  }

  async sendInvoiceCreatedNotification(userEmail, clientName, invoiceAmount, dueDate) {
    try {
      console.log('\n📧 === INVOICE CREATED NOTIFICATION ===');
      console.log(`To: ${userEmail}`);
      console.log(`Subject: New Invoice Created`);
      console.log(`Body:`);
      console.log(`Hello!`);
      console.log(`You have created a new invoice for ${clientName}.`);
      console.log(`Amount: $${invoiceAmount}`);
      console.log(`Due Date: ${new Date(dueDate).toLocaleDateString()}`);
      console.log(`We'll notify you when it's paid!`);
      console.log(`📧 === END NOTIFICATION ===\n`);
      
      return { success: true, message: 'Notification sent successfully' };
    } catch (error) {
      console.error('Error in email service:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();