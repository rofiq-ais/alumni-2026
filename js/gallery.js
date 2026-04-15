document.addEventListener('DOMContentLoaded', async () => {
  const items = await fetch('data/gallery.json').then(r=>r.json()).catch(()=>[]);
  const el = document.getElementById('grid');
  if (!items.length) { showEmpty('grid','Belum ada foto'); return; }
  window.__gal = items;
  el.className = 'ga stagger';
  el.innerHTML = items.map(g=>`
    <div class="card gallery-card" onclick="openLb(${g.id})">
      <img src="${g.photo}" alt="${g.title}" loading="lazy">
      <div class="gallery-info"><h3>${g.title}</h3><p>${formatDate(g.date)}</p></div>
    </div>`).join('');
});

function openLb(id) {
  const g = (window.__gal||[]).find(x=>x.id===id); if(!g) return;
  document.getElementById('lb-img').src = g.photo;
  document.getElementById('lb-title').textContent = g.title;
  document.getElementById('lb-desc').textContent = g.description+' — '+formatDate(g.date);
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLb() { document.getElementById('lb').classList.remove('open'); document.body.style.overflow=''; }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLb(); });
