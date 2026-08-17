let APPS = [];
let BUGS = [];

const SEVERITY_LEVELS = { 0: 'critical', 1: 'high', 2: 'medium', 3: 'low' };
const PRIORITY_LEVELS = { 0: 'critical', 1: 'high', 2: 'medium', 3: 'low' };
const APP_COLORS = ['#8b3a3a', '#2a5c2a', '#c44a00', '#5a3a8a', '#3a6a8a'];

function colorForApp(id) {
  return APP_COLORS[id % APP_COLORS.length];
}

function formatSteps(steps) {
  if (typeof steps === 'string') return steps;
  if (steps && typeof steps === 'object') {
    return Object.keys(steps)
      .sort()
      .map(function(k) { return k + '. ' + steps[k]; })
      .join('\n');
  }
  return '';
}

function mapApp(row) {
  return {
    id: row.id,
    name: row.Name,
    icon: row.Code,
    color: colorForApp(row.id),
    desc: '',
    image: row.image || row.icon_url || row.Icon || null
  };
}

function appCodeForBug(applicationId) {
  const app = APPS.find(function(a) { return a.id === applicationId; });
  return app ? app.icon : '';
}

function mediaForBug(appCode, bugId) {
  return MEDIA_REGISTRY[appCode + '-' + bugId] || [];
}

function buildEvidenceHtml(bug) {
  const items = bug.media || [];

  if (items.length === 0) {
    return '<div class="modal-evidence-placeholder">No evidence attached</div>';
  }

  if (items.length === 1) {
    const m = items[0];
    return m.type === 'video'
      ? '<div class="modal-evidence"><video src="Media/' + m.file + '" controls onerror="this.remove()"></video></div>'
      : '<div class="modal-evidence"><img src="Media/' + m.file + '" alt="Evidence" onerror="this.remove()"></div>';
  }

  return '<div class="modal-evidence-grid">' + items.map(function(m) {
    return m.type === 'video'
      ? '<div class="modal-evidence-item"><video src="Media/' + m.file + '" controls onerror="this.remove()"></video></div>'
      : '<div class="modal-evidence-item"><img src="Media/' + m.file + '" alt="Evidence" onerror="this.remove()"></div>';
  }).join('') + '</div>';
}

function mapBug(row) {
  return {
    id: row.id,
    appId: row.application_id,
    severity: SEVERITY_LEVELS[row.severity] || 'medium',
    priority: PRIORITY_LEVELS[row.priority] || 'medium',
    status: row.status ? 'open' : 'resolved',
    date: row.date_created,
    title: row.title,
    steps: formatSteps(row.steps),
    expected: row.r_expected,
    actual: row.r_actual,
    affectedVersion: row.afected_version,
    lastUpdate: row.date_close || row.date_created,
    media: mediaForBug(appCodeForBug(row.application_id), row.id)
  };
}

function showMessage(text) {
  const grid = document.getElementById('apps-grid');
  grid.innerHTML = '';
  const msg = document.createElement('p');
  msg.className = 'state-message';
  msg.textContent = text;
  grid.appendChild(msg);
}

function showLoading() {
  showMessage('Loading data...');
}

function renderApps() {
  const grid = document.getElementById('apps-grid');
  grid.innerHTML = '';

  for (const app of APPS) {
    const count = BUGS.filter(function(b) { return b.appId === app.id; }).length;
    const critical = BUGS.filter(function(b) { return b.appId === app.id && b.severity === 'critical'; }).length;

    const card = document.createElement('div');
    card.className = 'app-card';

    let icon;
    if (app.image) {
      icon = document.createElement('img');
      icon.className = 'app-card-image';
      icon.src = app.image;
      icon.alt = app.name;
    } else {
      icon = document.createElement('div');
      icon.className = 'app-card-icon';
      icon.style.cssText = 'background:' + app.color + '30;color:' + app.color + ';border:2px solid ' + app.color + '50;';
      icon.textContent = app.icon;
    }

    const name = document.createElement('h3');
    name.className = 'app-card-name';
    name.textContent = app.name;

    const desc = document.createElement('p');
    desc.className = 'app-card-desc';
    desc.textContent = app.desc;

    const info = document.createElement('div');
    info.className = 'app-card-bugs';
    info.innerHTML = 'Reported bugs: ' + count + (critical > 0 ? ' <span class="critical-count">(' + critical + ' critical)</span>' : '');

    card.append(icon, name, desc, info);
    card.addEventListener('click', function() { openApp(app.id); });
    grid.appendChild(card);
  }
}

function openApp(appId) {
  const app = APPS.find(function(a) { return a.id === appId; });
  if (!app) return;

  document.getElementById('home-section').classList.add('hidden');
  document.getElementById('bugs-section').classList.remove('hidden');
  document.getElementById('bugs-subtitle').classList.remove('hidden');
  document.getElementById('bugs-table').classList.remove('hidden');
  document.getElementById('back-btn').classList.remove('hidden');
  document.getElementById('bugs-app-name').textContent = app.name;

  const bugs = BUGS.filter(function(b) { return b.appId === appId; });
  const bugCount = bugs.length;
  document.getElementById('bugs-subtitle').textContent = bugCount + ' bug' + (bugCount !== 1 ? 's' : '') + ' reported';

  const tbody = document.getElementById('bugs-tbody');
  tbody.innerHTML = '';

  if (bugCount === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.className = 'empty-cell';
    cell.textContent = 'No bugs reported for this application';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  for (const bug of bugs) {
    const row = document.createElement('tr');
    row.className = 'bug-row';

    const sevLabel = bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1);
    const statLabel = bug.status.split('-').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');

    row.innerHTML = '<td class="bug-id-cell">' + bug.id + '</td>' +
      '<td class="bug-title-cell">' + bug.title + '</td>' +
      '<td><span class="severity-badge severity-' + bug.severity + '">' + sevLabel + '</span></td>' +
      '<td><span class="status-badge status-' + bug.status + '">' + statLabel + '</span></td>' +
      '<td>' + bug.date + '</td>';

    row.addEventListener('click', function() { openModal(bug.id); });
    tbody.appendChild(row);
  }
}

function goHome() {
  document.getElementById('home-section').classList.remove('hidden');
  document.getElementById('bugs-section').classList.add('hidden');
  document.getElementById('back-btn').classList.add('hidden');
  closeModal();
}

function openModal(bugId) {
  const bug = BUGS.find(function(b) { return b.id === bugId; });
  if (!bug) return;

  const app = APPS.find(function(a) { return a.id === bug.appId; });
  const sevLabel = bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1);
  const priLabel = bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1);
  const statLabel = bug.status.split('-').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');

  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  content.innerHTML =
    '<div class="modal-header">' +
      '<div class="modal-header-left">' +
        '<h3 class="modal-title">' + bug.title + '</h3>' +
        '<div class="modal-meta">' +
          '<span class="severity-badge severity-' + bug.severity + '">' + sevLabel + '</span>' +
          '<span class="priority-badge priority-' + bug.priority + '">' + priLabel + '</span>' +
          '<span class="status-badge status-' + bug.status + '">' + statLabel + '</span>' +
          '<span style="color: var(--text-muted); font-size: 0.85rem;">' + bug.id + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="modal-close" id="modal-close-btn">\u00d7</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div class="modal-section">' +
        '<div class="modal-section-label">Steps to Reproduce</div>' +
        '<p class="modal-description" style="white-space: pre-line;">' + bug.steps + '</p>' +
      '</div>' +
      '<div class="modal-section">' +
        '<div class="modal-section-label">Expected Result</div>' +
        '<p class="modal-description">' + bug.expected + '</p>' +
      '</div>' +
      '<div class="modal-section">' +
        '<div class="modal-section-label">Actual Result</div>' +
        '<p class="modal-description">' + bug.actual + '</p>' +
      '</div>' +
      '<div class="modal-info-grid">' +
        '<div class="modal-info-item"><div class="modal-info-label">Report date</div><div class="modal-info-value">' + bug.date + '</div></div>' +
        '<div class="modal-info-item"><div class="modal-info-label">Application</div><div class="modal-info-value">' + (app ? app.name : bug.appId) + '</div></div>' +
        '<div class="modal-info-item"><div class="modal-info-label">Affected version</div><div class="modal-info-value">' + bug.affectedVersion + '</div></div>' +
        '<div class="modal-info-item"><div class="modal-info-label">Last update</div><div class="modal-info-value">' + bug.lastUpdate + '</div></div>' +
      '</div>' +
      '<div class="modal-section">' +
        '<div class="modal-section-label">Evidence</div>' +
        buildEvidenceHtml(bug) +
      '</div>' +
    '</div>';

  overlay.classList.remove('hidden');

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', handleKeydown);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-content').innerHTML = '';
  document.removeEventListener('keydown', handleKeydown);
}

function handleKeydown(e) {
  if (e.key === 'Escape') closeModal();
}

async function loadData() {
  try {
    SupabaseService.init();
    const data = await SupabaseService.fetchAll();
    APPS = data.apps.map(mapApp);
    BUGS = data.bugs.map(mapBug);
    renderApps();
  } catch (err) {
    console.error(err);
    showMessage('Error loading data: ' + (err.message || 'unknown error'));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  showLoading();
  loadData();
  document.getElementById('logo-btn').addEventListener('click', goHome);
  document.getElementById('back-btn').addEventListener('click', goHome);
});