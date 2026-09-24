const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', verifyToken, requireAdmin, createJob);
router.put('/:id', verifyToken, requireAdmin, updateJob);
router.delete('/:id', verifyToken, requireAdmin, deleteJob);

module.exports = router;
