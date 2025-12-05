/* =========================================================================
   script.js — Wedding Invitation Premium
   - Cover sequencing
   - Guest param
   - Music toggle & autoplay
   - Countdown
   - Copy rekening
   - Gallery lightbox
   - Gold particles + subtle parallax
   ========================================================================= */

/* ===== Helper: get query param ===== */
function getQueryParam(key){
  try {
    const u = new URL(window.location.href);
    return u.searchParams.get(key);
  } catch(e){
    const qs = window.location.search.substring(1).split('&');
    for(let i=0;i<qs.length;i++){
      const p = qs[i].split('=');
      if(decodeURIComponent(p[0])===key) return decodeURIComponent(p[1]||'');
    }
    return null;
  }
}

/* ===== COVER SEQUENCING & OPEN BUTTON ===== */
function initCoverReveal(){
  const label = document.getElementById('label-top');
  const names = document.querySelector('.names-wrapper');
  const dateBlock = document.getElementById('date-block');
  const guestBlock = document.getElementById('guest-block');
  const openBtn = document.getElementById('open-btn');
  const guestNameSpan = document.getElementById('guest-name');

  // Set guest name from ?guest=
  const qGuest = getQueryParam('guest');
  if(qGuest && guestNameSpan){
    guestNameSpan.textContent = qGuest;
  }

  // Animate cover elements
  if(label) setTimeout(()=> label.classList.add('reveal'), 200);
  if(names) setTimeout(()=> names.classList.add('reveal'), 900);
  if(dateBlock) setTimeout(()=> dateBlock.classList.add('reveal'), 1500);
  if(guestBlock) setTimeout(()=> guestBlock.classList.add('reveal'), 1900);
  if(openBtn) setTimeout(()=> openBtn.classList.add('reveal'), 2300);

  if(openBtn){
    openBtn.addEventListener('click', (ev)=> {
      ev.preventDefault();
      const audio = document.getElementById('bgm');
      if(audio && audio.paused){
        audio.play().catch(()=>{}); // iOS user gesture
      }
      const main = document.getElementById('mainContent');
      const overlay = document.querySelector('.cover-overlay');
      if(overlay){
        overlay.style.transition = 'opacity .9s ease, transform .9s ease';
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(.995) translateY(-6px)';
        setTimeout(()=> overlay.style.display='none', 950);
      }
      if(main){
        main.classList.remove('hidden');
        setTimeout(()=> window.scrollTo({ top: 0, behavior: 'smooth' }), 420);
      }
    });
  }
}

/* ===== MUSIC TOGGLE ===== */
function initMusicToggle(){
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bgm');
  if(!btn || !audio) return;
  btn.textContent = '▶︎';
  let playing = false;

  btn.addEventListener('click', function(e){
    e.preventDefault();
    if(!audio.src){ console.warn('Audio source kosong.'); return; }
    if(!playing){
      audio.play().then(()=>{ playing=true; btn.textContent='⏸'; }).catch(()=>{ playing=true; btn.textContent='⏸'; });
    } else {
      audio.pause(); playing=false; btn.textContent='▶︎';
    }
  });

  audio.addEventListener('pause', ()=> { btn.textContent='▶︎'; playing=false; });
  audio.addEventListener('play', ()=> { btn.textContent='⏸'; playing=true; });
}

/* ===== COUNTDOWN ===== */
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

/* ===== COPY REKENING ===== */
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
    try{ document.execCommand('copy'); alert('Nomor disalin: '+s); } catch(e){ alert('Gagal menyalin.'); }
    document.body.removeChild(ta);
  }
}

/* ===== GALLERY LIGHTBOX ===== */
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
      overlay.addEventListener('click', ()=> { document.body.removeChild(overlay); });
      document.body.appendChild(overlay);
    });
  });
}

/* ===== PARTICLES ===== */
function initParticles(){
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let raf;
  function resize(){
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  resize(); window.addEventListener('resize', resize);
  const particles = [];
  function spawn(){
    const x = Math.random()*canvas.width;
    const y = canvas.height + (Math.random()*80);
    const size = 0.6 + Math.random()*3.2;
    const speed = 0.6 + Math.random()*1.8;
    const life = 120 + Math.random()*240;
    particles.push({x,y,size,speed,life,age:0,alpha:1});
  }
  function tick(){
    if(particles.length < 120 && Math.random() < 0.6) spawn();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.y -= p.speed;
      p.age++;
      p.alpha = Math.max(0, 1 - p.age/p.life);
      const grd = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*6);
      grd.addColorStop(0, `rgba(255,240,180,${0.95*p.alpha})`);
      grd.addColorStop(0.5, `rgba(255,200,90,${0.5*p.alpha})`);
      grd.addColorStop(1, `rgba(255,180,70,${0.03*p.alpha})`);
      ctx.fillStyle = grd;
      ctx.fillRect(p.x - p.size*4, p.y - p.size*4, p.size*8, p.size*8);
      if(p.age > p.life) particles.splice(i,1);
    }
    raf = requestAnimationFrame(tick);
  }
  tick();
  document.addEventListener('visibilitychange', ()=> { if(document.hidden) cancelAnimationFrame(raf); else tick(); });
}

/* ===== PARALLAX ===== */
function initParallax(){
  const bg = document.querySelector('.cover-bg');
  document.addEventListener('pointermove', (e)=>{
    if(!bg) return;
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    bg.style.transform = `translate3d(${dx*6}px, ${dy*4}px, 0) scale(1.03)`;
  }, {passive:true});
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', function(){
  initCoverReveal();
  initMusicToggle();
  initCountdowns();
  window.copyRek = copyRek;
  initGalleryLightbox();
  initParticles();
  initParallax();

  // fade-in observer for all cards
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('in-view');
    });
  }, {threshold:0.14});
  document.querySelectorAll('.fade-in').forEach(el=> io.observe(el));
});
