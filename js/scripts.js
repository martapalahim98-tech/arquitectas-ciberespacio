const container = document.querySelector(".scroll-container");
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
const progressBar = document.querySelector(".progress-bar");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

let isScrolling = false;
let scrollEndTimer;

/* ===== MENU TOGGLE ===== */
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));

/* ===== CLICK EN LINKS ===== */
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    nav.classList.remove("open"); // cerrar menú
    targetSection.scrollIntoView({ behavior: "smooth" }); // scroll suave
    updateActiveLink(targetId); // actualizar link activo
  });
});

/* ===== PROGRESS BAR ===== */
container.addEventListener("scroll", () => {
  progressBar.style.width =
    (container.scrollTop / (container.scrollHeight - container.clientHeight)) *
      100 +
    "%";
});

/* ===== NAV ACTIVE SECTION ===== */
function updateActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveLink(entry.target.id);
    });
  },
  { root: container, threshold: 0.6 },
);

sections.forEach((section) => observer.observe(section));

/* ===== SCROLL LOCK ===== */
function releaseScrollLock() {
  clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => {
    isScrolling = false;
  }, 150);
}

/* ===== SCROLL TO SECTION POR RUEDA ===== */
function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: "smooth" });
    updateActiveLink(sections[index].id);
  }
}

container.addEventListener(
  "wheel",
  (e) => {
    if (isScrolling) return;

    const currentSection = [...sections].find((s) => {
      const rect = s.getBoundingClientRect();
      return rect.top >= -50 && rect.top <= 50;
    });

    if (!currentSection) return;
    const currentIndex = [...sections].indexOf(currentSection);

    if (e.deltaY > 0) {
      // Scroll hacia abajo
      if (
        container.scrollTop + container.clientHeight >=
        currentSection.offsetTop + currentSection.offsetHeight - 5
      ) {
        if (currentIndex < sections.length - 1) {
          e.preventDefault();
          scrollToSection(currentIndex + 1);
        }
      }
    } else {
      // Scroll hacia arriba
      if (container.scrollTop <= currentSection.offsetTop + 5) {
        if (currentIndex > 0) {
          e.preventDefault();
          scrollToSection(currentIndex - 1);
        }
      }
    }
  },
  { passive: false },
);

/* ===== ENIAC SLIDESHOW ===== */
const eniacSection = document.getElementById("eniac");
const eniacFigures = document.querySelectorAll(".eniac--figure");
const eniacTexts = document.querySelectorAll(".eniac--text");
let currentEniacSlide = 0;

function getEniacSlideIndex() {
  const scrollable = eniacSection.offsetHeight - container.clientHeight;
  if (scrollable <= 0) return 0;
  const progress = (container.scrollTop - eniacSection.offsetTop) / scrollable;
  return Math.floor(
    Math.max(0, Math.min(0.9999, progress)) * eniacFigures.length,
  );
}

function changeEniacSlide(newIndex, goingDown) {
  const oldFigure = eniacFigures[currentEniacSlide];
  const newFigure = eniacFigures[newIndex];
  const oldText = eniacTexts[currentEniacSlide];
  const newText = eniacTexts[newIndex];

  currentEniacSlide = newIndex;

  oldFigure.classList.add(goingDown ? "exit-up" : "exit-down");
  oldFigure.classList.remove("active");
  oldText.classList.remove("active");

  newFigure.classList.remove("exit-up", "exit-down");
  if (!goingDown) newFigure.classList.add("enter-from-top");
  void newFigure.offsetWidth; // force reflow

  newFigure.classList.remove("enter-from-top");
  newFigure.classList.add("active");
  newText.classList.add("active");

  setTimeout(() => oldFigure.classList.remove("exit-up", "exit-down"), 400);
}

container.addEventListener("scroll", () => {
  if (isScrolling) {
    releaseScrollLock();
    return;
  }
  const newIndex = getEniacSlideIndex();
  if (newIndex !== currentEniacSlide) {
    changeEniacSlide(newIndex, newIndex > currentEniacSlide);
  }
});
