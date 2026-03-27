let libros = JSON.parse(localStorage.getItem('libros')) || [];
let editandoIndex = -1;
let filtroIdioma = 'todo';
let chartInstance = null;

// --- FUNCIONES DE RENDERIZADO ---
function renderizarLibros(term = "") {
    const tbody = document.getElementById('tbodyLibros');
    tbody.innerHTML = '';

    const filtrados = libros.filter(l =>
        (l.nombre.toLowerCase().includes(term) || l.autor.toLowerCase().includes(term)) &&
        (filtroIdioma === 'todo' || l.idioma === filtroIdioma)
    );

    filtrados.forEach((libro) => {
        const indexReal = libros.indexOf(libro);
        const badgeColor = libro.vecesLeido > 0 ? '#10b981' : '#94a3b8';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${libro.nombre}</strong></td>
            <td>${libro.autor}</td>
            <td>${getFlag(libro.idioma)} ${libro.idioma}</td>
            <td>${libro.paginas}</td>
            <td><span class="read-badge" style="background:${badgeColor}">${libro.vecesLeido}x</span></td>
            <td>
                <button onclick="editarLibro(${indexReal})" style="background:none">✏️</button>
                <button onclick="borrarLibro(${indexReal})" style="background:none">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('emptyState').style.display = filtrados.length ? 'none' : 'block';
    actualizarStats();
}

function getFlag(code) {
    const flags = { ES: '🇪🇸', EN: '🇺🇸', FR: '🇫🇷', DE: '🇩🇪', OT: '🌐' };
    return flags[code] || '📖';
}

// --- GESTIÓN DE DATOS ---
function guardarLibro() {
    const libro = {
        nombre: document.getElementById('nombreLibro').value.trim(),
        autor: document.getElementById('autorLibro').value.trim(),
        paginas: parseInt(document.getElementById('paginasLibro').value) || 0,
        capitulos: parseInt(document.getElementById('capitulosLibro').value) || 0,
        idioma: document.getElementById('idiomaLibro').value,
        vecesLeido: parseInt(document.getElementById('vecesLeidoLibro').value) || 0
    };

    if (!libro.nombre || !libro.autor) return alert("Rellena Título y Autor");

    if (editandoIndex > -1) {
        libros[editandoIndex] = libro;
    } else {
        libros.push(libro);
    }

    localStorage.setItem('libros', JSON.stringify(libros));
    ocultarFormulario();
    renderizarLibros();
}

function borrarLibro(idx) {
    if (confirm("¿Eliminar este libro?")) {
        libros.splice(idx, 1);
        localStorage.setItem('libros', JSON.stringify(libros));
        renderizarLibros();
    }
}

function editarLibro(idx) {
    const l = libros[idx];
    document.getElementById('nombreLibro').value = l.nombre;
    document.getElementById('autorLibro').value = l.autor;
    document.getElementById('paginasLibro').value = l.paginas;
    document.getElementById('capitulosLibro').value = l.capitulos;
    document.getElementById('idiomaLibro').value = l.idioma;
    document.getElementById('vecesLeidoLibro').value = l.vecesLeido;

    editandoIndex = idx;
    document.getElementById('formTitle').innerText = "✏️ Editando Libro";
    mostrarFormulario();
}

// --- FILTROS Y BUSQUEDA ---
function filtrarBusqueda() {
    renderizarLibros(document.getElementById('searchInput').value.toLowerCase());
}

function toggleFiltro() {
    const opciones = ['todo', 'ES', 'EN', 'FR', 'DE', 'OT'];
    let current = opciones.indexOf(filtroIdioma);
    filtroIdioma = opciones[(current + 1) % opciones.length];
    document.getElementById('filtroActual').innerText = filtroIdioma.toUpperCase();
    renderizarLibros();
}

// --- IMPORTAR / EXPORTAR ---
function exportar() {
    const data = JSON.stringify(libros, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi_biblioteca.json';
    a.click();
}

function importarArchivo(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            libros = JSON.parse(e.target.result);
            localStorage.setItem('libros', JSON.stringify(libros));
            renderizarLibros();
        } catch (err) { alert("Archivo no válido"); }
    };
    reader.readAsText(event.target.files[0]);
}

// --- GRÁFICO ---
function toggleChart() {
    const canvas = document.getElementById('chartSection');
    canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
    if (canvas.style.display === 'block') {
        if (chartInstance) chartInstance.destroy();
        const ctx = document.getElementById('librosChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: libros.slice(-5).map(l => l.nombre),
                datasets: [{
                    label: 'Páginas',
                    data: libros.slice(-5).map(l => l.paginas),
                    backgroundColor: '#6366f1'
                }]
            }
        });
    }
}

// --- UI ---
function mostrarFormulario() { document.getElementById('formOverlay').style.display = 'grid'; }
function ocultarFormulario() {
    document.getElementById('formOverlay').style.display = 'none';
    editandoIndex = -1;
    document.getElementById('formTitle').innerText = "📖 Nuevo Libro";
    document.querySelectorAll('.field input').forEach(i => i.value = "");
}

function actualizarStats() {
    document.getElementById('headerTotal').innerText = `${libros.length} libros`;
    const paginas = libros.reduce((s, l) => s + l.paginas, 0);
    document.getElementById('headerPaginas').innerText = `${paginas.toLocaleString()} pág`;
}

document.addEventListener('DOMContentLoaded', () => renderizarLibros());