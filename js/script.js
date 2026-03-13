const container   = document.querySelector(".scroll-container");
const sections    = document.querySelectorAll(".section");
const navLinks    = document.querySelectorAll(".nav-link");
const progressBar = document.querySelector(".progress-bar");
const menuToggle  = document.querySelector(".menu-toggle");
const nav         = document.querySelector(".nav");
const btnTop      = document.querySelector(".btn-top");

/* ── MENU TOGGLE ────────────────────────────────────────────────────────── */
menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    const isOpen = nav.classList.contains("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
});

/* ── SCROLL A SECCIÓN ───────────────────────────────────────────────────── */
navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const id      = link.getAttribute("href").substring(1);
        const section = document.getElementById(id);
        if (section) {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", false);
            container.scrollTo({ top: section.offsetTop, behavior: "smooth" });
        }
    });
});

/* ── CERRAR MENÚ AL TOCAR FUERA ─────────────────────────────────────────── */
document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", false);
    }
});

/* ── BARRA DE PROGRESO ──────────────────────────────────────────────────── */
container.addEventListener("scroll", () => {
    const total    = container.scrollHeight - container.clientHeight;
    const progress = (container.scrollTop / total) * 100;
    progressBar.style.width = progress + "%";
});

/* ── SECCIÓN ACTIVA ─────────────────────────────────────────────────────── */
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + id
                    );
                });
            }
        });
    },
    { root: container, threshold: 0.5 }
);
sections.forEach((section) => observer.observe(section));

/* ── LIMPIEZA EN RESIZE ─────────────────────────────────────────────────── */
window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", false);
    }
});

/* ── BOTÓN VOLVER ARRIBA ────────────────────────────────────────────────── */
container.addEventListener("scroll", () => {
    btnTop.classList.toggle("show", container.scrollTop > 400);
});

btnTop.addEventListener("click", () => {
    container.scrollTo({ top: 0, behavior: "smooth" });
});

/* ── MODAL GENERAL ──────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    const modal       = document.getElementById("modal-gallery");
    const modalImg    = document.getElementById("modal-img");
    const modalTitle  = document.getElementById("modal-title");
    const modalDetail = document.getElementById("modal-detail");
    const closeElements = [
        document.getElementById("js-modal-close"),
        document.getElementById("js-modal-btn-close"),
    ];

    let galleryData = [];

    fetch("data/gallery-data.json")
        .then((r) => r.json())
        .then((data) => { galleryData = data; })
        .catch((err) => console.error("Error cargando datos:", err));

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-open-modal");
        if (btn) {
            const id   = btn.getAttribute("data-id");
            const data = galleryData.find((item) => item.id === id);
            if (data) {
                modalImg.src              = data.image;
                modalTitle.textContent    = data.title;
                modalDetail.innerHTML     = data.detail;
                modal.showModal();
                document.body.style.overflow = "hidden";
            }
        }
    });

    const handleClose = () => {
        modal.close();
        document.body.style.overflow = "";
    };

    closeElements.forEach((el) => el?.addEventListener("click", handleClose));

    modal.addEventListener("click", (e) => {
        if (e.target === modal) handleClose();
    });
});

/* ── LIGHTBOX ───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    const lightbox      = document.getElementById("lightbox-gallery");
    const lightboxImg   = document.getElementById("lightbox-img");
    const closeLightbox = document.getElementById("js-lightbox-close");

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-lightbox");
        if (btn) {
            const imgSrc = btn.getAttribute("data-src");
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightbox.showModal();
                document.body.style.overflow = "hidden";
            }
        }
    });

    const handleCloseLightbox = () => {
        lightbox.close();
        document.body.style.overflow = "";
        lightboxImg.src = "";
    };

    closeLightbox.addEventListener("click", handleCloseLightbox);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) handleCloseLightbox();
    });
});

/* ── ENIAC SLIDESHOW ────────────────────────────────────────────────────── */
const eniacFigures       = document.querySelectorAll(".eniac--figure");
const eniacTexts         = document.querySelectorAll(".eniac--text");
let   currentEniacSlide  = 0;
let   statNumbers        = [];
let   slideStats         = [];

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
    const oldText   = eniacTexts[currentEniacSlide];
    const newText   = eniacTexts[newIndex];

    oldFigure.classList.add(goingNext ? "exit-left" : "exit-right");
    oldFigure.classList.remove("active");
    oldText.classList.remove("active");

    newFigure.classList.remove("exit-left", "exit-right", "active");
    if (!goingNext) newFigure.classList.add("enter-from-left");
    void newFigure.offsetWidth; // force reflow
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

const ENIAC_STATS = [
    {
        slide: 0,
        stats: [
            { value: 1945, label: "Año de construcción" },
            { value: 167,  label: "m² que ocupaba" },
            { value: 27,   label: "Toneladas de peso" },
            { value: 150,  label: "kW de consumo" },
            { value: 5000, label: "Sumas por segundo" },
        ],
    },
    {
        slide: 1,
        stats: [
            { value: 17468, label: "Tubos de vacío" },
            { value: 70000, label: "Resistencias" },
            { value: 10000, label: "Condensadores" },
            { value: 7200,  label: "Diodos de cristal" },
            { value: 6000,  label: "Interruptores manuales" },
        ],
    },
    {
        slide: 2,
        stats: [
            { value: 6,    label: "Programadoras originales" },
            { value: 6000, label: "Interruptores a configurar" },
            { value: 48,   label: "Horas entre fallos" },
            { value: 300,  label: "Multiplicaciones / seg." },
            { value: 1946, label: "Año de presentación pública" },
        ],
    },
    {
        slide: 3,
        stats: [
            { value: 150,   label: "kW consumo energético" },
            { value: 17468, label: "Válvulas de vacío" },
            { value: 48,    label: "Horas promedio entre fallos" },
            { value: 167,   label: "m² de superficie" },
            { value: 1955,  label: "Año de desconexión" },
        ],
    },
];

const eniacSection = document.getElementById("eniac");
if (eniacSection) {
    slideStats = ENIAC_STATS;
    const statsContainer = document.querySelector(".eniac--stats");
    ENIAC_STATS[0].stats.forEach(() => {
        const stat     = document.createElement("div");
        stat.className = "stat";
        stat.innerHTML = '<span class="stat--number">0</span><span class="stat--label"></span>';
        statsContainer.appendChild(stat);
    });
    statNumbers = document.querySelectorAll(".stat--number");
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

/* ── TIMELINE ANIMATIONS ────────────────────────────────────────────────── */
document.documentElement.classList.add("js-anim");

const tlObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("anim-triggered");
                tlObserver.unobserve(entry.target);
            }
        });
    },
    { root: container, threshold: 0.15 }
);

[
    ".contexto-timeline",
    ".contexto-bottom-mark",
    ".secret-wrapper",
    ".secret-rediscovery",
    ".secret-recognition",
].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) tlObserver.observe(el);
});

const bridgeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("anim-triggered");
                bridgeObserver.unobserve(entry.target);
            }
        });
    },
    { root: container, threshold: 0 }
);

const secretBridge = document.querySelector(".secret-bridge");
if (secretBridge) bridgeObserver.observe(secretBridge);

/* ── DARK MODE ──────────────────────────────────────────────────────────── */
const THEME_DARK  = "dark";
const THEME_LIGHT = "light";
const THEME_KEY   = "theme";

const themeToggle = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(isDark) {
    document.documentElement.dataset.theme = isDark ? THEME_DARK : THEME_LIGHT;
    themeToggle.setAttribute("aria-pressed", isDark);
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Activar modo claro" : "Activar modo oscuro"
    );
}

function getStoredTheme() {
    return localStorage.getItem(THEME_KEY);
}

const stored = getStoredTheme();
if (stored) {
    applyTheme(stored === THEME_DARK);
} else {
    applyTheme(prefersDark.matches);
}

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === THEME_DARK;
    localStorage.setItem(THEME_KEY, isDark ? THEME_LIGHT : THEME_DARK);
    applyTheme(!isDark);
});

prefersDark.addEventListener("change", (e) => {
    if (!getStoredTheme()) applyTheme(e.matches);
});

/* ── LEGADO — TIMELINE ──────────────────────────────────────────────────── */
const LEG_MILESTONES = [
    {
        year:  "1945",
        title: "Predicción meteorológica militar",
        text:  "El ENIAC fue utilizado para realizar las primeras simulaciones numéricas del clima, una capacidad crítica para planificar operaciones militares como desembarcos y ofensivas aéreas. Por primera vez, una máquina podía anticipar la naturaleza.",
        tag:   "Meteorología · Simulación · Ejército",
    },
    {
        year:  "1946",
        title: "Cálculos de la bomba de hidrógeno",
        text:  "El matemático John von Neumann utilizó el ENIAC para realizar los primeros cálculos termonucleares, determinando la viabilidad de la bomba de hidrógeno y marcando el inicio de la era nuclear computacional.",
        tag:   "Von Neumann · Fisión nuclear · Guerra Fría",
    },
    {
        year:  "1949",
        title: "Diseño de túneles de viento",
        text:  "El ENIAC permitió simular flujos aerodinámicos complejos, acelerando el diseño de aviones supersónicos y cohetes que serían esenciales en la Guerra Fría y la carrera espacial. La ingeniería dejaba de depender solo del ensayo y error.",
        tag:   "Aerodinámica · Supersónico · Cohetes",
    },
    {
        year:  "1950s",
        title: "Nacimiento de la programación moderna",
        text:  "Las técnicas inventadas por las ENIAC Six —subrutinas, bucles anidados, depuración sistemática— se convirtieron en los fundamentos de la ingeniería de software que usamos hoy. Programar dejó de ser un arte improvisado para convertirse en una disciplina.",
        tag:   "ENIAC Six · Subrutinas · Ingeniería de software",
    },
    {
        year:  "1957",
        title: "Carrera espacial",
        text:  "Los sucesores directos del ENIAC calcularon las trayectorias orbitales del programa espacial. Sin la computación que nació con el ENIAC, ni el Sputnik ni el Apollo habrían existido. El código que comenzó en un sótano de Filadelfia llegó a la Luna.",
        tag:   "Sputnik · Apollo · NASA",
    },
    {
        year:  "1969",
        title: "ARPANET y los orígenes de Internet",
        text:  "La red ARPANET, precursora de Internet, fue posible gracias a la computación digital nacida del ENIAC. Los principios de conmutación de paquetes se calcularon en máquinas herederas directas. Ese mismo año, el ser humano pisaba la Luna.",
        tag:   "ARPANET · Internet · Redes",
    },
    {
        year:  "1970s",
        title: "Criptografía computacional",
        text:  "Los sistemas de cifrado militar evolucionaron de mecánicos a digitales gracias a la potencia de cálculo inaugurada por el ENIAC, revolucionando la inteligencia y la seguridad nacional. La privacidad digital que protege internet hoy tiene su raíz aquí.",
        tag:   "Cifrado · Seguridad · Inteligencia",
    },
];

const legBtnPrev = document.getElementById("leg-tl-prev");
const legBtnNext = document.getElementById("leg-tl-next");
const legFill    = document.getElementById("leg-tl-fill");
const legDetail  = document.getElementById("leg-tl-detail");
const legHitos   = document.querySelectorAll(".legado-hito");
const legNavDots = document.querySelectorAll(".legado-nav__dot");

let legCurrent = 0;

function legGoTo(index) {
    legHitos.forEach((hito, i) => {
        hito.classList.toggle("is-active", i === index);
        hito.classList.toggle("is-past",   i < index);
    });

    legNavDots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));

    legFill.style.width =
        index === 0 ? "0%" : `${(index / (legHitos.length - 1)) * 100}%`;

    legBtnPrev.disabled = index === 0;
    legBtnNext.disabled = index === legHitos.length - 1;

    legDetail.classList.remove("is-visible");

    setTimeout(() => {
        document.getElementById("leg-tl-year").textContent  = LEG_MILESTONES[index].year;
        document.getElementById("leg-tl-title").textContent = LEG_MILESTONES[index].title;
        document.getElementById("leg-tl-text").textContent  = LEG_MILESTONES[index].text;
        document.getElementById("leg-tl-tag").textContent   = LEG_MILESTONES[index].tag;
        legDetail.classList.add("is-visible");
    }, 160);

    legCurrent = index;
}

if (legBtnPrev && legBtnNext) {
    legBtnNext.addEventListener("click", () => legGoTo(legCurrent + 1));
    legBtnPrev.addEventListener("click", () => legGoTo(legCurrent - 1));
    legHitos.forEach((hito, i) => hito.addEventListener("click", () => legGoTo(i)));
    document.addEventListener("keydown", (e) => {
        if (!document.getElementById("legado")?.contains(document.activeElement)) return;
        if (e.key === "ArrowRight" && legCurrent < legHitos.length - 1) legGoTo(legCurrent + 1);
        if (e.key === "ArrowLeft"  && legCurrent > 0)                   legGoTo(legCurrent - 1);
    });
    legGoTo(0);
}

/* ── LEGADO — FLIP CARDS ────────────────────────────────────────────────── */
document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click",   () => card.classList.toggle("flipped"));
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            card.classList.toggle("flipped");
        }
    });
});