const container = document.querySelector(".scroll-container");
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
let isScrolling = false;
let scrollEndTimer;

function releaseScrollLock() {
  clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => {
    isScrolling = false;
  }, 150);
}

// Función para mover a la sección
function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: "smooth" });

    // Actualizar menú
    updateActiveLink(sections[index].id);
  }
}

// Detectar rueda del ratón
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

    // Si scrolleamos hacia abajo
    if (e.deltaY > 0) {
      // Solo saltar si estamos al final de la sección actual
      if (
        container.scrollTop + container.clientHeight >=
        currentSection.offsetTop + currentSection.offsetHeight - 5
      ) {
        if (currentIndex < sections.length - 1) {
          e.preventDefault();
          scrollToSection(currentIndex + 1);
        }
      }
    }
    // Si scrolleamos hacia arriba
    else {
      // Solo saltar si estamos al inicio de la sección actual
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

// Actualizar links activos
function updateActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

// Click en los links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: "instant" });
    updateActiveLink(targetId);
  });
});

// ---- ENIAC Slideshow ----
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

  // Exit old figure (slides up when going down, slides down when going up)
  oldFigure.classList.add(goingDown ? "exit-up" : "exit-down");
  oldFigure.classList.remove("active");
  oldText.classList.remove("active");

  // Position new figure at its entry point
  newFigure.classList.remove("exit-up", "exit-down");
  if (!goingDown) newFigure.classList.add("enter-from-top");
  void newFigure.offsetWidth; // force reflow to commit the starting position

  // Animate new figure in
  newFigure.classList.remove("enter-from-top");
  newFigure.classList.add("active");
  newText.classList.add("active");

  // Clean up exit classes after animation completes
  setTimeout(() => oldFigure.classList.remove("exit-up", "exit-down"), 400);
}

container.addEventListener("scroll", () => {
  if (isScrolling) {
    releaseScrollLock(); // release only after scroll events stop (150ms silence)
    return;
  }
  const newIndex = getEniacSlideIndex();
  if (newIndex !== currentEniacSlide) {
    changeEniacSlide(newIndex, newIndex > currentEniacSlide);
  }
});
