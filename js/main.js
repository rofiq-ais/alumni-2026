// ── Shared layout & utilities ─────────────────────────────────────────────────

const NAV = [
  { page:'home',          href:'index.html',          icon:'house',          label:'Beranda' },
  { page:'students',      href:'students.html',       icon:'users',          label:'Anggota' },
  { page:'gallery',       href:'gallery.html',        icon:'images',         label:'Galeri' },
  { page:'quotes',        href:'quotes.html',         icon:'quote',          label:'Mutiara' },
];

function renderLayout() {
  const cur = document.body.dataset.page;

  // ── Header ─────────────────────────────────────────────────────────────────
  const h = document.getElementById('app-header');
  if (h) {
    h.innerHTML = `
      <!-- Left: Brand -->
      <div class="header-brand">
        <span class="brand-name">Ma'had Darul Atsar</span>
        <span class="brand-year">Alumni 2026</span>
      </div>

      <!-- Center: Nav links -->
      <nav class="header-nav">
        ${NAV.map(n => `
          <a href="${n.href}" class="nav-link ${cur === n.page ? 'active' : ''}">
            <i data-lucide="${n.icon}"></i>${n.label}
          </a>`).join('')}
      </nav>

      <!-- Right: Actions -->
      <div class="header-right">
        <button class="header-icon-btn" id="theme-toggle" title="Ganti Tema">
          <i data-lucide="${document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon'}" style="width:16px;height:16px;"></i>
        </button>
        <div class="user-chip">
          <div class="user-avatar">MDA</div>
          <div class="user-info">
            <span class="user-name">Kelas</span>
            <span class="user-role">Alumni 2026</span>
          </div>
        </div>
      </div>
    `;

    // Attach toggle event
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  }

  // ── Sidebar — narrow, icon only ────────────────────────────────────────────
  const s = document.getElementById('sidebar');
  if (s) {
    s.innerHTML = `
      ${NAV.map(n => `
        <a href="${n.href}" class="side-item ${cur === n.page ? 'active' : ''}" data-tip="${n.label}" title="${n.label}">
          <i data-lucide="${n.icon}"></i>
        </a>`).join('')}
      <div style="flex-grow: 1;"></div>
      <a href="#" class="side-item" data-tip="Pengaturan" title="Pengaturan">
        <i data-lucide="settings"></i>
      </a>
    `;
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Theme management ──────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.dataset.theme = saved;
}

function toggleTheme() {
  const cur = document.documentElement.dataset.theme;
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  
  // Re-render layout to update icon
  renderLayout();
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatDate(str) {
  return new Date(str).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
}
function daysUntil(str) {
  return Math.ceil((new Date(str) - new Date()) / 86400000);
}
function todayName() {
  return ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][new Date().getDay()];
}
function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
const COLORS = ['#7c5c3e','#2563eb','#0891b2','#16a34a','#d97706','#9333ea','#be123c','#0d9488'];
function avatarColor(id) { return COLORS[parseInt(id) % COLORS.length]; }

function showLoader(id) {
  document.getElementById(id).innerHTML = `<div class="loader"><div class="spinner"></div></div>`;
}
function showEmpty(id, msg = 'Tidak ada data') {
  document.getElementById(id).innerHTML = `
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
      </svg>
      <p style="font-size:14px;">${msg}</p>
    </div>`;
}

initTheme();
document.addEventListener('DOMContentLoaded', renderLayout);
