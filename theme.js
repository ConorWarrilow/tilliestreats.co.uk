/* Tillie's Treats — progressive enhancement
   - mobile navigation
   - gallery lightbox
   - dynamic footer year */
(function () {
  "use strict";

  /* ---- Mobile navigation ------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (navToggle && nav) {
    var setNav = function (open) {
      nav.setAttribute("data-open", String(open));
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    setNav(false);
    navToggle.addEventListener("click", function () {
      setNav(nav.getAttribute("data-open") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
  }

  /* ---- Gallery lightbox ------------------------------------------- */
  var gallery = document.querySelector(".gallery");
  var lightbox = document.querySelector(".lightbox");
  if (gallery && lightbox && typeof lightbox.showModal === "function") {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector(".lightbox__caption");
    var lastFocused = null;

    gallery.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var img = btn.querySelector("img");
      if (!img) return;
      lastFocused = btn;
      lbImg.src = img.getAttribute("data-full") || img.src;
      lbImg.alt = img.alt;
      if (lbCaption) lbCaption.textContent = img.alt;
      lightbox.showModal();
    });

    var closeLb = function () { if (lightbox.open) lightbox.close(); };
    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLb);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLb();
    });
    lightbox.addEventListener("close", function () {
      lbImg.removeAttribute("src");
      if (lastFocused) lastFocused.focus();
    });
  }

  /* ---- Services image parallax ------------------------------------ */
  var parallaxSections = document.querySelectorAll("[data-parallax]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (parallaxSections.length && !reduceMotion.matches) {
    var parallaxTicking = false;
    var updateParallax = function () {
      var viewportCenter = window.innerHeight / 2;
      parallaxSections.forEach(function (section) {
        var bounds = section.getBoundingClientRect();
        var sectionCenter = bounds.top + (bounds.height / 2);
        var distance = (sectionCenter - viewportCenter) / (window.innerHeight + bounds.height);
        section.style.setProperty("--parallax-x", String(distance * -81) + "px");
        section.style.setProperty("--parallax-y", String(distance * 81) + "px");
      });
      parallaxTicking = false;
    };
    var requestParallaxUpdate = function () {
      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    };
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
    updateParallax();
  }

  /* ---- Footer year ---------------------------------------------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
