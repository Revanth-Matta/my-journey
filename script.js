/* ==========================================================================
   Revanth’s Journey — script.js
   Vanilla JavaScript: arrival sequence, continuous twilight world,
   navigation, map route, route spaces, reveals, visitor counter,
   and accessibility behavior.
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const header = document.querySelector(".site-header");
  const pageThread = document.querySelector(".page-thread span");
  const hero = document.querySelector(".hero");
  const welcomeNote = document.getElementById("welcome-note");
  const world = document.querySelector(".world");
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

  const visitedKey = "revanthJourneyVisited";

  let activeRoute = null;
  let arrivalFinished = false;

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

  const clamp = (value, minimum, maximum) =>
    Math.min(Math.max(value, minimum), maximum);

  const mixColor = (from, to, progress) => {
    const mixed = from.map((channel, index) =>
      Math.round(channel + ((to[index] - channel) * progress))
    );

    return `rgb(${mixed[0]} ${mixed[1]} ${mixed[2]})`;
  };

  const rgbToValues = (rgb) =>
    rgb.replace("rgb(", "").replace(")", "");

  /* ------------------------------------------------------------------------
     Continuous twilight world
     ------------------------------------------------------------------------ */

  const worldMoods = [
    {
      top: [16, 26, 38],
      middle: [22, 35, 47],
      bottom: [29, 43, 54],
      glow: [255, 166, 58],
      glowOpacity: .48,
      glowPosition: "24% 88%",
      mist: [241, 230, 204],
      mistOpacity: .3,
      stars: .42,
      cloud: [241, 230, 204],
      cloudOpacity: .14
    },
    {
      top: [12, 22, 32],
      middle: [17, 29, 39],
      bottom: [22, 35, 44],
      glow: [94, 158, 148],
      glowOpacity: .32,
      glowPosition: "40% 90%",
      mist: [226, 236, 232],
      mistOpacity: .4,
      stars: .5,
      cloud: [226, 236, 232],
      cloudOpacity: .17
    },
    {
      top: [13, 22, 38],
      middle: [21, 32, 52],
      bottom: [27, 39, 58],
      glow: [122, 146, 220],
      glowOpacity: .34,
      glowPosition: "62% 86%",
      mist: [222, 231, 246],
      mistOpacity: .26,
      stars: .8,
      cloud: [222, 231, 246],
      cloudOpacity: .12
    },
    {
      top: [10, 18, 34],
      middle: [17, 28, 50],
      bottom: [24, 36, 58],
      glow: [154, 174, 240],
      glowOpacity: .36,
      glowPosition: "50% 82%",
      mist: [216, 228, 248],
      mistOpacity: .2,
      stars: 1,
      cloud: [216, 228, 248],
      cloudOpacity: .11
    },
    {
      top: [20, 24, 36],
      middle: [36, 34, 40],
      bottom: [54, 44, 40],
      glow: [255, 176, 82],
      glowOpacity: .48,
      glowPosition: "72% 88%",
      mist: [248, 234, 205],
      mistOpacity: .28,
      stars: .56,
      cloud: [248, 234, 205],
      cloudOpacity: .14
    },
    {
      top: [30, 25, 28],
      middle: [58, 40, 31],
      bottom: [82, 53, 32],
      glow: [255, 176, 70],
      glowOpacity: .58,
      glowPosition: "50% 92%",
      mist: [255, 236, 200],
      mistOpacity: .32,
      stars: .38,
      cloud: [255, 236, 200],
      cloudOpacity: .16
    },
    {
      top: [12, 20, 31],
      middle: [19, 30, 43],
      bottom: [26, 38, 50],
      glow: [255, 190, 100],
      glowOpacity: .4,
      glowPosition: "78% 86%",
      mist: [235, 233, 216],
      mistOpacity: .26,
      stars: .66,
      cloud: [235, 233, 216],
      cloudOpacity: .12
    }
  ];

  let currentMoodProgress = -1;
  let worldScrollPending = false;

  const applyWorldMood = (progress) => {
    if (!world) return;

    const scaled = clamp(progress, 0, 1) * (worldMoods.length - 1);
    const index = Math.floor(scaled);
    const nextIndex = Math.min(index + 1, worldMoods.length - 1);
    const localProgress = scaled - index;

    const from = worldMoods[index];
    const to = worldMoods[nextIndex];
    const rootStyle = document.documentElement.style;

    rootStyle.setProperty("--world-top", mixColor(from.top, to.top, localProgress));
    rootStyle.setProperty("--world-middle", mixColor(from.middle, to.middle, localProgress));
    rootStyle.setProperty("--world-bottom", mixColor(from.bottom, to.bottom, localProgress));

    const glowColor = rgbToValues(mixColor(from.glow, to.glow, localProgress));
    const glowOpacity = from.glowOpacity + ((to.glowOpacity - from.glowOpacity) * localProgress);
    const mistColor = rgbToValues(mixColor(from.mist, to.mist, localProgress));
    const mistOpacity = from.mistOpacity + ((to.mistOpacity - from.mistOpacity) * localProgress);
    const cloudColor = rgbToValues(mixColor(from.cloud, to.cloud, localProgress));
    const cloudOpacity = from.cloudOpacity + ((to.cloudOpacity - from.cloudOpacity) * localProgress);
    const stars = from.stars + ((to.stars - from.stars) * localProgress);

    rootStyle.setProperty("--world-glow", `rgba(${glowColor}, ${glowOpacity.toFixed(3)})`);
    rootStyle.setProperty("--world-glow-position", localProgress > .5 ? to.glowPosition : from.glowPosition);
    rootStyle.setProperty("--world-mist", `rgba(${mistColor}, ${mistOpacity.toFixed(3)})`);
    rootStyle.setProperty("--world-cloud", `rgba(${cloudColor}, ${cloudOpacity.toFixed(3)})`);
    rootStyle.setProperty("--world-stars", stars.toFixed(3));
  };

  const updateWorldMood = () => {
    if (!world || worldScrollPending) return;

    worldScrollPending = true;

    window.requestAnimationFrame(() => {
      worldScrollPending = false;

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = scrollable > 0
        ? clamp(window.pageYOffset / scrollable, 0, 1)
        : 0;

      if (Math.abs(progress - currentMoodProgress) < .002) return;

      currentMoodProgress = progress;
      applyWorldMood(progress);
    });
  };

  const initWorld = () => {
    if (prefersReducedMotion) {
      currentMoodProgress = 0;
      applyWorldMood(0);
      return;
    }

    updateWorldMood();
    window.addEventListener("scroll", updateWorldMood, { passive: true });
    window.addEventListener("resize", updateWorldMood, { passive: true });
  };

  /* ------------------------------------------------------------------------
     Arrival sequence
     ------------------------------------------------------------------------ */

  const markVisitAsCompleted = () => {
    try {
      window.localStorage.setItem(visitedKey, "true");
    } catch (error) {
      /* Storage unavailable; the arrival can still complete. */
    }
  };

  const revealCamp = () => {
    if (arrivalFinished) return;
    arrivalFinished = true;

    hero?.classList.remove("is-arriving");
    hero?.classList.remove("is-returning");
    hero?.classList.add("is-lit");
    hero?.removeEventListener("click", handleArrivalClick);

    markVisitAsCompleted();
  };

  const handleArrivalClick = () => {
    revealCamp();
  };

  const startFirstVisitArrival = () => {
    if (!hero) {
      markVisitAsCompleted();
      arrivalFinished = true;
      return;
    }

    hero.classList.add("is-arriving");
    hero.addEventListener("click", handleArrivalClick);

    window.setTimeout(revealCamp, prefersReducedMotion ? 1400 : 10000);
  };

  const startReturningVisitArrival = () => {
    if (!hero) {
      arrivalFinished = true;
      showWelcomeBack();
      return;
    }

    hero.classList.add("is-returning");
    arrivalFinished = true;

    window.setTimeout(() => {
      hero.classList.remove("is-returning");
      hero.classList.add("is-lit");
      showWelcomeBack();
    }, prefersReducedMotion ? 500 : 1600);
  };

  const showWelcomeBack = () => {
    if (!welcomeNote) return;

    welcomeNote.hidden = false;

    window.requestAnimationFrame(() => {
      welcomeNote.classList.add("is-visible");
    });

    window.setTimeout(() => {
      welcomeNote.classList.add("is-leaving");
      welcomeNote.classList.remove("is-visible");

      window.setTimeout(() => {
        welcomeNote.hidden = true;
        welcomeNote.classList.remove("is-leaving");
      }, prefersReducedMotion ? 0 : 750);
    }, prefersReducedMotion ? 1200 : 3000);
  };

  const initArrival = () => {
    window.scrollTo(0, 0);

    let hasVisitedBefore = false;

    try {
      hasVisitedBefore =
        window.localStorage.getItem(visitedKey) === "true";
    } catch (error) {
      hasVisitedBefore = false;
    }

    if (hasVisitedBefore) {
      startReturningVisitArrival();
      return;
    }

    startFirstVisitArrival();
  };

  /* ------------------------------------------------------------------------
     Scroll progress thread
     ------------------------------------------------------------------------ */

  const updateScrollThread = () => {
    if (!pageThread) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0
      ? clamp(window.pageYOffset / scrollable, 0, 1)
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
      updateWorldMood();

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
    initArrival();
    initWorld();
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