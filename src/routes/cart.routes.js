const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

//  /api/cart
router.route('/').get(protect, getCart).delete(protect, clearCart);

//  /api/cart/items
router.route('/items').post(protect, addItemToCart);

// /api/cart/items/:productId
router.route('/items/:productId').put(protect, updateItemQuantity).delete(protect, removeItemFromCart);

module.exports = router;