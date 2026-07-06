/**
 * Contacto - Turi Tours
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nombre = form.nombre.value.trim();
        const email = form.email.value.trim();
        const telefono = form.telefono ? form.telefono.value.trim() : '';
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

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        try {
            if (window.API) {
                const res = await window.API.enviarContacto({ nombre, email, telefono, asunto, mensaje, agenciaId: window.API.AGENCIA_ID });
                if (res && res.success) {
                    form.reset();
                    mostrarAlerta(res.message || 'Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
                } else {
                    mostrarAlerta('Ocurrió un error al enviar tu mensaje. Intenta de nuevo.', 'error');
                }
            } else {
                form.reset();
                mostrarAlerta('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
            }
        } catch (error) {
            console.error(error);
            mostrarAlerta('Ocurrió un error al enviar tu mensaje.', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
});
