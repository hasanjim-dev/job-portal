async function loadJobs(params = {}) {
  const grid = document.getElementById('job-grid');
  grid.innerHTML = '<p style="color: var(--text-muted);">Loading jobs...</p>';
  try {
    const qs = new URLSearchParams(params).toString();
    const jobs = await apiRequest(`/jobs${qs ? '?' + qs : ''}`);
    if (jobs.length === 0) {
      grid.innerHTML = `<div class="empty-state">No jobs match your search. Try different keywords.</div>`;
      return;
    }
    grid.innerHTML = jobs.map(jobCardHTML).join('');
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't load jobs. Is the backend server running?<br><small>${err.message}</small></div>`;
  }
}

function jobCardHTML(job) {
  const posted = new Date(job.created_at).toLocaleDateString();
  return `
   <a class="card" href="job-details.html?id=${job.id}">
      <div class="job-card-top">
        <div>
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company_name}</div>
        </div>
        <span class="tag">${job.job_type}</span>
      </div>
      <div class="job-meta">
        <span>📍 ${job.location}</span>
        ${job.salary_range ? `<span>💰 ${job.salary_range}</span>` : ''}
      </div>
      <div class="job-desc">${job.description}</div>
      <div style="color: var(--text-muted); font-size: 0.8rem;">Posted ${posted}</div>
    </a>`;
}

document.getElementById('search-btn').addEventListener('click', () => {
  loadJobs({
    search: document.getElementById('search-input').value,
    job_type: document.getElementById('type-filter').value,
    location: document.getElementById('location-filter').value
  });
});

loadJobs();
