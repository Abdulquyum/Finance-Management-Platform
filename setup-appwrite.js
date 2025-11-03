// setup-appwrite.js
const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6907958f002f3cc167a1')
    .setKey('standard_30239d788d929235eabfcf754df2c517e138367d746fa57503f23f56ddc3b6b0b37366827b2eae093e50576fc6ea491be498c6ab69c2309544372f24552288139e058b405303940ff8097943176e29a11608cc606e93aba473fd24908717dc8d5518ab4b19356dff1a344c79a0cc61ec83c940da2ca28dc33d67f4634793df17');

const databases = new Databases(client);
const DATABASE_ID = '690797e7001d88603fd1';

async function setupAppwrite() {
    console.log('Setting up Appwrite collections...');
    
    try {
        // Create Users collection if it doesn't exist
        try {
            const usersCollection = await databases.createCollection(
                DATABASE_ID,
                'users',
                'Users'
            );
            console.log('✅ Users collection created');
        } catch (error) {
            console.log('ℹ️ Users collection already exists');
        }

        // Add user attributes
        const userAttributes = [
            { type: 'string', key: 'email', size: 255, required: true },
            { type: 'string', key: 'name', size: 255, required: true },
            { type: 'string', key: 'businessName', size: 255, required: false }
        ];

        for (const attr of userAttributes) {
            try {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    'users',
                    attr.key,
                    attr.size,
                    attr.required
                );
                console.log(`✅ User attribute ${attr.key} added`);
            } catch (error) {
                console.log(`ℹ️ User attribute ${attr.key} already exists`);
            }
        }

        // Setup invoice attributes
        const invoiceAttributes = [
            { type: 'string', key: 'userId', size: 255, required: true },
            { type: 'string', key: 'clientName', size: 255, required: true },
            { type: 'string', key: 'description', size: 1000, required: false },
            { type: 'double', key: 'netAmount', required: true },
            { type: 'double', key: 'vatRate', required: true },
            { type: 'double', key: 'vatAmount', required: true },
            { type: 'double', key: 'totalAmount', required: true },
            { type: 'string', key: 'vatRateType', size: 50, required: true },
            { type: 'string', key: 'status', size: 20, required: true },
            { type: 'datetime', key: 'dueDate', required: true },
            { type: 'datetime', key: 'paidAt', required: false },
            { type: 'datetime', key: 'createdAt', required: true },
            { type: 'datetime', key: 'updatedAt', required: true }
        ];

        for (const attr of invoiceAttributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        'invoices',
                        attr.key,
                        attr.size,
                        attr.required
                    );
                } else if (attr.type === 'double') {
                    await databases.createFloatAttribute(
                        DATABASE_ID,
                        'invoices',
                        attr.key,
                        attr.required
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        'invoices',
                        attr.key,
                        attr.required
                    );
                }
                console.log(`✅ Invoice attribute ${attr.key} added`);
            } catch (error) {
                console.log(`ℹ️ Invoice attribute ${attr.key} already exists`);
            }
        }

        console.log('\n��� Appwrite setup completed!');
        console.log('\nNext steps:');
        console.log('1. Set up Messaging in Appwrite Console');
        console.log('2. Get APPWRITE_MESSAGING_ID from your email topic');
        console.log('3. Update your .env file with the messaging ID');
        console.log('4. Run your server with: npm run dev');

    } catch (error) {
        console.error('❌ Setup failed:', error);
    }
}

setupAppwrite();
