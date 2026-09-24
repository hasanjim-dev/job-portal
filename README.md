# JobNest - Job Portal

A full-stack job portal where job seekers can browse and apply for jobs, and admins can post jobs and manage applicants.

**Live Demo:** https://job-portal-smoky-kappa.vercel.app

## Features

**Job Seekers**
- Register and log in securely
- Browse the latest job openings
- Search and filter jobs by keyword, job type and location
- View full job details and apply
- Personal dashboard to track applications

**Admin**
- Admin dashboard with role-based access
- Post, edit and delete jobs
- View applicants for each job
- View all registered job seekers

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (hosted on Vercel)
- **Backend:** Node.js, Express.js (hosted on Railway)
- **Database:** MySQL (hosted on Railway)
- **Authentication:** JWT, bcrypt password hashing

## Project Structure

```
job-portal/
├── frontend/      # Static pages, CSS and JS
└── backend/
    ├── config/        # Database connection
    ├── controllers/   # Route logic
    ├── middleware/    # Auth and admin checks
    ├── routes/        # API routes
    └── database/      # schema.sql and seed.js
```

## Run Locally

1. Clone the repository
```bash
   git clone <your-repo-url>
   cd job-portal/backend
```
2. Install dependencies
```bash
   npm install
```
3. Create a MySQL database and import `database/schema.sql`
4. Copy `.env.example` to `.env` and fill in your database and JWT details
5. (Optional) Run `node database/seed.js` to create an admin account
6. Start the server
```bash
   npm start
```
7. Open `frontend/index.html` in a browser, and set `API_BASE` in `frontend/js/api.js` to `http://localhost:5000/api`

## API Overview

| Route | Purpose |
|-------|---------|
| `/api/auth` | Register and login |
| `/api/jobs` | List, view, create, update, delete jobs |
| `/api/applications` | Apply for jobs and view applications |
| `/api/admin` | Admin-only data (applicants, users) |

## Author

**Muntasir Hasan Jim**
Portfolio: https://muntasirhasanjim.vercel.app
