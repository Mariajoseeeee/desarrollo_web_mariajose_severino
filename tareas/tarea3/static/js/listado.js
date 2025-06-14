document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('tablaActividades');
  const detalle = document.getElementById('detalleActividad');
  const volverBtn = document.getElementById('volverListado');
  const comentariosDiv = document.getElementById('comentarios');
  tabla.querySelectorAll('tr[data-id]').forEach(fila => {
    fila.addEventListener('click', () => {
      const id = fila.dataset.id;
      tabla.style.display = 'none';
      detalle.style.display = 'block';
      volverBtn.style.display = 'inline-block';

      comentariosDiv.style.display = 'block';

      document.querySelectorAll('.detalle-item').forEach(div => div.style.display = 'none');
      const detalleSeleccionado = document.getElementById(`detalle-${id}`);
      if (detalleSeleccionado) detalleSeleccionado.style.display = 'block';

      cargarComentarios(id);
    });
  });

  volverBtn.addEventListener('click', () => {
    tabla.style.display = 'table';
    detalle.style.display = 'none';
    volverBtn.style.display = 'none';
    comentariosDiv.style.display = 'none';  
  });
});

function ampliarImagen(src) {
  const img = document.getElementById('imgGrande');
  img.src = src;
  document.getElementById('imagenAmpliada').style.display = 'block';
}

function cerrarImagen() {
  document.getElementById('imagenAmpliada').style.display = 'none';
}
function cargarComentarios(actividadId) {
    fetch(`/api/comentarios/${actividadId}`)
        .then(r => r.json())
        .then(data => {
            const lista = document.getElementById("lista-comentarios");
            lista.innerHTML = '';
            data.forEach(com => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${com.nombre}</strong> (${com.fecha}): ${com.texto}`;
                lista.appendChild(li);
            });
        });
}
document.getElementById("form-comentario").addEventListener("submit", function (e) {
    e.preventDefault();

    const actividadId = document.querySelector(".detalle-item:not([style*='display: none'])")?.id?.split("-")[1]
    if (!actividadId) {
      alert("No se pudo identificar la actividad para el comentario.");
      return;
    }
    const nombre = document.getElementById("nombre").value.trim();
    const texto = document.getElementById("texto").value.trim();

    const erroresDiv = document.getElementById("errores-comentario");
    erroresDiv.innerHTML = "";

    fetch("/api/comentarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            actividad_id: actividadId,
            nombre,
            texto,
        }),
    })
    .then(resp => {
        if (!resp.ok) return resp.json().then(data => { throw data; });
        return resp.json();
    })
    .then(data => {
        document.getElementById("form-comentario").reset();
        cargarComentarios(actividadId);
    })
    .catch(err => {
        if (err.errores) {
            erroresDiv.innerHTML = err.errores.map(e => `<p>${e}</p>`).join("");
        } else {
            erroresDiv.innerText = "Error al enviar el comentario.";
        }
    });
});
