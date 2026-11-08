/* austral-theme.js - small helpers for the new site header (phone menu + Our Solutions menu) */
document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".ea-header");
  if (!header) return;
  var menuBtn = header.querySelector(".ea-menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  header.querySelectorAll(".ea-drop > button").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var drop = btn.parentElement;
      var open = drop.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    header.querySelectorAll(".ea-drop.open").forEach(function (d) {
      if (!d.contains(e.target)) d.classList.remove("open");
    });
  });
  // On the Services page, picking another service from the menu opens it right away
  if (document.getElementById("service-choice")) {
    window.addEventListener("hashchange", function () { location.reload(); });
  }
});
