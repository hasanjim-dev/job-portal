-- ============================================
-- Job Portal Database Schema (MySQL)
-- ============================================

CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role ENUM('jobseeker', 'admin') NOT NULL DEFAULT 'jobseeker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    location VARCHAR(120) NOT NULL,
    job_type ENUM('Full-time','Part-time','Remote','Internship','Contract') DEFAULT 'Full-time',
    category VARCHAR(100),
    salary_range VARCHAR(60),
    description TEXT NOT NULL,
    requirements TEXT,
    status ENUM('open','closed') DEFAULT 'open',
    posted_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    cover_letter TEXT,
    resume_link VARCHAR(255),
    status ENUM('pending','reviewed','shortlisted','rejected','hired') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, user_id)
);

CREATE TABLE IF NOT EXISTS saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_save (user_id, job_id)
);
