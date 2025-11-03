### SETUP PROJECT

- git clone https://github.com/Abdulquyum/Finance-Management-Platform.git

- cd Finance-Management-Platform

- npm install

- npm run dev

### API Endpoints

#### Create Invoice

- POST /api/invoices

#### List Invoices

- GET /api/invoices?status=unpaid

#### Mark Invoice as Paid

- PATCH /api/invoices/:invoiceId/paid

#### Get Financial Summary

- GET /api/summary

### TEST ENDPOINTS using curl

##### 1. Create Invoice

curl -X POST http://localhost:3000/api/invoices -H "Content-Type: application/json" -H "Authorization: Bearer my-token" -d '{
"clientName": "Testee Limited",
"amount": 5000.00,
"description": "testee payment",
"vatRateType": "reduced"
}'

##### 2. List Invoices

- curl -X GET "http://localhost:3000/api/invoices" -H "Authorization: Bearer YOUR_VALID_TOKEN"

##### 3. Get Financial Summary

- curl -X GET "http://localhost:3000/api/summary" -H "Authorization: Bearer YOUR_VALID_TOKEN"

##### 4. Mark Invoice as Paid

- curl -X PATCH "http://localhost:3000/api/invoices/INVOICE_ID/paid" -H "Authorization: Bearer my-token"
