const validateName = (name) => {
    if (!name) return false;
    let lengthValid = name.trim().length > 0 && name.trim().length <= 200;
    return lengthValid;
  };
  
  const validateEmail = (email) => {
    if (!email) return false;
    let lengthValid = email.length <= 100;
    let re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    let formatValid = re.test(email);
    return lengthValid && formatValid;
  };
  
  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return true; 
    let re = /^\+569\d{8}$/;
    return re.test(phoneNumber);
  };
  
  const validateFechaInicio = (inicio) => {
    return inicio && inicio.length > 0;
  };
  
  const validateFechas = (inicio, termino) => {
    if (!termino) return true;
    return new Date(termino) > new Date(inicio);
  };
  
  
  const validateIdRedSocial = (contactarPor, idRed) => {
    if (!contactarPor) return true; // Si no hay medio de contacto, OK
    if (contactarPor === 'whatsapp') return true; // WhatsApp no requiere ID
    if (!idRed) return false; // Para otros medios, sí se requiere ID
    return idRed.length >= 4 && idRed.length <= 50;
  };
  
  
  const validateSector = (sector) => {
    return sector.length <= 100;
  };
  
  const validateRegionComuna = (region, comuna) => {
    return !!region && !!comuna;
  };
  
  const validateFotos = () => {
    let fotoInputs = document.querySelectorAll('input[name="fotos"], input[name="fotos[]"]');
    let totalFiles = 0;
    for (let input of fotoInputs) {
      totalFiles += input.files.length;
    }
    return totalFiles >= 1 && totalFiles <= 5;
  };
  
  const validateTema = (tema) => {
    return tema && tema.length > 0;
  };
  const validateDescripcion = (desc) => {
    return desc.trim().length > 0 && desc.length <= 1000;
  };
  
  
  document.addEventListener('DOMContentLoaded', function() {
    const contactarPor = document.getElementById('contactar-por');
    const idRedSocialContainer = document.getElementById('id-red-social-container');
  
    function actualizarVisibilidad() {
      if (contactarPor.value && contactarPor.value !== 'whatsapp') {
        idRedSocialContainer.style.display = 'block';
      } else {
        idRedSocialContainer.style.display = 'none';
        // opcional: limpiar input
        document.getElementById('id-red-social').value = '';
      }
    }
  
    contactarPor.addEventListener('change', actualizarVisibilidad);
  
    // Ejecutar al cargar la página para ajustar la visibilidad según el valor actual
    actualizarVisibilidad();
  });
  
  document.getElementById('agregar-foto').addEventListener('click', () => {
    const container = document.getElementById('fotos-container');
    const inputs = container.querySelectorAll('input[type="file"][name="fotos"]');
    if (inputs.length >= 5) {
      alert("No puedes agregar más de 5 fotos.");
      return;
    }
    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.name = 'fotos';
    newInput.accept = 'image/*';
    container.appendChild(newInput);
  });
  
  // Validar formulario al hacer submit
  document.getElementById("form-actividades").addEventListener("submit", (e) => {
    e.preventDefault();
  
    let myForm = e.target;
  
    let region = myForm["region"].value;
    let comuna = myForm["comuna"].value;
    let sector = myForm["sector"].value;
    let nombre = myForm["nombre"].value;
    let email = myForm["email"].value;
    let telefono = myForm["telefono"].value;
    let contactarPor = myForm["contactar-por"].value;
  
    let idRedSocial = '';
    const inputsContacto = document.querySelectorAll('#contactMethodsContainer input');
    for (const input of inputsContacto) {
      if (input.parentElement.style.display !== 'none') {
        idRedSocial = input.value;
        break;
      }
    }
  
    let inicio = myForm["dia-hora-inicio"].value;
    let termino = myForm["dia-hora-fin"].value;
  
    // Para temas, si son checkbox
    const temasChecked = document.querySelectorAll('input[name="temas"]:checked');
    let temaValido = temasChecked.length > 0;
  
    let descripcion = myForm["descripcion"].value;
  
    let errores = [];
  
    if (!validateRegionComuna(region, comuna)) errores.push("Región y Comuna");
    if (!validateSector(sector)) errores.push("Sector (máx. 100 caracteres)");
    if (!validateName(nombre)) errores.push("Nombre (obligatorio, máx. 200 caracteres)");
    if (!validateEmail(email)) errores.push("Correo electrónico (válido y máx. 100 caracteres)");
    if (!validatePhoneNumber(telefono)) errores.push("Teléfono (+569XXXXXXXX)");
    if (!validateIdRedSocial(contactarPor, idRedSocial)) errores.push("ID de red social (4-50 caracteres)");
    if (!validateFechaInicio(inicio)) errores.push("Fecha/hora de inicio (obligatoria)");
    if (!validateFechas(inicio, termino)) errores.push("Fecha de término debe ser posterior a inicio");
    if (!temaValido) errores.push("Debe seleccionar al menos un tema");
    if (!validateFotos()) errores.push("Fotos (entre 1 y 5)");
    if (!validateDescripcion(descripcion)) errores.push("Descripción (obligatoria, máx. 1000 caracteres)");
  
    let validationBox = document.getElementById("val-box");
    let validationMessageElem = document.getElementById("val-msg");
    let validationListElem = document.getElementById("val-list");
  
    if (errores.length > 0) {
      validationListElem.textContent = "";
      for (let error of errores) {
        let li = document.createElement("li");
        li.textContent = error;
        validationListElem.appendChild(li);
      }
      validationMessageElem.innerText = "Los siguientes campos son inválidos:";
      validationBox.style.backgroundColor = "#ffdddd";
      validationBox.style.borderLeftColor = "#f44336";
      validationBox.style.display = "block";
  
      // Ocultar confirmación
      document.getElementById("mensaje-confirmacion").style.display = "none";
    } else {
      validationBox.style.display = "none";
      // Mostrar confirmación personalizado
      document.getElementById("mensaje-confirmacion").style.display = "block";
      // Guardar el formulario para usarlo después
      window.formularioPendiente = myForm;
    }
  });
  

  document.getElementById("confirmar-si").addEventListener("click", () => {
    if (window.formularioPendiente) {
      window.formularioPendiente.submit(); // ahora sí se envía
    }
  });
  
  document.getElementById("confirmar-no").addEventListener("click", () => {
    document.getElementById("mensaje-confirmacion").style.display = "none";
  });
  