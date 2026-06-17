/* ============================================================
   Sadeepa Bandara — Portfolio interactions
   ============================================================ */
(() => {
  "use strict";

  const onReady = (fn) =>
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);

  onReady(() => {
    /* ---- Current year ---- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---- Navbar: scroll state + progress bar ---- */
    const navbar = document.getElementById("navbar");
    const progress = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");

    const onScroll = () => {
      const y = window.scrollY;
      if (navbar) navbar.classList.toggle("scrolled", y > 24);
      if (backToTop) backToTop.classList.toggle("show", y > 600);
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      );
    }

    /* ---- Mobile nav toggle ---- */
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const closeNav = () => {
      navLinks?.classList.remove("open");
      navToggle?.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    };
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        navToggle.classList.toggle("open", open);
        navToggle.setAttribute("aria-expanded", String(open));
      });
      navLinks.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", closeNav)
      );
    }

    /* ---- Scroll reveal ---- */
    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            // stagger items within the same parent
            const siblings = Array.from(
              e.target.parentElement?.querySelectorAll(":scope > .reveal") || []
            );
            const idx = Math.max(0, siblings.indexOf(e.target));
            e.target.style.transitionDelay = Math.min(idx * 80, 320) + "ms";
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("visible"));
    }

    /* ---- Active nav link via scroll spy ---- */
    const sections = document.querySelectorAll("main section[id], #hero");
    const navMap = new Map();
    document.querySelectorAll(".nav-link").forEach((link) => {
      const id = link.getAttribute("href")?.slice(1);
      if (id) navMap.set(id, link);
    });
    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            navMap.forEach((l) => l.classList.remove("active"));
            navMap.get(e.target.id)?.classList.add("active");
          });
        },
        { threshold: 0.5, rootMargin: "-30% 0px -55% 0px" }
      );
      sections.forEach((s) => spy.observe(s));
    }

    /* ---- Animated stat counters ---- */
    const counters = document.querySelectorAll(".stat-num");
    const runCounter = (el) => {
      const target = parseFloat(el.dataset.target || "0");
      const suffix = el.dataset.suffix || "";
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window && counters.length) {
      const cio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            runCounter(e.target);
            obs.unobserve(e.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((c) => cio.observe(c));
    } else {
      counters.forEach((c) => (c.textContent = (c.dataset.target || "") + (c.dataset.suffix || "")));
    }

    /* ---- Hero typing effect ---- */
    const typedEl = document.getElementById("typed");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (typedEl) {
      const phrases = [
        "Senior Full-Stack Engineer",
        "React + TypeScript",
        "GraphQL / Apollo APIs",
        "AWS / Kubernetes",
        "React Native & Android",
      ];
      if (reduceMotion) {
        typedEl.textContent = phrases[0];
      } else {
        let pi = 0,
          ci = 0,
          deleting = false;
        const type = () => {
          const word = phrases[pi];
          ci += deleting ? -1 : 1;
          typedEl.textContent = word.slice(0, ci);
          let delay = deleting ? 45 : 85;
          if (!deleting && ci === word.length) {
            delay = 1600;
            deleting = true;
          } else if (deleting && ci === 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
            delay = 350;
          }
          setTimeout(type, delay);
        };
        setTimeout(type, 600);
      }
    }
  });
})();
