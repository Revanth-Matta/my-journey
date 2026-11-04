document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-navigation");

  const desktopLinks = document.querySelectorAll(".atlas-rail a");
  const mobileLinks = document.querySelectorAll(".mobile-navigation a");
  const sections = document.querySelectorAll("main section[id]");

  const revealItems = document.querySelectorAll(".reveal");
  const territories = document.querySelectorAll(".territory");
  const mistLayers = document.querySelectorAll(".mist-territory");
  const routes = document.querySelectorAll(".water-routes .route");
  const atlasShip = document.querySelector(".atlas-ship");

  const backToTop = document.querySelector(".back-to-top");
  const arrival = document.querySelector("#arrival");
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------
     Theme
  --------------------------------------------- */
  const applyTheme = (theme) => {
    html.setAttribute("data-theme", theme);

    if (!themeToggle) return;

    const isLight = theme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
  };

  applyTheme(
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark"
  );

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  /* ---------------------------------------------
     Mobile navigation
  --------------------------------------------- */
  const closeMenu = (focusToggle = false) => {
    if (!mobileNav || !menuToggle) return;

    mobileNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    if (focusToggle) menuToggle.focus();
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
      );
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        mobileNav.classList.contains("is-open")
      ) {
        closeMenu(true);
      }
    });
  }

  /* ---------------------------------------------
     Active Atlas Rail
  --------------------------------------------- */
  const setActive = (id) => {
    [...desktopLinks, ...mobileLinks].forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${id}`
      );
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------------------------------------------
     Reveal animations
  --------------------------------------------- */
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ---------------------------------------------
     Atlas: mist, preview, reveal, routes, ship
  --------------------------------------------- */
  const territoryMeta = {
    "inklands": {
      route: "[data-route='inklands']",
      ship: { x: "27%", y: "27%" }
    },
    "strategy-isles": {
      route: "[data-route='strategy-isles']",
      ship: { x: "74%", y: "22%" }
    },
    "makers-coast": {
      route: "[data-route='makers-coast']",
      ship: { x: "72%", y: "55%" }
    },
    "curiosity-expanse": {
      route: "[data-route='curiosity-expanse']",
      ship: { x: "34%", y: "63%" }
    },
    "saffron-shores": {
      route: "[data-route='saffron-shores']",
      ship: { x: "72%", y: "79%" }
    },
    "professional-shore": {
      route: "[data-route='professional-shore']",
      ship: { x: "44%", y: "85%" }
    }
  };

  const getMistLayer = (territoryId) => {
    return document.querySelector(`.mist-territory[data-mist="${territoryId}"]`);
  };

  const getRoute = (territoryId) => {
    const meta = territoryMeta[territoryId];
    return meta ? document.querySelector(meta.route) : null;
  };

  const setMistState = (territoryId, state) => {
    const mist = getMistLayer(territoryId);

    if (!mist) return;

    mist.classList.remove("is-covered", "is-previewed", "is-revealed");

    if (state === "covered") {
      mist.classList.add("is-covered");
    } else if (state === "previewed") {
      mist.classList.add("is-previewed");
    } else if (state === "revealed") {
      mist.classList.add("is-revealed");
    }
  };

  const clearAllRoutes = () => {
    routes.forEach((route) => route.classList.remove("is-active"));
  };

  const highlightRoute = (territoryId) => {
    clearAllRoutes();

    const route = getRoute(territoryId);

    if (route) {
      route.classList.add("is-active");
    }
  };

  const moveShip = (territoryId) => {
    if (!atlasShip) return;

    const meta = territoryMeta[territoryId];

    if (!meta) return;

    if (reducedMotion) {
      atlasShip.style.left = "48%";
      atlasShip.style.top = "49%";
      return;
    }

    atlasShip.style.left = meta.ship.x;
    atlasShip.style.top = meta.ship.y;
  };

  const returnShipToArrival = () => {
    if (!atlasShip) return;

    if (reducedMotion) {
      atlasShip.style.left = "48%";
      atlasShip.style.top = "49%";
      return;
    }

    atlasShip.style.left = "48%";
    atlasShip.style.top = "49%";
  };

  const coverTerritory = (territory, focusControl = false) => {
    const territoryId = territory.id;
    const control = territory.querySelector(".territory-control");
    const detail = territory.querySelector(".territory-detail");

    territory.classList.remove("is-revealed");
    territory.classList.remove("is-previewed");

    setMistState(territoryId, "covered");

    if (control) {
      control.setAttribute("aria-expanded", "false");
    }

    if (detail) {
      detail.hidden = true;
    }

    if (focusControl && control) {
      control.focus();
    }
  };

  const coverAllTerritories = () => {
    territories.forEach((territory) => coverTerritory(territory));
    clearAllRoutes();
    returnShipToArrival();
  };

  const previewTerritory = (territory) => {
    if (territory.classList.contains("is-revealed")) return;

    const territoryId = territory.id;

    territory.classList.add("is-previewed");
    setMistState(territoryId, "previewed");
  };

  const clearPreview = (territory) => {
    if (territory.classList.contains("is-revealed")) return;

    const territoryId = territory.id;

    territory.classList.remove("is-previewed");
    setMistState(territoryId, "covered");
  };

  const revealTerritory = (territory) => {
    const territoryId = territory.id;

    territories.forEach((other) => {
      if (other !== territory) {
        coverTerritory(other);
      }
    });

    const control = territory.querySelector(".territory-control");
    const detail = territory.querySelector(".territory-detail");

    territory.classList.add("is-revealed");
    territory.classList.remove("is-previewed");

    setMistState(territoryId, "revealed");

    if (control) {
      control.setAttribute("aria-expanded", "true");
    }

    if (detail) {
      detail.hidden = false;
    }

    highlightRoute(territoryId);
    moveShip(territoryId);
  };

  /* Initialise every territory as covered */
  territories.forEach((territory) => {
    const territoryId = territory.id;
    const control = territory.querySelector(".territory-control");
    const detail = territory.querySelector(".territory-detail");

    setMistState(territoryId, "covered");

    if (control) {
      control.setAttribute("aria-expanded", "false");
    }

    if (detail) {
      detail.hidden = true;
    }

    /* Hover preview */
    territory.addEventListener("mouseenter", () => {
      previewTerritory(territory);
    });

    territory.addEventListener("mouseleave", () => {
      clearPreview(territory);
    });

    /* Keyboard focus preview */
    if (control) {
      control.addEventListener("focus", () => {
        previewTerritory(territory);
      });

      control.addEventListener("blur", () => {
        clearPreview(territory);
      });

      /* Click / Enter / Space */
      control.addEventListener("click", () => {
        if (territory.classList.contains("is-revealed")) {
          coverTerritory(territory);
          clearAllRoutes();
          returnShipToArrival();
        } else {
          revealTerritory(territory);
        }
      });
    }

    /* Escape covers active territory */
    territory.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        territory.classList.contains("is-revealed")
      ) {
        coverTerritory(territory, true);
        clearAllRoutes();
        returnShipToArrival();
      }
    });
  });

  /* Clicking outside the Atlas covers all territories */
  document.addEventListener("click", (event) => {
    const clickedInsideAtlas = event.target.closest(".atlas-world");

    if (!clickedInsideAtlas) {
      coverAllTerritories();
    }
  });

  /* ---------------------------------------------
     Back to top
  --------------------------------------------- */
  if (backToTop && arrival) {
    const topObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          backToTop.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    topObserver.observe(arrival);

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }
});
