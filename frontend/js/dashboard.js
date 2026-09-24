requireAuth('jobseeker');

async function loadMyApplications() {
  const body = document.getElementById('apps-body');
  try {
    const apps = await apiRequest('/applications/my', { auth: true });
    if (apps.length === 0) {
      body.innerHTML = `<tr><td colspan="4"><div class="empty-state">You haven't applied to any jobs yet. <a href="index.html" style="color:var(--purple-light);">Browse openings</a></div></td></tr>`;
      return;
    }
    body.innerHTML = apps.map(a => `
      <tr>
        <td><a href="job-details.html?id=${a.job_id}">${a.title}</a></td>
        <td>${a.company_name}</td>
        <td>${new Date(a.applied_at).toLocaleDateString()}</td>
        <td><span class="status-pill status-${a.status}">${a.status}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    body.innerHTML = `<tr><td colspan="4">Error loading applications: ${err.message}</td></tr>`;
  }
}

loadMyApplications();
