// TastyBites — unique flavour: tagline rotator, fact ticker, crave list,
// menu search, daily special, scroll-reveal, visit counter, greeting toast.
(function () {
  "use strict";

  var T = {
    cart: "Crave List",
    fav: "Add to Crave List",
    faved: "On your Crave List",
    special: "Sizzle of the Day",
    greetings: ["Hey there, Bun Buddy!", "Welcome back, Frank Fan!", "Howdy, Dog Devotee!", "Good to see you, Sauce Seeker!"],
    taglines: [
      "Gourmet hotdogs crafted with premium ingredients and served with passion",
      "Where every bite tells a story.",
      "Hand-crafted. Flame-kissed. Bun-hugged.",
      "Big flavour. Bigger smiles.",
      "From grill to thrill in 90 seconds."
    ],
    facts: [
      "Fun fact: South Africans eat over 12 million boerie-style sausages a year.",
      "Did you know? The word \"hotdog\" was first printed in 1894.",
      "Tip: Toasting the bun for 30 seconds doubles the crunch.",
      "Pro move: Mustard before ketchup keeps the bun crisp.",
      "Heads up: Our chipotle sauce is slow-smoked for 6 hours."
    ]
  };

  var CSS = ''
    + '.fact-ticker{background:#f5a623;color:#2d1a0e;text-align:center;padding:8px 16px;font-size:.9rem;font-weight:600;position:relative;z-index:99}'
    + '.fact-ticker span{transition:opacity .3s ease}'
    + '.crave-chip{display:inline-flex;align-items:center;gap:6px;margin-left:20px;background:#d4421a;color:#fff!important;padding:6px 14px;border-radius:20px;font-size:.85rem;font-weight:700;text-decoration:none;cursor:pointer}'
    + '.crave-chip:hover{background:#b8350f}'
    + '.crave-count{background:#fff;color:#d4421a;border-radius:10px;padding:0 8px;font-size:.8rem;min-width:20px;text-align:center}'
    + '.product-card{transition:transform .2s,box-shadow .2s}'
    + '.product-card:hover{transform:translateY(-4px);box-shadow:0 6px 20px rgba(0,0,0,.1)}'
    + '.crave-btn{display:block;width:100%;margin-top:12px;background:#fff8f0;color:#d4421a;border:1.5px solid #d4421a;padding:8px;border-radius:8px;font-family:"Nunito",sans-serif;font-weight:700;cursor:pointer;font-size:.9rem;transition:.2s}'
    + '.crave-btn:hover{background:#d4421a;color:#fff}'
    + '.crave-btn.active{background:#d4421a;color:#fff}'
    + '.daily-ribbon{position:absolute;top:16px;left:16px;background:linear-gradient(135deg,#d4421a,#ff6b3d);color:#fff;font-size:.7rem;font-weight:700;padding:5px 12px;border-radius:20px;box-shadow:0 2px 8px rgba(212,66,26,.4);text-transform:uppercase;letter-spacing:.5px;z-index:2}'
    + '.menu-search{max-width:500px;margin:0 auto 32px;text-align:center}'
    + '.menu-search input{width:100%;padding:12px 18px;border:1.5px solid #e8ddd4;border-radius:24px;font-family:"Nunito",sans-serif;font-size:1rem;background:#fff;outline:none;transition:border-color .2s}'
    + '.menu-search input:focus{border-color:#d4421a}'
    + '.menu-search-hint{color:#7a6455;font-size:.85rem;margin-top:8px;min-height:1.2em}'
    + '.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s,transform .6s}'
    + '.reveal.revealed{opacity:1;transform:none}'
    + '.flash-msg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#2d1a0e;color:#fff;padding:10px 18px;border-radius:8px;font-weight:700;font-size:.9rem;z-index:3;animation:flashIn .25s ease}'
    + '@keyframes flashIn{from{opacity:0;transform:translate(-50%,-40%)}to{opacity:1;transform:translate(-50%,-50%)}}'
    + '.tasty-toast{position:fixed;bottom:24px;left:50%;transform:translate(-50%,80px);background:#2d1a0e;color:#fff;padding:14px 24px;border-radius:30px;font-weight:700;box-shadow:0 6px 20px rgba(0,0,0,.3);opacity:0;transition:.4s;z-index:1000;font-size:.95rem}'
    + '.tasty-toast.show{transform:translate(-50%,0);opacity:1}'
    + '.visit-note{text-align:center;font-size:.85rem;opacity:.6;margin-top:12px;width:100%}';

  document.addEventListener("DOMContentLoaded", function () {
    injectCSS(CSS, "tb-extras-css");
    rotateTagline();
    injectFactTicker();
    setupScrollReveal();
    setupCraveList();
    setupProductSearch();
    markDailySpecial();
    setupVisitCounter();
    setupGreeting();
  });

  function injectCSS(css, id) {
    if (document.getElementById(id)) return;
    var s = document.createElement("style"); s.id = id; s.textContent = css;
    document.head.appendChild(s);
  }

  function rotateTagline() {
    var el = document.querySelector(".hero .centered p") || document.querySelector(".hero p");
    if (!el) return;
    el.style.transition = "opacity .35s ease";
    var i = 0, list = T.taglines;
    setInterval(function () {
      i = (i + 1) % list.length;
      el.style.opacity = "0";
      setTimeout(function () { el.textContent = list[i]; el.style.opacity = "0.9"; }, 350);
    }, 4500);
  }

  function injectFactTicker() {
    var bar = document.createElement("div");
    bar.className = "fact-ticker";
    var span = document.createElement("span");
    span.textContent = pick(T.facts);
    bar.appendChild(span);
    document.body.insertBefore(bar, document.body.firstChild);
    setInterval(function () {
      span.style.opacity = "0";
      setTimeout(function () { span.textContent = pick(T.facts); span.style.opacity = "1"; }, 300);
    }, 6000);
  }

  function setupScrollReveal() {
    var els = document.querySelectorAll(".card,.product-card,.location-card,.timeline-item,.section-title");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("revealed"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("revealed"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }

  function setupCraveList() {
    var KEY = "tastybites_crave_list";
    var list = JSON.parse(localStorage.getItem(KEY) || "[]");
    var inner = document.querySelector("header .header-inner");
    var chip = null;
    if (inner) {
      chip = document.createElement("a");
      chip.href = "#"; chip.className = "crave-chip";
      chip.innerHTML = '&#10084;&#65039; <span>' + T.cart + '</span> <span class="crave-count">0</span>';
      inner.appendChild(chip);
      chip.addEventListener("click", function (e) {
        e.preventDefault();
        if (!list.length) { alert("Your Crave List is empty! Visit our menu and tap \"Add to Crave List\" on your favourites."); return; }
        alert("Your Crave List:\n\n• " + list.join("\n• "));
      });
    }
    function refresh() {
      if (chip) chip.querySelector(".crave-count").textContent = list.length;
      document.querySelectorAll(".product-card").forEach(function (card) {
        var name = nameOf(card);
        var btn = card.querySelector(".crave-btn");
        if (btn) {
          var on = list.indexOf(name) !== -1;
          btn.classList.toggle("active", on);
          btn.textContent = on ? "♥ " + T.faved : "♡ " + T.fav;
        }
      });
    }
    document.querySelectorAll(".product-card").forEach(function (card) {
      if (card.querySelector(".crave-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "crave-btn";
      card.appendChild(btn);
      btn.addEventListener("click", function () {
        var name = nameOf(card); if (!name) return;
        var idx = list.indexOf(name);
        if (idx === -1) { list.push(name); flash(card, "Added to " + T.cart + "!"); }
        else { list.splice(idx, 1); }
        localStorage.setItem(KEY, JSON.stringify(list));
        refresh();
      });
    });
    refresh();
  }

  function nameOf(card) { var h = card.querySelector("h3"); return h ? h.textContent.trim() : ""; }

  function setupProductSearch() {
    var cards = document.querySelectorAll(".product-card");
    if (cards.length < 2) return;
    var subtitle = document.querySelector(".section-subtitle");
    var wrap = document.createElement("div");
    wrap.className = "menu-search";
    wrap.innerHTML = '<input type="search" placeholder="Search the menu — e.g. cheese, vegan, spicy"><p class="menu-search-hint" aria-live="polite"></p>';
    if (subtitle && subtitle.parentElement) subtitle.parentElement.insertBefore(wrap, subtitle.nextSibling);
    else cards[0].parentElement.parentElement.insertBefore(wrap, cards[0].parentElement);
    var input = wrap.querySelector("input");
    var hint = wrap.querySelector(".menu-search-hint");
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase(); var shown = 0;
      cards.forEach(function (c) {
        var match = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.style.display = match ? "" : "none";
        if (match) shown++;
      });
      hint.textContent = q ? shown + " tasty match" + (shown === 1 ? "" : "es") + " for \"" + q + "\"" : "";
    });
  }

  function markDailySpecial() {
    var cards = document.querySelectorAll(".product-card");
    if (!cards.length) return;
    var day = Math.floor(Date.now() / 86400000) % cards.length;
    var ribbon = document.createElement("span");
    ribbon.className = "daily-ribbon"; ribbon.textContent = T.special;
    cards[day].appendChild(ribbon);
  }

  function setupVisitCounter() {
    var KEY = "tastybites_visits";
    var n = parseInt(localStorage.getItem(KEY) || "0", 10) + 1;
    localStorage.setItem(KEY, n);
    var footer = document.querySelector("footer .footer-copy");
    if (footer) {
      var p = document.createElement("p");
      p.className = "visit-note";
      p.textContent = "You've stopped by " + n + " time" + (n === 1 ? "" : "s") + ". Thanks for the love!";
      footer.parentElement.appendChild(p);
    }
  }

  function setupGreeting() {
    var toast = document.createElement("div");
    toast.className = "tasty-toast";
    toast.textContent = pick(T.greetings);
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add("show"); });
    setTimeout(function () { toast.classList.remove("show"); }, 3500);
    setTimeout(function () { toast.remove(); }, 4200);
  }

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function flash(card, text) {
    var old = card.querySelector(".flash-msg"); if (old) old.remove();
    var m = document.createElement("span"); m.className = "flash-msg"; m.textContent = text;
    card.appendChild(m);
    setTimeout(function () { m.remove(); }, 1500);
  }
})();
