/*
 * app-link.js - connects the website to the El Austral app (sign-up, payment, clean-up, reports)
 * ONE setting below: where the app lives.
 *   Demo (now): the app runs on Miguel's computer -> http://localhost:8501 (works only on that computer)
 *   Later:      put the app's online address here, upload this file again, and every button follows.
 * Any link with data-app="signup" opens the app's Sign Up / Sign in page;
 * data-app="home" opens the app's main page (customers type their customer ID there).
 */
window.EA_APP_URL = "https://el-austral-demo.streamlit.app";   // online (was http://localhost:8501, only on Miguel's computer)

document.addEventListener("DOMContentLoaded", () => {
  const base = window.EA_APP_URL.replace(/\/$/, "");
  document.querySelectorAll("[data-app]").forEach((a) => {
    const es = (document.documentElement.lang || "").startsWith("es");   // Spanish pages open the app in Spanish
    a.href = (a.dataset.app === "signup" ? base + "/?page=signup" : base + "/") + (es ? (a.dataset.app === "signup" ? "&" : "?") + "lang=es" : "");
  });
});
