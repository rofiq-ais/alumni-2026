let sched = {}, activeDay = '';

document.addEventListener('DOMContentLoaded', async () => {
  sched = await fetch('data/schedule.json').then(r=>r.json()).catch(()=>({}));
  const today = todayName();
  activeDay = Object.keys(sched).includes(today) ? today : Object.keys(sched)[0] || '';
  buildTabs(); renderTable();
});

function buildTabs() {
  const today = todayName();
  document.getElementById('tabs').innerHTML = Object.keys(sched).map(d=>`
    <button class="day-tab ${d===activeDay?'active':''}" onclick="switchDay('${d}')">
      ${d}${d===today?' <span style="color:var(--accent-l);font-size:10px">●</span>':''}
    </button>`).join('');
}

function switchDay(d) {
  activeDay = d;
  document.querySelectorAll('.day-tab').forEach((b,i)=>b.classList.toggle('active',Object.keys(sched)[i]===d));
  renderTable();
}

function renderTable() {
  const rows = sched[activeDay]||[];
  document.getElementById('table-wrap').innerHTML = `
    <div class="card" style="padding:0;overflow:hidden;">
      <div class="tbl-wrap"><table>
        <thead><tr><th>Waktu</th><th>Mata Pelajaran</th><th>Pengajar</th></tr></thead>
        <tbody>${rows.map(r=>`
          <tr class="${r.type==='break'?'is-break':''}">
            <td style="white-space:nowrap;font-size:12.5px;color:var(--t3);">${r.time}</td>
            <td style="font-weight:${r.type==='break'?'400':'600'};">${r.subject}</td>
            <td>${r.teacher||'<span style="color:var(--t3)">—</span>'}</td>
          </tr>`).join('')}
        </tbody>
      </table></div>
    </div>`;
}
