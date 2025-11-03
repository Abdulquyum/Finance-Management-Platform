// test-nodemailer-fixed.js
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testNodemailer() {
  console.log('🧪 Testing Nodemailer with alternative settings...\n');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('❌ Missing email credentials in .env file');
    return;
  }

  console.log('📧 Email User:', process.env.EMAIL_USER);

  // Try different configurations
  const configs = [
    {
      name: 'Gmail with TLS (Port 587)',
      config: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    },
    {
      name: 'Gmail Direct (Port 587)',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    },
    {
      name: 'Gmail Direct (Port 465)',
      config: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // SSL
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    }
  ];

  for (const config of configs) {
    console.log(`\n🔧 Trying: ${config.name}...`);
    
    try {
      const transporter = nodemailer.createTransport(config.config);
      
      // Set shorter timeout
      transporter.set('timeout', 10000);
      
      await transporter.verify();
      console.log(`✅ ${config.name}: SMTP connection successful!`);
      
      // Try to send test email
      const result = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Test: ${config.name}`,
        text: `This is a test using ${config.name}`
      });
      
      console.log(`✅ ${config.name}: Test email sent!`);
      console.log('📧 Message ID:', result.messageId);
      return; // Stop if one works
      
    } catch (error) {
      console.log(`❌ ${config.name}: ${error.message}`);
    }
  }
  
  console.log('\n💡 All connection attempts failed. Trying fallback solutions...');
  await tryFallbackSolutions();
}

async function tryFallbackSolutions() {
  console.log('\n🔄 Trying fallback solutions...');
  
  // Solution 1: Check if it's a firewall issue
  console.log('1. 🔍 Check your firewall/antivirus - they may block SMTP');
  console.log('2. 🌐 Try a different network (mobile hotspot, etc.)');
  console.log('3. 🔓 Try allowing "less secure apps" in Gmail (temporarily)');
  
  // Solution 2: Use a different email service
  console.log('\n4. 📧 Consider using a different email provider:');
  console.log('   - SendGrid (free tier available)');
  console.log('   - Mailgun');
  console.log('   - Outlook/Hotmail');
}

testNodemailer();