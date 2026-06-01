// agencia.js - Funciones para el portal interno de la Agencia (Modelo Negocio)

if (typeof API !== 'undefined') {
    API.getMockDashboardAgencia = async function() {
        if (!API.USE_MOCK) return {}; // En producción llamaría a fetch('/api/agencia/dashboard')
        
        const state = JSON.parse(localStorage.getItem('turitours_db')) || INITIAL_MOCK_DB;
        
        // Simular datos de hoy
        const hoy = new Date().toISOString().split('T')[0];
        const reservasHoy = state.reservas || [];
        
        let ventasTotales = 0;
        let cantReservas = 0;
        let cantPasajeros = 0;
        let saldosPendientes = 0;
        
        reservasHoy.forEach(r => {
            // Contar todas como "de hoy" para el demo, a menos que queramos filtrar por r.creado_at
            ventasTotales += r.monto_total || 0;
            cantReservas++;
            cantPasajeros += r.num_personas || 0;
            if (r.estado_pago === 'ADELANTO') {
                saldosPendientes += (r.monto_total - (r.monto_adelanto || 0));
            }
        });

        // Ordenar ultimas reservas por ID desc
        const ultimas = [...reservasHoy].sort((a,b) => b.id - a.id).slice(0, 10);

        return {
            ventasHoy: ventasTotales,
            reservasHoy: cantReservas,
            pasajerosHoy: cantPasajeros,
            saldosPendientes: saldosPendientes,
            ultimasReservas: ultimas
        };
    };
}
