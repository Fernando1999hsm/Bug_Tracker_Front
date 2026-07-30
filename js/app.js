const APPS = [
  { id: 'cod-mobile', name: 'Call of Duty Mobile', icon: 'COD', color: '#8b3a3a', desc: 'First-person shooter battle royale y multijugador' },
  { id: 'pokemon-go', name: 'Pok\u00e9mon GO', icon: 'PK', color: '#2a5c2a', desc: 'Realidad aumentada para atrapar Pok\u00e9mon en el mundo real' }
];

const BUGS = [
  {
    id: 'COD-001', appId: 'cod-mobile', severity: 'critical', status: 'open', date: '2026-07-28',
    title: 'Crash al entrar en partida Battle Royale',
    full: 'Al seleccionar el modo Battle Royale y presionar iniciar partida, el juego se congela en la pantalla de carga durante 10 segundos y luego crashea sin mostrar error. Ocurre consistentemente en dispositivos con 4GB de RAM o menos. Se prob\u00f3 en Xiaomi Redmi Note 10 y Samsung A52.',
    evidence: 'Media/Cod_Mob_01.jpg'
  }
];

function renderApps() {
  const grid = document.getElementById('apps-grid');
  for (const app of APPS) {
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

    card.append(icon, name, desc);
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
  document.getElementById('bugs-subtitle').textContent = bugs.length + ' bug' + (bugs.length !== 1 ? 's' : '') + ' reportado' + (bugs.length !== 1 ? 's' : '');

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
  const statLabel = bug.status.split('-').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');

  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  content.innerHTML =
    '<div class="modal-header">' +
      '<div class="modal-header-left">' +
        '<h3 class="modal-title">' + bug.title + '</h3>' +
        '<div class="modal-meta">' +
          '<span class="severity-badge severity-' + bug.severity + '">' + sevLabel + '</span>' +
          '<span class="status-badge status-' + bug.status + '">' + statLabel + '</span>' +
          '<span style="color: var(--text-muted); font-size: 0.85rem;">' + bug.id + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="modal-close" id="modal-close-btn">\u00d7</button>' +
    '</div>' +
    '<div class="modal-body">' +
      '<div class="modal-section">' +
        '<div class="modal-section-label">Descripci\u00f3n</div>' +
        '<p class="modal-description">' + bug.full + '</p>' +
      '</div>' +
      '<div class="modal-info-grid">' +
        '<div class="modal-info-item"><div class="modal-info-label">Fecha de reporte</div><div class="modal-info-value">' + bug.date + '</div></div>' +
        '<div class="modal-info-item"><div class="modal-info-label">Aplicaci\u00f3n</div><div class="modal-info-value">' + (app ? app.name : bug.appId) + '</div></div>' +
      '</div>' +
      '<div class="modal-section">' +
        '<div class="modal-section-label">Evidencia</div>' +
        (bug.evidence ? '<div class="modal-evidence"><img src="' + bug.evidence + '" alt="Evidencia"></div>' : '<div class="modal-evidence-placeholder">Sin evidencia adjunta</div>') +
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