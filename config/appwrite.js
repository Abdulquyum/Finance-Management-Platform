const { Client, Databases, Account, Storage, Messaging } = require('node-appwrite');

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const INVOICES_COLLECTION_ID = process.env.APPWRITE_INVOICES_COLLECTION_ID;
const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;

module.exports = {
  client,
  databases,
  account,
  storage,
  DATABASE_ID,
  INVOICES_COLLECTION_ID,
  USERS_COLLECTION_ID
};
