/* ===========================
   MUSIC CONTROL
=========================== */
const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("music-toggle");
let musicPlaying = false;

musicToggle.addEventListener("click", () => {
  if (!musicPlaying) {
    bgm.play();
    musicToggle.textContent = "⏸";
    musicPlaying = true;
  } else {
    bgm.pause();
    musicToggle.textContent = "▶︎";
    musicPlaying = false;
  }
});


/* ===========================
   OPEN INVITATION
=========================== */
const openBtn = document.getElementById("open-btn");
const coverPage = document.body;
const mainContent = document.getElementById("mainContent");

openBtn.addEventListener("click", function () {

  // Play music on user gesture (Safari fix)
  bgm.play().then(() => {
    musicToggle.textContent = "⏸";
    musicPlaying = true;
  }).catch(() => {
    console.log("Safari autoplay blocked");
  });

  // Hide cover
  coverPage.classList.remove("cover-page");
  document.querySelector(".cover-overlay").classList.add("fade-out");

  // Show main content
  setTimeout(() => {
    mainContent.classList.remove("hidden");
    smoothScrollDown();
  }, 900);
});

/* Smooth auto-scroll */
function smoothScrollDown() {
  const targetY = mainContent.offsetTop;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = 1400;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startY, distance, duration);

    window.scrollTo(0, run);

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

/* Easing function */
function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
}


/* ===========================
   COUNTDOWN
=========================== */
function startCountdown(id) {
  const el = document.getElementById(id);
  const target = new Date(el.dataset.date).getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff < 0) {
      el.innerHTML = "<span class='done'>Acara telah dimulai</span>";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    el.innerHTML = `
      <div class="cd-box">${d}<span>Hari</span></div>
      <div class="cd-box">${h}<span>Jam</span></div>
      <div class="cd-box">${m}<span>Menit</span></div>
      <div class="cd-box">${s}<span>Detik</span></div>
    `;
  }, 1000);
}

startCountdown("countdown1");
startCountdown("countdown2");


/* ===========================
   COPY REKENING
=========================== */
function copyRek() {
  const no = document.getElementById("rek-no").textContent;
  navigator.clipboard.writeText(no).then(() => {
    alert("Nomor rekening disalin");
  });
}


/* ===========================
   GUEST NAME FROM URL
=========================== */
const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get("to");

if (guest) {
  document.getElementById("guest-name").textContent = decodeURIComponent(guest);
}


/* ===========================
   FADE-IN ON SCROLL
=========================== */
const fadeElements = document.querySelectorAll(".fade-in");

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.87;

  fadeElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
