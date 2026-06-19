// TastyBites — shared site script (mobile nav, active link, smooth scroll, back-to-top, footer year)
(function () {
  "use strict";

  var CSS = ''
    + '.nav-toggle{display:none;background:none;border:none;cursor:pointer;padding:8px;margin-left:12px}'
    + '.nav-toggle span{display:block;width:24px;height:3px;background:#f5a623;margin:4px 0;border-radius:2px;transition:.25s}'
    + '.nav-toggle.active span:nth-child(1){transform:translateY(7px) rotate(45deg)}'
    + '.nav-toggle.active span:nth-child(2){opacity:0}'
    + '.nav-toggle.active span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}'
    + '@media(max-width:768px){'
    + '  .nav-toggle{display:block}'
    + '  header nav{position:absolute;top:100%;left:0;right:0;background:#2d1a0e;display:none;flex-direction:column;padding:12px 20px}'
    + '  header nav.open{display:flex}'
    + '  header nav a{margin:8px 0!important}'
    + '}'
    + '.back-to-top{position:fixed;right:20px;bottom:20px;width:46px;height:46px;border:none;border-radius:50%;background:#d4421a;color:#fff;font-size:1.4rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;z-index:200}'
    + '.back-to-top.visible{opacity:1;pointer-events:auto}'
    + '.back-to-top:hover{transform:translateY(-3px);background:#b8350f}';

  document.addEventListener("DOMContentLoaded", function () {
    injectCSS(CSS, "tb-main-css");
    setupMobileNav();
    highlightActiveLink();
    setFooterYear();
    setupSmoothScroll();
    setupBackToTop();
  });

  function injectCSS(css, id) {
    if (document.getElementById(id)) return;
    var s = document.createElement("style"); s.id = id; s.textContent = css;
    document.head.appendChild(s);
  }

  function setupMobileNav() {
    var inner = document.querySelector("header .header-inner");
    var nav = document.querySelector("header nav");
    if (!inner || !nav) return;
    var toggle = document.createElement("button");
    toggle.type = "button"; toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Toggle navigation");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    inner.appendChild(toggle);
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("active", open);
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("active");
      });
    });
  }

  function highlightActiveLink() {
    var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("header nav a").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
      if (href === current) link.classList.add("active");
    });
  }

  function setFooterYear() {
    document.querySelectorAll("footer .footer-copy, footer p").forEach(function (p) {
      p.innerHTML = p.innerHTML.replace(/\b(19|20)\d{2}\b/, new Date().getFullYear());
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length > 1) {
          var t = document.querySelector(id);
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
        }
      });
    });
  }

  function setupBackToTop() {
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Back to top"); btn.innerHTML = "&#8679;";
    document.body.appendChild(btn);
    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 400);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
