/* Formularios. Todos llegan al correo de la iglesia; el asunto indica a quién va dirigido. */
(function () {
  const t = VDF.t, C = VDF_CONFIG;
  const contact = [
    { n: "nombre", l: { es: "Nombre", en: "Name" }, type: "text", req: true, auto: "name" },
    { n: "telefono", l: { es: "Teléfono", en: "Phone" }, type: "tel", auto: "tel" },
    { n: "email", l: { es: "Correo electrónico", en: "Email" }, type: "email", auto: "email" }
  ];
  const FORMS = [
    { id: "oracion", title: { es: "Petición de oración", en: "Prayer request" }, small: { es: "Oramos contigo", en: "We pray with you" },
      verse: { es: "Por nada estéis afanosos; antes bien, en todo, mediante oración y súplica con acción de gracias, sean dadas a conocer vuestras peticiones delante de Dios.", en: "Be anxious for nothing, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.", ref: { es: "Filipenses 4:6", en: "Philippians 4:6" } },
      route: { n: "para", l: { es: "¿Quién recibe tu petición?", en: "Who should receive your request?" }, opts: [["Damas", { es: "Mujer", en: "Woman" }], ["Hombres", { es: "Hombre", en: "Man" }], ["Jóvenes", { es: "Joven", en: "Youth" }], ["Ancianos", { es: "Pastor y ancianos", en: "Pastor and elders" }]] },
      subject: v => `[Oración · ${v.para || "General"}] Petición de oración`,
      fields: [...contact.map((f, i) => i ? f : { ...f, req: false, l: { es: "Nombre (opcional)", en: "Name (optional)" } }),
        { n: "mensaje", l: { es: "¿Cómo podemos orar por ti?", en: "How can we pray for you?" }, type: "textarea", req: true },
        { n: "compartir", l: { es: "Se puede compartir con la congregación", en: "It may be shared with the congregation" }, type: "checkbox" }] },
    { id: "visita", title: { es: "Visita o conversación", en: "Visit or conversation" }, small: { es: "Ancianos, líderes, hogares", en: "Elders, leaders, homes" },
      verse: { es: "Llevad los unos las cargas de los otros, y cumplid así la ley de Cristo.", en: "Bear one another's burdens, and thereby fulfill the law of Christ.", ref: { es: "Gálatas 6:2", en: "Galatians 6:2" } },
      route: { n: "tipo", l: { es: "¿Qué necesitas?", en: "What do you need?" }, opts: [["Ancianos", { es: "Hablar con un anciano", en: "Talk with an elder" }], ["Líder", { es: "Hablar con un líder", en: "Talk with a leader" }], ["Hogares", { es: "Visita al hogar", en: "Home visit" }], ["Diáconos", { es: "Visita por enfermedad", en: "Visit for illness" }]] },
      subject: v => `[${v.tipo || "Ancianos"}] Solicitud de visita o conversación`,
      fields: [...contact, { n: "direccion", l: { es: "Dirección (si pides una visita)", en: "Address (if requesting a visit)" }, type: "text", auto: "street-address" }, { n: "mensaje", l: { es: "Cuéntanos brevemente", en: "Tell us briefly" }, type: "textarea", req: true }] },
    { id: "necesidad", title: { es: "Necesidad", en: "Need" }, small: { es: "Amor en Acción", en: "Love in Action" },
      verse: { es: "Hijos, no amemos de palabra ni de lengua, sino de hecho y en verdad.", en: "Little children, let us not love with word or with tongue, but in deed and truth.", ref: { es: "1 Juan 3:18", en: "1 John 3:18" } },
      notice: { es: "Toda solicitud es evaluada por el ministerio Amor en Acción conforme a los criterios de la iglesia. Enviar este formulario no garantiza la ayuda; nos comunicaremos contigo.", en: "Every request is reviewed by the Love in Action ministry according to the church's criteria. Sending this form does not guarantee assistance; we will contact you." },
      route: { n: "tipo", l: { es: "Tipo de necesidad", en: "Type of need" }, opts: [["Comida", { es: "Comida", en: "Food" }], ["Tarjeta de compra", { es: "Tarjeta de compra", en: "Grocery card" }], ["Servicios", { es: "Luz, agua u otro servicio", en: "Utilities" }], ["Otra", { es: "Otra", en: "Other" }]] },
      subject: v => `[Amor en Acción] Solicitud de ayuda · ${v.tipo || ""}`,
      fields: [...contact.map(f => f.n === "telefono" ? { ...f, req: true } : f), { n: "mensaje", l: { es: "Describe tu situación", en: "Describe your situation" }, type: "textarea", req: true }] },
    { id: "misiones", title: { es: "Misiones", en: "Missions" }, small: { es: "Para iglesias y misiones", en: "For churches and missions" },
      verse: { es: "¿Cómo, pues, invocarán a Aquel en quien no han creído? ¿Y cómo creerán en Aquel de quien no han oído? ¿Y cómo oirán sin haber quien les predique?", en: "How then will they call on Him in whom they have not believed? How will they believe in Him whom they have not heard? And how will they hear without a preacher?", ref: { es: "Romanos 10:14", en: "Romans 10:14" } },
      notice: { es: "Las solicitudes de misiones las evalúa la Junta de Ancianos.", en: "Mission requests are reviewed by the Board of Elders." },
      subject: () => "[Ancianos] Solicitud de misiones",
      fields: [...contact, { n: "iglesia", l: { es: "Iglesia o misión", en: "Church or mission" }, type: "text", req: true }, { n: "lugar", l: { es: "Lugar", en: "Location" }, type: "text" }, { n: "mensaje", l: { es: "Describe la misión y la necesidad", en: "Describe the mission and the need" }, type: "textarea", req: true }] },
    { id: "conocer", title: { es: "Conocer la iglesia", en: "Get to know us" }, small: { es: "Primera visita", en: "First visit" },
      subject: () => "[Conocer la iglesia] Persona interesada",
      fields: [...contact, { n: "mensaje", l: { es: "¿Algo que quieras contarnos?", en: "Anything you'd like to tell us?" }, type: "textarea" }] },
    { id: "membresia", title: { es: "Clase de membresía", en: "Membership class" }, small: { es: "Ser miembro", en: "Become a member" },
      subject: () => "[Membresía] Información sobre la clase de membresía",
      fields: [...contact, { n: "mensaje", l: { es: "Comentarios (opcional)", en: "Comments (optional)" }, type: "textarea" }] },
    { id: "bautismo", title: { es: "Clase de bautismo", en: "Baptism class" }, small: { es: "Bautizarme", en: "Be baptized" },
      subject: () => "[Bautismo] Información sobre la clase de bautismo",
      fields: [...contact, { n: "mensaje", l: { es: "Comentarios (opcional)", en: "Comments (optional)" }, type: "textarea" }] }
  ];

  const nav = document.getElementById("fnav"), box = document.getElementById("fbox");
  nav.innerHTML = FORMS.map(f => `<button type="button" role="tab" data-f="${f.id}">${t(f.title)}<small>${t(f.small)}</small></button>`).join("");

  function field(f, fid) {
    const id = `${fid}-${f.n}`;
    if (f.type === "checkbox") return `<label class="choice" style="display:flex;gap:10px;align-items:center;font-weight:600"><input type="checkbox" id="${id}" name="${f.n}" value="sí"> ${t(f.l)}</label>`;
    const req = f.req ? " required" : "";
    const input = f.type === "textarea" ? `<textarea id="${id}" name="${f.n}"${req}></textarea>` : `<input id="${id}" name="${f.n}" type="${f.type}"${f.auto ? ` autocomplete="${f.auto}"` : ""}${req}>`;
    return `<div class="field"><label for="${id}">${t(f.l)}${f.req ? " *" : ""}</label>${input}</div>`;
  }

  function render(id) {
    const f = FORMS.find(x => x.id === id) || FORMS[0];
    nav.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b.dataset.f === f.id));
    const [c1, c2, c3, ...rest] = f.fields;
    box.innerHTML = `<form class="vdf" novalidate data-id="${f.id}">
      <h2>${t(f.title)}</h2>
      ${f.verse ? `<blockquote class="verse" style="font-size:22px">“${t({ es: f.verse.es, en: f.verse.en })}”<cite>${t(f.verse.ref)}</cite></blockquote>` : ""}
      ${f.notice ? `<p class="notice">${t(f.notice)}</p>` : ""}
      ${f.route ? `<fieldset class="field"><legend>${t(f.route.l)}</legend><div class="choice">${f.route.opts.map((o, i) => `<label><input type="radio" name="${f.route.n}" value="${o[0]}"${i === 0 ? " checked" : ""}> ${t(o[1])}</label>`).join("")}</div></fieldset>` : ""}
      ${field(c1, f.id)}
      <div class="row2">${field(c2, f.id)}${field(c3, f.id)}</div>
      ${rest.map(x => field(x, f.id)).join("")}
      <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="position:absolute;left:-5000px" aria-hidden="true">
      <div class="btn-row"><button class="btn wood" type="submit">${t({ es: "Enviar", en: "Send" })}</button></div>
      <div class="status" aria-live="polite"></div>
    </form>`;
    const form = box.querySelector("form");
    form.addEventListener("submit", e => submit(e, f));
  }

  function submit(e, f) {
    e.preventDefault();
    const form = e.target, status = form.querySelector(".status"), en = VDF.lang() === "en";
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    if (fd.get("_gotcha")) return;
    fd.delete("_gotcha");
    const v = Object.fromEntries(fd.entries());
    if (!v.email && !v.telefono && f.id !== "oracion") {
      status.innerHTML = `<p class="notice">${en ? "Please include a phone number or email so we can contact you." : "Incluye un teléfono o correo para poder comunicarnos contigo."}</p>`;
      return;
    }
    const subject = f.subject(v);
    const body = Object.entries(v).map(([k, x]) => `${k}: ${x}`).join("\n");
    if (C.formEndpoint) {
      const btn = form.querySelector("[type=submit]"); btn.disabled = true;
      fetch(C.formEndpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ _subject: subject, formulario: f.title.es, ...v }) })
        .then(r => { if (!r.ok) throw 0; form.innerHTML = `<div class="ok"><b>${en ? "Thank you! We received your message." : "¡Gracias! Recibimos tu mensaje."}</b><br>${en ? "Someone from the church will contact you." : "Alguien de la iglesia se comunicará contigo."}</div>`; })
        .catch(() => { btn.disabled = false; status.innerHTML = `<p class="notice">${en ? "It could not be sent. Please call us at " : "No se pudo enviar. Llámanos al "}${C.phone}.</p>`; });
    } else {
      location.href = `mailto:${VDF.email()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.innerHTML = `<p class="notice">${en ? "Your email app should open with the message ready. If it doesn't, call us at " : "Se abrirá tu aplicación de correo con el mensaje listo. Si no se abre, llámanos al "}${C.phone}.</p>`;
    }
  }

  nav.addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) { history.replaceState(null, "", "#" + b.dataset.f); render(b.dataset.f); } });
  window.addEventListener("hashchange", () => render(location.hash.slice(1)));
  render(location.hash.slice(1) || "oracion");
})();
