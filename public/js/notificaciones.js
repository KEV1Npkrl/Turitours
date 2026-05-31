/**
 * Notificaciones turista — RF-C07 (mock)
 */
document.addEventListener('DOMContentLoaded', initNotificacionesPage);

const TIPO_LABELS = {
    confirmacion_reserva: 'Confirmacion',
    recordatorio_24h: 'Recordatorio',
    anulacion: 'Anulacion',
    comunicado: 'Comunicado'
};

async function initNotificacionesPage() {
    const container = document.getElementById('notifContent');
    if (!container) return;

    if (!API.isAuthenticated()) {
        window.location.href = 'login.html?redirect=notificaciones.html';
        return;
    }

    try {
        const notifs = await API.getNotificacionesTurista();
        if (!notifs.length) {
            container.innerHTML = '<div class="notif-empty"><p>No tienes notificaciones aun.</p></div>';
            return;
        }
        container.innerHTML = '<ul class="notif-list">' +
            notifs.map(renderNotif).join('') + '</ul>';
    } catch (error) {
        container.innerHTML = '<p class="notif-empty">No se pudieron cargar las notificaciones.</p>';
    }
}

function renderNotif(n) {
    const tipo = TIPO_LABELS[n.tipo] || n.tipo;
    const fecha = new Date(n.created_at).toLocaleString('es-PE');
    return '<li class="notif-item notif-' + n.tipo + '">' +
        '<div class="notif-item-head"><span class="notif-tipo">' + tipo + '</span>' +
        '<time datetime="' + n.created_at + '">' + fecha + '</time></div>' +
        '<h3>' + escapeHtml(n.asunto) + '</h3>' +
        '<p>' + escapeHtml(n.cuerpo) + '</p>' +
        '<span class="notif-to">Para: ' + escapeHtml(n.destinatario) + '</span></li>';
}

function escapeHtml(t) {
    if (!t) return '';
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
