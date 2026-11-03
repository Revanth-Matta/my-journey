/* =========================================
   Revanth’s Journey — Modern Journey
   Interaction layer
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const EMAIL_ADDRESS = "revanthkm13@gmail.com";

  const themeToggle = document.querySelector("[data-theme-toggle]");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNavigation = document.querySelector(".mobile-navigation");

  const desktopNavLinks = document.querySelectorAll(".journey-rail a");
  const mobileNavLinks = document.querySelectorAll(".mobile-navigation a");
  const sections = document.querySelectorAll("main section[id]");

  const revealElements = document.querySelectorAll(".reveal");
  const backToTop = document.querySelector(".back-to-top");
  const arrivalSection = document.querySelector("#arrival");

  const routeTimeline = document.querySelector("[data-route-timeline]");
  const milestones = document.querySelectorAll("[data-milestone]");
  const timelineViewport = document.querySelector(".timeline-viewport");
  const timelinePrev = document.querySelector("[data-timeline-prev]");
  const timelineNext = document.querySelector("[data-timeline-next]");
  const timelinePause = document.querySelector("[data-timeline-pause]");
  const routeOrb = document.querySelector(".route-orb");

  const routeButtons = document.querySelectorAll("[data-route]");
  const routeDialog = document.querySelector("#route-dialog");
  const routeSpace = document.querySelector("#route-space");
  const routeContent = document.querySelector("#route-content");
  const routeClose = document.querySelector(".route-close");
  const routeReturn = document.querySelector("[data-route-return]");

  const visitorCount = document.querySelector("#visitor-count");
  const yearElement = document.querySelector("#year");

  /* -----------------------------------------
     Current year
  ----------------------------------------- */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------
     Theme
  ----------------------------------------- */

  const applyTheme = (theme) => {
    html.setAttribute("data-theme", theme);

    if (!themeToggle) {
      return;
    }

    const isLight = theme === "light";

    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
  };

  const systemPrefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;

  applyTheme(systemPrefersLight ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      applyTheme(currentTheme === "light" ? "dark" : "light");
    });
  }

  /* -----------------------------------------
     Mobile navigation
  ----------------------------------------- */

  const closeMobileNavigation = (returnFocus = false) => {
    if (!mobileNavigation || !menuToggle) {
      return;
    }

    mobileNavigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    if (returnFocus) {
      menuToggle.focus();
    }
  };

  if (menuToggle && mobileNavigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNavigation.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileNavigation();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        mobileNavigation.classList.contains("is-open")
      ) {
        closeMobileNavigation(true);
      }
    });
  }

  /* -----------------------------------------
     Active Journey Rail
  ----------------------------------------- */

  const setActiveSection = (sectionId) => {
    const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];

    allNavLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);
    });
  };

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* -----------------------------------------
     Scroll reveal
  ----------------------------------------- */

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
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
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* -----------------------------------------
     Route Timeline
  ----------------------------------------- */

  let activeMilestoneIndex = 0;
  let timelinePaused = prefersReducedMotion;
  let timelineTimer = null;

  const activateMilestone = (index, scrollIntoView = true) => {
    if (milestones.length === 0) {
      return;
    }

    activeMilestoneIndex = (index + milestones.length) % milestones.length;

    milestones.forEach((milestone, milestoneIndex) => {
      milestone.classList.toggle(
        "is-active",
        milestoneIndex === activeMilestoneIndex
      );
    });

    if (scrollIntoView && timelineViewport) {
      const activeMilestone = milestones[activeMilestoneIndex];
      const viewportWidth = timelineViewport.clientWidth;
      const milestoneLeft = activeMilestone.offsetLeft;
      const milestoneWidth = activeMilestone.offsetWidth;

      timelineViewport.scrollTo({
        left:
          milestoneLeft -
          viewportWidth / 2 +
          milestoneWidth / 2,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    }
  };

  const stopTimeline = () => {
    if (timelineTimer) {
      clearInterval(timelineTimer);
      timelineTimer = null;
    }
  };

  const startTimeline = () => {
    if (prefersReducedMotion || timelinePaused || milestones.length === 0) {
      return;
    }

    stopTimeline();

    timelineTimer = setInterval(() => {
      activateMilestone(activeMilestoneIndex + 1);
    }, 4200);
  };

  const updatePauseButton = () => {
    if (!timelinePause) {
      return;
    }

    timelinePause.setAttribute("aria-pressed", String(timelinePaused));
    timelinePause.setAttribute(
      "aria-label",
      timelinePaused ? "Play journey animation" : "Pause journey animation"
    );

    timelinePause.innerHTML = timelinePaused
      ? '<span aria-hidden="true">▶</span>'
      : '<span aria-hidden="true">❚❚</span>';
  };

  const pauseTimeline = () => {
    timelinePaused = true;
    updatePauseButton();
    stopTimeline();

    if (routeOrb) {
      routeOrb.style.animationPlayState = "paused";
    }
  };

  const playTimeline = () => {
    timelinePaused = false;
    updatePauseButton();
    startTimeline();

    if (routeOrb) {
      routeOrb.style.animationPlayState = "running";
    }
  };

  if (routeOrb) {
    routeOrb.style.animationPlayState = timelinePaused
      ? "paused"
      : "running";
  }

  if (milestones.length > 0) {
    activateMilestone(0, false);
    updatePauseButton();

    if (!prefersReducedMotion) {
      startTimeline();
    }

    if (timelinePrev) {
      timelinePrev.addEventListener("click", () => {
        pauseTimeline();
        activateMilestone(activeMilestoneIndex - 1);
      });
    }

    if (timelineNext) {
      timelineNext.addEventListener("click", () => {
        pauseTimeline();
        activateMilestone(activeMilestoneIndex + 1);
      });
    }

    if (timelinePause) {
      timelinePause.addEventListener("click", () => {
        if (timelinePaused) {
          playTimeline();
        } else {
          pauseTimeline();
        }
      });
    }

    milestones.forEach((milestone, index) => {
      milestone.addEventListener("mouseenter", () => {
        pauseTimeline();
        activateMilestone(index);
      });

      milestone.addEventListener("focusin", () => {
        pauseTimeline();
        activateMilestone(index);
      });

      milestone.addEventListener("click", () => {
        pauseTimeline();
        activateMilestone(index);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (!routeTimeline || !routeTimeline.contains(document.activeElement)) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        pauseTimeline();
        activateMilestone(activeMilestoneIndex + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        pauseTimeline();
        activateMilestone(activeMilestoneIndex - 1);
      }
    });
  }

  /* -----------------------------------------
     Route spaces
  ----------------------------------------- */

  const routeData = {
    "reading-writing": {
      title: "Reading & Writing",
      status: "Drafting",
      intro:
        "A route shaped by stories, imagination, and the possibilities hidden inside them.",
      theme: "reading",
      blocks: [
        {
          heading: "Currently Reading",
          html: `
            <p>
              Web novels across fantasy, progression, adventure, fiction,
              fanfiction, and character-driven stories.
            </p>
            <p>
              In fanfiction, I especially enjoy exploring overlooked
              potential—characters, scenes, plots, and “what if” moments
              where one different decision changes the entire direction of
              a story.
            </p>
          `
        },
        {
          heading: "Genres I Enjoy",
          html: `
            <ul>
              <li>Fantasy</li>
              <li>Adventure</li>
              <li>Action</li>
              <li>Slice of Life</li>
              <li>Comedy</li>
              <li>Progression</li>
              <li>Cultivation</li>
              <li>System-based stories</li>
              <li>Immersive world-building</li>
              <li>Reincarnation</li>
              <li>Transmigration</li>
              <li>Rebirth</li>
            </ul>
          `
        },
        {
          heading: "Original Novel",
          html: `
            <p>
              An original web novel is currently in the drafting stage.
              Once preparation is complete, I plan to publish it under a
              pen name.
            </p>
            <ul>
              <li><strong>Status:</strong> Drafting</li>
              <li><strong>Chapters:</strong> In progress</li>
              <li><strong>World-building:</strong> Developing</li>
              <li><strong>Publishing:</strong> Planned</li>
              <li><strong>Platform:</strong> To be finalized</li>
              <li><strong>Pen name:</strong> Will be updated soon</li>
            </ul>
          `
        },
        {
          heading: "Future Route Plans",
          html: `
            <ul>
              <li>Continue drafting the story.</li>
              <li>Develop the world, characters, and plot.</li>
              <li>Explore publishing when the novel is ready.</li>
              <li>Share further updates on this route.</li>
            </ul>
          `
        }
      ],
      cta: {
        label: "Stay on This Route",
        href: `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
          "Reading & Writing Route"
        )}`
      }
    },

    "games-strategy": {
      title: "Games & Strategy",
      status: "Active",
      intro:
        "A route built around strategy, immersive worlds, steady improvement, and knowing when to adapt.",
      theme: "games",
      blocks: [
        {
          heading: "Games I Enjoy",
          html: `
            <ul>
              <li>Strategy</li>
              <li>Role-playing</li>
              <li>Survival</li>
              <li>Simulation</li>
              <li>Action &amp; adventure</li>
              <li>Sandbox</li>
              <li>Open-world</li>
            </ul>
          `
        },
        {
          heading: "Games I’ve Played",
          html: `
            <ul>
              <li>Clash of Clans</li>
              <li>Online chess</li>
              <li>Call of Duty</li>
              <li>BGMI</li>
              <li>Dr. Driving</li>
              <li>Need for Speed</li>
              <li>GTA</li>
              <li>Free Fire</li>
              <li>SimCity</li>
              <li>Subway Surfers</li>
              <li>Temple Run</li>
              <li>Candy Crush</li>
              <li>Gardenscapes</li>
              <li>Idle simulators</li>
              <li>LifeAfter</li>
              <li>Minecraft</li>
            </ul>
            <p>
              Along with other strategy, construction, racing, shooting,
              simulation, survival, action, and adventure games—both
              single-player and multiplayer.
            </p>
          `
        },
        {
          heading: "Memorable Games",
          html: `
            <ul>
              <li>
                <strong>Subway Surfers &amp; Temple Run:</strong>
                My first endless-runner experiences on a phone I bought
                with my own money.
              </li>
              <li>
                <strong>Candy Crush:</strong>
                I wanted to reach the end—then discovered the levels never
                really end.
              </li>
              <li>
                <strong>SimCity &amp; Minecraft:</strong>
                Building from a basic start while managing growing demands.
              </li>
              <li>
                <strong>Dr. Driving:</strong>
                A lesson in patience, control, and the reality of driving.
              </li>
              <li>
                <strong>Need for Speed:</strong>
                Speed, control, and the thrill of the road.
              </li>
              <li>
                <strong>BGMI, Free Fire, Call of Duty &amp; LifeAfter:</strong>
                Different ways to experience intense action.
              </li>
              <li>
                <strong>Idle simulators:</strong>
                My go-to choice when I simply want to pass time.
              </li>
            </ul>
          `
        },
        {
          heading: "Currently Playing",
          html: `
            <p>
              <strong>Game of Thrones: Kings Road</strong><br>
              On an aggressive path to become a top player.
            </p>
          `
        },
        {
          heading: "My Game Style",
          html: `
            <p>
              I enjoy planning, adapting, improving step by step, and finding
              smart ways to handle challenges.
            </p>
            <p>
              And when everything fails, I turn to my ultimate hidden weapons:
              YouTube tutorials, spoilers, and cheats—then start grinding again.
            </p>
          `
        },
        {
          heading: "Future Route Plans",
          html: `
            <ul>
              <li>Exploring simple game development.</li>
              <li>Exploring interactive design.</li>
              <li>
                Open to esports opportunities when the right opportunity arises.
              </li>
            </ul>
          `
        }
      ],
      cta: {
        label: "Follow This Route",
        href: `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
          "Games & Strategy Route"
        )}`
      }
    },

    "design-products": {
      title: "Design & Digital Products",
      status: "Building",
      intro:
        "A route for creating, experimenting, and turning small ideas into useful experiences.",
      theme: "design",
      blocks: [
        {
          heading: "What I Enjoy Creating",
          html: `
            <ul>
              <li>Graphics</li>
              <li>Simple digital tools</li>
              <li>Personal interfaces</li>
              <li>Visual concepts</li>
              <li>Portfolio experiments</li>
            </ul>
          `
        },
        {
          heading: "Tools I Explore",
          html: `
            <ul>
              <li>Canva and free design tools</li>
              <li>AI-assisted workflows</li>
              <li>Simple offline-friendly tools</li>
            </ul>
          `
        },
        {
          heading: "Current Experiments",
          html: `
            <ul>
              <li><strong>Resume Template Builder</strong> — Built</li>
              <li><strong>Job Fit Tracker</strong> — Built</li>
              <li><strong>Message Builder</strong> — Built</li>
              <li><strong>Personal Portfolio</strong> — In progress</li>
              <li><strong>Future digital product</strong> — Exploring</li>
            </ul>
          `
        },
        {
          heading: "Ideas & Dreams",
          html: `
            <p>
              To keep exploring useful digital products, improve my design
              skills, and eventually share tools that help people organize,
              plan, and create.
            </p>
          `
        },
        {
          heading: "Future Route Plans",
          html: `
            <ul>
              <li>Learn more about design systems and product thinking.</li>
              <li>Turn small ideas into useful digital experiences.</li>
              <li>Share selected experiments and tools over time.</li>
            </ul>
          `
        }
      ],
      cta: {
        label: "View Experiments",
        href: `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
          "Design & Digital Products"
        )}`
      }
    },

    "learning-exploration": {
      title: "Learning & Exploration",
      status: "Learning",
      intro:
        "A route for learning, exploring, and improving through practice.",
      theme: "learning",
      blocks: [
        {
          heading: "Currently Learning",
          html: `
            <p>Data analysis and practical analytical skills.</p>
          `
        },
        {
          heading: "Areas of Interest",
          html: `
            <ul>
              <li>Data analysis</li>
              <li>Digital marketing</li>
              <li>AI tools</li>
              <li>Personal productivity</li>
              <li>Design systems</li>
              <li>Game development</li>
            </ul>
          `
        },
        {
          heading: "Learning Approach",
          html: `
            <ul>
              <li>Learn by exploring.</li>
              <li>Build small things.</li>
              <li>Improve through practice.</li>
            </ul>
          `
        },
        {
          heading: "Future Route Plans",
          html: `
            <ul>
              <li>Complete the Data Analyst certification.</li>
              <li>Apply analytical thinking to personal projects.</li>
              <li>
                Keep exploring how technology can simplify everyday work.
              </li>
            </ul>
          `
        }
      ],
      cta: {
        label: "View Learning Notes",
        href: `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
          "Learning & Exploration"
        )}`
      }
    },

    "food-curiosity": {
      title: "Food & Curiosity",
      status: "Exploring",
      intro:
        "A vegetarian route through flavors, cuisines, and food experiences worth exploring.",
      theme: "food",
      blocks: [
        {
          heading: "What I Enjoy",
          html: `
            <p>
              Exploring vegetarian flavors, cuisines, and new food experiences.
            </p>
          `
        },
        {
          heading: "Cuisines I Want to Explore",
          html: `
            <p>
              A growing list of regional and international cuisines.
            </p>
          `
        },
        {
          heading: "Food Experiences",
          html: `
            <p>
              To be added as I explore more places and dishes.
            </p>
          `
        },
        {
          heading: "Future Route Plans",
          html: `
            <ul>
              <li>Explore new cuisines gradually.</li>
              <li>Document the experiences that stand out.</li>
              <li>Build a personal food map over time.</li>
            </ul>
          `
        }
      ],
      cta: {
        label: "Follow This Route",
        href: `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(
          "Food & Curiosity Route"
        )}`
      }
    }
  };

  let activeRouteTrigger = null;

  const openRoute = (routeId, trigger) => {
    const route = routeData[routeId];

    if (!route || !routeDialog || !routeContent) {
      return;
    }

    activeRouteTrigger = trigger || null;

    routeSpace.className = `route-space route-${route.theme}`;
    routeSpace.setAttribute("data-route-theme", route.theme);

    const blocks = route.blocks
      .map(
        (block) => `
          <section class="route-block">
            <h3>${block.heading}</h3>
            ${block.html}
          </section>
        `
      )
      .join("");

    routeContent.innerHTML = `
      <span class="route-status-badge">${route.status}</span>
      <h2 id="route-title">${route.title}</h2>
      <p class="route-intro">${route.intro}</p>
      ${blocks}
      <div class="route-cta">
        <a class="btn btn-primary" href="${route.cta.href}">
          ${route.cta.label}
        </a>
      </div>
    `;

    routeDialog.showModal();
    routeSpace.scrollTop = 0;
  };

  const closeRoute = () => {
    if (!routeDialog || !routeDialog.open) {
      return;
    }

    routeDialog.close();

    if (activeRouteTrigger) {
      activeRouteTrigger.focus();
      activeRouteTrigger = null;
    }
  };

  routeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openRoute(button.dataset.route, button);
    });
  });

  if (routeClose) {
    routeClose.addEventListener("click", closeRoute);
  }

  if (routeReturn) {
    routeReturn.addEventListener("click", closeRoute);
  }

  if (routeDialog) {
    routeDialog.addEventListener("close", () => {
      if (activeRouteTrigger) {
        activeRouteTrigger.focus();
        activeRouteTrigger = null;
      }
    });

    routeDialog.addEventListener("click", (event) => {
      const area = routeDialog.getBoundingClientRect();

      const clickedOutside =
        event.clientX < area.left ||
        event.clientX > area.right ||
        event.clientY < area.top ||
        event.clientY > area.bottom;

      if (clickedOutside) {
        closeRoute();
      }
    });
  }

  /* -----------------------------------------
     Back to top
  ----------------------------------------- */

  if (backToTop && arrivalSection) {
    const topObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          backToTop.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      {
        threshold: 0.2
      }
    );

    topObserver.observe(arrivalSection);

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  /* -----------------------------------------
     Visitor counter
  ----------------------------------------- */

  if (visitorCount) {
    const counterEndpoint =
      "https://api.counterapi.dev/v1/my-journey-revanth/up";

    const setCounter = (value) => {
      visitorCount.textContent = Number(value).toLocaleString("en-US");
    };

    const animateCounter = (target) => {
      if (prefersReducedMotion) {
        setCounter(target);
        return;
      }

      const duration = 1200;
      const startTime = performance.now();
      const startValue = Math.max(0, target - 20);

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(
          startValue + (target - startValue) * eased
        );

        setCounter(value);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    fetch(counterEndpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Counter request failed");
        }

        return response.json();
      })
      .then((data) => {
        const count =
          data.count ??
          data.value ??
          data.data?.count ??
          data.data?.value ??
          0;

        animateCounter(Number(count));
      })
      .catch(() => {
        visitorCount.textContent = "—";
      });
  }
});
