/* ========================================================
   js/script.js
   - Cover reveal sequencing
   - Guest name from URL
   - Music toggle
   - Two countdown timers
   - Copy rekening
   - Simple lightbox for gallery images
   ======================================================== */

/* --------- Utility: ambil query param --------- */
function getQueryParam(key) {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
  } catch (e) {
    // fallback sederhana
    const qs = window.location.search.substring(1).split('&');
    for (let i=0;i<qs.length;i++){
      const pair = qs[i].split('=');
      if(decodeURIComponent(pair[0]) === key) return decodeURIComponent(pair[1] || '');
    }
    return null;
  }
}

/* --------- COVER: sequencing reveal --------- */
function initCoverReveal(){
  const label = document.getElementById('label-top');
  const names = document.querySelector('.names-wrapper');
  const dateBlock = document.getElementById('date-block');
  const guestBlock = document.getElementById('guest-block');
  const openBtn = document.getElementById('open-btn');
  const guestNameSpan = document.getElementById('guest-name');

  // Tampilkan nama tamu jika ada ?guest=Nama
  const qGuest = getQueryParam('guest');
  if(qGuest && guestNameSpan){
    try { guestNameSpan.textContent = qGuest; } catch(e){}
  }

  // animasi sequenced, waktu disetel agar elegan (normal)
  if(label) setTimeout(()=> label.classList.add('reveal'), 200);
  if(names) setTimeout(()=> names.classList.add('reveal'), 900);
  if(dateBlock) setTimeout(()=> dateBlock.classList.add('reveal'), 1500);
  if(guestBlock) setTimeout(()=> guestBlock.classList.add('reveal'), 1900);
  if(openBtn) setTimeout(()=> openBtn.classList.add('reveal'), 2300);

  // Pause musik saat tombol "Buka Undangan" diklik (agar tidak ikut terbawa ke halaman baru)
  if(openBtn){
    openBtn.addEventListener('click', function(){
      try {
        const a = document.getElementById('bgm');
        if(a && !a.paused) a.pause();
      } catch(e){}
    });
  }
}

/* --------- MUSIC: toggle play/pause --------- */
function initMusicToggle(){
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bgm');
  if(!btn || !audio) return;

  // default icon
  btn.textContent = '▶︎';
  let playing = false;

  btn.addEventListener('click', function(e){
    e.preventDefault();
    // If audio has no source, notify (console)
    if(!audio.src){
      console.warn('Audio source kosong: upload assets/music.mp3 atau atur src audio.');
      return;
    }

    if(!playing){
      audio.play().then(()=>{
        playing = true;
        btn.textContent = '⏸';
      }).catch(err=>{
        // autoplay / playback blocked: user interaction required — but click already user interaction
        // Show play icon anyway
        console.warn('Audio play error:', err);
        playing = true;
        btn.textContent = '⏸';
      });
    } else {
      audio.pause();
      playing = false;
      btn.textContent = '▶︎';
    }
  });

  // Jika audio berhenti lewat event (misal end), set icon
  audio.addEventListener('pause', ()=> { btn.textContent = '▶︎'; playing = false; });
  audio.addEventListener('play', ()=> { btn.textContent = '⏸'; playing = true; });
}

/* --------- COUNTDOWN: untuk banyak elemen --------- */
function initCountdowns(){
  // configurable: cari elemen dengan class .countdown, atau id tertentu
  const els = document.querySelectorAll('.countdown');
  if(!els || els.length === 0) return;

  els.forEach(el=>{
    // data-date harus ada pada parent atau pada elemen itu sendiri
    // Jika elemen punya id countdown1/2 dan kita ingin set tanggal khusus, fallback akan dipakai.
    let iso = el.dataset.date || null;

    // fallback berdasarkan id (buat kemudahan)
    if(!iso && el.id === 'countdown1') iso = '2025-12-21T08:00:00+07:00';
    if(!iso && el.id === 'countdown2') iso = '2025-12-28T09:00:00+07:00';
    if(!iso){
      console.warn('Countdown element tanpa data-date:', el);
      return;
    }

    function update(){
      const now = Date.now();
      const target = (new Date(iso)).getTime();
      let diff = target - now;

      if(isNaN(target)){
        el.textContent = 'Tanggal tidak valid';
        return;
      }

      if(diff <= 0){
        el.textContent = 'Acara telah dimulai';
        return;
      }

      // hitung hari/jam/menit/detik
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= d * (1000 * 60 * 60 * 24);
      const h = Math.floor(diff / (1000 * 60 * 60));
      diff -= h * (1000 * 60 * 60);
      const m = Math.floor(diff / (1000 * 60));
      diff -= m * (1000 * 60);
      const s = Math.floor(diff / 1000);

      el.textContent = `${d} Hari • ${h} Jam • ${m} Menit • ${s} Detik`;
    }

    // initial + interval
    update();
    setInterval(update, 1000);
  });
}

/* --------- COPY REKENING --------- */
function copyRek(){
  const node = document.getElementById('rek-no');
  if(!node){
    alert('Nomor rekening tidak ditemukan.');
    return;
  }
  const text = node.textContent.trim();
  if(!text) { alert('Nomor rekening kosong'); return; }

  // copy using Clipboard API (modern)
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>{
      // feedback sederhana
      const orig = document.querySelector('.copy-btn');
      if(orig){
        orig.textContent = 'Tersalin ✓';
        setTimeout(()=> orig.textContent = 'Copy Nomor', 2000);
      } else {
        alert('Nomor rekening disalin: ' + text);
      }
    }).catch(err=>{
      // fallback: create temp input
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }

  function fallbackCopy(str){
    const ta = document.createElement('textarea');
    ta.value = str;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      alert('Nomor rekening disalin: ' + str);
    } catch(e){
      alert('Gagal menyalin nomor. Silakan salin manual: ' + str);
    }
    document.body.removeChild(ta);
  }
}

/* --------- SIMPLE LIGHTBOX untuk GALERI --------- */
function initGalleryLightbox(){
  const galleryImgs = document.querySelectorAll('.gallery img');
  if(!galleryImgs || galleryImgs.length === 0) return;

  galleryImgs.forEach(img=>{
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(e){
      e.preventDefault();
      const src = img.src || img.getAttribute('src');
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.92)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = 99999;
      overlay.style.cursor = 'zoom-out';

      // image
      const big = document.createElement('img');
      big.src = src;
      big.style.maxWidth = '92%';
      big.style.maxHeight = '92%';
      big.style.borderRadius = '8px';
      big.style.boxShadow = '0 12px 40px rgba(0,0,0,0.7)';
      overlay.appendChild(big);

      // click overlay to close
      overlay.addEventListener('click', function(){
        try { document.body.removeChild(overlay); } catch(e){}
      });

      document.body.appendChild(overlay);
    });
  });
}

/* --------- INIT on DOMContentLoaded --------- */
document.addEventListener('DOMContentLoaded', function(){

  // Cover sequencing (if on index.html)
  if(document.body.classList.contains('cover-page')){
    initCoverReveal();
  }

  // Music
  initMusicToggle();

  // Countdown(s)
  initCountdowns();

  // Copy Rekening: expose globally for inline onclick
  window.copyRek = copyRek;

  // Gallery lightbox
  initGalleryLightbox();

  // Small accessibility: if user lands on main.html and audio playing on previous page, ensure paused
  // (This guards against audio carrying unexpectedly.)
  const audio = document.getElementById('bgm');
  if(audio){
    // Pause audio when leaving page (beforeunload)
    window.addEventListener('pagehide', ()=> { try { audio.pause(); } catch(e){} });
  }

});
