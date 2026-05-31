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

    initPasswordToggle('password', 'togglePassword');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value;

        if (!email || !password) {
            mostrarAlerta('Completa los campos obligatorios', 'warning');
            return;
        }

        try {
            await API.login(email, password);
            mostrarAlerta('Sesion iniciada correctamente', 'success');

            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect') || 'mis-reservas.html';

            const pending = localStorage.getItem('pendingBooking');
            if (pending) {
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

    initPasswordToggle('password', 'togglePassword');
    initPasswordToggle('confirmPassword', 'toggleConfirmPassword');

    applyDocumentFieldRules(form.tipo_doc.value, form.documento);
    form.tipo_doc.addEventListener('change', function() {
        form.documento.value = '';
        clearFieldError('documento');
        applyDocumentFieldRules(form.tipo_doc.value, form.documento);
    });

    await initCountryPicker(form);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearFormErrors(form);

        const paisVal = form.pais_id.value.trim();
        const datos = {
            tipo_doc: form.tipo_doc.value,
            documento: form.documento.value.trim(),
            nombre: form.nombre.value.trim(),
            apellidos: form.apellidos.value.trim(),
            email: form.email.value.trim(),
            celular: form.celular.value.trim(),
            pais_id: paisVal ? parseInt(paisVal, 10) : null,
            restricciones_medicas: form.restricciones_medicas.value.trim() || null,
            password: form.password.value,
            confirmPassword: form.confirmPassword.value,
            politica: form.politica.checked
        };

        const resultado = TuristaValidacion.validarRegistro(datos);
        if (!resultado.valido) {
            mostrarErroresFormulario(form, resultado.errores);
            const primerCampo = Object.keys(resultado.errores)[0];
            const input = form[primerCampo] || document.getElementById(primerCampo);
            if (input && typeof input.focus === 'function') input.focus();
            return;
        }

        try {
            await API.registro({
                tipo_doc: datos.tipo_doc,
                documento: datos.documento,
                nombre: datos.nombre,
                apellidos: datos.apellidos,
                email: datos.email || null,
                celular: datos.celular || null,
                pais_id: datos.pais_id,
                restricciones_medicas: datos.restricciones_medicas,
                password: datos.password
            });

            mostrarAlerta('Cuenta creada. Ya puedes iniciar sesion.', 'success');
            window.location.href = 'login.html';
        } catch (error) {
            mostrarAlerta(error.message || 'No se pudo registrar', 'error');
        }
    });
}

function applyDocumentFieldRules(tipoDoc, input) {
    if (!input || typeof TuristaValidacion === 'undefined') return;
    const regla = TuristaValidacion.getReglaDocumento(tipoDoc);
    input.maxLength = regla.maxlength;
    input.placeholder = regla.placeholder;
    input.setAttribute('inputmode', regla.inputmode);

    const hint = document.getElementById('documentoHint');
    if (hint) hint.textContent = regla.mensaje.replace(/^El /, '').replace(/\.$/, '');
}

function clearFieldError(fieldName) {
    const errorEl = document.getElementById(fieldName + 'Error');
    const input = document.getElementById(fieldName);
    if (errorEl) errorEl.textContent = '';
    if (input) input.classList.remove('is-invalid');
}

function clearFormErrors(form) {
    form.querySelectorAll('.field-error').forEach(function(el) {
        el.textContent = '';
    });
    form.querySelectorAll('.is-invalid').forEach(function(el) {
        el.classList.remove('is-invalid');
    });
}

function mostrarErroresFormulario(form, errores) {
    Object.keys(errores).forEach(function(campo) {
        const errorEl = document.getElementById(campo + 'Error');
        const input = form[campo] || document.getElementById(campo);
        if (errorEl) errorEl.textContent = errores[campo];
        if (input && input.classList) input.classList.add('is-invalid');
    });
}

async function initCountryPicker(form) {
    const searchInput = document.getElementById('pais_search');
    const hiddenInput = form.pais_id;
    const listbox = document.getElementById('pais_listbox');
    const picker = document.getElementById('countryPicker');
    if (!searchInput || !hiddenInput || !listbox || !picker) return;

    let paises = [];
    try {
        paises = await API.getPaises();
    } catch (error) {
        paises = typeof PAISES_CATALOGO !== 'undefined' ? PAISES_CATALOGO : [];
    }

    let selectedPais = null;
    if (hiddenInput.value) {
        const initialId = parseInt(hiddenInput.value, 10);
        selectedPais = paises.find(function(p) { return p.id === initialId; }) || null;
    }
    if (!selectedPais) {
        selectedPais = paises.find(function(p) { return p.id === 1; }) || paises[0] || null;
    }
    let activeIndex = -1;

    function normalize(text) {
        return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function getFlagClass(iso) {
        if (typeof isoToFlagClass === 'function') return isoToFlagClass(iso);
        if (!iso || iso.length !== 2) return 'fi fi-xx';
        return 'fi fi-' + iso.toLowerCase();
    }

    function setSelected(pais) {
        selectedPais = pais;
        hiddenInput.value = pais ? String(pais.id) : '';
        if (pais) {
            searchInput.value = pais.nombre;
            searchInput.dataset.iso = pais.codigo_iso;
            updateInputFlagDisplay(searchInput);
        } else {
            searchInput.value = '';
            delete searchInput.dataset.iso;
            updateInputFlagDisplay(searchInput);
        }
    }

    function updateInputFlagDisplay(input) {
        const field = input.closest('.country-picker-field');
        if (!field) return;

        let flagEl = field.querySelector('.country-picker-flag');
        const iso = input.dataset.iso;

        if (!iso) {
            if (flagEl) flagEl.classList.add('hidden');
            return;
        }

        if (!flagEl) {
            flagEl = document.createElement('span');
            flagEl.className = 'country-picker-flag';
            flagEl.setAttribute('aria-hidden', 'true');
            field.insertBefore(flagEl, input);
        }

        flagEl.className = 'country-picker-flag ' + getFlagClass(iso);
    }

    function filterPaises(query) {
        const q = normalize(query);
        if (!q) return paises.slice(0, 80);
        return paises.filter(function(p) {
            return normalize(p.nombre).includes(q) ||
                (p.codigo_iso && p.codigo_iso.toLowerCase().includes(q));
        }).slice(0, 80);
    }

    function renderList(items) {
        listbox.innerHTML = '';
        activeIndex = -1;

        if (!items.length) {
            const empty = document.createElement('li');
            empty.className = 'country-picker-empty';
            empty.textContent = 'No se encontraron paises';
            listbox.appendChild(empty);
            return;
        }

        items.forEach(function(pais, index) {
            const li = document.createElement('li');
            li.className = 'country-picker-item';
            li.setAttribute('role', 'option');
            li.dataset.id = pais.id;
            li.dataset.index = index;
            li.innerHTML = '<span class="country-flag ' + getFlagClass(pais.codigo_iso) + '"></span><span>' + pais.nombre + '</span>';
            li.addEventListener('mousedown', function(e) {
                e.preventDefault();
                selectPais(pais);
            });
            listbox.appendChild(li);
        });
    }

    function openList() {
        listbox.classList.remove('hidden');
        searchInput.setAttribute('aria-expanded', 'true');
    }

    function closeList() {
        listbox.classList.add('hidden');
        searchInput.setAttribute('aria-expanded', 'false');
        activeIndex = -1;
    }

    function selectPais(pais) {
        setSelected(pais);
        closeList();
    }

    function highlightItem(index) {
        const items = listbox.querySelectorAll('.country-picker-item');
        items.forEach(function(el) { el.classList.remove('is-active'); });
        if (index >= 0 && index < items.length) {
            items[index].classList.add('is-active');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    if (selectedPais) setSelected(selectedPais);

    const field = searchInput.closest('.country-picker-field');
    if (field) {
        field.addEventListener('click', function() {
            searchInput.focus();
        });
    }

    searchInput.addEventListener('focus', function() {
        renderList(filterPaises(searchInput.value));
        openList();
    });

    searchInput.addEventListener('input', function() {
        hiddenInput.value = '';
        selectedPais = null;
        delete searchInput.dataset.iso;
        updateInputFlagDisplay(searchInput);
        renderList(filterPaises(searchInput.value));
        openList();
    });

    searchInput.addEventListener('keydown', function(e) {
        const items = listbox.querySelectorAll('.country-picker-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (listbox.classList.contains('hidden')) {
                renderList(filterPaises(searchInput.value));
                openList();
            }
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
            highlightItem(activeIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            highlightItem(activeIndex);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && items[activeIndex]) {
                const id = parseInt(items[activeIndex].dataset.id, 10);
                const pais = paises.find(function(p) { return p.id === id; });
                if (pais) selectPais(pais);
            }
        } else if (e.key === 'Escape') {
            closeList();
        }
    });

    document.addEventListener('click', function(e) {
        if (!picker.contains(e.target)) {
            closeList();
            if (!hiddenInput.value && searchInput.value.trim()) {
                searchInput.value = '';
            } else if (selectedPais) {
                setSelected(selectedPais);
            }
        }
    });
}

function initPasswordToggle(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (!input || !button) return;

    const iconEye = button.querySelector('.icon-eye');
    const iconEyeOff = button.querySelector('.icon-eye-off');

    button.addEventListener('click', function() {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        button.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
        button.setAttribute('aria-label', isHidden ? 'Ocultar contrasena' : 'Mostrar contrasena');

        if (iconEye && iconEyeOff) {
            iconEye.classList.toggle('hidden', isHidden);
            iconEyeOff.classList.toggle('hidden', !isHidden);
        }
    });
}

if (typeof window !== 'undefined') {
    window.initCountryPicker = initCountryPicker;
    window.initPasswordToggle = initPasswordToggle;
    window.clearFormErrors = clearFormErrors;
    window.mostrarErroresFormulario = mostrarErroresFormulario;
}
