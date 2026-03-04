// 1. Base de datos inicial VACÍA para que tú la rellenes
let academicPlan = JSON.parse(localStorage.getItem('myPlan')) || {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []
};

let currentMove = null;

// 2. Función para mostrar el semestre seleccionado
function showSemester(num) {
    const panel = document.getElementById('semester-panel');
    const list = document.getElementById('subject-list');
    document.getElementById('panel-title').innerText = `Gestión del Semestre ${num}`;
    document.getElementById('panel-title').dataset.current = num;
    panel.style.display = 'block';
    list.innerHTML = "";

    if (academicPlan[num].length === 0) {
        list.innerHTML = "<p style='text-align:center; padding:20px; opacity:0.5;'>No hay asignaturas añadidas aún.</p>";
    }

    academicPlan[num].forEach((subj, index) => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
            <div class="subject-header">
                <span>${subj.name}</span>
                <button class="btn-red" onclick="openMoveModal('${subj.name}', ${num}, ${index})">Mover / Borrar</button>
            </div>
            <div class="subject-body">
                ${createEvalBar("Examen Final", subj.exam)}
                ${createEvalBar("Trabajos", subj.trab)}
                ${createEvalBar("Ev. Continua", subj.cont)}
            </div>
        `;
        list.appendChild(card);
    });
}

function createEvalBar(label, percent) {
    return `
        <div class="eval-item">
            <div class="eval-info"><span>${label}</span><span>${percent}%</span></div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
        </div>`;
}

// 3. Añadir asignatura con sus porcentajes
function addCustomSubject() {
    const name = document.getElementById('new-subject-name').value;
    const e = document.getElementById('perc-exam').value || 0;
    const t = document.getElementById('perc-trabajo').value || 0;
    const c = document.getElementById('perc-cont').value || 0;
    const sem = document.getElementById('panel-title').dataset.current;

    if (name && sem) {
        academicPlan[sem].push({ name: name, exam: e, trab: t, cont: c });
        localStorage.setItem('myPlan', JSON.stringify(academicPlan));
        showSemester(sem);
        // Limpiar campos
        document.getElementById('new-subject-name').value = "";
        document.getElementById('perc-exam').value = "";
        document.getElementById('perc-trabajo').value = "";
        document.getElementById('perc-cont').value = "";
    } else {
        alert("Por favor, introduce al menos el nombre de la asignatura.");
    }
}

// 4. Modal de Movimiento
function openMoveModal(name, fromSem, index) {
    currentMove = { name, fromSem, index };
    document.getElementById('suspense-msg').innerText = `¿A qué semestre quieres mover "${name}"?`;
    document.getElementById('reschedule-modal').style.display = 'flex';
}

function confirmReschedule() {
    const target = document.getElementById('target-semester').value;
    const subjectObj = academicPlan[currentMove.fromSem][currentMove.index];
    academicPlan[currentMove.fromSem].splice(currentMove.index, 1);
    academicPlan[target].push(subjectObj);
    localStorage.setItem('myPlan', JSON.stringify(academicPlan));
    showSemester(currentMove.fromSem);
    closeModal();
}

function closeModal() { document.getElementById('reschedule-modal').style.display = 'none'; }

// 5. Comentarios y Barra de Scroll
document.getElementById('comment-form').onsubmit = (e) => {
    e.preventDefault();
    const user = document.getElementById('user-name').value;
    const text = document.getElementById('comment-text').value;
    const div = document.createElement('div');
    div.style = "background:#0f3460; padding:15px; margin-top:10px; border-radius:8px; border-left: 3px solid #4ecca3;";
    div.innerHTML = `<strong>${user}</strong>: <p>${text}</p>`;
    document.getElementById('comments-display').prepend(div);
    e.target.reset();
};

window.onscroll = () => {
    let scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById("scroll-indicator").style.width = scrolled + "%";
};