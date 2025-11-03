const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticateUser } = require('../middleware/auth');
const { validateRequest, createInvoiceSchema } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateUser);

router.post('/', validateRequest(createInvoiceSchema), invoiceController.createInvoice);
router.get('/', invoiceController.getInvoices);
router.patch('/:invoiceId/paid', invoiceController.markAsPaid);

module.exports = router;
