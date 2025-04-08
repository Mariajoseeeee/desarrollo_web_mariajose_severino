
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-actividad');
    const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
    
    // Valida que el teléfono tenga el formato adecuado.
    const validarTelefono = (telefono) => {
        const regexTelefono = /^\+56[0-9]{9}$/; // Formato +56912345678
        return regexTelefono.test(telefono);
    };

    // Valida que el email tenga el formato adecuado.
    const validarEmail = (email) => {
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regexEmail.test(email);
    };

    // Valida las fechas de inicio y término.
    const validarFechas = (inicio, termino) => {
        const fechaInicio = new Date(inicio);
        const fechaTermino = new Date(termino);
        return fechaTermino > fechaInicio; // El término debe ser después del inicio
    };

    // Validación del formulario al momento de enviarlo.
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Información del lugar
        const region = document.getElementById('region').value;
        const comuna = document.getElementById('comuna').value;
        const sector = document.getElementById('sector').value;

        // Datos del organizador
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const contactarPor = document.getElementById('contactar-por').value;
        const idRedSocial = document.getElementById('id-red-social').value;

        // Información de la actividad
        const inicio = document.getElementById('dia-hora-inicio').value;
        const termino = document.getElementById('dia-hora-fin').value;
        const descripcion = document.getElementById('descripcion').value;
        const tema = document.getElementById('tema').value;
        const foto = document.getElementById('foto').files.length;
        
        // Validación de lugar
        if (!region || !comuna) {
            alert("La región y comuna son obligatorios.");
            return;
        }
        
        // Validación de organizador
        if (nombre.length === 0 || nombre.length > 200) {
            alert("El nombre del organizador es obligatorio y debe tener un máximo de 200 caracteres.");
            return;
        }
        if (!validarEmail(email)) {
            alert("Por favor ingrese un correo electrónico válido.");
            return;
        }
        if (telefono && !validarTelefono(telefono)) {
            alert("El número de teléfono debe estar en el formato +56912345678.");
            return;
        }

        // Validación de la actividad
        if (!validarFechas(inicio, termino)) {
            alert("La fecha de término debe ser posterior a la de inicio.");
            return;
        }
        if (!tema) {
            alert("El tema es obligatorio.");
            return;
        }
        if (tema === 'otro' && (idRedSocial.length < 3 || idRedSocial.length > 15)) {
            alert("La descripción del tema 'otro' debe tener entre 3 y 15 caracteres.");
            return;
        }
        
        // Validación de fotos
        if (foto === 0 || foto > 5) {
            alert("Debes agregar entre 1 y 5 fotos.");
            return;
        }

        // Mostrar confirmación
        mensajeConfirmacion.style.display = 'block';
    });

    // Botón de confirmación "Sí"
    document.getElementById('confirmar-si').addEventListener('click', () => {
        alert("Hemos recibido su información, muchas gracias y suerte en su actividad.");
        window.location.href = 'index.html';  // Redirige a la portada
    });

    // Botón de cancelación "No"
    document.getElementById('confirmar-no').addEventListener('click', () => {
        mensajeConfirmacion.style.display = 'none';
    });

    document.addEventListener("DOMContentLoaded", () => {
        const regionSelect = document.getElementById("region");
        const comunaSelect = document.getElementById("comuna");
      
        // Evitar errores si no está definida
        if (!region_comuna || !region_comuna.regiones) {
          console.error("No se encontró region_comuna o regiones.");
          return;
        }
      
        // Poblar regiones
        region_comuna.regiones.forEach(region => {
          const option = document.createElement("option");
          option.textContent = region.nombre;
          option.value = region.numero;
          regionSelect.appendChild(option);
        });
      
        // Actualizar comunas según región seleccionada
        regionSelect.addEventListener("change", () => {
          const regionSeleccionada = region_comuna.regiones.find(
            r => r.numero == regionSelect.value
          );
      
          comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
          comunaSelect.disabled = !regionSeleccionada;
      
          if (regionSeleccionada) {
            regionSeleccionada.comunas.forEach(comuna => {
              const option = document.createElement("option");
              option.textContent = comuna.nombre;
              option.value = comuna.id;
              comunaSelect.appendChild(option);
            });
          }
        });
      });
      
      
    // Mostrar campo de red social si "contactar por" es diferente de vacío
    document.getElementById('contactar-por').addEventListener('change', (e) => {
        if (e.target.value !== '') {
            document.getElementById('id-red-social-container').style.display = 'block';
        } else {
            document.getElementById('id-red-social-container').style.display = 'none';
        }
    });

    // Mostrar campo de foto adicional si se hace click en el botón
    document.getElementById('agregar-foto').addEventListener('click', () => {
        const nuevoInputFoto = document.createElement('input');
        nuevoInputFoto.type = 'file';
        nuevoInputFoto.accept = 'image/*';
        document.getElementById('agregar-foto').appendChild(nuevoInputFoto);
    });
});
