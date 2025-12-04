// COUNTDOWN
const cds = document.querySelectorAll(".countdown");

cds.forEach(el => {
  const target = new Date(el.dataset.date).getTime();

  setInterval(() => {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      el.innerHTML = "Acara telah dimulai";
      return;
    }

    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff / (1000*60*60)) % 24);
    const m = Math.floor((diff / (1000*60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    el.innerHTML = `${d} Hari • ${h} Jam • ${m} Menit • ${s} Detik`;
  }, 1000);
});
