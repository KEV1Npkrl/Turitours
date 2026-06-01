/**
 * Admin App — Logica compartida para paneles internos
 * Sidebar, auth guard, toast, modal, tabla paginada, utilidades
 */
const AdminApp = (function () {

    /* ═══════════════════════════════════════
       ICONS (SVG inline)
       ═══════════════════════════════════════ */
    const ICONS = {
        map_pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
        tours: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        reservas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>',
        caja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        turistas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        operaciones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        inventario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        personal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        reportes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
        auditoria: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
        plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
        x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
        alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
        download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
        edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
        trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
        arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
        lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
    };

    /* ═══════════════════════════════════════
       SIDEBAR MENU CONFIG
       ═══════════════════════════════════════ */
    const MENU = [
        { section: 'General' },
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: 'index.html', modulo: 'dashboard' },
        { section: 'Catálogo' },
        { id: 'destinos', label: 'Destinos', icon: 'map_pin', href: 'destinos.html', modulo: 'tours' },
        { id: 'tours', label: 'Tours', icon: 'tours', href: 'tours.html', modulo: 'tours' },
        { section: 'Ventas' },
        { id: 'reservas', label: 'Reservas', icon: 'reservas', href: 'reservas.html', modulo: 'reservas' },
        { id: 'turistas', label: 'Turistas', icon: 'turistas', href: 'turistas.html', modulo: 'turistas' },
        { id: 'caja', label: 'Caja', icon: 'caja', href: 'caja.html', modulo: 'caja' },
        { section: 'Operaciones' },
        { id: 'operaciones', label: 'Operaciones', icon: 'operaciones', href: 'operaciones.html', modulo: 'operaciones' },
        { id: 'inventario', label: 'Inventario', icon: 'inventario', href: 'inventario.html', modulo: 'inventario' },
        { section: 'Administración' },
        { id: 'personal', label: 'Personal', icon: 'personal', href: 'personal.html', modulo: 'personal' },
        { id: 'auditoria', label: 'Auditoria', icon: 'auditoria', href: 'auditoria.html', modulo: 'auditoria' }
    ];

    /* ═══════════════════════════════════════
       INIT — Auth guard + Sidebar
       ═══════════════════════════════════════ */
    function init(pagina) {
        if (!AdminAPI.isAdminAuth()) {
            window.location.href = 'login.html';
            return false;
        }
        renderSidebar(pagina);
        initMobileToggle();
        initToastContainer();
        return true;
    }

    /* ═══════════════════════════════════════
       SIDEBAR RENDER
       ═══════════════════════════════════════ */
    function renderSidebar(currentPage) {
        const sidebar = document.getElementById('adminSidebar');
        if (!sidebar) return;

        const session = AdminAPI.getSession();
        const modulos = AdminAPI.getModulosPermitidos();
        const initials = session ? session.nombre.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : '??';
        const rolState = getAdminDb();
        const rol = rolState.roles.find(r => r.id === session.rol_id);
        const rolNombre = rol ? rol.nombre : 'Usuario';

        let navHtml = '';
        MENU.forEach(item => {
            if (item.section) {
                navHtml += `<div class="sidebar-section-title">${item.section}</div>`;
                return;
            }
            if (!modulos.includes(item.modulo)) return;
            const isActive = currentPage === item.id;
            navHtml += `
                <a href="${item.href}" class="sidebar-link${isActive ? ' active' : ''}" data-page="${item.id}">
                    ${ICONS[item.icon] || ''}
                    <span>${item.label}</span>
                </a>`;
        });

        sidebar.innerHTML = `
            <div class="sidebar-brand">
                <div class="sidebar-brand-logo" style="background:transparent;">
                    <img src="../assets/turitours_logo.webp" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:8px;">
                </div>
                <div class="sidebar-brand-text">
                    <span class="sidebar-brand-name">TuriTours</span>
                    <span class="sidebar-brand-role">${rolNombre}</span>
                </div>
            </div>
            <nav class="sidebar-nav">
                <div class="sidebar-section">${navHtml}</div>
            </nav>
            <div class="sidebar-footer">
                <div class="sidebar-user-avatar">${initials}</div>
                <div class="sidebar-user-info">
                    <div class="sidebar-user-name">${session ? session.nombre : 'Usuario'}</div>
                    <div class="sidebar-user-role">${session ? session.email : ''}</div>
                </div>
                <button class="sidebar-logout" id="sidebarLogout" title="Cerrar sesion">${ICONS.logout}</button>
            </div>`;

        document.getElementById('sidebarLogout')?.addEventListener('click', () => AdminAPI.logout());
    }

    /* ═══════════════════════════════════════
       MOBILE TOGGLE
       ═══════════════════════════════════════ */
    function initMobileToggle() {
        const toggle = document.getElementById('menuToggleAdmin');
        const sidebar = document.getElementById('adminSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay?.classList.toggle('open');
        });

        overlay?.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        });
    }

    /* ═══════════════════════════════════════
       TOAST SYSTEM
       ═══════════════════════════════════════ */
    function initToastContainer() {
        if (document.querySelector('.a-toast-container')) return;
        const c = document.createElement('div');
        c.className = 'a-toast-container';
        c.id = 'toastContainer';
        document.body.appendChild(c);
    }

    function toast(msg, type) {
        type = type || 'success';
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const iconMap = {
            success: `<span class="a-toast-icon" style="color:var(--a-success)">${ICONS.check}</span>`,
            error: `<span class="a-toast-icon" style="color:var(--a-danger)">${ICONS.alert}</span>`,
            warning: `<span class="a-toast-icon" style="color:var(--a-warning)">${ICONS.alert}</span>`,
            info: `<span class="a-toast-icon" style="color:var(--a-info)">${ICONS.alert}</span>`
        };
        const cssClass = type === 'success' ? '' : ' toast-' + type;

        const el = document.createElement('div');
        el.className = 'a-toast' + cssClass;
        el.innerHTML = `${iconMap[type] || iconMap.info}<span class="a-toast-msg">${msg}</span>
            <button class="a-toast-close">${ICONS.x}</button>`;
        container.appendChild(el);

        const close = () => { el.classList.add('removing'); setTimeout(() => el.remove(), 200); };
        el.querySelector('.a-toast-close').addEventListener('click', close);
        setTimeout(close, 4500);
    }

    /* ═══════════════════════════════════════
       MODAL SYSTEM
       ═══════════════════════════════════════ */
    function openModal(id) {
        const overlay = document.getElementById(id);
        if (overlay) {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(id) {
        const overlay = document.getElementById(id);
        if (overlay) {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    function initModalCloseButtons() {
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-close-modal');
                closeModal(modalId);
            });
        });

        document.querySelectorAll('.a-modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal(overlay.id);
            });
        });
    }

    /* ═══════════════════════════════════════
       UTILITY FUNCTIONS
       ═══════════════════════════════════════ */
    function formatFecha(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function formatFechaHora(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
            ' ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    }

    function formatMoney(amount) {
        return 'S/ ' + parseFloat(amount || 0).toFixed(2);
    }

    function badgeEstado(estado) {
        const map = {
            confirmada: 'green', completada: 'blue', pendiente: 'amber',
            anulada: 'red', reprogramada: 'purple',
            abierta: 'green', cerrada: 'gray',
            activo: 'green', inactivo: 'gray', bloqueado: 'red',
            pagado: 'green'
        };
        const color = map[estado] || 'gray';
        return `<span class="a-badge a-badge-${color} a-badge-dot">${estado}</span>`;
    }

    function badgeMetodo(metodo) {
        const map = {
            efectivo: 'green', yape: 'purple', plin: 'blue',
            transferencia: 'indigo', tarjeta: 'amber'
        };
        const color = map[metodo] || 'gray';
        return `<span class="a-badge a-badge-${(color === 'indigo' ? 'blue' : color)}">${metodo}</span>`;
    }

    function icon(name) {
        return ICONS[name] || '';
    }

    /* ═══════════════════════════════════════
       PUBLIC
       ═══════════════════════════════════════ */
    return {
        init, renderSidebar, toast,
        openModal, closeModal, initModalCloseButtons,
        formatFecha, formatFechaHora, formatMoney,
        badgeEstado, badgeMetodo, icon, ICONS
    };
})();

if (typeof window !== 'undefined') window.AdminApp = AdminApp;
