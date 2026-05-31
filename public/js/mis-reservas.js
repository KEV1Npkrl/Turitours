/**
 * Portal Mis Reservas — RF-C06 / RF-31
 * Tabla BD: reservas (+ tour, codigo_qr)
 */
document.addEventListener('DOMContentLoaded', initMisReservasPage);

const ESTADO_LABELS = {
    pendiente: { text: 'Pendiente', className: 'estado-pendiente' },
    confirmada: { text: 'Confirmada', className: 'estado-confirmada' },
    completada: { text: 'Completada', className: 'estado-completada' },
    anulada: { text: 'Anulada', className: 'estado-anulada' },
    reprogramada: { text: 'Reprogramada', className: 'estado-reprogramada' }
};

let reservasCache = [];

async function initMisReservasPage() {
    const container = document.getElementById('reservasContent');
    if (!container) return;

    if (!API.isAuthenticated()) {
        window.location.href = 'login.html?redirect=mis-reservas.html';
        return;
    }

    setupModal();
    await loadReservas();

    const params = new URLSearchParams(window.location.search);
    const reservaId = params.get('id');
    if (reservaId) {
        openVoucher(parseInt(reservaId, 10));
    }
}

function setupModal() {
    const modal = document.getElementById('reservaModal');
    if (!modal) return;

    modal.querySelectorAll('[data-close-modal]').forEach(function(el) {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal() {
    const modal = document.getElementById('reservaModal');
    if (modal) {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('reservaModal');
    if (modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
    }
}

async function loadReservas() {
    const container = document.getElementById('reservasContent');
    const welcome = document.getElementById('reservasWelcome');

    try {
        const user = await API.getUsuarioActual();
        if (welcome && user) {
            welcome.textContent = 'Hola, ' + user.nombre + '. Aqui puedes ver y gestionar tus reservas.';
        }

        reservasCache = await API.getReservasUsuario();

        if (!reservasCache.length) {
            container.innerHTML = `
                <div class="reservas-empty">
                    <h2>Aun no tienes reservas</h2>
                    <p>Explora nuestros tours y reserva tu proxima aventura en Tarapoto.</p>
                    <a href="tours.html" class="btn btn-primary">Ver tours</a>
                </div>
            `;
            return;
        }

        reservasCache.sort(function(a, b) {
            return new Date(b.fecha_servicio) - new Date(a.fecha_servicio);
        });

        container.innerHTML = `
            <div class="reservas-toolbar">
                <p><strong>${reservasCache.length}</strong> reserva(s) encontrada(s)</p>
                <a href="tours.html" class="btn btn-outline btn-sm">Nueva reserva</a>
            </div>
            <div class="reservas-list">
                ${reservasCache.map(renderReservaCard).join('')}
            </div>
        `;

        bindReservaActions(container);
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="reservas-empty">
                <p>No se pudieron cargar tus reservas.</p>
                <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
}

function renderReservaCard(reserva) {
    const tour = reserva.tour;
    const estado = ESTADO_LABELS[reserva.estado] || ESTADO_LABELS.pendiente;
    const imagen = tour ? tour.imagen_principal : '';
    const nombreTour = tour ? tour.nombre : 'Tour #' + reserva.tour_id;

    return `
        <article class="reserva-card" data-reserva-id="${reserva.id}">
            <div class="reserva-card-image">
                ${imagen ? `<img src="${imagen}" alt="${nombreTour}" loading="lazy">` : ''}
            </div>
            <div class="reserva-card-body">
                <div class="reserva-card-header">
                    <h2>${nombreTour}</h2>
                    <span class="reserva-estado ${estado.className}">${estado.text}</span>
                </div>
                <ul class="reserva-meta">
                    <li><strong>Fecha:</strong> ${formatFecha(reserva.fecha_servicio)}</li>
                    <li><strong>Personas:</strong> ${reserva.num_personas}</li>
                    <li><strong>Total:</strong> ${formatPrecio(reserva.total)}</li>
                    ${reserva.saldo_pendiente > 0 ? `<li><strong>Saldo pendiente:</strong> ${formatPrecio(reserva.saldo_pendiente)}</li>` : ''}
                    <li><strong>Codigo:</strong> ${reserva.codigo_qr || '—'}</li>
                </ul>
                <div class="reserva-card-actions">
                    <button type="button" class="btn btn-primary btn-sm" data-action="voucher" data-id="${reserva.id}">Ver voucher</button>
                    ${canReprogramar(reserva) ? `<button type="button" class="btn btn-outline btn-sm" data-action="reprogramar" data-id="${reserva.id}">Cambiar fecha</button>` : ''}
                    ${canCancelar(reserva) ? `<button type="button" class="btn btn-outline btn-sm reserva-btn-danger" data-action="cancelar" data-id="${reserva.id}">Anular</button>` : ''}
                </div>
            </div>
        </article>
    `;
}

function canReprogramar(reserva) {
    return reserva.estado === 'pendiente' || reserva.estado === 'confirmada' || reserva.estado === 'reprogramada';
}

function canCancelar(reserva) {
    return reserva.estado === 'pendiente' || reserva.estado === 'confirmada' || reserva.estado === 'reprogramada';
}

function bindReservaActions(container) {
    container.querySelectorAll('[data-action]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
            const id = parseInt(this.dataset.id, 10);
            const action = this.dataset.action;

            if (action === 'voucher') openVoucher(id);
            if (action === 'cancelar') await handleCancelar(id);
            if (action === 'reprogramar') await handleReprogramar(id);
        });
    });
}

function openVoucher(reservaId) {
    const reserva = reservasCache.find(function(r) { return r.id === reservaId; });
    if (!reserva) return;

    const tour = reserva.tour;
    const estado = ESTADO_LABELS[reserva.estado] || ESTADO_LABELS.pendiente;
    const qrData = encodeURIComponent(reserva.codigo_qr || 'RESERVA-' + reserva.id);
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + qrData;

    document.getElementById('voucherContent').innerHTML = `
        <div class="voucher-print" id="voucherPrint">
            <div class="voucher-header">
                <div>
                    <p class="voucher-kicker">Tarapoto Tours</p>
                    <h2 id="modalTitle">Voucher de reserva</h2>
                    <p class="voucher-code">${reserva.codigo_qr}</p>
                </div>
                <span class="reserva-estado ${estado.className}">${estado.text}</span>
            </div>

            <div class="voucher-grid">
                <div class="voucher-details">
                    <h3>${tour ? tour.nombre : 'Tour'}</h3>
                    <dl class="voucher-dl">
                        <div><dt>Reserva N°</dt><dd>${String(reserva.id).padStart(5, '0')}</dd></div>
                        <div><dt>Fecha del servicio</dt><dd>${formatFecha(reserva.fecha_servicio)}</dd></div>
                        <div><dt>Hora de recojo</dt><dd>${formatHora(reserva.hora_recojo)}</dd></div>
                        <div><dt>Lugar de recojo</dt><dd>${reserva.lugar_recojo || 'Por confirmar'}</dd></div>
                        <div><dt>Personas</dt><dd>${reserva.num_personas}</dd></div>
                        <div><dt>Total</dt><dd>${formatPrecio(reserva.total)}</dd></div>
                        <div><dt>Saldo pendiente</dt><dd>${formatPrecio(reserva.saldo_pendiente)}</dd></div>
                        <div><dt>Canal</dt><dd>${reserva.canal === 'web' ? 'Reserva web' : 'Mostrador'}</dd></div>
                    </dl>
                    <p class="voucher-note">Presenta este codigo QR el dia del tour para validar tu reserva.</p>
                </div>
                <div class="voucher-qr">
                    <img src="${qrUrl}" width="200" height="200" alt="Codigo QR de la reserva ${reserva.codigo_qr}">
                    <p>${reserva.codigo_qr}</p>
                </div>
            </div>
        </div>
        <div class="voucher-actions no-print">
            <button type="button" class="btn btn-primary" onclick="window.print()">Imprimir / PDF</button>
            <button type="button" class="btn btn-outline" data-close-modal>Cerrar</button>
        </div>
    `;

    document.getElementById('voucherContent').querySelector('[data-close-modal]')
        ?.addEventListener('click', closeModal);

    openModal();
}

async function handleCancelar(reservaId) {
    const motivo = prompt('Motivo de anulacion (opcional):');
    if (motivo === null) return;

    try {
        await API.cancelarReserva(reservaId, motivo || undefined);
        mostrarAlerta('Reserva anulada correctamente', 'success');
        await loadReservas();
    } catch (error) {
        mostrarAlerta(error.message || 'No se pudo anular la reserva', 'error');
    }
}

async function handleReprogramar(reservaId) {
    const reserva = reservasCache.find(function(r) { return r.id === reservaId; });
    if (!reserva) return;

    const fechaNueva = prompt('Nueva fecha (AAAA-MM-DD):', reserva.fecha_servicio);
    if (!fechaNueva) return;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNueva)) {
        mostrarAlerta('Formato de fecha invalido. Use AAAA-MM-DD', 'warning');
        return;
    }

    try {
        await API.reprogramarReserva(reservaId, fechaNueva);
        mostrarAlerta('Fecha actualizada correctamente', 'success');
        await loadReservas();
    } catch (error) {
        mostrarAlerta(error.message || 'No se pudo reprogramar', 'error');
    }
}

function formatHora(hora) {
    if (!hora) return 'Por confirmar';
    return hora.substring(0, 5);
}
