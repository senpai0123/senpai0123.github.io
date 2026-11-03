/* Videos: las series se muestran completas desde el inicio; las categorías muestran lo más reciente.
   data/videos.json se actualiza solo con GitHub Actions (tools/fetch_videos.py). */
(function () {
  const t = VDF.t, esc = VDF.esc;
  const series = VDF_PLAYLISTS.filter(p => p.type === "serie");
  const cats = VDF_PLAYLISTS.filter(p => p.type === "categoria");
  const modal = document.getElementById("modal"), player = document.getElementById("player");

  function open(src) { player.src = src; modal.hidden = false; modal.querySelector(".close").focus(); }
  function close() { modal.hidden = true; player.src = ""; }
  modal.querySelector(".close").addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) close(); });

  document.getElementById("series").innerHTML = series.map(s => `<div class="serie reveal in">
      <div class="label">${t({ es: "Serie", en: "Series" })}</div>
      <h3>${t(s.name)}</h3>
      <p style="color:#c6c2bb">${t(s.note)}</p>
      <div class="btn-row"><button class="btn wood" type="button" data-list="${s.id}">${t({ es: "Ver desde el inicio", en: "Watch from the start" })}</button>
      <a class="btn ghost" style="color:#f3f0ea;border-color:#d2a46c" href="https://www.youtube.com/playlist?list=${s.id}" target="_blank" rel="noopener">YouTube</a></div>
    </div>`).join("");
  document.getElementById("series").addEventListener("click", e => {
    const b = e.target.closest("[data-list]");
    if (b) open(`https://www.youtube.com/embed/videoseries?list=${b.dataset.list}&autoplay=1`);
  });

  const tabs = document.getElementById("tabs"), grid = document.getElementById("grid"), fb = document.getElementById("fallback");
  tabs.innerHTML = cats.map((c, i) => `<button class="tab" role="tab" type="button" aria-selected="${i === 0}" data-k="${c.key}">${t(c.name)}</button>`).join("");
  let data = {};
  const fmt = d => { try { return new Date(d).toLocaleDateString(VDF.lang() === "en" ? "en-US" : "es-US", { year: "numeric", month: "long", day: "numeric" }); } catch (e) { return ""; } };

  function show(key) {
    tabs.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.k === key));
    const c = cats.find(x => x.key === key);
    const list = (data[key] || []).slice(0, 9);
    if (!list.length) {
      grid.innerHTML = "";
      fb.hidden = false;
      fb.innerHTML = `<div class="embed"><iframe loading="lazy" title="${esc(c.name.es)}" src="https://www.youtube.com/embed/videoseries?list=${c.id}" allowfullscreen></iframe></div>`;
      return;
    }
    fb.hidden = true;
    grid.innerHTML = list.map(v => `<button class="vcard" type="button" data-v="${v.id}">
        <span class="thumb" style="background-image:url(https://i.ytimg.com/vi/${v.id}/hqdefault.jpg)"></span>
        <span class="meta"><b>${esc(v.title)}</b><span>${fmt(v.published)}</span></span></button>`).join("");
  }
  tabs.addEventListener("click", e => { const b = e.target.closest(".tab"); if (b) show(b.dataset.k); });
  grid.addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (b) open(`https://www.youtube.com/embed/${b.dataset.v}?autoplay=1`); });
  document.addEventListener("vdf:lang", () => show(tabs.querySelector('[aria-selected="true"]').dataset.k));

  fetch("data/videos.json", { cache: "no-store" }).then(r => r.json()).then(d => { data = d.playlists || {}; show(cats[0].key); })
    .catch(() => show(cats[0].key));
})();
