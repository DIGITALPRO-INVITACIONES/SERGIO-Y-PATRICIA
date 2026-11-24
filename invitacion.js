const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- MÚSICA ---------- */
const music = $('#music'), musicBtn = $('#music-toggle');
let musicWanted = false;
function musicState() {
  const on = !music.paused;
  musicBtn.setAttribute('aria-pressed', String(on));
  musicBtn.setAttribute('aria-label', on ? 'Pausar música' : 'Reproducir música');
}
music.addEventListener('play', musicState);
music.addEventListener('pause', musicState);
musicBtn.addEventListener('click', () => {
  if (music.paused) { musicWanted = true; music.play().catch(musicState); }
  else { musicWanted = false; music.pause(); }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) music.pause();
  else if (musicWanted) music.play().catch(musicState);
});

/* ---------- ANIMACIONES ---------- */
const animBtn = $('#anim-toggle');
let animOn = !reduced.matches;
function animState() {
  document.body.classList.toggle('still', !animOn);
  animBtn.setAttribute('aria-pressed', String(animOn));
  animBtn.setAttribute('aria-label', animOn ? 'Pausar animaciones' : 'Reanudar animaciones');
}
animBtn.addEventListener('click', () => { animOn = !animOn; animState(); });

const colors = ['#5d6b45', '#8a9466', '#b4532f', '#d98a68', '#b8924a', '#e2c78f'];
const hojas = $('#hojas');
for (let i = 0; i < 18; i++) {
  const el = document.createElement('i');
  const kind = Math.random();
  if (kind > .82) el.className = 'brillo';
  else if (kind > .5) el.className = 'petalo';
  el.style.cssText = `--x:${Math.random() * 100}%;--s:${12 + Math.random() * 12}px;--c:${colors[i % colors.length]};--d:${12 + Math.random() * 12}s;--delay:-${Math.random() * 24}s;--drift:${-90 + Math.random() * 180}px;--r:${240 + Math.random() * 540}deg`;
  hojas.append(el);
}
document.addEventListener('visibilitychange', () => hojas.classList.toggle('paused', document.hidden));

/* ---------- ABRIR SOBRE ---------- */
const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
}), { threshold: .08 });

let opened = false;
function openInvitation() {
  if (opened) return; opened = true;
  musicWanted = true;
  music.play().catch(musicState);
  $('#envelope').classList.add('open');
  $('#welcome').classList.add('opening');
  $('#open').disabled = true;
  setTimeout(() => $('#welcome').classList.add('leaving'), reduced.matches ? 100 : 1500);
  setTimeout(() => {
    $('#welcome').hidden = true;
    $('#invitation').hidden = false;
    $('#controls').hidden = false;
    animState();
    window.scrollTo(0, 0);
    $('h1').focus({ preventScroll: true });
    document.querySelectorAll('.reveal').forEach(s => { s.classList.add('ready'); observer.observe(s); });
  }, reduced.matches ? 300 : 2100);
}
$('#open').addEventListener('click', openInvitation);
$('#seal').addEventListener('click', openInvitation);

/* ---------- CALENDARIO (diciembre 2026 empieza en martes) ---------- */
const cal = $('#calendar');
for (let d = 0; d <= 31; d++) {
  const s = document.createElement('span');
  if (d > 0) s.textContent = d;
  if (d === 12) { s.className = 'chosen'; s.setAttribute('aria-label', '12 de diciembre, nuestra boda'); }
  cal.append(s);
}

/* ---------- CUENTA REGRESIVA ---------- */
const target = new Date('2026-12-12T14:30:00-04:00').getTime();
const units = [['days', 86400000], ['hours', 3600000], ['minutes', 60000], ['seconds', 1000]];
function count() {
  let n = target - Date.now();
  if (n <= 0) { $('#countdown').hidden = true; $('#today').hidden = false; return; }
  units.forEach(([id, ms]) => {
    const el = $('#' + id), v = String(Math.floor(n / ms)).padStart(2, '0');
    n %= ms;
    if (el.textContent !== v) { el.textContent = v; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
  });
}
count(); setInterval(count, 1000);

/* ---------- REGALO ---------- */
$('#gift').addEventListener('click', e => {
  const g = e.currentTarget, open = !g.classList.contains('open');
  g.classList.toggle('open', open);
  g.setAttribute('aria-expanded', String(open));
});

/* ---------- CONFIRMACIÓN POR WHATSAPP ---------- */
const msg = 'Hola Sergio y Patricia, confirmo mi asistencia a su boda el sábado 12 de diciembre.\nMi nombre: \nNúmero de asistentes: ';
$('#rsvp').href = 'https://wa.me/59165777426?text=' + encodeURIComponent(msg);
