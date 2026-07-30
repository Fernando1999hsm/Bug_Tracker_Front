const APPS = [
  { id: 'cod-mobile', name: 'Call of Duty Mobile', icon: 'COD', color: '#8b3a3a', desc: 'First-person shooter battle royale and multiplayer' },
  { id: 'pokemon-go', name: 'Pok\u00e9mon GO', icon: 'PK', color: '#2a5c2a', desc: 'Augmented reality to catch Pok\u00e9mon in the real world' }
];

const BUGS = [
  {
    id: 'COD-001', appId: 'cod-mobile', severity: 'critical', priority: 'high', status: 'open', date: '2026-07-28',
    title: 'Crash when entering Battle Royale match',
    steps: '1. Open Call of Duty Mobile\n2. Select Battle Royale mode\n3. Press "Start Match"\n4. Wait for the loading screen to finish',
    expected: 'The game should load the Battle Royale map and enter the match normally',
    actual: 'The game freezes on the loading screen for 10 seconds and then crashes without showing any error message',
    affectedVersion: '10.3.5',
    lastUpdate: '2026-07-30',
    evidence: 'Media/Cod_Mob_01.jpg'
  }
];

function renderApps() {
  const grid = document.getElementById('apps-grid');
  for (const app of APPS) {
    const count = BUGS.filter(function(b) { return b.appId === app.id; }).length;
    const critical = BUGS.filter(function(b) { return b.appId === app.id && b.severity === 'critical'; }).length;

    const card = document.createElement('div');
    card.className = 'app-card';

    const icon = document.createElement('div');
    icon.className = 'app-card-icon';
    icon.style.cssText = 'background:' + app.color + '30;color:' + app.color + ';border:2px solid ' + app.color + '50;';
    icon.textContent = app.icon;

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
        (bug.evidence ? '<div class="modal-evidence"><img src="' + bug.evidence + '" alt="Evidence"></div>' : '<div class="modal-evidence-placeholder">No evidence attached</div>') +
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

document.addEventListener('DOMContentLoaded', function() {
  renderApps();
  document.getElementById('logo-btn').addEventListener('click', goHome);
  document.getElementById('back-btn').addEventListener('click', goHome);
});