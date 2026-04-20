// =============================================
// CONFIGURACIÓN CENTRALIZADA DE TASKER'S MÉXICO
// =============================================

// Configuración de Supabase
const SUPABASE_URL = 'https://ayhflwricnkptoinabhe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZsd3JpY25rcHRvaW5hYmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTI0OTksImV4cCI6MjA4ODMyODQ5OX0.m5LaJmQVqoiBCbxYJ3ZGEV5x2c4oGjK9iHKtAfcc21M';

// Inicializar cliente Supabase (solo una vez)
let supabaseClient = null;

function initSupabase() {
    if (!supabaseClient && typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase inicializado desde config.js');
    } else if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase no cargado');
    }
    return supabaseClient;
}

// =============================================
// NOTIFICACIONES TOAST (modernas)
// =============================================
function mostrarToast(mensaje, tipo = 'info') {
    // Eliminar toast anterior si existe
    const toastAnterior = document.querySelector('.toast-notification');
    if (toastAnterior) toastAnterior.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium text-sm sm:text-base animate-slideIn ${
        tipo === 'success' ? 'bg-green-500' : 
        tipo === 'error' ? 'bg-red-500' : 
        tipo === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`;
    
    const icono = tipo === 'success' ? 'fa-check-circle' : 
                  tipo === 'error' ? 'fa-exclamation-triangle' : 
                  tipo === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `<i class="fas ${icono} mr-2"></i>${mensaje}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// =============================================
// SPINNER DE CARGA
// =============================================
let loadingOverlay = null;

function mostrarCarga(texto = 'Cargando...') {
    if (loadingOverlay) ocultarCarga();
    
    loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center';
    loadingOverlay.innerHTML = `
        <div class="bg-white rounded-2xl p-6 text-center shadow-xl">
            <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-3"></i>
            <p class="text-slate-600 font-medium">${texto}</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
}

function ocultarCarga() {
    if (loadingOverlay) {
        loadingOverlay.remove();
        loadingOverlay = null;
    }
}

// =============================================
// FORMATEADORES
// =============================================
function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-MX', { 
        style: 'currency', 
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(monto || 0);
}

function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-MX');
}

function formatearFechaHora(fecha) {
    if (!fecha) return 'N/A';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-MX') + ' ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

// =============================================
// ESTADOS DE SERVICIOS
// =============================================
const estadosServicio = {
    pendiente_pago: { texto: 'Pendiente pago', clase: 'badge-pendiente', icono: 'fa-hourglass-half' },
    publicado: { texto: 'Buscando tasker', clase: 'badge-publicado', icono: 'fa-search' },
    asignado: { texto: 'Asignado', clase: 'badge-asignado', icono: 'fa-handshake' },
    en_progreso: { texto: 'En progreso', clase: 'badge-progreso', icono: 'fa-play-circle' },
    completado: { texto: 'Completado', clase: 'badge-completado', icono: 'fa-check-circle' },
    cancelado: { texto: 'Cancelado', clase: 'badge-cancelado', icono: 'fa-times-circle' }
};

function obtenerEstadoServicio(status) {
    return estadosServicio[status] || { texto: status, clase: 'badge-pendiente', icono: 'fa-question-circle' };
}

// =============================================
// VERIFICAR SESIÓN
// =============================================
async function verificarSesion(redirectUrl = 'login.html') {
    const supabase = initSupabase();
    if (!supabase) return null;
    
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        window.location.href = redirectUrl;
        return null;
    }
    return session;
}

async function obtenerPerfil(usuarioId) {
    const supabase = initSupabase();
    if (!supabase) return null;
    
    const { data: perfil, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', usuarioId)
        .maybeSingle();
    
    if (error) {
        console.error('Error obteniendo perfil:', error);
        return null;
    }
    return perfil;
}

// =============================================
// CERRAR SESIÓN
// =============================================
async function cerrarSesion() {
    const supabase = initSupabase();
    if (supabase) {
        await supabase.auth.signOut();
    }
    window.location.href = 'index.html';
}

// =============================================
// INICIALIZAR
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});
