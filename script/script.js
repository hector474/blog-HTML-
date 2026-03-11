const tabla = document.getElementById('miTabla');
const btnNuevaFila = document.getElementById('btn-nueva-fila');

// 1. Escuchar cambios en cualquier input dentro de la tabla
tabla.addEventListener('input', calcularTodo);

// 2. Función para añadir filas
btnNuevaFila.addEventListener('click', () => {
    const tbody = tabla.querySelector('tbody');
    const nuevaFila = document.createElement('tr');
    
    nuevaFila.innerHTML = `
        <td><input type="text" class="nombre-input" placeholder="Nueva actividad"></td>
        <td><input type="number" class="pct-input" value="0" min="0" max="100"></td>
        <td><input type="number" class="nota-input" value="0" min="0" max="10"></td>
        <td><button class="btn-eliminar" onclick="eliminarFila(this)">❌</button></td>
    `;
    
    tbody.appendChild(nuevaFila);
    calcularTodo();
});

// 3. Función para eliminar filas
function eliminarFila(boton) {
    boton.closest('tr').remove();
    calcularTodo();
}

// 4. Lógica de cálculo
function calcularTodo() {
    const filas = tabla.querySelectorAll('tbody tr');
    let notaFinal = 0;
    let sumaPorcentajes = 0;

    filas.forEach(fila => {
        const pct = parseFloat(fila.querySelector('.pct-input').value) || 0;
        const nota = parseFloat(fila.querySelector('.nota-input').value) || 0;
        
        sumaPorcentajes += pct;
        notaFinal += (nota * (pct / 100));
    });

    // Actualizar nota final
    document.getElementById('total-nota').innerText = notaFinal.toFixed(2);

    // Validar si los porcentajes suman 100
    const aviso = document.getElementById('aviso-porcentaje');
    if (sumaPorcentajes !== 100) {
        aviso.innerText = `Atención: Los porcentajes suman ${sumaPorcentajes}%, deberían sumar 100%.`;
    } else {
        aviso.innerText = "";
    }
}