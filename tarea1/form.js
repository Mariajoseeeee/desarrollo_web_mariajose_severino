document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-actividades');
    const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

    const validarTelefono = (telefono) => /^\+569\d{8}$/.test(telefono);
    const validarEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    const validarFechas = (inicio, termino) => new Date(termino) > new Date(inicio);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const region = document.getElementById('region').value;
        const comuna = document.getElementById('comuna').value;
        const sector = document.getElementById('sector').value;

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const contactarPor = document.getElementById('contactar-por').value;
        const idRedSocial = document.getElementById('id-red-social')?.value.trim() || '';

        const inicio = document.getElementById('dia-hora-inicio').value;
        const termino = document.getElementById('dia-hora-fin').value;
        const descripcion = document.getElementById('descripcion').value.trim();
        const tema = document.getElementById('tema').value;
        const fotos = document.querySelectorAll('#fotos-container input[type="file"]');

        if (!region || !comuna) {
            alert("La región y comuna son obligatorios.");
            return;
        }

        if (sector.length > 100) {
            alert("El sector no puede tener más de 100 caracteres.");
            return;
        }

        if (!nombre || nombre.length > 200) {
            alert("El nombre del organizador es obligatorio y debe tener un máximo de 200 caracteres.");
            return;
        }

        if (!validarEmail(email) || email.length > 100) {
            alert("Por favor ingrese un correo electrónico válido y no mayor a 100 caracteres.");
            return;
        }

        if (telefono && !validarTelefono(telefono)) {
            alert("El número de teléfono debe estar en el formato +56912345678");
            return;
        }

        if (contactarPor && idRedSocial && (idRedSocial.length < 4 || idRedSocial.length > 50)) {
            alert("El ID o URL de red social debe tener entre 4 y 50 caracteres.");
            return;
        }
        


        if (!inicio) {
            alert("La fecha y hora de inicio es obligatoria.");
            return;
        }

        if (termino && !validarFechas(inicio, termino)) {
            alert("La fecha de término debe ser posterior a la de inicio.");
            return;
        }

        if (!tema) {
            alert("El tema es obligatorio.");
            return;
        }

        if (tema === 'Otro') {
            const descripcionTema = document.getElementById('tema-otro').value.trim();
            if (descripcionTema.length < 3 || descripcionTema.length > 15) {
                alert("La descripción del tema 'otro' debe tener entre 3 y 15 caracteres.");
                return;
            }
        }

        if (fotos.length === 0 || fotos.length > 5) {
            alert("Debes agregar entre 1 y 5 fotos.");
            return;
        }
        

        mensajeConfirmacion.style.display = 'block';
    });

    document.getElementById('confirmar-si').addEventListener('click', () => {
        alert("Hemos recibido su información, muchas gracias y suerte en su actividad.");
        window.location.href = 'index.html';
    });

    document.getElementById('confirmar-no').addEventListener('click', () => {
        mensajeConfirmacion.style.display = 'none';
    });

    // Región y comuna
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");

    if (typeof region_comuna !== 'undefined' && region_comuna.regiones) {
        region_comuna.regiones.forEach(region => {
            const option = document.createElement("option");
            option.textContent = region.nombre;
            option.value = region.numero;
            regionSelect.appendChild(option);
        });

        regionSelect.addEventListener("change", () => {
            const regionSeleccionada = region_comuna.regiones.find(r => r.numero == regionSelect.value);
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
    }

    document.getElementById('contactar-por').addEventListener('change', (e) => {
        const contenedor = document.getElementById('id-red-social-container');
        const redSeleccionada = e.target.value;
    
        // Solo mostrar campo extra si es necesario
        if (redSeleccionada === 'instagram' || redSeleccionada === 'telegram') {
            contenedor.style.display = 'block';
        } else {
            contenedor.style.display = 'none';
            document.getElementById('id-red-social').value = ''; // limpiar el campo
        }
    });
    

    // Tema "Otro"
    const selectTema = document.getElementById('tema');
    const inputTemaOtro = document.getElementById('tema-otro');
    const containerTemaOtro = document.getElementById('tema-otro-container');

    selectTema.addEventListener('change', () => {
        if (selectTema.value === 'Otro') {
            containerTemaOtro.style.display = 'block';
        } else {
            containerTemaOtro.style.display = 'none';
            inputTemaOtro.value = '';
        }
    });

    // Agregar fotos adicionales
    document.getElementById('agregar-foto').addEventListener('click', () => {
        const fotosContainer = document.getElementById('fotos-container');
        const totalFotos = fotosContainer.querySelectorAll('input[type="file"]').length;
        if (totalFotos < 5) {
            const nuevoInput = document.createElement('input');
            nuevoInput.type = 'file';
            nuevoInput.accept = 'image/*';
            fotosContainer.appendChild(nuevoInput);
        } else {
            alert("No puedes agregar más de 5 fotos.");
        }
    });
});
