// test-direct-fixed.js
const appwriteService = require('./services/appwriteDirectService');

async function testDirectService() {
  try {
    console.log('🧪 Testing Fixed Direct Appwrite Service...\n');
    
    // Test 1: Get invoices with fallback
    console.log('1. Testing getInvoices (will use fallback)...');
    const invoices = await appwriteService.getInvoices('dev-user-123');
    console.log('✅ Success! Found', invoices.total, 'invoices');
    
    if (invoices.total > 0) {
      console.log('📄 Sample invoices:');
      invoices.documents.slice(0, 3).forEach(inv => {
        console.log(`   - ${inv.clientName}: $${inv.totalAmount} (${inv.status})`);
      });
    }
    
    // Test 2: Create a test invoice if we have none
    if (invoices.total === 0) {
      console.log('\n2. Creating test invoice...');
      const testInvoice = {
        userId: 'dev-user-123',
        clientName: 'Test Company',
        description: 'Test service for API',
        netAmount: 500,
        vatRate: 20,
        vatAmount: 100,
        totalAmount: 600,
        vatRateType: 'standard',
        status: 'unpaid',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const created = await appwriteService.createInvoice(testInvoice);
      console.log('✅ Invoice created:', created.$id);
    }
    
    return { success: true, invoices };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

testDirectService().then(result => {
  console.log('\n🎉 All tests passed!');
  console.log('🚀 Now restart your server and test the API endpoints');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Tests failed');
  process.exit(1);
});