/* ==========================================================================
   Revanth’s Journey — script.js
   Vanilla JavaScript: navigation, map route, route spaces, reveals,
   visitor counter, and accessibility behavior.
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const header = document.querySelector(".site-header");
  const pageThread = document.querySelector(".page-thread span");
  const mapBoard = document.getElementById("map-board");
  const mapSection = document.getElementById("journey-map");
  const routeStage = document.querySelector(".route-stage");
  const routePanels = Array.from(document.querySelectorAll(".route-panel"));
  const signpostButtons = Array.from(document.querySelectorAll(".signpost"));
  const routeCardLinks = Array.from(document.querySelectorAll("[data-route].route-card"));
  const threadSvg = document.querySelector(".thread");
  const threadDrawn = document.querySelector(".thread__drawn");
  const threadTrail = document.querySelector(".thread__trail");
  const threadHalo = document.querySelector(".thread__halo");

  const routeOrder = [
    "inklands",
    "strategy-isles",
    "curiosity-expanse",
    "makers-coast",
    "saffron-shores"
  ];

  let activeRoute = null;

  /* ------------------------------------------------------------------------
     Utilities
     ------------------------------------------------------------------------ */

  const getRoutePanel = (route) =>
    document.getElementById(`route-${route}`);

  const getSignpostButton = (route) =>
    document.querySelector(`.signpost[data-route="${route}"]`);

  const smoothScrollTo = (target, offset = 0) => {
    if (!target) return;

    const top =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      (header ? header.offsetHeight : 0) -
      offset;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  /* ------------------------------------------------------------------------
     Scroll progress thread
     ------------------------------------------------------------------------ */

  const updateScrollThread = () => {
    if (!pageThread) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0
      ? Math.min(Math.max(window.pageYOffset / scrollable, 0), 1)
      : 0;

    pageThread.style.width = `${progress * 100}%`;
  };

  /* ------------------------------------------------------------------------
     Reveal animations
     ------------------------------------------------------------------------ */

  const initReveals = () => {
    const revealTargets = document.querySelectorAll(".reveal, [data-reveal-group]");

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      revealTargets.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealTargets.forEach((item) => revealObserver.observe(item));
  };

  /* ------------------------------------------------------------------------
     Journey-map route thread
     ------------------------------------------------------------------------ */

  const buildRouteThread = () => {
    if (!mapBoard || !threadSvg || !threadDrawn) return;
    if (window.getComputedStyle(threadSvg).display === "none") return;

    const boardRect = mapBoard.getBoundingClientRect();
    const width = boardRect.width;
    const height = boardRect.height;

    if (width <= 0 || height <= 0) return;

    threadSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    threadSvg.setAttribute("preserveAspectRatio", "none");

    const points = routeOrder
      .map((route) => {
        const button = getSignpostButton(route);
        if (!button) return null;

        const buttonRect = button.getBoundingClientRect();

        return {
          x: buttonRect.left - boardRect.left + buttonRect.width / 2,
          y: buttonRect.top - boardRect.top + buttonRect.height / 2
        };
      })
      .filter(Boolean);

    if (points.length < 2) return;

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i += 1) {
      const previous = points[i - 1];
      const current = points[i];
      const midX = (previous.x + current.x) / 2;

      path += ` C ${midX} ${previous.y}, ${midX} ${current.y}, ${current.x} ${current.y}`;
    }

    [threadDrawn, threadTrail, threadHalo].forEach((pathElement) => {
      if (pathElement) pathElement.setAttribute("d", path);
    });

    const length = threadDrawn.getTotalLength();

    threadDrawn.style.setProperty("--thread-length", length);
    threadDrawn.style.strokeDasharray = `${length}`;
    threadDrawn.style.strokeDashoffset = prefersReducedMotion ? "0" : `${length}`;
  };

  const drawThreadProgress = (route) => {
    if (!threadDrawn || !threadSvg) return;
    if (window.getComputedStyle(threadSvg).display === "none") return;

    const routeIndex = routeOrder.indexOf(route);
    const totalLength = threadDrawn.getTotalLength();

    if (routeIndex < 0) {
      threadSvg.classList.remove("is-drawn");
      threadDrawn.style.strokeDashoffset = prefersReducedMotion
        ? "0"
        : `${totalLength}`;
      return;
    }

    const targetProgress = (routeIndex + 1) / routeOrder.length;
    const targetLength = totalLength * targetProgress;

    threadSvg.classList.add("is-drawn");
    threadDrawn.style.strokeDashoffset = `${totalLength - targetLength}`;
  };

  const initThreadOnScroll = () => {
    if (!mapSection || !threadDrawn) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      threadSvg?.classList.add("is-drawn");
      threadDrawn.style.strokeDashoffset = "0";
      return;
    }

    const threadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          buildRouteThread();
          threadSvg?.classList.add("is-drawn");
          threadDrawn.style.strokeDashoffset = "0";
          threadObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    threadObserver.observe(mapSection);
  };

  /* ------------------------------------------------------------------------
     Route spaces
     ------------------------------------------------------------------------ */

  const closeAllPanels = () => {
    routePanels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove("is-open");
    });

    signpostButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });

    activeRoute = null;
    routeStage?.classList.remove("has-active");
    mapBoard?.classList.remove("is-lit");
    drawThreadProgress(null);
  };

  const openRoute = (route, options = {}) => {
    const panel = getRoutePanel(route);
    const button = getSignpostButton(route);

    if (!panel) return;

    const shouldToggleOff =
      activeRoute === route && options.toggle !== false;

    if (shouldToggleOff) {
      closeAllPanels();
      return;
    }

    closeAllPanels();

    panel.hidden = false;

    if (!prefersReducedMotion) {
      panel.classList.add("is-open");
    }

    button?.setAttribute("aria-expanded", "true");

    activeRoute = route;
    routeStage?.classList.add("has-active");
    mapBoard?.classList.add("is-lit");
    drawThreadProgress(route);

    if (options.focusTitle !== false) {
      const title = panel.querySelector("h3");
      window.requestAnimationFrame(() => {
        title?.focus({ preventScroll: true });
      });
    }

    if (options.scroll !== false) {
      window.requestAnimationFrame(() => {
        smoothScrollTo(panel, 18);
      });
    }
  };

  const initRouteControls = () => {
    signpostButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openRoute(button.dataset.route, {
          toggle: true,
          scroll: false
        });
      });
    });

    routeCardLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        openRoute(link.dataset.route, {
          toggle: false,
          scroll: true
        });
      });
    });

    document.querySelectorAll("[data-close]").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = button.closest(".route-panel");
        const route = panel?.dataset.route;
        const signpost = route ? getSignpostButton(route) : null;

        closeAllPanels();

        if (signpost) {
          signpost.focus({ preventScroll: true });
        }
      });
    });

    document.querySelectorAll("[data-next]").forEach((button) => {
      button.addEventListener("click", () => {
        openRoute(button.dataset.next, {
          toggle: false,
          scroll: true
        });
      });
    });

    const viewExperimentsButton = document.querySelector("[data-open-projects]");
    const experiments = document.getElementById("makers-experiments");

    viewExperimentsButton?.addEventListener("click", () => {
      experiments?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      window.requestAnimationFrame(() => {
        experiments?.focus({ preventScroll: true });
      });
    });
  };

  /* ------------------------------------------------------------------------
     Visitor counter
     ------------------------------------------------------------------------ */

  const initVisitorCounter = () => {
    const counter = document.getElementById("visitor-count");
    if (!counter) return;

    const storageKey = "revanths-journey-visits";
    let visits = 1;

    try {
      const stored = window.localStorage.getItem(storageKey);
      visits = stored ? Number.parseInt(stored, 10) || 0 : 0;
      visits += 1;
      window.localStorage.setItem(storageKey, String(visits));
    } catch (error) {
      visits = 1;
    }

    counter.textContent = visits.toLocaleString();
  };

  /* ------------------------------------------------------------------------
     Resize handling
     ------------------------------------------------------------------------ */

  let resizeTimer = null;

  const handleResize = () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
      buildRouteThread();

      if (activeRoute) {
        drawThreadProgress(activeRoute);
      } else if (prefersReducedMotion) {
        threadDrawn.style.strokeDashoffset = "0";
      }
    }, 160);
  };

  /* ------------------------------------------------------------------------
     Initialize
     ------------------------------------------------------------------------ */

  const init = () => {
    updateScrollThread();
    buildRouteThread();
    initReveals();
    initThreadOnScroll();
    initRouteControls();
    initVisitorCounter();

    window.addEventListener("scroll", updateScrollThread, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();