// ========================================
// GESTOR ACADÉMICO - JAVASCRIPT PRINCIPAL
// Scroll indicator + Calculadora notas
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // SCROLL INDICATOR (para blog.html)
    if (document.getElementById('scroll-indicator')) {
        initScrollIndicator();
    }
    
    // CALCULADORA DE NOTAS (para curso1.html y similares)
    if (document.getElementById('miTabla')) {
        initCalculadoraNotas();
    }
    
});

// SCROLL INDICATOR (barra progreso en navbar)
function initScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        indicator.style.width = scrollPercent + '%';
        indicator.style.opacity = scrollPercent / 100;
    });
}

// CALCULADORA DE NOTAS PONDERADAS
function initCalculadoraNotas() {
    const tabla = document.getElementById('miTabla');
    const btnNuevaFila = document.getElementById('btn-nueva-fila');
    const totalNota = document.getElementById('total-nota');
    const avisoPorcentaje = document.getElementById('aviso-porcentaje');
    
    // Cargar datos desde localStorage
    cargarDatosLocalStorage();
    
    // Event listeners
    btnNuevaFila.addEventListener('click', añadirFila);
    
    // Recalcular al cambiar cualquier input
    tabla.addEventListener('input', calcularNotaFinal);
    
    // Eliminar fila (ya definida en HTML onclick)
    
    function añadirFila() {
        const tbody = tabla.querySelector('tbody');
        const nuevaFila = tbody.insertRow();
        
        // Celda nombre
        const celdaNombre = nuevaFila.insertCell();
        celdaNombre.innerHTML = `<input type="text" class="nombre-input" value="Nueva actividad">`;
        
        // Celda porcentaje
        const celdaPct = nuevaFila.insertCell();
        celdaPct.innerHTML = `<input type="number" class="pct-input" value="0" min="0" max="100">`;
        
        // Celda nota
        const celdaNota = nuevaFila.insertCell();
        celdaNota.innerHTML = `<input type="number" class="nota-input" value="0" min="0" max="10" step="0.1">`;
        
        // Celda eliminar
        const celdaAccion = nuevaFila.insertCell();
        celdaAccion.innerHTML = `<button class="btn-eliminar" onclick="eliminarFila(this)">❌</button>`;
        
        // Recalcular
        calcularNotaFinal();
        guardarDatosLocalStorage();
    }
    
    function eliminarFila(btn) {
        if (confirm('¿Eliminar esta actividad?')) {
            btn.closest('tr').remove();
            calcularNotaFinal();
            guardarDatosLocalStorage();
        }
    }
    
    function calcularNotaFinal() {
        let sumaPorcentajes = 0;
        let sumaPonderada = 0;
        let filasValidas = 0;
        
        const filas = tabla.querySelectorAll('tbody tr');
        
        filas.forEach(fila => {
            const pctInput = fila.querySelector('.pct-input');
            const notaInput = fila.querySelector('.nota-input');
            
            const porcentaje = parseFloat(pctInput.value) || 0;
            const nota = parseFloat(notaInput.value) || 0;
            
            if (porcentaje > 0 && nota >= 0) {
                sumaPorcentajes += porcentaje;
                sumaPonderada += (porcentaje * nota);
                filasValidas++;
            }
        });
        
        // Nota final (ponderada)
        const notaFinal = filasValidas > 0 ? (sumaPonderada / sumaPorcentajes).toFixed(2) : 0;
        
        // Actualizar UI
        totalNota.textContent = notaFinal;
        
        // Validar porcentaje total
        if (sumaPorcentajes === 100) {
            totalNota.style.color = '#10b981'; // Verde
            avisoPorcentaje.textContent = '✅ Porcentaje correcto (100%)';
            avisoPorcentaje.style.color = '#10b981';
        } else if (sumaPorcentajes > 0) {
            totalNota.style.color = '#f59e0b'; // Naranja
            avisoPorcentaje.textContent = `⚠️ Suma porcentajes: ${sumaPorcentajes.toFixed(0)}% (debe ser 100%)`;
            avisoPorcentaje.style.color = '#f59e0b';
        } else {
            totalNota.style.color = '#6b7280'; // Gris
            avisoPorcentaje.textContent = 'Añade actividades con % > 0';
            avisoPorcentaje.style.color = '#6b7280';
        }
        
        // Calificación cualitativa
        if (notaFinal >= 9) totalNota.textContent += ' (Sobresaliente)';
        else if (notaFinal >= 7) totalNota.textContent += ' (Notable)';
        else if (notaFinal >= 5) totalNota.textContent += ' (Aprobado)';
        else if (notaFinal >= 0) totalNota.textContent += ' (Suspenso)';
    }
    
    // LOCALSTORAGE: Guardar/Cargar datos
    function guardarDatosLocalStorage() {
        const filas = [];
        document.querySelectorAll('tbody tr').forEach(fila => {
            const nombre = fila.querySelector('.nombre-input').value;
            const pct = fila.querySelector('.pct-input').value;
            const nota = fila.querySelector('.nota-input').value;
            filas.push({ nombre, pct, nota });
        });
        localStorage.setItem('notasCurso1', JSON.stringify(filas));
    }
    
    function cargarDatosLocalStorage() {
        const datos = localStorage.getItem('notasCurso1');
        if (datos) {
            const filas = JSON.parse(datos);
            filas.forEach((filaData, index) => {
                if (index === 0) {
                    // Actualizar fila existente
                    document.querySelector('.nombre-input').value = filaData.nombre;
                    document.querySelector('.pct-input').value = filaData.pct;
                    document.querySelector('.nota-input').value = filaData.nota;
                } else {
                    // Añadir nuevas filas
                    añadirFila();
                    const nuevaFila = document.querySelectorAll('tbody tr')[index];
                    nuevaFila.querySelector('.nombre-input').value = filaData.nombre;
                    nuevaFila.querySelector('.pct-input').value = filaData.pct;
                    nuevaFila.querySelector('.nota-input').value = filaData.nota;
                }
            });
            calcularNotaFinal();
        }
    }
    
    // Inicializar cálculo
    calcularNotaFinal();
}

// Hacer funciones globales (para onclick en HTML)
window.eliminarFila = eliminarFila;
window.añadirFila = añadirFila;
