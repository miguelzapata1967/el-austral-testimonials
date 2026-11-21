/*
 * El Austral Consultant - testimonials connector (Cloudflare Worker)
 * ------------------------------------------------------------------
 * POST  (from the Contact Us form, English or Spanish)
 *       Saves the testimonial into data/testimonials.json on GitHub, in the language it was written in,
 *       plus its translation (English <-> Spanish), so both versions of the site show it.
 * GET   /translate?key=YOUR_KEY
 *       Fills in any translation still missing (for example a reply Miguel just typed on GitHub in one
 *       language). Open that address once in the browser after replying.
 *
 * Settings (Worker > Settings > Variables and Secrets):
 *   GITHUB_TOKEN    Secret: fine-grained token, Contents: Read and write, only this repository
 *   GITHUB_REPO     miguelzapata1967/el-austral-testimonials
 *   GITHUB_BRANCH   main
 *   FILE_PATH       data/testimonials.json
 *   ALLOWED_ORIGIN  https://www.elaustralconsultant.com  (more than one: separate them with commas)
 *   TRANSLATE_KEY   Secret: any word you choose, for the /translate address
 * Binding (Worker > Settings > Bindings > Add > Workers AI):  variable name  AI
 *   Without it, testimonials are still saved; they just show in their own language on both sites.
 */

const ALWAYS_ALLOWED = [
  "https://www.elaustralconsultant.com",
  "https://elaustralconsultant.com",
  "https://miguelzapata1967.github.io",
];
const MODEL = "@cf/meta/m2m100-1.2b";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = ALWAYS_ALLOWED.concat(
      (env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim().replace(/\/$/, "")).filter(Boolean));
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    const reply = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    try {
      // ---- fill in missing translations (Miguel's replies)
      if (request.method === "GET" && url.pathname === "/translate") {
        if (!env.TRANSLATE_KEY || url.searchParams.get("key") !== env.TRANSLATE_KEY) {
          return reply({ ok: false, error: "wrong key" }, 403);
        }
        const done = await updateFile(env, async list => fillTranslations(env, list),
                                      "Testimonials: translations filled in");
        return reply({ ok: true, translated: done });
      }

      if (request.method !== "POST") return reply({ ok: true, info: "El Austral testimonials connector" });
      if (!allowed.includes(origin)) return reply({ ok: false, error: "origin not allowed" }, 403);

      const d = await request.json();
      if (d.website) return reply({ ok: true });                       // hidden field filled: a robot
      const clean = (v, max) => String(v || "").replace(/\s+$/g, "").slice(0, max);
      const first = clean(d.first_name, 40).trim();
      const last = clean(d.last_name, 40).trim();
      const year = clean(d.service_year, 4).trim();
      const comment = clean(d.comment, 3000).trim();
      if (!first || !last || !/^\d{4}$/.test(year) || comment.length < 5) {
        return reply({ ok: false, error: "missing fields" }, 400);
      }
      const lang = d.lang === "es" ? "es" : "en";
      const other = lang === "es" ? "en" : "es";
      const entry = {
        id: "t-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6),
        first_name: first,
        last_initial: last[0].toUpperCase(),
        service_year: year,
        source: d.source === "el-austral" ? "el-austral" : "previous",
        lang,
        comment,
        ["comment_" + lang]: comment,
        ["comment_" + other]: (await translate(env, comment, lang, other)) || "",
        submitted: new Date().toISOString().slice(0, 10),
        reply: "",
      };
      await updateFile(env, async list => { list.push(entry); return 1; }, `New testimonial: ${first} ${entry.last_initial}.`);
      return reply({ ok: true });
    } catch (e) {
      return reply({ ok: false, error: String(e && e.message || e) }, 500);
    }
  },
};

// ------------------------------------------------------------------ translation
async function translate(env, text, from, to) {
  if (!env.AI || !text) return null;
  try {
    // one paragraph at a time, so line breaks are kept and long comments aren't cut off
    const parts = text.split(/\n/);
    const out = [];
    for (const p of parts) {
      if (!p.trim()) { out.push(p); continue; }
      const r = await env.AI.run(MODEL, { text: p, source_lang: from, target_lang: to });
      const t = r && r.translated_text;
      if (!t || t.startsWith("ERROR")) return null;
      out.push(t);
    }
    return out.join("\n");
  } catch (e) {
    return null;
  }
}

async function fillTranslations(env, list) {
  let n = 0;
  for (const t of list) {
    const lang = t.lang || "en";
    const other = lang === "es" ? "en" : "es";
    t.lang = lang;
    if (t.comment && !t["comment_" + lang]) t["comment_" + lang] = t.comment;
    if (t.comment && !t["comment_" + other]) {
      const x = await translate(env, t.comment, lang, other);
      if (x) { t["comment_" + other] = x; n++; }
    }
    // Miguel's reply: typed in "reply" (or in reply_en / reply_es); fill in the other language
    const rLang = t.reply_es && !t.reply_en ? "es" : t.reply_en && !t.reply_es ? "en" : (t.reply ? lang : null);
    if (rLang) {
      const rOther = rLang === "es" ? "en" : "es";
      const src = t["reply_" + rLang] || t.reply;
      if (!t["reply_" + rLang]) t["reply_" + rLang] = src;
      if (!t["reply_" + rOther]) {
        const x = await translate(env, src, rLang, rOther);
        if (x) { t["reply_" + rOther] = x; n++; }
      }
    }
  }
  return n;
}

// ------------------------------------------------------------------ GitHub file
async function updateFile(env, change, message) {
  const api = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${env.FILE_PATH}`;
  const branch = env.GITHUB_BRANCH || "main";
  const headers = {
    "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
    "Accept": "application/vnd.github+json",
    "User-Agent": "el-austral-testimonials",
  };
  for (let attempt = 0; attempt < 4; attempt++) {
    const g = await fetch(`${api}?ref=${branch}`, { headers });
    let list = [], sha;
    if (g.status === 200) {
      const j = await g.json();
      sha = j.sha;
      const bytes = Uint8Array.from(atob(j.content.replace(/\n/g, "")), c => c.charCodeAt(0));
      list = JSON.parse(new TextDecoder().decode(bytes) || "[]");
    } else if (g.status !== 404) {
      throw new Error("GitHub read failed: " + g.status);
    }
    const result = await change(list);
    const text = JSON.stringify(list, null, 2) + "\n";
    const enc = new TextEncoder().encode(text);
    let bin = "";
    for (let i = 0; i < enc.length; i += 8192) bin += String.fromCharCode(...enc.subarray(i, i + 8192));
    const b64 = btoa(bin);
    const p = await fetch(api, {
      method: "PUT", headers,
      body: JSON.stringify({ message, content: b64, branch, ...(sha ? { sha } : {}) }),
    });
    if (p.ok) return result;
    if (p.status !== 409 && p.status !== 422) throw new Error("GitHub save failed: " + p.status);
    await new Promise(r => setTimeout(r, 400 * (attempt + 1)));      // someone saved at the same moment
  }
  throw new Error("GitHub busy, try again");
}
