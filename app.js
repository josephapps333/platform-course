/* ================================================================
 *  VIDEO CONFIGURATION
 *  ----------------------------------------------------------------
 *  Add your Bunny.net embed URLs and video titles here.
 *  Each object accepts:
 *    url      – the full Bunny.net embed URL (required)
 *    title    – video title shown in the player and sidebar
 *    duration – optional duration label, e.g. "12:34"
 *    thumb    – optional thumbnail URL; omit to show a placeholder
 *
 *  Example Bunny.net embed URL format:
 *    https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}?autoplay=true
 * ================================================================ */
const VIDEOS = [
  {
    url:   "https://iframe.mediadelivery.net/embed/600588/b3704de3-5463-4834-b437-c761ebb358c8?autoplay=true",
    title: "Lesson 1"
  },
  {
    url:   "https://iframe.mediadelivery.net/embed/600588/53ab2c49-5a58-49a2-a059-71a3d18e4cd9?autoplay=true",
    title: "Lesson 2"
  },
  {
    url:   "https://iframe.mediadelivery.net/embed/600588/923db9f3-e405-4069-bf23-621c7a6985ec?autoplay=true",
    title: "Lesson 3"
  },
  {
    url:   "https://iframe.mediadelivery.net/embed/600588/a8ae7dc0-021e-4982-a70d-d270fdf95e8f?autoplay=true",
    title: "Lesson 4"
  },
  {
    url:   "https://iframe.mediadelivery.net/embed/600588/9b430e0d-7b7c-42d2-ab34-6b7e9a850aa8?autoplay=true",
    title: "Lesson 5"
  },
  {
    url:   "https://iframe.mediadelivery.net/embed/600588/825a9bde-ff0c-48f3-9cc7-1404d5b6482f?autoplay=true",
    title: "Lesson 6"
  }
];
/* ── End of configuration ─────────────────────────────────────── */


/* ── App State ──────────────────────────────────────────────── */
let activeIndex = 0;

/* ── DOM Refs ───────────────────────────────────────────────── */
const player     = document.getElementById("main-player");
const titleEl    = document.getElementById("current-title");
const subtitleEl = document.getElementById("current-subtitle");
const listEl     = document.getElementById("sidebar-list");
const countEl    = document.getElementById("sidebar-count");

/* ── Build Sidebar ──────────────────────────────────────────── */
function buildSidebar() {
  listEl.innerHTML = "";
  countEl.textContent = VIDEOS.length + " videos";

  VIDEOS.forEach((v, i) => {
    const card = document.createElement("div");
    card.className = "video-card" + (i === activeIndex ? " active" : "");
    card.dataset.index = i;

    const thumbHtml = v.thumb
      ? `<img src="${escHtml(v.thumb)}" alt="" loading="lazy" />`
      : `<span class="card-thumb-icon">&#9654;</span>`;

    card.innerHTML = `
      <span class="card-num">${i + 1}</span>
      <div class="card-thumb">${thumbHtml}</div>
      <div class="card-info">
        <div class="card-title">${escHtml(v.title)}</div>
        ${v.duration ? `<div class="card-duration">${escHtml(v.duration)}</div>` : ""}
      </div>`;

    card.addEventListener("click", () => loadVideo(i));
    listEl.appendChild(card);
  });
}

/* ── Load a Video ───────────────────────────────────────────── */
function loadVideo(index) {
  if (index < 0 || index >= VIDEOS.length) return;
  activeIndex = index;
  const v = VIDEOS[index];

  player.src = v.url;
  titleEl.textContent = v.title;
  subtitleEl.textContent = v.duration ? "Duration: " + v.duration : "";

  // Update active card styling
  listEl.querySelectorAll(".video-card").forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });

  // Scroll active card into view
  const activeCard = listEl.querySelector(".video-card.active");
  if (activeCard) {
    activeCard.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  // Scroll player into view on mobile
  if (window.innerWidth <= 900) {
    document.querySelector(".player-col").scrollIntoView({ behavior: "smooth" });
  }
}

/* ── XSS-safe escaping ──────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ── Init (called by auth.js once the user is signed in) ────── */
function initApp() {
  buildSidebar();
  loadVideo(0);
}
