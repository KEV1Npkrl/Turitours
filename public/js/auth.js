/**
 * Autenticacion turista — Modelo Cliente
 * Tabla BD: turistas
 */
document.addEventListener('DOMContentLoaded', function() {
    initLoginPage();
    initRegistroPage();
});

function initLoginPage() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value;

        try {
            await API.login(email, password);
            mostrarAlerta('Sesion iniciada correctamente', 'success');

            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect') || 'mis-reservas.html';

            const pending = localStorage.getItem('pendingBooking');
            if (pending) {
                localStorage.removeItem('pendingBooking');
                const data = JSON.parse(pending);
                window.location.href = 'tour-detalle.html?id=' + data.tourId;
                return;
            }

            window.location.href = redirect;
        } catch (error) {
            mostrarAlerta(error.message || 'No se pudo iniciar sesion', 'error');
        }
    });
}

async function initRegistroPage() {
    const form = document.getElementById('registroForm');
    if (!form) return;

    const paisSelect = form.pais_id;
    if (paisSelect) {
        try {
            const paises = await API.getPaises();
            paises.forEach(function(pais) {
                const option = document.createElement('option');
                option.value = pais.id;
                option.textContent = pais.nombre;
                if (pais.id === 1) option.selected = true;
                paisSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando paises:', error);
        }
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (password !== confirmPassword) {
            mostrarAlerta('Las contrasenas no coinciden', 'warning');
            return;
        }

        if (!form.politica.checked) {
            mostrarAlerta('Debes aceptar la politica de privacidad', 'warning');
            return;
        }

        try {
            await API.registro({
                tipo_doc: form.tipo_doc.value,
                documento: form.documento.value.trim(),
                nombre: form.nombre.value.trim(),
                apellidos: form.apellidos.value.trim(),
                email: form.email.value.trim(),
                celular: form.celular.value.trim(),
                pais_id: parseInt(form.pais_id.value, 10),
                restricciones_medicas: form.restricciones_medicas.value.trim() || null,
                password
            });

            mostrarAlerta('Cuenta creada. Ya puedes iniciar sesion.', 'success');
            window.location.href = 'login.html';
        } catch (error) {
            mostrarAlerta(error.message || 'No se pudo registrar', 'error');
        }
    });
}
