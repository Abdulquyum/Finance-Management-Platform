// services/appwriteEmailService.js
const { Client, Messaging } = require('node-appwrite');

class AppwriteEmailService {
  constructor() {
    const client = new Client()
      .setEndpoint('https://fra.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    this.messaging = new Messaging(client);
    this.messagingId = process.env.APPWRITE_MESSAGING_ID;
  }

  async sendInvoicePaidNotification(userEmail, clientName, invoiceAmount, invoiceId) {
    try {
      const message = await this.messaging.createEmail(
        this.messagingId,
        {
          subject: `Invoice Paid - ${invoiceId}`,
          content: `
            <h2>🎉 Invoice Payment Received!</h2>
            <p>Great news! Your invoice <strong>#${invoiceId}</strong> has been paid by <strong>${clientName}</strong>.</p>
            <p><strong>Amount Paid:</strong> $${invoiceAmount}</p>
            <p>The VAT has been automatically recalculated in your financial summary.</p>
            <br>
            <p>Thank you for using our finance platform!</p>
          `,
          topics: ['invoice-payments'],
          recipients: [userEmail]
        }
      );

      console.log('✅ Appwrite email sent successfully. Message ID:', message.$id);
      return { success: true, messageId: message.$id };
    } catch (error) {
      console.error('❌ Appwrite email failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new AppwriteEmailService();