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
  const backToTop = document.querySelector(".back-to-top");
  const arrival = document.querySelector("#arrival");
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* Theme */
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

  /* Mobile navigation */
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
      if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMenu(true);
      }
    });
  }

  /* Active Atlas Rail */
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

  /* Reveal animations */
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

  /* Territory disclosure */
  territories.forEach((territory) => {
    const revealButton = territory.querySelector(".reveal-control");
    const coverButton = territory.querySelector(".cover-control");
    const detail = territory.querySelector(".territory-detail");

    if (!revealButton || !detail) return;

    const reveal = () => {
      territory.classList.add("is-revealed");
      detail.hidden = false;
      revealButton.setAttribute("aria-expanded", "true");

      if (coverButton) {
        coverButton.setAttribute("aria-expanded", "true");
      }
    };

    const cover = () => {
      territory.classList.remove("is-revealed");
      detail.hidden = true;
      revealButton.setAttribute("aria-expanded", "false");

      if (coverButton) {
        coverButton.setAttribute("aria-expanded", "false");
      }

      revealButton.focus();
    };

    revealButton.addEventListener("click", reveal);

    if (coverButton) {
      coverButton.addEventListener("click", cover);
    }

    territory.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && territory.classList.contains("is-revealed")) {
        cover();
      }
    });
  });

  /* Back to top */
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
