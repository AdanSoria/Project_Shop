const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getUserOrders);
router.route('/checkout').post(protect, createOrder);
router.route('/:orderId').get(protect, getOrderById);

module.exports = router;
