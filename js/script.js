// Countdown (multiple elements)
function initCountdown(){
  document.querySelectorAll('.countdown').forEach(el=>{
    const target = new Date(el.dataset.date).getTime();
    function tick(){
      const now = Date.now();
      let diff = target - now;
      if(diff < 0){ el.textContent = "Telah berlangsung"; return; }
      const days = Math.floor(diff / (1000*60*60*24));
      diff -= days*(1000*60*60*24);
      const hours = Math.floor(diff/(1000*60*60));
      diff -= hours*(1000*60*60);
      const minutes = Math.floor(diff/(1000*60));
      const seconds = Math.floor((diff/1000)%60);
      el.textContent = `${days} hari ${hours} jam ${minutes} m ${seconds} d`;
    }
    tick(); setInterval(tick,1000);
  });
}

// Lightbox simple
function initLightbox(){
  document.querySelectorAll('.lightbox').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const src = a.href;
      const overlay = document.createElement('div');
      overlay.style= 'position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:9999';
      overlay.addEventListener('click', ()=>overlay.remove());
      const img = document.createElement('img'); img.src = src; img.style='max-width:90%;max-height:90%';
      overlay.appendChild(img);
      document.body.appendChild(overlay);
    });
  });
}

// Music toggle
function initMusic(){
  const audio = document.getElementById('bgm');
  const btn = document.getElementById('music-toggle');
  if(!btn || !audio) return;
  btn.addEventListener('click', ()=>{
    if(audio.paused){ audio.play(); btn.textContent='⏸'; } else { audio.pause(); btn.textContent='▶︎'; }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{ initCountdown(); initLightbox(); initMusic(); });
