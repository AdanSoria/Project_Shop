const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { protect } = require('../middleware/auth.middleware');

// @route   POST /api/invoices
// @desc    Crear una nueva factura a partir de una orden
// @access  Privado
router.post('/', protect, invoiceController.createInvoice);

module.exports = router;
