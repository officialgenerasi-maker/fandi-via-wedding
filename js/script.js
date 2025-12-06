// ---- helper: get query param ----
function getQueryParam(key){
  try{
    const u = new URL(window.location.href);
    return u.searchParams.get(key);
  }catch(e){
    return null;
  }
}

/* ---------- COVER sequencing & open ---------- */
(function(){
  const openBtn = document.getElementById('open-btn');
  const main = document.getElementById('mainContent');
  const overlay = document.querySelector('.cover-overlay');
  const bgm = document.getElementById('bgm');
  const musicToggle = document.getElementById('music-toggle');

  // guest name from ?to=Nama
  const qGuest = getQueryParam('to') || getQueryParam('guest') || getQueryParam('nama');
  if(qGuest){
    const el = document.getElementById('guest-name');
    if(el) el.textContent = decodeURIComponent(qGuest.replace(/\+/g,' '));
  }

  // music toggle
  if(musicToggle && bgm){
    musicToggle.addEventListener('click', function(e){
      e.preventDefault();
      if(bgm.paused){ bgm.play().then(()=> musicToggle.textContent='⏸').catch(()=> musicToggle.textContent='⏸'); }
      else { bgm.pause(); musicToggle.textContent='▶︎'; }
    });
  }

  // open button behavior
  if(openBtn){
    openBtn.addEventListener('click', function(ev){
      ev.preventDefault();
      // play music (user gesture)
      if(bgm && bgm.paused){
        bgm.play().catch(()=>{/* ignore */});
        musicToggle.textContent = '⏸';
      }

      // hide overlay visually
      if(overlay){
        overlay.style.transition = 'opacity .9s ease, transform .9s ease';
        overlay.style.opacity = '0';
        overlay.style.transform = 'translateY(-8px) scale(.995)';
        setTimeout(()=> { overlay.style.display = 'none'; }, 920);
      }

      // reveal main and smooth scroll
      if(main){
        main.classList.remove('hidden');
        setTimeout(()=> {
          // try native scrollIntoView first
          try{
            main.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }catch(e){
            // fallback animated scroll
            const target = main.getBoundingClientRect().top + window.scrollY - 20;
            window.scrollTo({ top: target, behavior: 'smooth' });
          }
          try{ main.focus(); }catch(e){}
        }, 360);
      }
    });
  }
})();

/* ---------- countdowns ---------- */
(function(){
  function start(id, iso){
    const el = document.getElementById(id);
    if(!el) return;
    const target = new Date(iso).getTime();
    function tick(){
      const now = Date.now();
      let diff = target - now;
      if(diff <= 0){ el.textContent = 'Acara telah dimulai'; return; }
      const d = Math.floor(diff / (1000*60*60*24));
      diff -= d*(1000*60*60*24);
      const h = Math.floor(diff / (1000*60*60));
      diff -= h*(1000*60*60);
      const m = Math.floor(diff / (1000*60));
      diff -= m*(1000*60);
      const s = Math.floor(diff / 1000);
      el.textContent = `${d} hari ${h} jam ${m} menit ${s} detik`;
    }
    tick(); setInterval(tick,1000);
  }
  start('countdown1','2025-12-21T08:00:00+07:00');
  start('countdown2','2025-12-28T09:00:00+07:00');
})();

/* ---------- copy rekening ---------- */
function copyRek(){
  const el = document.getElementById('rek-no');
  if(!el) return alert('Nomor rekening tidak ditemukan');
  const txt = el.textContent.trim();
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(()=> alert('Nomor rekening disalin ✓')).catch(()=> { fallbackCopy(txt); });
  } else fallbackCopy(txt);
  function fallbackCopy(s){
    const ta = document.createElement('textarea'); ta.value=s; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); alert('Nomor rekening disalin ✓'); }catch(e){ alert('Gagal menyalin'); }
    document.body.removeChild(ta);
  }
}

/* ---------- gallery lightbox ---------- */
(function(){
  const imgs = document.querySelectorAll('.gallery img');
  if(!imgs) return;
  imgs.forEach(img=>{
    img.style.cursor='pointer';
    img.addEventListener('click', function(){
      const src = img.src || img.getAttribute('src');
      const overlay = document.createElement('div');
      overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(0,0,0,0.92)'; overlay.style.display='flex';
      overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.zIndex=99999; overlay.style.cursor='zoom-out';
      const big = document.createElement('img'); big.src=src; big.style.maxWidth='92%'; big.style.maxHeight='92%'; big.style.borderRadius='8px';
      overlay.appendChild(big);
      overlay.addEventListener('click', ()=> { try{ document.body.removeChild(overlay); }catch(e){} });
      document.body.appendChild(overlay);
    });
  });
})();
