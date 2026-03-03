const sections = document.querySelectorAll('main > section');
const navLinks = document.querySelectorAll('header a');

const observerOptions = {
    threshold: 0.6
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');

            // Quitar clase activa a todos
            navLinks.forEach(link => {
                link.classList.remove('active');

                // Añadir clase al link que coincida con el id de la sección
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));