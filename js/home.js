// home.js — Beranda dengan hero slider + quote carousel

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch only needed data
  const [slides, students] = await Promise.all([
    fetch("data/slides.json")
      .then((r) => r.json())
      .catch(() => []),
    fetch("data/students.json")
      .then((r) => r.json())
      .catch(() => []),
  ]);

  // Stats - Only students
  const sStud = document.getElementById("s-students");
  if (sStud) sStud.textContent = students.length;

  // Hero Slider
  initHeroSlider(slides);

  // Quote Carousel (pakai quote dari students)
  const quotes = students.filter((s) => s.quote);
  initQuoteCarousel(quotes);

  if (typeof lucide !== "undefined") lucide.createIcons();
});

// ─── Hero Slider ──────────────────────────────────────────────────────────────
function initHeroSlider(slides) {
  if (!slides.length) return;
  const wrap = document.getElementById("hero-wrap");
  const track = document.getElementById("hero-track");
  const dotsEl = document.getElementById("hero-dots");
  let cur = 0,
    timer;

  track.innerHTML = slides
    .map((s) => {
      const imgSrc =
        s.image.startsWith("http") || s.image.includes("/")
          ? s.image.replace(/^\.\//, "")
          : `assets/img/slides/${s.image}`;
      return `
      <div class="hero-slide">
        <img src="${imgSrc}" alt="${s.title}"
          onerror="this.style.background='linear-gradient(135deg,#3b2f6e,#1e3a5f)'">
        <div class="hero-content">
          <div class="hero-label">${s.label}</div>
          <div class="hero-title">${s.title}</div>
          <p class="hero-subtitle">${s.subtitle}</p>
          ${s.btn ? `<a href="${s.btnHref}" class="hero-btn">${s.btn} →</a>` : ""}
        </div>
      </div>`;
    })
    .join("");

  // ── FIX: use pure CSS percent ──────────────────────────────────────────
  dotsEl.innerHTML = slides
    .map(
      (_, i) =>
        `<span class="hero-dot ${i === 0 ? "active" : ""}" onclick="heroGo(${i})"></span>`,
    )
    .join("");

  function goTo(n) {
    cur = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    document
      .querySelectorAll(".hero-dot")
      .forEach((d, i) => d.classList.toggle("active", i === cur));
  }

  document.getElementById("hero-prev").onclick = () => {
    goTo(cur - 1);
    resetTimer();
  };
  document.getElementById("hero-next").onclick = () => {
    goTo(cur + 1);
    resetTimer();
  };
  window.heroGo = (n) => {
    goTo(n);
    resetTimer();
  };

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(cur + 1), 10000);
  }
  resetTimer();
}

// ─── Quote Carousel ───────────────────────────────────────────────────────────
function initQuoteCarousel(quotes) {
  if (!quotes.length) return;
  const track = document.getElementById("quote-track");
  const dotsEl = document.getElementById("quote-dots");

  // Acak urutan, mulai dari random index
  const shuffled = [...quotes].sort(() => Math.random() - 0.5);
  let cur = 0,
    timer;

  track.innerHTML = shuffled
    .map((s) => {
      const col = avatarColor(s.id);
      return `
      <div class="quote-card">
        <div class="quote-mark">"</div>
        <div class="quote-text">${s.quote}</div>
        <div class="quote-author">
          <div class="quote-avatar" style="background:${col};">${getInitials(s.nama)}</div>
          <div>
            <div class="quote-author-name">${s.nama}</div>
            <div class="quote-author-role">${s.role || "Anggota"} · Alumni 2026</div>
          </div>
        </div>
      </div>`;
    })
    .join("");

  dotsEl.innerHTML = shuffled
    .map(
      (_, i) =>
        `<span class="q-dot ${i === 0 ? "active" : ""}" onclick="quoteGo(${i})"></span>`,
    )
    .join("");

  function goTo(n) {
    cur = (n + shuffled.length) % shuffled.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    document
      .querySelectorAll(".q-dot")
      .forEach((d, i) => d.classList.toggle("active", i === cur));
  }

  document.getElementById("q-prev").onclick = () => {
    goTo(cur - 1);
    resetTimer();
  };
  document.getElementById("q-next").onclick = () => {
    goTo(cur + 1);
    resetTimer();
  };
  window.quoteGo = (n) => {
    goTo(n);
    resetTimer();
  };

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(cur + 1), 10000);
  }
  resetTimer();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function catBadge(c) {
  return { Penting: "br_", Kegiatan: "bc", Info: "bgr" }[c] || "bgr";
}
