let allAnn = [], activeCat = 'Semua';

document.addEventListener('DOMContentLoaded', async () => {
  allAnn = await fetch('data/announcements.json').then(r=>r.json()).catch(()=>[]);
  render();
});

function setCat(c) {
  activeCat = c;
  document.querySelectorAll('#filters .btn').forEach(b=>b.classList.toggle('active',b.dataset.c===c));
  render();
}

function render() {
  const list = activeCat==='Semua' ? allAnn : allAnn.filter(a=>a.category===activeCat);
  const el = document.getElementById('list');
  if (!list.length) { showEmpty('list','Tidak ada pengumuman'); return; }
  el.className = 'stagger';
  el.innerHTML = list.map(a=>`
    <div class="card ann-card">
      <div class="ann-meta">
        <span class="badge ${catBadge(a.category)}">${a.category}</span>
        <span class="ann-date">${formatDate(a.date)}</span>
        <span class="ann-date" style="margin-left:auto;">— ${a.author}</span>
      </div>
      <div class="ann-title">${a.title}</div>
      <div class="ann-content">${a.content}</div>
    </div>`).join('');
}

function catBadge(c){ return {Penting:'br_',Kegiatan:'bc',Info:'bgr'}[c]||'bgr'; }
