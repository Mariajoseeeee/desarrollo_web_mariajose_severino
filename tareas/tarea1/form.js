
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

const validateTemaOtro = (tema, descripcion) => {
if (tema !== "Otro") return true;
return descripcion.length >= 3 && descripcion.length <= 15;
};

const validateIdRedSocial = (contactarPor, idRed) => {
if (!contactarPor || !idRed) return true;
return idRed.length >= 4 && idRed.length <= 50;
};

const validateSector = (sector) => {
return sector.length <= 100;
};

const validateRegionComuna = (region, comuna) => {
return !!region && !!comuna;
};

const validateFotos = () => {
    // Obtener todos los inputs de tipo file para fotos
    let fotoInputs = document.querySelectorAll('input[name="fotos"], input[name="fotos[]"]');
    let totalFiles = 0;
    
    // Contar el total de archivos seleccionados
    for (let input of fotoInputs) {
        totalFiles += input.files.length;
    }
    
    return totalFiles >= 1 && totalFiles <= 5;
};

const validateTema = (tema) => {
return tema && tema.length > 0;
};

const validateForm = () => {
let myForm = document.forms["myForm"];

let region = myForm["region"].value;
let comuna = myForm["comuna"].value;
let sector = myForm["sector"].value;
let nombre = myForm["nombre"].value;
let email = myForm["email"].value;
let telefono = myForm["telefono"].value;
let contactarPor = myForm["contactar-por"].value;
let idRedSocial = "";
const inputsContacto = document.querySelectorAll('#contactMethodsContainer input');
inputsContacto.forEach(input => {
  if (input.parentElement.style.display !== 'none') {
    idRedSocial = input.value;
  }
});

let inicio = myForm["dia-hora-inicio"].value;
let termino = myForm["dia-hora-fin"].value;
let tema = myForm["tema"].value;
let temaOtro = myForm["tema-otro"]?.value || "";
let fotos = myForm["fotos"].files;

let isValid = true;
let invalidInputs = [];

const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid = false;
};

if (!validateRegionComuna(region, comuna)) setInvalidInput("Región y Comuna");
if (!validateSector(sector)) setInvalidInput("Sector (máx. 100 caracteres)");
if (!validateName(nombre)) setInvalidInput("Nombre (obligatorio, máx. 200 caracteres)");
if (!validateEmail(email)) setInvalidInput("Correo electrónico (válido y máx. 100 caracteres)");
if (!validatePhoneNumber(telefono)) setInvalidInput("Teléfono (+569XXXXXXXX)");
if (!validateIdRedSocial(contactarPor, idRedSocial)) setInvalidInput("ID de red social (4-50 caracteres)");
if (!validateFechaInicio(inicio)) setInvalidInput("Fecha/hora de inicio (obligatoria)");
if (!validateFechas(inicio, termino)) setInvalidInput("Fecha de término debe ser posterior a inicio");
if (!validateTema(tema)) setInvalidInput("Tema");
if (!validateTemaOtro(tema, temaOtro)) setInvalidInput("Tema 'Otro' (3-15 caracteres)");
if (!validateFotos(fotos)) setInvalidInput("Fotos (entre 1 y 5)");

let validationBox = document.getElementById("val-box");
let validationMessageElem = document.getElementById("val-msg");
let validationListElem = document.getElementById("val-list");

if (!isValid) {
    validationListElem.textContent = "";
    for (let input of invalidInputs) {
    let li = document.createElement("li");
    li.textContent = input;
    validationListElem.appendChild(li);
    }
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";
    validationBox.hidden = false;
} else {
    myForm.style.display = "none";
    validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
    validationListElem.textContent = "";

    let submitButton = document.createElement("button");
    submitButton.innerText = "Enviar";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {
    alert("Hemos recibido su información, muchas gracias y suerte en su actividad.");
    window.location.href = "index.html";
    });

    let backButton = document.createElement("button");
    backButton.innerText = "Volver";
    backButton.addEventListener("click", () => {
    myForm.style.display = "block";
    validationBox.hidden = true;
    });

    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";
    validationBox.hidden = false;
}
};

document.getElementById("submit-btn").addEventListener("click", validateForm);

// Agrega esto a tu JavaScript para mantener los inputs anteriores
document.querySelector('select[name="contactar-por"]').addEventListener('change', function() {
    const selectedOption = this.value;
    const contactContainer = document.getElementById('contactMethodsContainer'); // Ajusta el ID según tu HTML
    
    // Crear un nuevo div para contener el label y el input
    const newContactMethod = document.createElement('div');
    newContactMethod.className = 'contact-method';
    
    // Crear el nuevo input
    newContactMethod.innerHTML = `
        <label for="id-red-social-${selectedOption}">ID de ${selectedOption}:</label>
        <input type="text" name="id-red-social-${selectedOption}" 
               minlength="4" maxlength="50" 
               placeholder="Tu ID en ${selectedOption}">
    `;
    
    // Agregar el nuevo método de contacto al contenedor
    contactContainer.appendChild(newContactMethod);
});