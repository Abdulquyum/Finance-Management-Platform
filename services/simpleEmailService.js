// services/simpleEmailService.js - UPDATED WITH WORKING CONFIG
const nodemailer = require('nodemailer');

// Use the working configuration from the test
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendInvoicePaidNotification(userEmail, clientName, invoiceAmount, invoiceId) {
  try {
    const result = await transporter.sendMail({
      from: `"Finance Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `💰 Invoice Paid - ${invoiceId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0;">🎉 Invoice Paid!</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #333;">Great news! Your invoice has been paid.</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
              <p style="margin: 5px 0;"><strong>Invoice ID:</strong> ${invoiceId}</p>
              <p style="margin: 5px 0;"><strong>Client:</strong> ${clientName}</p>
              <p style="margin: 5px 0;"><strong>Amount Paid:</strong> <span style="color: #4CAF50; font-weight: bold; font-size: 18px;">$${invoiceAmount}</span></p>
              <p style="margin: 5px 0;"><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p style="color: #666;">The VAT has been automatically recalculated in your financial dashboard.</p>
            <a href="http://localhost:3000/api/invoices" style="display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Invoices</a>
          </div>
          <div style="background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
            <p style="margin: 0; color: #666; font-size: 12px;">This is an automated notification from your Finance Platform</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ REAL EMAIL SENT to:', userEmail);
    console.log('📧 Message ID:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email failed:', error);
    return { success: false, error: error.message };
  }
}

async function sendInvoiceCreatedNotification(userEmail, clientName, invoiceAmount, dueDate) {
  try {
    const result = await transporter.sendMail({
      from: `"Finance Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `📄 New Invoice Created`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0;">📄 New Invoice Created</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #333;">Your invoice has been created successfully.</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196F3;">
              <p style="margin: 5px 0;"><strong>Client:</strong> ${clientName}</p>
              <p style="margin: 5px 0;"><strong>Amount:</strong> <span style="color: #2196F3; font-weight: bold; font-size: 18px;">$${invoiceAmount}</span></p>
              <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #FF9800;">Pending Payment</span></p>
            </div>
            <p style="color: #666;">We'll notify you when the client makes the payment.</p>
            <a href="http://localhost:3000/api/invoices" style="display: inline-block; background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Invoices</a>
          </div>
          <div style="background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
            <p style="margin: 0; color: #666; font-size: 12px;">This is an automated notification from your Finance Platform</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ REAL EMAIL SENT to:', userEmail);
    console.log('📧 Message ID:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email failed:', error);
    return { success: false, error: error.message };
  }
}

// Test function to verify the service is working
async function testEmailService() {
  console.log('🧪 Testing email service...');
  const result = await sendInvoicePaidNotification(
    process.env.EMAIL_USER,
    'Test Client',
    1000.00,
    'TEST-123'
  );
  
  if (result.success) {
    console.log('🎉 Email service is working correctly!');
  } else {
    console.log('❌ Email service test failed:', result.error);
  }
}

module.exports = { 
  sendInvoicePaidNotification, 
  sendInvoiceCreatedNotification,
  testEmailService
};