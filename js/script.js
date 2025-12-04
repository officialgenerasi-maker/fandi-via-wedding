/* =========================================================================
   js/script.js
   - Cover sequencing
   - Guest param
   - Music toggle
   - Countdown for two dates
   - Copy rekening
   - Gallery lightbox
   ========================================================================= */

/* helper: get query param */
function getQueryParam(k){
  try {
    const u = new URL(window.location.href);
    return u.searchParams.get(k);
  } catch(e){
    const qs = window.location.search.substring(1).split('&');
    for(let i=0;i<qs.length;i++){
      const p = qs[i].split('=');
      if(decodeURIComponent(p[0])===k) return decodeURIComponent(p[1]||'');
    }
    return null;
  }
}

/* COVER sequencing */
function initCoverReveal(){
  const label = document.getElementById('label-top');
  const names = document.querySelector('.names-wrapper');
  const dateBlock = document.getElementById('date-block');
  const guestBlock = document.getElementById('guest-block');
  const openBtn = document.getElementById('open-btn');
  const guestNameSpan = document.getElementById('guest-name');

  const qGuest = getQueryParam('guest');
  if(qGuest && guestNameSpan){
    try{ guestNameSpan.textContent = qGuest; } catch(e){}
  }

  if(label) setTimeout(()=> label.classList.add('reveal'), 200);
  if(names) setTimeout(()=> names.classList.add('reveal'), 900);
  if(dateBlock) setTimeout(()=> dateBlock.classList.add('reveal'), 1500);
  if(guestBlock) setTimeout(()=> guestBlock.classList.add('reveal'), 1900);
  if(openBtn) setTimeout(()=> openBtn.classList.add('reveal'), 2300);

  if(openBtn){
    openBtn.addEventListener('click', ()=> {
      try { const a=document.getElementById('bgm'); if(a && !a.paused) a.pause(); } catch(e){}
    });
  }
}

/* MUSIC toggle */
function initMusicToggle(){
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bgm');
  if(!btn || !audio) return;
  btn.textContent = '▶︎';
  let playing=false;
  btn.addEventListener('click', function(e){
    e.preventDefault();
    if(!audio.src){ console.warn('Audio source kosong. Upload assets/musik.mp3'); return; }
    if(!playing){
      audio.play().then(()=>{ playing=true; btn.textContent='⏸'; }).catch(err=>{ playing=true; btn.textContent='⏸'; console.warn(err); });
    } else {
      audio.pause(); playing=false; btn.textContent='▶︎';
    }
  });
  audio.addEventListener('pause', ()=> { btn.textContent='▶︎'; playing=false; });
  audio.addEventListener('play', ()=> { btn.textContent='⏸'; playing=true; });
}

/* COUNTDOWNS */
function initCountdowns(){
  const els = document.querySelectorAll('.countdown');
  if(!els) return;
  els.forEach(el=>{
    const iso = el.dataset.date || (el.id==='countdown1' ? '2025-12-21T08:00:00+07:00' : el.id==='countdown2' ? '2025-12-28T09:00:00+07:00' : null);
    if(!iso) return;
    function update(){
      const now = Date.now();
      const target = (new Date(iso)).getTime();
      let diff = target - now;
      if(diff<=0){ el.textContent='Acara telah dimulai'; return; }
      const d = Math.floor(diff / (1000*60*60*24));
      diff -= d*(1000*60*60*24);
      const h = Math.floor(diff / (1000*60*60));
      diff -= h*(1000*60*60);
      const m = Math.floor(diff / (1000*60));
      diff -= m*(1000*60);
      const s = Math.floor(diff / 1000);
      el.textContent = `${d} Hari • ${h} Jam • ${m} Menit • ${s} Detik`;
    }
    update(); setInterval(update,1000);
  });
}

/* COPY REKENING */
function copyRek(){
  const el = document.getElementById('rek-no');
  if(!el){ alert('Nomor rekening tidak ditemukan'); return; }
  const text = el.textContent.trim();
  if(!text){ alert('Nomor rekening kosong'); return; }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=> {
      const btn = document.querySelector('.copy-btn');
      if(btn){ btn.textContent='Tersalin ✓'; setTimeout(()=> btn.textContent='Copy Nomor',2000); }
      else alert('Nomor disalin: '+text);
    }).catch(()=> fallbackCopy(text));
  } else { fallbackCopy(text); }
  function fallbackCopy(s){
    const ta = document.createElement('textarea'); ta.value=s; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); alert('Nomor disalin: '+s); } catch(e){ alert('Gagal menyalin. Silakan salin manual: '+s); }
    document.body.removeChild(ta);
  }
}

/* GALLERY LIGHTBOX */
function initGalleryLightbox(){
  const imgs = document.querySelectorAll('.gallery img');
  if(!imgs || imgs.length===0) return;
  imgs.forEach(img=>{
    img.style.cursor='pointer';
    img.addEventListener('click', function(){
      const src = img.src || img.getAttribute('src');
      const overlay = document.createElement('div');
      overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center';
      overlay.style.background='rgba(0,0,0,0.92)'; overlay.style.zIndex=99999; overlay.style.cursor='zoom-out';
      const big = document.createElement('img'); big.src=src; big.style.maxWidth='92%'; big.style.maxHeight='92%'; big.style.borderRadius='8px';
      overlay.appendChild(big);
      overlay.addEventListener('click', ()=> { try{ document.body.removeChild(overlay);}catch(e){} });
      document.body.appendChild(overlay);
    });
  });
}

/* INIT */
document.addEventListener('DOMContentLoaded', function(){
  if(document.body.classList.contains('cover-page')) initCoverReveal();
  initMusicToggle();
  initCountdowns();
  window.copyRek = copyRek;
  initGalleryLightbox();
  const a=document.getElementById('bgm'); if(a){ window.addEventListener('pagehide', ()=> { try{ a.pause(); } catch(e){} }); }
});
