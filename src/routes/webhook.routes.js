const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../controllers/webhook.controller');

// This route is public and uses express.raw() middleware in app.js
router.post('/stripe', handleStripeWebhook);

module.exports = router;
