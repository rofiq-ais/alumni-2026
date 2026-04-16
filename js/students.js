let all = [], filterRole = 'Semua';

document.addEventListener('DOMContentLoaded', async () => {
  all = await fetch('data/students.json').then(r=>r.json()).catch(()=>[]);
  buildFilters();
  render();
});

function buildFilters() {
  const roles = ['Semua',...new Set(all.map(s=>s.role))];
  document.getElementById('filters').innerHTML = roles.map(r=>
    `<button class="btn btn-glass ${r==='Semua'?'active':''}" onclick="setRole('${r}')">${r}</button>`
  ).join('');
}

function setRole(r) {
  filterRole = r;
  document.querySelectorAll('#filters .btn').forEach(b=>b.classList.toggle('active',b.textContent===r));
  render();
}

function render() {
  const q = document.getElementById('q').value.toLowerCase();
  const list = all.filter(s=>(filterRole==='Semua'||s.role===filterRole)&&s.nama.toLowerCase().includes(q));
  const el = document.getElementById('grid');
  if (!list.length) { showEmpty('grid','Santri tidak ditemukan'); return; }
  el.className = 'ga stagger';
  el.innerHTML = list.map(s => {
    const col = avatarColor(s.id);
    const av = s.profile
      ? `<img src="assets/img/profile/${s.profile}" class="avatar" alt="${s.nama}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="avatar" style="background:${col};display:none;">${getInitials(s.nama)}</div>`
      : `<div class="avatar" style="background:${col};">${getInitials(s.nama)}</div>`;
    return `<div class="card student-card" onclick="openProfileById('${s.id}')">
      ${av}
      <div><div class="student-name">${s.nama}</div>
      <div style="margin:5px 0"><span class="badge ${roleBadge(s.role)}">${s.role}</span></div></div>
    </div>`;
  }).join('');
}

function roleBadge(r){ return {Ketua:'bp','Wakil Ketua':'bc',Sekretaris:'bg',Bendahara:'by'}[r]||'bgr'; }

// ── Profile modal ──────────────────────────────────────────────────────────────
function openProfileById(id) {
  const s = all.find(x => x.id === id);
  if (s) openProfile(s);
}

function openProfile(s) {
  const col = avatarColor(s.id);
  const av = s.profile
    ? `<img src="assets/img/profile/${s.profile}" class="modal-avatar" style="object-fit:cover;" onerror="this.outerHTML='<div class=modal-avatar style=background:${col}>${getInitials(s.nama)}</div>'">`
    : `<div class="modal-avatar" style="background:${col};">${getInitials(s.nama)}</div>`;
  document.getElementById('modal-body').innerHTML = `
    ${av}
    <div class="modal-name">${s.nama}</div>
    <div class="modal-role"><span class="badge ${roleBadge(s.role)}">${s.role}</span></div>
    <div class="modal-row"><span class="modal-label">TTL</span><span class="modal-val">${s.ttl||'—'}</span></div>
    <div class="modal-row"><span class="modal-label">Alamat</span><span class="modal-val">${s.alamat||'—'}</span></div>
    <div class="modal-row"><span class="modal-label">Email</span><span class="modal-val">${s.email||'—'}</span></div>
    <div class="modal-row"><span class="modal-label">Instagram</span><span class="modal-val">@${s.ig||'—'}</span></div>
    <div class="modal-row"><span class="modal-label">WhatsApp</span>
      <span class="modal-val"><a href="https://wa.me/${s.wa}" target="_blank" style="color:var(--green);">+${s.wa||'—'}</a></span></div>
    ${s.quote?`<div class="modal-quote">"${s.quote}"</div>`:''}
  `;
  document.getElementById('profile-modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeProfile() {
  document.getElementById('profile-modal').classList.remove('open');
  document.body.style.overflow='';
}
