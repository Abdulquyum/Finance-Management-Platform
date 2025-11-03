// test-appwrite-fixed.js
require('dotenv').config();
const { databases, DATABASE_ID, INVOICES_COLLECTION_ID } = require('./config/appwrite');

async function testAppwriteFixed() {
  try {
    console.log('Ì¥ç Testing Appwrite with empty queries array...');
    
    // Test with empty array instead of undefined
    const result = await databases.listDocuments(
      DATABASE_ID,
      INVOICES_COLLECTION_ID,
      [] // Empty array
    );
    
    console.log('‚úÖ SUCCESS! Appwrite connection working with empty array');
    console.log('Ì≥ä Total documents:', result.total);
    console.log('Ì≥Ñ Sample documents:', result.documents.slice(0, 3).map(doc => ({
      id: doc.$id,
      clientName: doc.clientName,
      amount: doc.totalAmount
    })));
    
    return result;
  } catch (error) {
    console.error('‚ùå Still failing:', error.message);
    
    // Try one more approach - use the service directly
    console.log('Ì¥Ñ Trying service approach...');
    const AppwriteService = require('./services/appwriteService');
    const invoices = await AppwriteService.getInvoices('dev-user-123', {});
    console.log('‚úÖ Service approach worked! Invoices:', invoices.total);
    
    return invoices;
  }
}

testAppwriteFixed().catch(console.error);
