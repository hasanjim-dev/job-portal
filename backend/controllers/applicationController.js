const pool = require('../config/db');

// Jobseeker applies to a job
exports.applyToJob = async (req, res) => {
  try {
    const { job_id, cover_letter, resume_link } = req.body;
    if (!job_id) return res.status(400).json({ message: 'job_id is required' });

    const [existing] = await pool.query(
      'SELECT id FROM applications WHERE job_id = ? AND user_id = ?',
      [job_id, req.user.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }

    await pool.query(
      `INSERT INTO applications (job_id, user_id, cover_letter, resume_link) VALUES (?, ?, ?, ?)`,
      [job_id, req.user.id, cover_letter || null, resume_link || null]
    );
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error submitting application' });
  }
};

// Jobseeker: view own applications
exports.getMyApplications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, j.title, j.company_name, j.location FROM applications a
       JOIN jobs j ON a.job_id = j.id WHERE a.user_id = ? ORDER BY a.applied_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: view applicants for a specific job
exports.getApplicantsForJob = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.full_name, u.email, u.phone FROM applications a
       JOIN users u ON a.user_id = u.id WHERE a.job_id = ? ORDER BY a.applied_at DESC`,
      [req.params.jobId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    await pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Application status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
