const express = require('express');
const router = express.Router();
const {
  applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus
} = require('../controllers/applicationController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.post('/', verifyToken, applyToJob);
router.get('/my', verifyToken, getMyApplications);
router.get('/job/:jobId', verifyToken, requireAdmin, getApplicantsForJob);
router.put('/:id/status', verifyToken, requireAdmin, updateApplicationStatus);

module.exports = router;
