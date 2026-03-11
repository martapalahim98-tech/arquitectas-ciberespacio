const container = document.querySelector(".scroll-container");
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
const progressBar = document.querySelector(".progress-bar");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const btnTop = document.querySelector(".btn-top");

/* MENU TOGGLE */
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", !expanded);
});

/* SCROLL A SECCIÓN */
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const id = link.getAttribute("href").substring(1);
    const section = document.getElementById(id);

    if (section) {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", false);
      container.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

/* CERRAR MENU AL TOCAR FUERA */
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", false);
  }
});

/* BARRA DE PROGRESO */
container.addEventListener("scroll", () => {
  const total = container.scrollHeight - container.clientHeight;
  const progress = (container.scrollTop / total) * 100;

  progressBar.style.width = progress + "%";
});

/* SECCIÓN ACTIVA */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + id,
          );
        });
      }
    });
  },
  {
    root: container,
    threshold: 0.5,
  },
);

sections.forEach((section) => observer.observe(section));

/* LIMPIEZA EN RESIZE */
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", false);
  }
});

/* BOTÓN VOLVER ARRIBA */
container.addEventListener("scroll", () => {
  if (container.scrollTop > 400) {
    btnTop.classList.add("show");
  } else {
    btnTop.classList.remove("show");
  }
});

btnTop.addEventListener("click", () => {
  container.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* ===== ENIAC SLIDESHOW ===== */
const eniacFigures = document.querySelectorAll(".eniac--figure");
const eniacTexts = document.querySelectorAll(".eniac--text");
let currentEniacSlide = 0;

/* Stats data for each slide */
const slideStats = [
  // Slide 0: Escala / Overview
  [
    { number: "27", formatted: "27", label: "toneladas" },
    { number: "167", formatted: "167", label: "metros cuadrados" },
    { number: "5000", formatted: "5.000", label: "operaciones/seg" },
    { number: "17468", formatted: "17.468", label: "tubos de vacío" },
  ],
  // Slide 1: Componentes
  [
    { number: "1500", formatted: "1.500", label: "relés" },
    { number: "70000", formatted: "70.000", label: "resistencias" },
    { number: "10000", formatted: "10.000", label: "condensadores" },
    { number: "7200", formatted: "7.200", label: "diodos de cristal" },
  ],
  // Slide 2: Programación
  [
    { number: "6000", formatted: "6.000", label: "interruptores" },
    { number: "5000", formatted: "5.000", label: "sumas/seg" },
    { number: "300", formatted: "300", label: "multiplicac./seg" },
    { number: "2", formatted: "2", label: "semanas de config." },
  ],
  // Slide 3: Consumo energético
  [
    { number: "150", formatted: "150", label: "kW de consumo" },
    { number: "160", formatted: "160", label: "kW máximos" },
    { number: "48", formatted: "48", label: "horas por fallo" },
    { number: "1945", formatted: "1945", label: "año de creación" },
  ],
];

function updateStats(slideIndex) {
  const stats = slideStats[slideIndex];
  if (!stats) return;

  statNumbers.forEach((el, i) => {
    const labelEl = el.nextElementSibling; // .stat--label
    el.classList.add("stat--fade");

    setTimeout(() => {
      el.dataset.formatted = stats[i].formatted;
      el.dataset.target = stats[i].number;
      if (labelEl) labelEl.textContent = stats[i].label;
      el.classList.remove("stat--fade");
      animateCounter(el, parseFloat(stats[i].number));
    }, 200);
  });
}

function changeEniacSlide(newIndex, goingNext) {
  const oldFigure = eniacFigures[currentEniacSlide];
  const newFigure = eniacFigures[newIndex];
  const oldText = eniacTexts[currentEniacSlide];
  const newText = eniacTexts[newIndex];

  // Exit old slide
  oldFigure.classList.add(goingNext ? "exit-left" : "exit-right");
  oldFigure.classList.remove("active");
  oldText.classList.remove("active");

  // Position new slide off-screen before animating in
  newFigure.classList.remove("exit-left", "exit-right", "active");
  if (!goingNext) {
    newFigure.classList.add("enter-from-left");
  }

  // Force reflow so the browser registers the starting position
  void newFigure.offsetWidth;

  // Animate new slide in
  newFigure.classList.remove("enter-from-left");
  newFigure.classList.add("active");
  newText.classList.add("active");

  currentEniacSlide = newIndex;

  // Update stats for the new slide
  updateStats(newIndex);

  // Clean up exit classes after transition
  setTimeout(() => oldFigure.classList.remove("exit-left", "exit-right"), 400);
}

/* ===== ENIAC STATS COUNTER ===== */
const statNumbers = document.querySelectorAll(".stat--number");

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el, target, duration = 1800) {
  const useDecimals = target >= 1000;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = Math.round(eased * target);

    // Format with Spanish locale (dot as thousands separator)
    el.textContent = useDecimals
      ? current.toLocaleString("es-ES")
      : current.toString();

    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = el.dataset.formatted; // ensure exact final value
  }

  requestAnimationFrame(tick);
}

function initStatsCounters() {
  statNumbers.forEach((el) => {
    // Store the original formatted string for the final snap
    el.dataset.formatted = el.textContent.trim();
    // Parse the raw number (handles "5.000" and "17.468" as Spanish thousands)
    const raw = el.textContent.trim().replace(/\./g, "").replace(/,/g, ".");
    el.dataset.target = parseFloat(raw);
    el.textContent = "0";
  });
}

let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach((el, i) => {
          const target = parseFloat(el.dataset.target);
          // Stagger each stat slightly
          setTimeout(() => animateCounter(el, target), i * 120);
        });
      }
    });
  },
  { root: container, threshold: 0.4 },
);

const eniacSection = document.getElementById("eniac");
if (eniacSection) {
  initStatsCounters();
  statsObserver.observe(eniacSection);
}

const btnPrev = document.querySelector(".eniac--btn-prev");
const btnNext = document.querySelector(".eniac--btn-next");

if (btnPrev && btnNext) {
  btnPrev.addEventListener("click", () => {
    changeEniacSlide(
      (currentEniacSlide - 1 + eniacFigures.length) % eniacFigures.length,
      false,
    );
  });

  btnNext.addEventListener("click", () => {
    changeEniacSlide((currentEniacSlide + 1) % eniacFigures.length, true);
  });
}
