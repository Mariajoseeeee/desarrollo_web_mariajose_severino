document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('tablaActividades');
  const detalle = document.getElementById('detalleActividad');
  const volverBtn = document.getElementById('volverListado');

  tabla.querySelectorAll('tr[data-id]').forEach(fila => {
    fila.addEventListener('click', () => {
      const id = fila.dataset.id;
      tabla.style.display = 'none';
      detalle.style.display = 'block';
      volverBtn.style.display = 'inline-block';  

      document.querySelectorAll('.detalle-item').forEach(div => div.style.display = 'none');
      const detalleSeleccionado = document.getElementById(`detalle-${id}`);
      if (detalleSeleccionado) detalleSeleccionado.style.display = 'block';
    });
  });

  volverBtn.addEventListener('click', () => {
    tabla.style.display = 'table';
    detalle.style.display = 'none';
    volverBtn.style.display = 'none';  
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
