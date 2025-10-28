const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
// Asumo que tus middlewares se llaman protect y isAdmin
const { protect, isAdmin } = require('../middleware/auth.middleware');

// /api/products
router.route('/').get(getProducts).post(protect, isAdmin, createProduct);

// /api/products/:id
router.route('/:id').get(getProductById).put(protect, isAdmin, updateProduct).delete(protect, isAdmin, deleteProduct);

module.exports = router;