document.addEventListener("DOMContentLoaded", () => {

    document.body.classList.add("loaded");

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const overlay = document.querySelector(".menu-overlay");
    const reveals = document.querySelectorAll(".reveal");
    const title = document.querySelector(".title-gradient");

    /* ===============================
       HAMBURGER MENU
    ================================= */
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        overlay.classList.remove("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    /* ===============================
       TYPING EFFECT
    ================================= */
    const text = "Antonio Adolfo";
    let index = 0;
    title.textContent = "";

    function typeEffect() {
        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(typeEffect, 80);
        }
    }

    typeEffect();

    /* ===============================
       SCROLL REVEAL
    ================================= */
    window.addEventListener("scroll", () => {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                element.classList.add("active");
            }
        });
    });

    /* ===============================
       FOOTER YEAR
    ================================= */
    document.getElementById("year").textContent = new Date().getFullYear();

});


/* ===============================
   BOTÓN SUBIR ARRIBA
================================= */
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* ===============================
   FORMULARIO A GMAIL
================================= */
const form = document.getElementById("whatsappForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const asunto = document.getElementById("asunto").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    const tuCorreo = "antonioadolfo0827@gmail.com"; // 🔥 PON TU GMAIL REAL

    const subject = `📩 Nueva Solicitud desde tu Portafolio | ${asunto}`;

const body =
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        NUEVA SOLICITUD DE SERVICIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 INFORMACIÓN DEL CLIENTE
──────────────────────────
Nombre: ${nombre}
Correo Electrónico: ${correo}

📝 ASUNTO
──────────────────────────
${asunto}

📌 DETALLE DEL PROYECTO
──────────────────────────
${mensaje}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mensaje enviado automáticamente 
desde tu Portafolio Profesional.

© Antonio Adolfo | Ingeniero en Sistemas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const url = `https://mail.google.com/mail/?view=cm&to=${tuCorreo}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(url, "_blank");
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

function animateCircularSkills() {
    const circles = document.querySelectorAll(".circle");

    circles.forEach(circle => {
        const percent = circle.getAttribute("data-percent");
        const progress = circle.querySelector(".progress");

        const radius = 45;
        const circumference = 2 * Math.PI * radius;

        progress.style.strokeDasharray = circumference;

        const offset = circumference - (percent / 100) * circumference;

        const sectionTop = circle.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 50) {
            progress.style.strokeDashoffset = offset;
        }
    });
}

window.addEventListener("scroll", animateCircularSkills);
