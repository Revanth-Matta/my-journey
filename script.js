/* =========================================
   My Journey — Revanth Kumar Matta
   Final Trial 1 interactions
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  const navLinks = document.querySelectorAll(".primary-nav a");

  const backToTop = document.querySelector(".back-to-top");
  const arrivalSection = document.querySelector("#arrival");

  const resumeDoor = document.querySelector(".resume-door");
  const resumeFooterLink = document.querySelector(".resume-footer-link");

  const routeDialog = document.querySelector("#route-dialog");
  const routeSpace = document.querySelector("#route-space");
  const routeContent = document.querySelector("#route-content");
  const routeClose = document.querySelector(".route-close");
  const routeCards = document.querySelectorAll(".route-card");

  const coreGrid = document.querySelector("#core-grid");
  const coreCards = document.querySelectorAll(".core-card");

  const visitorCount = document.querySelector("#visitor-count");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -----------------------------------------
     Mobile navigation
  ----------------------------------------- */

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        primaryNav.classList.contains("is-open")
      ) {
        primaryNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.focus();
      }
    });
  }

  /* -----------------------------------------
     Scroll reveal animations
  ----------------------------------------- */

  const revealElements = document.querySelectorAll(".reveal");

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
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
     Professional Core spotlight
  ----------------------------------------- */

  if (coreGrid && coreCards.length > 0) {
    coreCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        coreCards.forEach((otherCard) => {
          otherCard.classList.toggle("is-selected", otherCard === card);
        });
      });

      card.addEventListener("focus", () => {
        coreCards.forEach((otherCard) => {
          otherCard.classList.toggle("is-selected", otherCard === card);
        });
      });

      card.addEventListener("click", () => {
        const isSelected = card.classList.contains("is-selected");

        coreCards.forEach((otherCard) => {
          otherCard.classList.remove("is-selected");
        });

        if (!isSelected) {
          card.classList.add("is-selected");
        }
      });
    });

    coreGrid.addEventListener("mouseleave", () => {
      coreCards.forEach((card) => {
        card.classList.remove("is-selected");
      });
    });
  }

  /* -----------------------------------------
     Route content
  ----------------------------------------- */

  const routeData = {
    "reading-writing": {
      title: "Reading & Writing",
      status: "Drafting",
      intro:
        "A route shaped by stories, imagination, and the possibilities hidden inside them.",
      blocks: [
        {
          heading: "Currently Reading",
          html: `
            <p>
              Web novels across fantasy, progression, adventure, fiction,
              fanfiction, and character-driven stories.
            </p>
            <p>
              In fanfiction, I especially enjoy exploring unexplored, ignored,
              or underutilized potential—characters, scenes, plots, and
              “what if” moments where one different decision can change the
              entire direction of a story.
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
          heading: "My Original Novel",
          html: `
            <p>
              An original web novel is currently in the drafting stage.
            </p>
            <p>
              Once the preparation is complete, I plan to publish it under
              a pen name.
            </p>
          `
        },
        {
          heading: "Where to Read It",
          html: `<p>Coming soon.</p>`
        },
        {
          heading: "Original Novel Status",
          html: `
            <ul>
              <li><strong>Status:</strong> Drafting</li>
              <li><strong>Chapters:</strong> In progress</li>
              <li><strong>World-building:</strong> Developing</li>
              <li><strong>Publishing:</strong> Planned</li>
              <li><strong>Platform:</strong> To be finalized</li>
              <li><strong>Pen name:</strong> Will be updated soon</li>
              <li><strong>Resources:</strong> Free AI tools for drafting and organization</li>
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
        href: "mailto:revanthkm13@gmail.com?subject=Reading%20%26%20Writing%20Route"
      }
    },

    "games-strategy": {
      title: "Games & Strategy",
      status: "Active",
      intro:
        "A route built around strategy, immersive worlds, steady improvement, and knowing when to adapt.",
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
              <li>Online shooter games</li>
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
            <div class="memory-grid">
              <div class="memory-card">
                <strong>Subway Surfers &amp; Temple Run</strong>
                <p>
                  My first endless-runner experiences on a phone I bought
                  with my own money.
                </p>
              </div>

              <div class="memory-card">
                <strong>Candy Crush</strong>
                <p>
                  I wanted to reach the end—then discovered the levels
                  never really end.
                </p>
              </div>

              <div class="memory-card">
                <strong>SimCity &amp; Minecraft</strong>
                <p>
                  Building from a basic start while managing growing demands
                  and increasingly impatient citizens.
                </p>
              </div>

              <div class="memory-card">
                <strong>Dr. Driving</strong>
                <p>
                  A lesson in patience, control, and the reality of driving.
                </p>
              </div>

              <div class="memory-card">
                <strong>Need for Speed</strong>
                <p>
                  The name says it all: speed, control, and the thrill of
                  the road.
                </p>
              </div>

              <div class="memory-card">
                <strong>BGMI, Free Fire, Call of Duty &amp; LifeAfter</strong>
                <p>
                  Different ways to experience intense, out-of-the-ordinary
                  action.
                </p>
              </div>

              <div class="memory-card">
                <strong>Idle simulators</strong>
                <p>
                  My go-to choice when I simply want to pass time.
                </p>
              </div>
            </div>

            <p>
              These are only a few of the many games I have played, loved,
              wanted to try, and continue to enjoy.
            </p>
            <p>
              More will be added as I reflect on the games that left the
              strongest impression.
            </p>
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
          heading: "Looking Forward To",
          html: `
            <ul>
              <li>New strategy games</li>
              <li>Open-world games</li>
              <li>Story-rich games</li>
            </ul>
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
        href: "mailto:revanthkm13@gmail.com?subject=Games%20%26%20Strategy%20Route"
      }
    },

    "design-products": {
      title: "Design & Digital Products",
      status: "Building",
      intro:
        "A route for creating, experimenting, and turning small ideas into useful experiences.",
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
        href: "mailto:revanthkm13@gmail.com?subject=Design%20%26%20Digital%20Products"
      }
    },

    "learning-exploration": {
      title: "Learning & Exploration",
      status: "Learning",
      intro:
        "A route for learning, exploring, and improving through practice.",
      blocks: [
        {
          heading: "Currently Learning",
          html: `
            <p>
              Data analysis and practical analytical skills.
            </p>
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
        href: "mailto:revanthkm13@gmail.com?subject=Learning%20%26%20Exploration"
      }
    },

    "food-curiosity": {
      title: "Food & Curiosity",
      status: "Exploring",
      intro:
        "A vegetarian route through flavors, cuisines, and food experiences worth exploring.",
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
        href: "mailto:revanthkm13@gmail.com?subject=Food%20%26%20Curiosity%20Route"
      }
    }
  };

  /* -----------------------------------------
     Open and close route spaces
  ----------------------------------------- */

  let activeRouteCard = null;

  function openRoute(routeId, triggerCard) {
    const route = routeData[routeId];

    if (!route || !routeDialog || !routeContent) {
      return;
    }

    activeRouteCard = triggerCard || null;

    routeSpace.className = "route-space " + routeId;

    const blocksHtml = route.blocks
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
      ${blocksHtml}
      <div class="route-cta">
        <a class="btn btn-primary" href="${route.cta.href}">
          ${route.cta.label}
        </a>
      </div>
    `;

    routeDialog.showModal();
    routeDialog.scrollTop = 0;
  }

  function closeRoute() {
    if (!routeDialog.open) {
      return;
    }

    routeDialog.close();

    if (activeRouteCard) {
      activeRouteCard.focus();
      activeRouteCard = null;
    }
  }

  routeCards.forEach((card) => {
    card.addEventListener("click", () => {
      openRoute(card.dataset.route, card);
    });
  });

  if (routeClose) {
    routeClose.addEventListener("click", closeRoute);
  }

  if (routeDialog) {
    routeDialog.addEventListener("close", () => {
      if (activeRouteCard) {
        activeRouteCard.focus();
        activeRouteCard = null;
      }
    });

    routeDialog.addEventListener("click", (event) => {
      const dialogArea = routeDialog.getBoundingClientRect();

      const clickedOutside =
        event.clientX < dialogArea.left ||
        event.clientX > dialogArea.right ||
        event.clientY < dialogArea.top ||
        event.clientY > dialogArea.bottom;

      if (clickedOutside) {
        closeRoute();
      }
    });
  }

  /* -----------------------------------------
     Back to top button
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
     Resume door animation
  ----------------------------------------- */

  if (resumeDoor) {
    resumeDoor.addEventListener("click", () => {
      resumeDoor.classList.add("is-opening");
    });
  }

  if (resumeFooterLink) {
    resumeFooterLink.addEventListener("click", () => {
      resumeFooterLink.classList.add("is-opening");
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
      const startValue = Math.max(0, target - 24);

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(
          startValue + (target - startValue) * eased
        );

        setCounter(currentValue);

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
