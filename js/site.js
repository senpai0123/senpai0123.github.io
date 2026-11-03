/* Encabezado, pie, idioma y animaciones comunes */
(function () {
  const C = window.VDF_CONFIG;
  const root = document.documentElement;
  root.classList.add("js");

  // ---------- idioma ----------
  let lang = "es";
  try { lang = localStorage.getItem("vdf-lang") || (navigator.language || "es").slice(0, 2); } catch (e) {}
  if (lang !== "en") lang = "es";
  root.dataset.lang = lang;

  window.VDF = {
    t(o) { return `<span lang="es">${o.es}</span><span lang="en">${o.en}</span>`; },
    lang() { return root.dataset.lang; },
    email() { return C.emailUser + "@" + C.emailDomain; },
    esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  };
  const t = VDF.t;

  const page = document.body.dataset.page || "";
  const links = [
    ["index.html", "inicio", { es: "Inicio", en: "Home" }],
    ["visitanos.html", "visitanos", { es: "Visítanos", en: "Visit" }],
    ["nosotros.html", "nosotros", { es: "Nosotros", en: "About" }],
    ["nosotros.html#ancianos", "ancianos", { es: "Ancianos", en: "Elders" }],
    ["ministerios.html", "ministerios", { es: "Ministerios", en: "Ministries" }],
    ["videos.html", "videos", { es: "Videos", en: "Videos" }],
    ["eventos.html", "eventos", { es: "Eventos", en: "Events" }],
    ["ayuda.html", "ayuda", { es: "¿Cómo te ayudamos?", en: "How can we help?" }]
  ];

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `<div class="wrap">
    <a class="brand" href="index.html" aria-label="Iglesia Vida de Fe, inicio"><img src="img/logo-blanco.png" alt="Iglesia Vida de Fe · Life of Faith Church" width="137" height="38"></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Menú"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <nav class="nav" id="nav">
      ${links.map(l => `<a href="${l[0]}"${l[1] === page ? ' aria-current="page"' : ""}>${t(l[2])}</a>`).join("")}
      <a class="btn-give" href="ofrendar.html"${page === "ofrendar" ? ' aria-current="page"' : ""}>${t({ es: "Ofrendar", en: "Give" })}</a>
    </nav>
    <div class="lang" role="group" aria-label="Idioma / Language">
      <button type="button" data-l="es" aria-pressed="${lang === "es"}">ES</button>
      <button type="button" data-l="en" aria-pressed="${lang === "en"}">EN</button>
    </div>
  </div>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<div class="wrap">
    <div>
      <img src="img/logo-blanco.png" alt="Iglesia Vida de Fe · Life of Faith Church" width="158" height="44">
      <p>${t({ es: "Amar a Dios, amar a otros, servir.", en: "Love God, love others, serve." })}</p>
    </div>
    <div>
      <h4>${t({ es: "Visítanos", en: "Visit us" })}</h4>
      <ul>
        <li><a href="${C.maps}" target="_blank" rel="noopener">${C.address}</a></li>
        <li>${t({ es: "Correo postal", en: "Mailing address" })}: ${C.poBox}</li>
        <li><a href="tel:${C.phoneLink}">${C.phone}</a></li>
        <li><a href="#" data-email>${t({ es: "Escríbenos", en: "Email us" })}</a></li>
      </ul>
    </div>
    <div>
      <h4>${t({ es: "Síguenos", en: "Follow us" })}</h4>
      <ul>
        <li><a href="${C.facebook}" target="_blank" rel="noopener">Facebook</a></li>
        <li><a href="${C.youtube}" target="_blank" rel="noopener">YouTube</a></li>
        <li><a href="ofrendar.html">${t({ es: "Ofrendar", en: "Give" })}</a></li>
        <li><a href="ayuda.html">${t({ es: "Petición de oración", en: "Prayer request" })}</a></li>
      </ul>
    </div>
    <p class="legal">© ${new Date().getFullYear()} Iglesia Vida de Fe · Life of Faith Church · Vineland, NJ</p>
  </div>`;
  document.body.append(footer);

  // correo armado en el navegador (menos spam)
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-email]");
    if (!a) return;
    e.preventDefault();
    location.href = "mailto:" + VDF.email();
  });

  // menú móvil
  const btn = header.querySelector(".menu-btn"), nav = header.querySelector(".nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });

  // cambio de idioma
  header.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => {
    const l = b.dataset.l;
    root.dataset.lang = l;
    root.lang = l;
    header.querySelectorAll(".lang button").forEach(x => x.setAttribute("aria-pressed", x.dataset.l === l));
    try { localStorage.setItem("vdf-lang", l); } catch (e) {}
    document.dispatchEvent(new CustomEvent("vdf:lang", { detail: l }));
  }));
  root.lang = lang;

  // revelado al bajar
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
    // por si algo queda sin mostrarse
    setTimeout(() => els.forEach(el => el.classList.add("in")), 4000);
  }

  // indicador "en vivo" durante los horarios de culto (hora de Nueva Jersey)
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = k => parts.find(p => p.type === k).value;
    const day = get("weekday"), mins = (+get("hour") % 24) * 60 + (+get("minute"));
    const live = (day === "Sun" && mins >= 595 && mins <= 750) || (day === "Tue" && mins >= 1135 && mins <= 1210) || (day === "Wed" && mins >= 1135 && mins <= 1240);
    if (live) document.querySelectorAll("[data-live]").forEach(el => el.insertAdjacentHTML("afterbegin", '<span class="live-dot" aria-hidden="true"></span>'));
  } catch (e) {}
})();
