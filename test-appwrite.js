// test-appwrite-fixed.js
require('dotenv').config();
const { databases, DATABASE_ID, INVOICES_COLLECTION_ID } = require('./config/appwrite');

async function testAppwriteFixed() {
  try {
    console.log('🔍 Testing Appwrite with empty queries array...');
    
    // Test with empty array instead of undefined
    const result = await databases.listDocuments(
      DATABASE_ID,
      INVOICES_COLLECTION_ID,
      [] // Empty array
    );
    
    console.log('✅ SUCCESS! Appwrite connection working with empty array');
    console.log('📊 Total documents:', result.total);
    console.log('📄 Sample documents:', result.documents.slice(0, 3).map(doc => ({
      id: doc.$id,
      clientName: doc.clientName,
      amount: doc.totalAmount
    })));
    
    return result;
  } catch (error) {
    console.error('❌ Still failing:', error.message);
    
    // Try one more approach - use the service directly
    console.log('🔄 Trying service approach...');
    const AppwriteService = require('./services/appwriteService');
    const invoices = await AppwriteService.getInvoices('dev-user-123', {});
    console.log('✅ Service approach worked! Invoices:', invoices.total);
    
    return invoices;
  }
}

testAppwriteFixed().catch(console.error);