/**
 * Responsive JS - Hamburger menu injection for SuperAdmin & Agencia panels
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- SuperAdmin layout ---
    const saHeader = document.querySelector('.sa-header');
    const saSidebar = document.querySelector('.sa-sidebar');

    if (saHeader && saSidebar && !document.querySelector('.mobile-toggle')) {
        // Create hamburger button
        const btn = document.createElement('button');
        btn.className = 'mobile-toggle';
        btn.setAttribute('aria-label', 'Abrir menu');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        saHeader.insertBefore(btn, saHeader.firstChild);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sa-sidebar-overlay';
        overlay.id = 'saSidebarOverlay';
        document.body.appendChild(overlay);

        // Toggle sidebar
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            saSidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        });

        // Close on overlay click
        overlay.addEventListener('click', () => {
            saSidebar.classList.remove('open');
            overlay.classList.remove('open');
        });

        // Close on nav link click (mobile)
        saSidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    saSidebar.classList.remove('open');
                    overlay.classList.remove('open');
                }
            });
        });
    }

    // --- Agencia layout ---
    const topbar = document.querySelector('.topbar');
    const sidebar = document.querySelector('.sidebar');

    if (topbar && sidebar && !topbar.querySelector('.mobile-toggle')) {
        const btn = document.createElement('button');
        btn.className = 'mobile-toggle';
        btn.setAttribute('aria-label', 'Abrir menu');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        topbar.insertBefore(btn, topbar.firstChild);

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
    }

    // --- Close sidebar when clicking outside on mobile ---
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            // SuperAdmin
            if (saSidebar && saSidebar.classList.contains('open')) {
                const toggle = document.querySelector('.mobile-toggle');
                if (!saSidebar.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
                    saSidebar.classList.remove('open');
                    const ov = document.getElementById('saSidebarOverlay');
                    if (ov) ov.classList.remove('open');
                }
            }
            // Agencia
            if (sidebar && sidebar.classList.contains('open')) {
                const toggle = topbar ? topbar.querySelector('.mobile-toggle') : null;
                if (!sidebar.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
                    sidebar.classList.remove('open');
                }
            }
        }
    });
});
