const pool = require('../config/db');

// GET /api/jobs?search=&category=&location=&job_type=
exports.getJobs = async (req, res) => {
  try {
    const { search, category, location, job_type } = req.query;
    let sql = `SELECT j.*, u.full_name AS posted_by_name
               FROM jobs j JOIN users u ON j.posted_by = u.id
               WHERE j.status = 'open'`;
    const params = [];

    if (search) {
      sql += ' AND (j.title LIKE ? OR j.company_name LIKE ? OR j.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      sql += ' AND j.category = ?';
      params.push(category);
    }
    if (location) {
      sql += ' AND j.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (job_type) {
      sql += ' AND j.job_type = ?';
      params.push(job_type);
    }
    sql += ' ORDER BY j.created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT j.*, u.full_name AS posted_by_name FROM jobs j
       JOIN users u ON j.posted_by = u.id WHERE j.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin only
exports.createJob = async (req, res) => {
  try {
    const { title, company_name, location, job_type, category, salary_range, description, requirements } = req.body;
    if (!title || !company_name || !location || !description) {
      return res.status(400).json({ message: 'Title, company, location and description are required' });
    }
    const [result] = await pool.query(
      `INSERT INTO jobs (title, company_name, location, job_type, category, salary_range, description, requirements, posted_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, company_name, location, job_type || 'Full-time', category || null, salary_range || null, description, requirements || null, req.user.id]
    );
    res.status(201).json({ message: 'Job posted successfully', jobId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating job' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { title, company_name, location, job_type, category, salary_range, description, requirements, status } = req.body;
    await pool.query(
      `UPDATE jobs SET title=?, company_name=?, location=?, job_type=?, category=?, salary_range=?, description=?, requirements=?, status=?
       WHERE id = ?`,
      [title, company_name, location, job_type, category, salary_range, description, requirements, status, req.params.id]
    );
    res.json({ message: 'Job updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating job' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await pool.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting job' });
  }
};
