/**
 * Contacto - Turi Tours
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = form.nombre.value.trim();
        const email = form.email.value.trim();
        const asunto = form.asunto.value;
        const mensaje = form.mensaje.value.trim();

        if (!nombre || !email || !asunto || !mensaje) {
            mostrarAlerta('Por favor completa todos los campos obligatorios.', 'warning');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarAlerta('Ingresa un correo electronico valido.', 'warning');
            return;
        }

        form.reset();
        mostrarAlerta('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
    });
});
