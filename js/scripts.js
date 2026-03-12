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

/* MODAL GENERAL */
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('modal-gallery');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDetail = document.getElementById('modal-detail');
    const closeElements = [
        document.getElementById('js-modal-close'),
        document.getElementById('js-modal-btn-close')
    ];

    let galleryData = [];

    // Cargar JSON
    fetch('data/gallery-data.json')
        .then(response => response.json())
        .then(data => { galleryData = data; })
        .catch(err => console.error("Error cargando datos:", err));

    // Abrir Modal
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-open-modal');
        if (btn) {
            const id = btn.getAttribute('data-id');
            const data = galleryData.find(item => item.id === id);

            if (data) {
                modalImg.src = data.image;
                modalTitle.textContent = data.title;
                modalDetail.innerHTML = data.detail;
                modal.showModal();
                // Prevenir scroll del body al abrir
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // Cerrar Modal
    const handleClose = () => {
        modal.close();
        document.body.style.overflow = '';
    };

    closeElements.forEach(el => el?.addEventListener('click', handleClose));

    // Cerrar al hacer click en el fondo oscuro
    modal.addEventListener('click', (e) => {
        if (e.target === modal) handleClose();
    });
});

/* ===== ENIAC SLIDESHOW ===== */
const eniacFigures = document.querySelectorAll(".eniac--figure");
const eniacTexts = document.querySelectorAll(".eniac--text");
let currentEniacSlide = 0;

/* ===== ENIAC STATS COUNTER ===== */
let statNumbers = [];

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
    fetch("data/eniac-stats.json")
        .then((response) => response.json())
        .then((data) => {
            slideStats = data;
            const statsContainer = document.querySelector(".eniac--stats");
            data[0].stats.forEach(() => {
                const stat = document.createElement("div");
                stat.className = "stat";
                stat.innerHTML = '<span class="stat--number">0</span><span class="stat--label"></span>';
                statsContainer.appendChild(stat);
            });
            statNumbers = document.querySelectorAll(".stat--number");
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