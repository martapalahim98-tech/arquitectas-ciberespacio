const container = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
let isScrolling = false;

// Función para mover a la sección
function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        isScrolling = true;
        sections[index].scrollIntoView({ behavior: 'smooth' });

        // Actualizar menú
        updateActiveLink(sections[index].id);

        // Desbloquear tras la animación
        setTimeout(() => { isScrolling = false; }, 800);
    }
}

// Detectar rueda del ratón
container.addEventListener('wheel', (e) => {
    if (isScrolling) return;

    const currentSection = [...sections].find(s => {
        const rect = s.getBoundingClientRect();
        return rect.top >= -50 && rect.top <= 50;
    });

    if (!currentSection) return;
    const currentIndex = [...sections].indexOf(currentSection);

    // Si scrolleamos hacia abajo
    if (e.deltaY > 0) {
        // Solo saltar si estamos al final de la sección actual
        if (container.scrollTop + container.clientHeight >= currentSection.offsetTop + currentSection.offsetHeight - 5) {
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
}, { passive: false });

// Actualizar links activos
function updateActiveLink(id) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
}

// Click en los links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
        updateActiveLink(targetId);
    });
});