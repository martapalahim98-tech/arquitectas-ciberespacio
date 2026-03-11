const container = document.querySelector(".scroll-container");
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");
const progressBar = document.querySelector(".progress-bar");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

let isScrolling = false;
let scrollEndTimer;

/* ===== MENU TOGGLE ===== */
if (menuToggle) {
    menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
}

/* ===== NAV ACTIVE SECTION ===== */
function updateActiveLink(id) {
    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
}

/* ===== CLICK EN LINKS ===== */
navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (nav) nav.classList.remove("open");
        targetSection.scrollIntoView({ behavior: "smooth" });
        updateActiveLink(targetId);
    });
});

/* ===== PROGRESS BAR ===== */
container.addEventListener("scroll", () => {
    if (progressBar) {
        progressBar.style.width =
            (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100 + "%";
    }
});

/* ===== INTERSECTION OBSERVER – NAV ACTIVE ===== */
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) updateActiveLink(entry.target.id);
        });
    },
    { root: container, threshold: 0.6 }
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

        const sectionsArray = [...sections];
        const currentSection = sectionsArray.find((s) => {
            const rect = s.getBoundingClientRect();
            return rect.top >= -50 && rect.top <= 50;
        });

        if (!currentSection) return;
        const currentIndex = sectionsArray.indexOf(currentSection);

        if (e.deltaY > 0) {
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
            if (container.scrollTop <= currentSection.offsetTop + 5) {
                if (currentIndex > 0) {
                    e.preventDefault();
                    scrollToSection(currentIndex - 1);
                }
            }
        }
    },
    { passive: false }
);

container.addEventListener("scroll", () => {
    if (isScrolling) releaseScrollLock();
});

/* ===== ENIAC SLIDESHOW ===== */
const eniacFigures = document.querySelectorAll(".eniac--figure");
const eniacTexts = document.querySelectorAll(".eniac--text");
let currentEniacSlide = 0;

/* ===== ENIAC STATS COUNTER ===== */
const statNumbers = document.querySelectorAll(".stat--number");

/* slideStats se carga desde data/eniac-stats.json */
let slideStats = [];

function updateStats(slideIndex) {
    const slide = slideStats[slideIndex];
    if (!slide) return;

    statNumbers.forEach((el, i) => {
        const labelEl = el.nextElementSibling;
        el.classList.add("stat--fade");

        setTimeout(() => {
            if (labelEl) labelEl.textContent = slide.stats[i].label;
            el.classList.remove("stat--fade");
            animateCounter(el, slide.stats[i].value);
        }, 200);
    });
}

function changeEniacSlide(newIndex, goingNext) {
    const oldFigure = eniacFigures[currentEniacSlide];
    const newFigure = eniacFigures[newIndex];
    const oldText = eniacTexts[currentEniacSlide];
    const newText = eniacTexts[newIndex];

    oldFigure.classList.add(goingNext ? "exit-left" : "exit-right");
    oldFigure.classList.remove("active");
    oldText.classList.remove("active");

    newFigure.classList.remove("exit-left", "exit-right", "active");
    if (!goingNext) newFigure.classList.add("enter-from-left");

    void newFigure.offsetWidth; // reflow forzado para que la transicion css detecte la posicion 

    newFigure.classList.remove("enter-from-left");
    newFigure.classList.add("active");
    newText.classList.add("active");

    currentEniacSlide = newIndex;
    updateStats(newIndex);

    setTimeout(() => oldFigure.classList.remove("exit-left", "exit-right"), 400);
}

function animateCounter(el, target, duration = 1800) {
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = String(Math.round((1 - Math.pow(1 - progress, 4)) * target));
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

let statsAnimated = false;

const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                updateStats(0);
            }
        });
    },
    { root: container, threshold: 0.4 }
);

const eniacSection = document.getElementById("eniac");
if (eniacSection) {
    statNumbers.forEach((el) => { el.textContent = "0"; }); // oculta valores hasta que se inicie la animación

    fetch("data/eniac-stats.json")
        .then((response) => response.json())
        .then((data) => {
            slideStats = data;
            statsObserver.observe(eniacSection);
        })
        .catch(() => {
            console.warn("No se pudo cargar eniac-stats.json. Los contadores no se animarán.");
        });
}

const btnPrev = document.querySelector(".eniac--btn-prev");
const btnNext = document.querySelector(".eniac--btn-next");

if (btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => {
        changeEniacSlide(
            (currentEniacSlide - 1 + eniacFigures.length) % eniacFigures.length,
            false
        );
    });

    btnNext.addEventListener("click", () => {
        changeEniacSlide((currentEniacSlide + 1) % eniacFigures.length, true);
    });
}