const container = document.querySelector(".scroll-container");
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

// Guard: these elements don't exist in the current HTML, so skip safely
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

        const currentSection = [...sections].find((s) => {
            const rect = s.getBoundingClientRect();
            return rect.top >= -50 && rect.top <= 50;
        });

        if (!currentSection) return;
        const currentIndex = [...sections].indexOf(currentSection);

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

/* Stats data read from each slide's data-stats attribute in the HTML */
const slideStats = [...eniacFigures].map(fig => JSON.parse(fig.dataset.stats));

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
    { root: container, threshold: 0.4 }
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
            false
        );
    });

    btnNext.addEventListener("click", () => {
        changeEniacSlide((currentEniacSlide + 1) % eniacFigures.length, true);
    });
}