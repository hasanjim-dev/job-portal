const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [[{ totalJobs }]] = await pool.query('SELECT COUNT(*) AS totalJobs FROM jobs');
    const [[{ openJobs }]] = await pool.query("SELECT COUNT(*) AS openJobs FROM jobs WHERE status = 'open'");
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'jobseeker'");
    const [[{ totalApplications }]] = await pool.query('SELECT COUNT(*) AS totalApplications FROM applications');
    const [[{ pendingApplications }]] = await pool.query("SELECT COUNT(*) AS pendingApplications FROM applications WHERE status = 'pending'");

    res.json({ totalJobs, openJobs, totalUsers, totalApplications, pendingApplications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, phone, role, created_at FROM users WHERE role = 'jobseeker' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllJobsAdmin = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applicant_count
       FROM jobs j ORDER BY j.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
