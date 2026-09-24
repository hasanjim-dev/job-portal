# JobNest — Job Portal

A full-stack job portal with a MySQL database, JWT authentication, and a separate admin dashboard — built in a dark-purple theme to match your portfolio.

## Features
- Job seekers can register, browse/search jobs, apply, and track application status.
- Admin account posts jobs, reviews applicants, updates application status, and sees platform stats.
- Signing in with the admin account routes straight to the Admin Dashboard; job seekers go to their own dashboard.

## Tech Stack
- **Backend:** Node.js, Express, MySQL (mysql2), JWT auth, bcrypt password hashing
- **Frontend:** Plain HTML/CSS/JavaScript (no framework/build step needed)

## Project Structure
```
job-portal/
  backend/
    config/db.js          MySQL connection pool
    controllers/           Route logic (auth, jobs, applications, admin)
    middleware/auth.js      JWT verification + admin guard
    routes/                 Express routers
    database/schema.sql     Table definitions
    database/seed.js        Creates the default admin account
    server.js
    .env.example
  frontend/
    index.html, login.html, register.html, job-details.html,
    dashboard.html (job seeker), admin.html (admin dashboard)
    css/style.css           Dark purple theme
    js/                     API calls + page logic
```

## Setup

### 1. Database
Make sure MySQL is running locally, then:
```bash
mysql -u root -p < backend/database/schema.sql
```
This creates the `job_portal` database with all tables.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # then edit .env with your MySQL password and a JWT secret
npm run seed               # creates the default admin account
npm run dev                 # starts the API on http://localhost:5000
```

**Default admin login:**
- Email: `admin@jobportal.com`
- Password: `Admin@123`

Change this password after first login (or edit `database/seed.js` before seeding).

### 3. Frontend
The frontend is plain static HTML/CSS/JS — no build step. Easiest way to run it:
```bash
cd frontend
npx serve .
```
Or just open `index.html` directly in your browser, or use the VS Code "Live Server" extension.

By default the frontend calls the API at `http://localhost:5000/api` — change `API_BASE` in `frontend/js/api.js` if you deploy the backend elsewhere.

## Deploying
- **Backend:** Render, Railway, or any Node host with a MySQL add-on (PlanetScale, Railway MySQL, etc.)
- **Frontend:** Vercel/Netlify (static hosting) — same as your portfolio site. Just remember to update `API_BASE` to your deployed backend URL.

## Notes
- Passwords are hashed with bcrypt; never stored in plain text.
- JWT tokens are stored in `localStorage` and sent as `Authorization: Bearer <token>`.
- Roles are enforced both in the UI (page redirects) and on the backend (middleware) — the backend is the real gatekeeper.
