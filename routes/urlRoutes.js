const express = require('express');
const { shortenUrl, redirectUrl, getAnalytics } = require('../controllers/urlController');
const rateLimitMiddleware = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/shorten', rateLimitMiddleware, shortenUrl);
router.get('/:shortCode', redirectUrl);
router.get('/analytics/:shortCode', getAnalytics);

module.exports = router;
