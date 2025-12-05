/* ============================
   BUKA UNDANGAN + MUSIC + SCROLL
============================ */
const openBtn = document.getElementById("open-btn");
const mainContent = document.getElementById("mainContent");
const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("music-toggle");

openBtn.addEventListener("click", () => {
  mainContent.classList.remove("hidden");

  // Play music
  bgm.play().catch(()=>{});
  musicToggle.textContent = "⏸";

  // Smooth scroll pelan
  setTimeout(() => {
    window.scrollTo({
      top: mainContent.offsetTop - 20,
      behavior: "smooth"
    });
  }, 300);
});

/* TOGGLE MUSIK */
musicToggle.addEventListener("click", () => {
  if (bgm.paused) {
    bgm.play();
    musicToggle.textContent = "⏸";
  } else {
    bgm.pause();
    musicToggle.textContent = "▶︎";
  }
});

/* ============================
   COUNTDOWN 1 & 2
============================ */
function runCountdown(id, date) {
  const el = document.getElementById(id);
  const target = new Date(date).getTime();

  setInterval(() => {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      el.innerHTML = "Acara sedang berlangsung";
      return;
    }

    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor(diff % (1000*60*60*24) / (1000*60*60));
    const m = Math.floor(diff % (1000*60*60) / (1000*60));
    const s = Math.floor(diff % (1000*60) / 1000);

    el.innerHTML = `${d} hari ${h} jam ${m} menit ${s} detik`;
  }, 1000);
}

runCountdown("countdown1", "2025-12-21T08:00:00+07:00");
runCountdown("countdown2", "2025-12-28T09:00:00+07:00");

/* ============================
   COPY REKENING
============================ */
function copyRek() {
  const no = document.getElementById("rek-no").innerText;
  navigator.clipboard.writeText(no);
  alert("Nomor rekening disalin!");
}

/* ============================
   TAMU DARI URL
============================ */
const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get("to");

if (guest) {
  document.getElementById("guest-name").innerText = guest.replace(/-/g, " ");
}
