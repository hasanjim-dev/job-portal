requireAuth('admin');

// --- Tab switching ---
document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    link.classList.add('active');
    const tab = link.dataset.tab;
    document.getElementById(`tab-${tab}`).style.display = 'block';
    if (tab === 'jobs') loadJobsAdmin();
    if (tab === 'applicants') loadApplicantJobOptions();
    if (tab === 'users') loadUsers();
  });
});

// --- Overview ---
async function loadStats() {
  const grid = document.getElementById('stat-grid');
  try {
    const s = await apiRequest('/admin/stats', { auth: true });
    grid.innerHTML = `
      <div class="stat-card"><div class="num">${s.totalJobs}</div><div class="label">Total Jobs Posted</div></div>
      <div class="stat-card"><div class="num">${s.openJobs}</div><div class="label">Open Jobs</div></div>
      <div class="stat-card"><div class="num">${s.totalUsers}</div><div class="label">Registered Job Seekers</div></div>
      <div class="stat-card"><div class="num">${s.totalApplications}</div><div class="label">Total Applications</div></div>
      <div class="stat-card"><div class="num">${s.pendingApplications}</div><div class="label">Pending Review</div></div>
    `;
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">${err.message}</div>`;
  }
}

// --- Manage Jobs ---
async function loadJobsAdmin() {
  const body = document.getElementById('jobs-body');
  body.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
  try {
    const jobs = await apiRequest('/admin/jobs', { auth: true });
    if (jobs.length === 0) {
      body.innerHTML = `<tr><td colspan="6">No jobs posted yet.</td></tr>`;
      return;
    }
    body.innerHTML = jobs.map(j => `
      <tr>
        <td>${j.title}</td>
        <td>${j.company_name}</td>
        <td>${j.job_type}</td>
        <td><span class="status-pill status-${j.status}">${j.status}</span></td>
        <td>${j.applicant_count}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="toggleJobStatus(${j.id}, '${j.status}')">${j.status === 'open' ? 'Close' : 'Reopen'}</button>
          <button class="btn btn-sm btn-danger" onclick="deleteJob(${j.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    body.innerHTML = `<tr><td colspan="6">${err.message}</td></tr>`;
  }
}

async function toggleJobStatus(id, currentStatus) {
  const job = await apiRequest(`/jobs/${id}`);
  await apiRequest(`/jobs/${id}`, {
    method: 'PUT', auth: true,
    body: { ...job, status: currentStatus === 'open' ? 'closed' : 'open' }
  });
  loadJobsAdmin();
}

async function deleteJob(id) {
  if (!confirm('Delete this job permanently?')) return;
  await apiRequest(`/jobs/${id}`, { method: 'DELETE', auth: true });
  loadJobsAdmin();
}

// --- Post a Job ---
document.getElementById('post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('post-msg');
  try {
    await apiRequest('/jobs', {
      method: 'POST', auth: true,
      body: {
        title: document.getElementById('title').value,
        company_name: document.getElementById('company_name').value,
        location: document.getElementById('location').value,
        job_type: document.getElementById('job_type').value,
        category: document.getElementById('category').value,
        salary_range: document.getElementById('salary_range').value,
        description: document.getElementById('description').value,
        requirements: document.getElementById('requirements').value
      }
    });
    msg.innerHTML = `<div class="alert alert-success">Job published successfully!</div>`;
    document.getElementById('post-form').reset();
  } catch (err) {
    msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
  }
});

// --- Applicants ---
async function loadApplicantJobOptions() {
  const select = document.getElementById('applicant-job-select');
  const jobs = await apiRequest('/admin/jobs', { auth: true });
  select.innerHTML = `<option value="">-- Select a job --</option>` +
    jobs.map(j => `<option value="${j.id}">${j.title} (${j.applicant_count} applicants)</option>`).join('');
  select.onchange = () => loadApplicants(select.value);
}

async function loadApplicants(jobId) {
  const body = document.getElementById('applicants-body');
  if (!jobId) { body.innerHTML = `<tr><td colspan="5">Select a job above.</td></tr>`; return; }
  body.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
  try {
    const applicants = await apiRequest(`/applications/job/${jobId}`, { auth: true });
    if (applicants.length === 0) {
      body.innerHTML = `<tr><td colspan="5">No applicants yet for this job.</td></tr>`;
      return;
    }
    body.innerHTML = applicants.map(a => `
      <tr>
        <td>${a.full_name}</td>
        <td>${a.email}</td>
        <td>${a.resume_link ? `<a href="${a.resume_link}" target="_blank" style="color:var(--purple-light);">View</a>` : '-'}</td>
        <td><span class="status-pill status-${a.status}">${a.status}</span></td>
        <td>
          <select onchange="updateStatus(${a.id}, this.value)">
            ${['pending','reviewed','shortlisted','rejected','hired'].map(s =>
              `<option value="${s}" ${s === a.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    body.innerHTML = `<tr><td colspan="5">${err.message}</td></tr>`;
  }
}

async function updateStatus(appId, status) {
  await apiRequest(`/applications/${appId}/status`, { method: 'PUT', auth: true, body: { status } });
}

// --- Users ---
async function loadUsers() {
  const body = document.getElementById('users-body');
  body.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
  try {
    const users = await apiRequest('/admin/users', { auth: true });
    if (users.length === 0) { body.innerHTML = `<tr><td colspan="4">No job seekers registered yet.</td></tr>`; return; }
    body.innerHTML = users.map(u => `
      <tr>
        <td>${u.full_name}</td>
        <td>${u.email}</td>
        <td>${u.phone || '-'}</td>
        <td>${new Date(u.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (err) {
    body.innerHTML = `<tr><td colspan="4">${err.message}</td></tr>`;
  }
}

loadStats();
