let allTasks = [], activeF = 'Semua';

document.addEventListener('DOMContentLoaded', async () => {
  allTasks = await fetch('data/tasks.json').then(r=>r.json()).catch(()=>[]);
  render();
});

function setF(f) {
  activeF = f;
  document.querySelectorAll('#filters .btn').forEach(b=>b.classList.toggle('active',b.dataset.f===f));
  render();
}

function render() {
  const fn = {Semua:()=>true,Aktif:t=>t.status==='pending',Selesai:t=>t.status==='done'};
  const list = allTasks.filter(fn[activeF]||fn.Semua);
  const el = document.getElementById('list');
  if (!list.length) { showEmpty('list','Tidak ada tugas'); return; }
  el.className = 'stagger';
  el.innerHTML = list.map(t=>{
    const d = daysUntil(t.deadline);
    let cls='task-dl', txt='';
    if(t.status==='done') txt='✓ Selesai';
    else if(d<0){ cls+=' overdue'; txt=`Terlambat ${Math.abs(d)} hari`; }
    else if(d===0){ cls+=' soon'; txt='Deadline hari ini!'; }
    else if(d<=3){ cls+=' soon'; txt=`${d} hari lagi`; }
    else txt=`Deadline: ${formatDate(t.deadline)}`;
    return `<div class="card task-card" style="${t.status==='done'?'opacity:.6':''}">
      <div class="task-header">
        <div class="task-title">${t.title}</div>
        <span class="badge ${t.status==='done'?'bg':p2b(t.priority)}">${t.status==='done'?'Selesai':t.priority==='high'?'Prioritas':t.priority==='medium'?'Sedang':'Rendah'}</span>
      </div>
      <div class="task-desc">${t.description}</div>
      <div class="task-footer">
        <span class="badge bp">${t.subject}</span>
        <span class="${cls}">${txt}</span>
      </div>
    </div>`;
  }).join('');
}
function p2b(p){ return {high:'br_',medium:'by',low:'bgr'}[p]||'bgr'; }
