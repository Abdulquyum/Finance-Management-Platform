# Finance Management Platform

A robust, production-ready backend API for managing invoices and financial operations for small businesses. Built with Express.js and Appwrite, featuring invoice creation, VAT calculation, payment tracking, and comprehensive financial reporting.

## 🚀 Features

- **Invoice Management**: Create, list, and track invoices with status management
- **VAT Calculation**: Support for standard, reduced, and zero VAT rates
- **Financial Summaries**: Real-time overview of revenue, outstanding amounts, and financial metrics
- **Payment Tracking**: Mark invoices as paid with automatic notifications
- **Email Notifications**: Automated email alerts for invoice payments
- **PDF Generation**: Generate invoice PDFs for documentation
- **Authentication**: Secure token-based authentication via Appwrite
- **Data Validation**: Request validation using Joi schemas
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Appwrite account and project
- Environment variables configured (see [Configuration](#configuration))

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Abdulquyum/Finance-Management-Platform.git
cd Finance-Management-Platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Appwrite Configuration
APPWRITE_ENDPOINT=https://your-endpoint.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_INVOICES_COLLECTION_ID=your-invoices-collection-id
APPWRITE_USERS_COLLECTION_ID=your-users-collection-id

# Email Configuration (if using email services)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

### 4. Initialize Appwrite Collections

Run the setup script to create necessary collections and attributes:

```bash
node setup-appwrite.js
```

### 5. Start the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

All endpoints require authentication via Bearer token in the Authorization header.

### Base URL

- **Local**: `http://localhost:3000`
- **Production**: `http://51.20.42.154` (or your production URL)

### Authentication

Include the Bearer token in the Authorization header:

```
Authorization: Bearer your-token-here
```

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**

```json
{
  "success": true,
  "message": "Finance Platform API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Invoice Endpoints

#### Create Invoice

**POST** `/api/invoices`

Create a new invoice with automatic VAT calculation.

**Request Body:**

```json
{
  "clientName": "Acme Corporation",
  "amount": 5000.0,
  "description": "Consulting services for Q1 2024",
  "dueDate": "2024-02-01T00:00:00.000Z",
  "vatRateType": "standard"
}
```

**Parameters:**

- `clientName` (string, required): Name of the client
- `amount` (number, required): Invoice amount (must be positive)
- `description` (string, optional): Invoice description (max 1000 characters)
- `dueDate` (date, optional): Due date (must be in the future, ISO format)
- `vatRateType` (string, optional): VAT rate type - `standard`, `reduced`, or `zero` (default: `standard`)

**Response:**

```json
{
  "success": true,
  "data": {
    "invoiceId": "unique-invoice-id",
    "clientName": "Acme Corporation",
    "amount": 5000.0,
    "vatAmount": 1000.0,
    "totalAmount": 6000.0,
    "status": "unpaid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "clientName": "Acme Corporation",
    "amount": 5000.00,
    "description": "Consulting services",
    "vatRateType": "standard"
  }'
```

---

#### List Invoices

**GET** `/api/invoices`

Retrieve all invoices for the authenticated user. Supports optional filtering by status.

**Query Parameters:**

- `status` (string, optional): Filter by status - `paid` or `unpaid`

**Response:**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "invoiceId": "unique-invoice-id",
        "clientName": "Acme Corporation",
        "amount": 5000.0,
        "vatAmount": 1000.0,
        "totalAmount": 6000.0,
        "status": "unpaid",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

**Examples:**

```bash
# Get all invoices
curl -X GET "http://localhost:3000/api/invoices" \
  -H "Authorization: Bearer your-token-here"

# Get unpaid invoices only
curl -X GET "http://localhost:3000/api/invoices?status=unpaid" \
  -H "Authorization: Bearer your-token-here"
```

---

#### Mark Invoice as Paid

**PATCH** `/api/invoices/:invoiceId/paid`

Mark an invoice as paid and trigger email notification.

**URL Parameters:**

- `invoiceId` (string, required): The ID of the invoice to mark as paid

**Response:**

```json
{
  "success": true,
  "message": "Invoice marked as paid",
  "data": {
    "invoiceId": "unique-invoice-id",
    "status": "paid",
    "paidAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Example:**

```bash
curl -X PATCH "http://localhost:3000/api/invoices/INVOICE_ID/paid" \
  -H "Authorization: Bearer your-token-here"
```

---

### Summary Endpoints

#### Get Financial Summary

**GET** `/api/summary`

Get a comprehensive financial summary including revenue, outstanding amounts, and recent activity.

**Response:**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalInvoices": 10,
      "paidInvoices": 7,
      "unpaidInvoices": 3
    },
    "revenue": {
      "totalRevenue": 35000.0,
      "totalVAT": 7000.0,
      "grandTotal": 42000.0
    },
    "outstanding": {
      "totalAmount": 15000.0,
      "invoiceCount": 3
    },
    "recentActivity": {
      "lastPayment": {
        "invoiceId": "unique-invoice-id",
        "clientName": "Acme Corporation",
        "amount": 5000.0,
        "paidAt": "2024-01-01T00:00:00.000Z"
      },
      "upcomingDue": {
        "invoiceId": "unique-invoice-id",
        "clientName": "Tech Solutions Ltd",
        "amount": 3000.0,
        "dueDate": "2024-02-01T00:00:00.000Z"
      }
    }
  }
}
```

**Example:**

```bash
curl -X GET "http://localhost:3000/api/summary" \
  -H "Authorization: Bearer your-token-here"
```

---

## 🏗️ Architecture

### Project Structure

```
Finance-Management-Platform/
├── app.js                      # Main application entry point
├── config/
│   └── appwrite.js            # Appwrite client configuration
├── controllers/
│   ├── invoiceController.js   # Invoice business logic
│   └── summaryController.js   # Financial summary logic
├── middleware/
│   ├── auth.js                # Authentication middleware
│   └── validation.js          # Request validation middleware
├── routes/
│   ├── invoices.js            # Invoice routes
│   └── summary.js             # Summary routes
└── services/
    ├── appwriteService.js     # Appwrite database operations
    ├── authService.js         # Authentication service
    ├── emailService.js        # Email notification service
    ├── pdfService.js          # PDF generation service
    └── vatService.js          # VAT calculation service
```

### Key Components

- **Controllers**: Handle HTTP requests and responses, orchestrate business logic
- **Services**: Encapsulate business logic and external service integrations
- **Middleware**: Authentication and request validation
- **Routes**: Define API endpoints and middleware chains

### VAT Calculation

The platform supports three VAT rate types:

- **Standard**: 20% VAT rate
- **Reduced**: 5% VAT rate
- **Zero**: 0% VAT rate

VAT calculations are handled automatically when creating invoices.

---

## 🔒 Security Considerations

1. **Authentication**: All endpoints require valid Bearer tokens
2. **Input Validation**: All requests are validated using Joi schemas
3. **Error Handling**: Sensitive error details are hidden in production
4. **Environment Variables**: Sensitive data stored in environment variables
5. **CORS**: Configured for cross-origin requests (adjust for production)

**Production Recommendations:**

- Use HTTPS for all API communications
- Implement rate limiting
- Use environment-specific CORS settings
- Rotate API keys regularly
- Implement proper logging and monitoring
- Set up request size limits

---

## 🧪 Testing

### Manual Testing with cURL

See the [API Documentation](#api-documentation) section for detailed cURL examples for each endpoint.

### Production Server Testing

Replace `localhost:3000` with your production server IP or domain:

```bash
# Example: Production server
curl -X POST http://51.20.42.154/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "clientName": "Talentra Company",
    "amount": 10000.00,
    "description": "Internship Test Payment",
    "vatRateType": "standard"
  }'
```

---

## 📦 Dependencies

### Core Dependencies

- **express**: Web framework for Node.js
- **node-appwrite**: Appwrite SDK for backend operations
- **joi**: Schema validation library
- **nodemailer**: Email sending functionality
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management
- **axios**: HTTP client for external requests

### Development Dependencies

- **nodemon**: Auto-reload server during development

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production` in environment variables
- [ ] Configure production Appwrite endpoint and credentials
- [ ] Set up proper CORS origins
- [ ] Configure email service credentials
- [ ] Set up process manager (PM2, systemd, etc.)
- [ ] Configure reverse proxy (nginx, Apache)
- [ ] Set up SSL/TLS certificates
- [ ] Configure monitoring and logging
- [ ] Set up backup strategy for Appwrite data

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:

```env
NODE_ENV=production
PORT=3000
APPWRITE_ENDPOINT=https://your-production-endpoint.appwrite.io/v1
APPWRITE_PROJECT_ID=your-production-project-id
APPWRITE_API_KEY=your-production-api-key
# ... other production variables
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Verify the Bearer token is valid and not expired
   - Check Appwrite authentication service configuration

2. **Database Connection Issues**

   - Verify Appwrite endpoint and credentials
   - Ensure database and collections exist
   - Check network connectivity

3. **Validation Errors**

   - Review request body format and required fields
   - Check data types match expected schema

4. **Email Service Issues**
   - Verify email service credentials
   - Check SMTP server configuration
   - Review email service logs

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Version**: 1.0.0  
**Last Updated**: 2024
