/*
 * testimonials-wall.js - the testimonial frames on the Home page (English and Spanish).
 * Comments live in data/testimonials.json. Each comment is saved in the language it was written in,
 * and the connector (Cloudflare Worker) adds the translation:
 *   comment / reply            the original text
 *   comment_en, comment_es     the comment in each language
 *   reply_en, reply_es         Miguel's reply in each language
 * The page shows the version in its own language, or the original if a translation is missing.
 */
(function () {
  const ES = (document.documentElement.lang || "").startsWith("es");
  const L = ES ? "es" : "en";
  const T = ES ? {
    prev: "Negocio anterior", ea: "Cliente de El Austral Consultant",
    served: "Atendido en", empty: "Sea el primero en dejar un testimonio.",
    read: "Leer el testimonio completo de ", translated: "(traducido del inglés)"
  } : {
    prev: "Previous business", ea: "El Austral Consultant customer",
    served: "Served", empty: "Be the first to leave a testimonial.",
    read: "Read the full testimonial from ", translated: "(translated from Spanish)"
  };

  const wall = document.getElementById("wall");
  const modalBg = document.getElementById("modalBg");
  if (!wall || !modalBg) return;
  let lastFocus = null;

  // the text in this page's language, or the original when there is no translation yet
  function text(t, field) {
    return (t[field + "_" + L] || t[field] || "").trim();
  }
  function isTranslated(t) {
    return (t.lang || "en") !== L && !!t["comment_" + L];
  }
  function shortText(s, max = 140) {
    return s.length > max ? s.slice(0, max).trimEnd() + "…" : s;
  }
  function signature(t) {
    const who = t.source === "el-austral" ? T.ea : T.prev;
    return `${t.first_name} ${t.last_initial}. — ${T.served} ${t.service_year} · ${who}`;
  }

  function render(list) {
    wall.innerHTML = "";
    if (!list.length) {
      wall.outerHTML = '<p class="t-empty">' + T.empty + "</p>";
      return;
    }
    list.sort((a, b) => (b.submitted || "").localeCompare(a.submitted || ""));
    for (const t of list) {
      const btn = document.createElement("button");
      btn.className = "frame";
      btn.setAttribute("aria-label", T.read + t.first_name);
      const q = document.createElement("div");
      q.className = "frame-quote";
      q.textContent = "“" + shortText(text(t, "comment")) + "”";
      const n = document.createElement("div");
      n.className = "frame-name";
      n.textContent = signature(t);
      btn.append(q, n);
      btn.addEventListener("click", () => openModal(t, btn));
      wall.appendChild(btn);
    }
  }

  function openModal(t, from) {
    lastFocus = from;
    document.getElementById("modalComment").textContent = "“" + text(t, "comment") + "”";
    document.getElementById("modalName").textContent =
      signature(t) + (isTranslated(t) ? "  " + T.translated : "");
    const reply = document.getElementById("modalReply");
    const r = text(t, "reply");
    if (r) {
      document.getElementById("modalReplyText").textContent = r;
      reply.hidden = false;
    } else {
      reply.hidden = true;
    }
    modalBg.classList.add("open");
    document.getElementById("modalClose").focus();
  }
  function closeModal() {
    modalBg.classList.remove("open");
    if (lastFocus) lastFocus.focus();
  }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modalBg.addEventListener("click", e => { if (e.target === modalBg) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  fetch("data/testimonials.json?v=" + Date.now())
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(render)
    .catch(() => render([]));
})();
