let actividades = [];

function mostrarSeccion(id) {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function agregarActividad() {
  const titulo = document.getElementById('titulo').value.trim();
  const fecha = document.getElementById('fecha').value;

  if (titulo === "" || fecha === "") {
    alert("Por favor completa todos los campos.");
    return;
  }

  actividades.push({ titulo, fecha });
  document.getElementById('titulo').value = "";
  document.getElementById('fecha').value = "";

  actualizarListado();
  actualizarEstadisticas();
  mostrarSeccion('listado');
}

function actualizarListado() {
  const lista = document.getElementById('listaActividades');
  lista.innerHTML = "";

  actividades.forEach(actividad => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${actividad.titulo}</strong> - <em>${actividad.fecha}</em>`;
    lista.appendChild(item);
  });
}

function actualizarEstadisticas() {
  document.getElementById('totalActividades').textContent = actividades.length;
}


mostrarSeccion('listado');
