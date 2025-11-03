// services/appwriteEmailService.js
const { Client, Messaging } = require('node-appwrite');

class AppwriteEmailService {
  constructor() {
    // 1. Initialize the Client object correctly
    const client = new Client()
      .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your API Endpoint
      .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
      .setKey(process.env.APPWRITE_API_KEY); // Your secret API key

    // 2. Initialize Messaging service correctly
    this.messaging = new Messaging(client);
    this.messagingId = process.env.APPWRITE_MESSAGING_ID; // Your Messaging Topic ID
  }

  async sendInvoicePaidNotification(userEmail, clientName, invoiceAmount, invoiceId) {
    try {
      // 3. Use the correct method to create an email
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
          topics: ['invoice-payments'], // Optional: Use if you have created a topic
          recipients: [userEmail] // Send to specific recipients
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