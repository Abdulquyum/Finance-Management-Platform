// test-email-connection.js
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmailConnection() {
  console.log('Ì∑™ Testing Email Connection...\n');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('‚ùå Email credentials missing in .env file');
    return;
  }

  console.log('Ì≥ß Email:', process.env.EMAIL_USER);
  console.log('Ì¥ë Password:', process.env.EMAIL_PASSWORD ? '*** set ***' : 'missing');

  const configs = [
    {
      name: 'Gmail TLS (Port 587)',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000
      }
    },
    {
      name: 'Gmail SSL (Port 465)',
      config: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    }
  ];

  for (const config of configs) {
    console.log(`\nÌ¥ß Testing: ${config.name}...`);
    
    try {
      const transporter = nodemailer.createTransport(config.config);
      
      // Verify connection
      await transporter.verify();
      console.log(`‚úÖ ${config.name}: Connection successful!`);
      
      // Try to send email
      const result = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'abdulquyumajumobi@gmail.com', // Send to yourself
        subject: `Test: ${config.name}`,
        text: `This is a test email using ${config.name}`
      });
      
      console.log(`‚úÖ ${config.name}: Email sent successfully!`);
      console.log('Ì≥ß Message ID:', result.messageId);
      return;
      
    } catch (error) {
      console.log(`‚ùå ${config.name}: ${error.message}`);
    }
  }
  
  console.log('\nÌ≤° All email configurations failed. Possible solutions:');
  console.log('1. Ì¥í Check if your network blocks SMTP ports');
  console.log('2. Ì≥± Try using a different network (mobile hotspot)');
  console.log('3. ‚öôÔ∏è  Verify your Gmail app password is correct');
  console.log('4. Ìª°Ô∏è  Temporarily disable firewall/antivirus');
}

testEmailConnection();
