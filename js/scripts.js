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
    const isOpen = nav.classList.contains("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
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
                modalDetail.textContent = data.detail;
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

/* LIGHTBOX */
document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById('lightbox-gallery');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.getElementById('js-lightbox-close');

    // Escuchar clicks en botones "Conoce más"
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-lightbox');
        if (btn) {
            const imgSrc = btn.getAttribute('data-src');
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightbox.showModal();
                document.body.style.overflow = 'hidden'; // Bloquea scroll fondo
            }
        }
    });

    // Cerrar Lightbox
    const handleCloseLightbox = () => {
        lightbox.close();
        document.body.style.overflow = ''; // Libera scroll
        lightboxImg.src = ''; // Limpia la imagen para la próxima carga
    };

    closeLightbox.addEventListener('click', handleCloseLightbox);

    // Cerrar al hacer click fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) handleCloseLightbox();
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
/* ============================================================
   LEGADO — TIMELINE
============================================================ */
const legadoMilestones = [
  {
    year:  '1945',
    title: 'Predicción meteorológica militar',
    text:  'El ENIAC fue utilizado para realizar las primeras simulaciones numéricas del clima, una capacidad crítica para planificar operaciones militares como desembarcos y ofensivas aéreas. Por primera vez, una máquina podía anticipar la naturaleza.',
    tag:   'Meteorología · Simulación · Ejército'
  },
  {
    year:  '1946',
    title: 'Cálculos de la bomba de hidrógeno',
    text:  'El matemático John von Neumann utilizó el ENIAC para realizar los primeros cálculos termonucleares, determinando la viabilidad de la bomba de hidrógeno y marcando el inicio de la era nuclear computacional.',
    tag:   'Von Neumann · Fisión nuclear · Guerra Fría'
  },
  {
    year:  '1949',
    title: 'Diseño de túneles de viento',
    text:  'El ENIAC permitió simular flujos aerodinámicos complejos, acelerando el diseño de aviones supersónicos y cohetes que serían esenciales en la Guerra Fría y la carrera espacial. La ingeniería dejaba de depender solo del ensayo y error.',
    tag:   'Aerodinámica · Supersónico · Cohetes'
  },
  {
    year:  '1950s',
    title: 'Nacimiento de la programación moderna',
    text:  'Las técnicas inventadas por las ENIAC Six —subrutinas, bucles anidados, depuración sistemática— se convirtieron en los fundamentos de la ingeniería de software que usamos hoy. Programar dejó de ser un arte improvisado para convertirse en una disciplina.',
    tag:   'ENIAC Six · Subrutinas · Ingeniería de software'
  },
  {
    year:  '1957',
    title: 'Carrera espacial',
    text:  'Los sucesores directos del ENIAC calcularon las trayectorias orbitales del programa espacial. Sin la computación que nació con el ENIAC, ni el Sputnik ni el Apollo habrían existido. El código que comenzó en un sótano de Filadelfia llegó a la Luna.',
    tag:   'Sputnik · Apollo · NASA'
  },
  {
    year:  '1969',
    title: 'ARPANET y los orígenes de Internet',
    text:  'La red ARPANET, precursora de Internet, fue posible gracias a la computación digital nacida del ENIAC. Los principios de conmutación de paquetes se calcularon en máquinas herederas directas. Ese mismo año, el ser humano pisaba la Luna.',
    tag:   'ARPANET · Internet · Redes'
  },
  {
    year:  '1970s',
    title: 'Criptografía computacional',
    text:  'Los sistemas de cifrado militar evolucionaron de mecánicos a digitales gracias a la potencia de cálculo inaugurada por el ENIAC, revolucionando la inteligencia y la seguridad nacional. La privacidad digital que protege internet hoy tiene su raíz aquí.',
    tag:   'Cifrado · Seguridad · Inteligencia'
  }
];

const legBtnPrev  = document.getElementById('leg-tl-prev');
const legBtnNext  = document.getElementById('leg-tl-next');
const legFill     = document.getElementById('leg-tl-fill');
const legDetail   = document.getElementById('leg-tl-detail');
const legHitos    = document.querySelectorAll('.legado-hito');
const legNavDots  = document.querySelectorAll('.legado-nav__dot');

let legCurrent = 0;

const legGoTo = (index) => {
  legHitos.forEach((hito, i) => {
    hito.classList.toggle('is-active', i === index);
    hito.classList.toggle('is-past',   i < index);
  });

  legNavDots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));

  legFill.style.width = index === 0 ? '0%' : `${index / (legHitos.length - 1) * 100}%`;

  legBtnPrev.disabled = index === 0;
  legBtnNext.disabled = index === legHitos.length - 1;

  legDetail.classList.remove('is-visible');

  setTimeout(() => {
    document.getElementById('leg-tl-year').textContent  = legadoMilestones[index].year;
    document.getElementById('leg-tl-title').textContent = legadoMilestones[index].title;
    document.getElementById('leg-tl-text').textContent  = legadoMilestones[index].text;
    document.getElementById('leg-tl-tag').textContent   = legadoMilestones[index].tag;
    legDetail.classList.add('is-visible');
  }, 160);

  legCurrent = index;
};

legBtnNext.addEventListener('click', () => legGoTo(legCurrent + 1));
legBtnPrev.addEventListener('click', () => legGoTo(legCurrent - 1));

legHitos.forEach((hito, i) => hito.addEventListener('click', () => legGoTo(i)));

document.addEventListener('keydown', (e) => {
  if (!document.getElementById('legado')?.contains(document.activeElement)) return;
  if (e.key === 'ArrowRight' && legCurrent < legHitos.length - 1) legGoTo(legCurrent + 1);
  if (e.key === 'ArrowLeft'  && legCurrent > 0)                   legGoTo(legCurrent - 1);
});

legGoTo(0);

/* ============================================================
   LEGADO — FLIP CARDS
============================================================ */
document.querySelectorAll('.flip-card').forEach((card) => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});