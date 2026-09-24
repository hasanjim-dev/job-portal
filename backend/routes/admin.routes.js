const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllJobsAdmin } = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/stats', verifyToken, requireAdmin, getStats);
router.get('/users', verifyToken, requireAdmin, getAllUsers);
router.get('/jobs', verifyToken, requireAdmin, getAllJobsAdmin);

module.exports = router;
