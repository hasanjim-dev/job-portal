// Change this if your backend runs on a different host/port
const API_BASE = 'https://job-portal-production-a010.up.railway.app/';

function getToken() { return localStorage.getItem('jp_token'); }
function getUser() { return JSON.parse(localStorage.getItem('jp_user') || 'null'); }
function saveSession(token, user) {
  localStorage.setItem('jp_token', token);
  localStorage.setItem('jp_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('jp_token');
  localStorage.removeItem('jp_user');
}

async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// Renders the navbar auth state on every page
function renderNavAuth() {
  const slot = document.getElementById('nav-auth-slot');
  if (!slot) return;
  const user = getUser();
  if (!user) {
    slot.innerHTML = `<a href="login.html" class="btn btn-outline btn-sm">Login</a>
                       <a href="register.html" class="btn btn-primary btn-sm">Sign Up</a>`;
  } else {
    const dashLink = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
    slot.innerHTML = `<a href="${dashLink}">Hi, ${user.full_name.split(' ')[0]}</a>
                       <a href="#" id="logout-btn" class="btn btn-outline btn-sm">Logout</a>`;
    document.getElementById('logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      clearSession();
      window.location.href = 'index.html';
    });
  }
}

// Guards a page: redirects if not logged in, or wrong role
function requireAuth(role) {
  const user = getUser();
  if (!user) { window.location.href = 'login.html'; return null; }
  if (role && user.role !== role) { window.location.href = 'index.html'; return null; }
  return user;
}

document.addEventListener('DOMContentLoaded', renderNavAuth);
