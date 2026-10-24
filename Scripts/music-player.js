// Background music for every page. Add to each page: <script src="../Scripts/music-player.js" defer></script>
// (from index.html in the English folder use src="Scripts/music-player.js").
(() => {
  const script = document.currentScript;
  const base = new URL('../Music/', script.src);   // English/Music, resolved from this script's own location
  const tracks = [
    {title: 'Graceful Flow', file: 'Graceful Flow.mp3'},
    {title: 'Serenade in G', file: 'Serenade in G (1).mp3'},
    {title: '流指小调', file: '流指小调.mp3'}
  ];
  const KEY = 'elAustralMusic';
  let saved = {track: 0, time: 0, muted: false};
  try { Object.assign(saved, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  if (!tracks[saved.track]) saved.track = 0;

  const style = document.createElement('style');
  style.textContent = `
    .music-player{position:fixed;right:1rem;bottom:1rem;z-index:50;display:flex;align-items:center;gap:.5rem;padding:.4rem .7rem;background:#fff;border:1px solid #78182e;border-radius:999px;box-shadow:0 2px 10px rgba(64,11,25,.18);font:.85rem Arial,sans-serif;color:#252126}
    .music-player button{display:grid;place-items:center;width:2rem;height:2rem;padding:0;border:0;border-radius:50%;background:#78182e;color:#fff;cursor:pointer;transition:background .2s}
    .music-player button:hover{background:#aa2d48}
    .music-player svg{width:1.1rem;height:1.1rem}
    .music-player select{max-width:10rem;padding:.3rem .4rem;border:1px solid #d9c9cc;border-radius:6px;background:#fff;color:inherit;font:inherit}
    .music-player button:focus-visible,.music-player select:focus-visible{outline:2px solid #aa2d48;outline-offset:2px}
    @media(max-width:700px){.music-player{left:.75rem;right:.75rem;justify-content:space-between;border-radius:14px}.music-player select{flex:1;min-width:0;max-width:none}}`;
  document.head.appendChild(style);

  const ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';

  const box = document.createElement('div');
  box.className = 'music-player';
  box.setAttribute('role', 'region');
  box.setAttribute('aria-label', 'Background music');
  const mute = document.createElement('button');
  mute.type = 'button';
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Choose a track');
  tracks.forEach((t, i) => select.add(new Option(t.title, i)));
  select.value = saved.track;
  const audio = document.createElement('audio');
  audio.preload = 'auto';
  audio.volume = 0.5;
  audio.muted = saved.muted;
  box.append(mute, select, audio);
  document.body.appendChild(box);

  const paint = () => {
    mute.innerHTML = audio.muted ? ICON_OFF : ICON_ON;
    mute.setAttribute('aria-label', audio.muted ? 'Unmute music' : 'Mute music');
    mute.setAttribute('aria-pressed', String(audio.muted));
  };
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify({track: Number(select.value), time: audio.currentTime || 0, muted: audio.muted})); } catch (e) {}
  };
  const load = (i, time) => {
    audio.src = new URL(tracks[i].file, base).href;
    if (time) audio.addEventListener('loadedmetadata', () => { if (time < audio.duration) audio.currentTime = time; }, {once: true});
  };

  // Browsers only allow sound after a visitor interacts with the page. Try now; if blocked, start on the first click, tap or key press.
  const events = ['pointerdown', 'keydown', 'touchstart'];
  const kick = () => audio.play().then(() => events.forEach(e => document.removeEventListener(e, kick, true))).catch(() => {});
  const begin = () => audio.play().catch(() => events.forEach(e => document.addEventListener(e, kick, true)));

  mute.addEventListener('click', () => { audio.muted = !audio.muted; paint(); save(); });
  select.addEventListener('change', () => { load(Number(select.value)); audio.play().catch(() => {}); save(); });
  audio.addEventListener('ended', () => { select.value = (Number(select.value) + 1) % tracks.length; load(Number(select.value)); audio.play().catch(() => {}); save(); });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

  paint();
  load(saved.track, saved.time);
  begin();
})();
