const jobId = new URLSearchParams(window.location.search).get('id');
let currentJob = null;

async function loadJob() {
  const box = document.getElementById('job-detail');
  try {
    currentJob = await apiRequest(`/jobs/${jobId}`);
    box.innerHTML = `
      <div class="job-card-top">
        <div>
          <div class="job-title" style="font-size:1.4rem;">${currentJob.title}</div>
          <div class="job-company">${currentJob.company_name}</div>
        </div>
        <span class="tag">${currentJob.job_type}</span>
      </div>
      <div class="job-meta">
        <span>📍 ${currentJob.location}</span>
        ${currentJob.salary_range ? `<span>💰 ${currentJob.salary_range}</span>` : ''}
        ${currentJob.category ? `<span>🏷️ ${currentJob.category}</span>` : ''}
        <span class="status-pill status-${currentJob.status}">${currentJob.status}</span>
      </div>
      <hr style="border-color: var(--border); margin: 18px 0;">
      <h3 style="margin-bottom:8px;">Description</h3>
      <p style="color: var(--text-muted); line-height:1.6; white-space: pre-line;">${currentJob.description}</p>
      ${currentJob.requirements ? `<h3 style="margin:18px 0 8px;">Requirements</h3>
      <p style="color: var(--text-muted); line-height:1.6; white-space: pre-line;">${currentJob.requirements}</p>` : ''}
    `;
    renderApplyBox();
  } catch (err) {
    box.innerHTML = `<div class="empty-state">Job not found.</div>`;
  }
}

function renderApplyBox() {
  const applyBox = document.getElementById('apply-box');
  const user = getUser();

  if (!user) {
    applyBox.innerHTML = `<p style="color: var(--text-muted);">
      <a href="login.html" style="color: var(--purple-light);">Log in</a> as a job seeker to apply for this job.</p>`;
    return;
  }
  if (user.role === 'admin') {
    applyBox.innerHTML = `<p style="color: var(--text-muted);">Admin accounts post and manage jobs from the admin dashboard.</p>`;
    return;
  }

  applyBox.innerHTML = `
    <h3 style="margin-bottom: 14px;">Apply for this job</h3>
    <div id="apply-msg"></div>
    <form id="apply-form">
      <div class="field"><label>Resume link (Google Drive, portfolio, etc.)</label><input type="url" id="resume_link" placeholder="https://..."></div>
      <div class="field"><label>Cover letter</label><textarea id="cover_letter" placeholder="Tell them why you're a great fit..."></textarea></div>
      <button class="btn btn-primary" type="submit">Submit Application</button>
    </form>
  `;

  document.getElementById('apply-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('apply-msg');
    try {
      await apiRequest('/applications', {
        method: 'POST', auth: true,
        body: {
          job_id: jobId,
          resume_link: document.getElementById('resume_link').value,
          cover_letter: document.getElementById('cover_letter').value
        }
      });
      msg.innerHTML = `<div class="alert alert-success">Application submitted! Track it from your dashboard.</div>`;
      document.getElementById('apply-form').style.display = 'none';
    } catch (err) {
      msg.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  });
}

loadJob();
