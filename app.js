require('dotenv').config();
const express = require('express');
const cors = require('cors');

const invoiceRoutes = require('./routes/invoices');
const summaryRoutes = require('./routes/summary');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/summary', summaryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Finance Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Finance Platform API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
