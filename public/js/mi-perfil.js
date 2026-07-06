/**
 * Mi Perfil — turista (tabla: turistas)
 * Campos no editables: tipo_doc, documento (identidad unica por agencia)
 */
document.addEventListener('DOMContentLoaded', initMiPerfilPage);

const SEGMENTO_LABELS = {
    normal: 'Turista',
    frecuente: 'Frecuente',
    vip: 'VIP'
};

async function initMiPerfilPage() {
    const container = document.getElementById('perfilContent');
    if (!container) return;

    if (!API.isAuthenticated()) {
        window.location.href = 'login.html?redirect=mi-perfil.html';
        return;
    }

    try {
        const user = await API.getUsuarioActual();
        if (!user) {
            window.location.href = 'login.html?redirect=mi-perfil.html';
            return;
        }

        const intro = document.getElementById('perfilIntro');
        if (intro) {
            intro.textContent = 'Hola, ' + user.nombre + '. Revisa y actualiza tus datos personales.';
        }

        renderPerfilForm(container, user);
        setupPerfilForm(user);
    } catch (error) {
        container.innerHTML = '<p class="perfil-error">No se pudo cargar tu perfil. Intenta de nuevo.</p>';
        console.error(error);
    }
}

function renderPerfilForm(container, user) {
    const initials = (user.nombre.charAt(0) + (user.apellidos ? user.apellidos.charAt(0) : '')).toUpperCase();
    const segmento = SEGMENTO_LABELS[user.segmento] || user.segmento || 'Turista';
    const emailVerificado = user.email_verificado ? 'Verificado' : 'Pendiente';

    container.innerHTML = `
        <div class="perfil-layout">
            <aside class="perfil-sidebar">
                <div class="perfil-avatar-card">
                    <span class="perfil-avatar" aria-hidden="true">${initials}</span>
                    <h2 class="perfil-avatar-name">${escapeHtml(user.nombre_completo)}</h2>
                    <p class="perfil-avatar-doc">${escapeHtml(user.tipo_doc)} ${escapeHtml(user.documento)}</p>
                </div>
                <ul class="perfil-meta-list">
                    <li><span>Segmento</span><strong>${escapeHtml(segmento)}</strong></li>
                    <li><span>Correo</span><strong>${escapeHtml(emailVerificado)}</strong></li>
                </ul>
                <a href="mis-reservas.html" class="btn btn-outline btn-block">Ver mis reservas</a>
            </aside>

            <div class="perfil-main">
                <form id="perfilForm" class="perfil-form" novalidate>
                    <section class="perfil-form-section">
                        <h3>Identidad</h3>
                        <p class="perfil-section-hint">Estos datos no se pueden modificar por seguridad.</p>
                        <div class="auth-form-grid">
                            <div class="form-group">
                                <label for="tipo_doc">Tipo de documento</label>
                                <input type="text" id="tipo_doc" class="form-input is-readonly" value="${escapeHtml(user.tipo_doc)}" readonly tabindex="-1">
                            </div>
                            <div class="form-group">
                                <label for="documento">Numero de documento</label>
                                <input type="text" id="documento" class="form-input is-readonly" value="${escapeHtml(user.documento)}" readonly tabindex="-1">
                            </div>
                        </div>
                    </section>

                    <section class="perfil-form-section">
                        <h3>Datos personales</h3>
                        <div class="auth-form-grid">
                            <div class="form-group">
                                <label for="nombre">Nombres</label>
                                <input type="text" id="nombre" name="nombre" class="form-input is-readonly" maxlength="60" required value="${escapeHtml(user.nombre)}" readonly tabindex="-1">
                                <span class="field-error" id="nombreError" role="alert"></span>
                            </div>
                            <div class="form-group">
                                <label for="apellidos">Apellidos</label>
                                <input type="text" id="apellidos" name="apellidos" class="form-input is-readonly" maxlength="80" required value="${escapeHtml(user.apellidos)}" readonly tabindex="-1">
                                <span class="field-error" id="apellidosError" role="alert"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="fecha_nacimiento">Fecha de nacimiento</label>
                            <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" class="form-input" value="${user.fecha_nacimiento || ''}">
                        </div>
                    </section>

                    <section class="perfil-form-section">
                        <h3>Contacto</h3>
                        <div class="auth-form-grid">
                            <div class="form-group">
                                <label for="email">Correo electronico</label>
                                <input type="email" id="email" name="email" class="form-input" maxlength="120" value="${escapeHtml(user.email || '')}" placeholder="tu@email.com">
                                <span class="field-error" id="emailError" role="alert"></span>
                            </div>
                            <div class="form-group">
                                <label for="celular">Celular / WhatsApp</label>
                                <input type="tel" id="celular" name="celular" class="form-input" maxlength="20" value="${escapeHtml(user.celular || '')}" placeholder="+51 999 000 000">
                                <span class="field-error" id="celularError" role="alert"></span>
                            </div>
                        </div>
                    </section>

                    <section class="perfil-form-section">
                        <h3>Preferencias de viaje</h3>
                        <div class="auth-form-grid">
                            <div class="form-group country-picker-wrap">
                                <label for="pais_search">Pais</label>
                                <input type="hidden" id="pais_id" name="pais_id" value="${user.pais_id || ''}">
                                <div class="country-picker" id="countryPicker">
                                    <div class="country-picker-field">
                                        <span class="country-picker-flag hidden" id="pais_flag" aria-hidden="true"></span>
                                        <input type="text" id="pais_search" class="country-picker-input" placeholder="Buscar pais..." autocomplete="off" role="combobox" aria-expanded="false" aria-controls="pais_listbox" aria-autocomplete="list">
                                    </div>
                                    <ul class="country-picker-list hidden" id="pais_listbox" role="listbox"></ul>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="restricciones_medicas">Restricciones medicas</label>
                                <input type="text" id="restricciones_medicas" name="restricciones_medicas" class="form-input" value="${escapeHtml(user.restricciones_medicas || '')}" placeholder="Opcional">
                            </div>
                        </div>
                    </section>

                    <section class="perfil-form-section">
                        <h3>Seguridad</h3>
                        <p class="perfil-section-hint">Deja en blanco si no deseas cambiar tu contrasena.</p>
                        <div class="form-group">
                            <label for="password_actual">Contrasena actual</label>
                            <div class="password-field">
                                <input type="password" id="password_actual" name="password_actual" class="form-input" autocomplete="current-password">
                                <button type="button" class="password-toggle" id="togglePasswordActual" aria-label="Mostrar contrasena" aria-pressed="false">
                                    <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    <svg class="icon-eye-off hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                </button>
                            </div>
                            <span class="field-error" id="password_actualError" role="alert"></span>
                        </div>
                        <div class="auth-form-grid">
                            <div class="form-group">
                                <label for="password_nueva">Nueva contrasena</label>
                                <div class="password-field">
                                    <input type="password" id="password_nueva" name="password_nueva" class="form-input" autocomplete="new-password" minlength="6">
                                    <button type="button" class="password-toggle" id="togglePasswordNueva" aria-label="Mostrar contrasena" aria-pressed="false">
                                        <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        <svg class="icon-eye-off hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    </button>
                                </div>
                                <span class="field-error" id="password_nuevaError" role="alert"></span>
                            </div>
                            <div class="form-group">
                                <label for="password_confirmar">Confirmar nueva contrasena</label>
                                <div class="password-field">
                                    <input type="password" id="password_confirmar" name="password_confirmar" class="form-input" autocomplete="new-password" minlength="6">
                                    <button type="button" class="password-toggle" id="togglePasswordConfirmar" aria-label="Mostrar contrasena" aria-pressed="false">
                                        <svg class="icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        <svg class="icon-eye-off hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    </button>
                                </div>
                                <span class="field-error" id="password_confirmarError" role="alert"></span>
                            </div>
                        </div>
                    </section>

                    <div class="perfil-form-actions">
                        <button type="submit" class="btn btn-primary btn-lg" id="perfilSubmitBtn">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function setupPerfilForm(user) {
    const form = document.getElementById('perfilForm');
    if (!form) return;

    initPasswordToggle('password_actual', 'togglePasswordActual');
    initPasswordToggle('password_nueva', 'togglePasswordNueva');
    initPasswordToggle('password_confirmar', 'togglePasswordConfirmar');
    initCountryPicker(form);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (typeof clearFormErrors === 'function') clearFormErrors(form);

        const paisVal = form.pais_id.value.trim();
        const datos = {
            nombre: form.nombre.value.trim(),
            apellidos: form.apellidos.value.trim(),
            email: form.email.value.trim(),
            celular: form.celular.value.trim(),
            pais_id: paisVal ? parseInt(paisVal, 10) : null,
            restricciones_medicas: form.restricciones_medicas.value.trim() || null,
            fecha_nacimiento: form.fecha_nacimiento.value || null,
            password_actual: form.password_actual.value,
            password_nueva: form.password_nueva.value,
            password_confirmar: form.password_confirmar.value
        };

        const resultado = TuristaValidacion.validarPerfil(datos);
        if (!resultado.valido) {
            if (typeof mostrarErroresFormulario === 'function') {
                mostrarErroresFormulario(form, resultado.errores);
            }
            const primerCampo = Object.keys(resultado.errores)[0];
            const input = form[primerCampo] || document.getElementById(primerCampo);
            if (input && typeof input.focus === 'function') input.focus();
            return;
        }

        const btn = document.getElementById('perfilSubmitBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Guardando...';
        }

        try {
            const response = await API.actualizarPerfil({
                nombre: datos.nombre,
                apellidos: datos.apellidos,
                email: datos.email || null,
                celular: datos.celular || null,
                pais_id: datos.pais_id,
                restricciones_medicas: datos.restricciones_medicas,
                fecha_nacimiento: datos.fecha_nacimiento,
                password_actual: datos.password_actual || null,
                password_nueva: datos.password_nueva || null
            });

            mostrarAlerta(response.message || 'Perfil actualizado correctamente', 'success');

            form.password_actual.value = '';
            form.password_nueva.value = '';
            form.password_confirmar.value = '';

            if (typeof initAuthHeader === 'function') {
                initAuthHeader();
            }

            const intro = document.getElementById('perfilIntro');
            if (intro && response.turista) {
                intro.textContent = 'Hola, ' + response.turista.nombre + '. Revisa y actualiza tus datos personales.';
            }
        } catch (error) {
            mostrarAlerta(error.message || 'No se pudo guardar el perfil', 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Guardar cambios';
            }
        }
    });
}

function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
