const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, createDirectCharge } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(protect, getUserOrders);
router.route('/checkout').post(protect, createOrder);
router.route('/charge').post(protect, createDirectCharge);
router.route('/:orderId').get(protect, getOrderById);

module.exports = router;
