// ── Quotes Page Logic ──────────────────────────────────────────────────────────

let allStudents = [];
let currentActiveId = null;

async function initQuotes() {
  try {
    const res = await fetch('data/students.json');
    allStudents = await res.json();
    
    renderContacts();
    
    // Set default (the first student)
    if (allStudents.length > 0) {
      selectQuote(allStudents[0].id);
    }
  } catch (err) {
    console.error('Failed to load students:', err);
    showEmpty('contacts-list', 'Gagal memuat daftar anggota');
  }
}

function renderContacts() {
  const container = document.getElementById('contacts-list');
  if (!container) return;
  
  if (allStudents.length === 0) {
    showEmpty('contacts-list', 'Daftar anggota kosong');
    return;
  }
  
  container.innerHTML = allStudents.map(s => `
    <div class="contact-item ${currentActiveId === s.id ? 'active' : ''}" 
         onclick="selectQuote('${s.id}')" id="contact-${s.id}">
      <div class="contact-avatar" style="background:${avatarColor(s.id)}">
        ${getInitials(s.nama)}
      </div>
      <div class="contact-info">
        <div class="contact-name">${s.nama}</div>
        <div class="contact-role">${s.role}</div>
      </div>
    </div>
  `).join('');
}

function selectQuote(id) {
  const student = allStudents.find(s => s.id === id);
  if (!student) return;
  
  // Update UI active state in list
  if (currentActiveId) {
    const prev = document.getElementById(`contact-${currentActiveId}`);
    if (prev) prev.classList.remove('active');
  }
  currentActiveId = id;
  const cur = document.getElementById(`contact-${id}`);
  if (cur) cur.classList.add('active');
  
  // Update Display Area with animation
  const card = document.getElementById('active-quote-card');
  const quoteEl = document.getElementById('display-quote');
  const nameEl = document.getElementById('display-name');
  const roleEl = document.getElementById('display-role');
  const avatarEl = document.getElementById('display-avatar');

  // Trigger re-animation
  card.style.animation = 'none';
  card.offsetHeight; // trigger reflow
  card.style.animation = 'quoteIn 0.5s var(--ease) both';

  quoteEl.textContent = student.quote || "Belum ada kutipan tertulis.";
  nameEl.textContent = student.nama;
  roleEl.textContent = student.role;
  avatarEl.textContent = getInitials(student.nama);
  avatarEl.style.background = avatarColor(student.id);
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Copy to Clipboard ─────────────────────────────────────────────────────────
function setupCopyFeature() {
  const btn = document.getElementById('copy-quote-btn');
  if (!btn) return;

  btn.addEventListener('click', function() {
    const quoteText = document.getElementById('display-quote').textContent;
    const authorName = document.getElementById('display-name').textContent;
    const fullText = `"${quoteText}" — ${authorName}`;

    // Prefer navigator.clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText)
        .then(() => showCopyFeedback(btn))
        .catch(err => {
          console.error('Clipboard API failed, using fallback:', err);
          fallbackCopyText(fullText, btn);
        });
    } else {
      fallbackCopyText(fullText, btn);
    }
  });
}

function fallbackCopyText(text, btn) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showCopyFeedback(btn);
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }
  document.body.removeChild(textArea);
}

function showCopyFeedback(btn) {
  const originalContent = btn.innerHTML;
  
  btn.innerHTML = `
    <i data-lucide="check" style="width:14px;height:14px;"></i>
    <span>Tersalin!</span>
  `;
  btn.style.background = 'var(--green-dim)';
  btn.style.color = 'var(--green)';
  btn.style.borderColor = 'var(--green)';
  
  if (typeof lucide !== 'undefined') lucide.createIcons();

  setTimeout(() => {
    btn.innerHTML = originalContent;
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  initQuotes();
  setupCopyFeature();
});
