// Obtener elementos para el mensaje de bienvenida
const nombreIngresado =  document.getElementById("nombre");
const botonEnviar =  document.getElementById("btn-enviar");
const mensajeBienvenida =  document.getElementById("mensaje");


// Obtener elementos para el contador
const notaCalificacion  =  document.getElementById("calificacion");
const botonDisminuir =  document.getElementById("btn-disminuir");
const botonAumentar =  document.getElementById("btn-aumentar");

// Calificación inicial

let calificacionInicial = parseInt(notaCalificacion.textContent);


// Función para mostrar mensaje de bienvenida
const mostrarMensaje = () => {
    const nombre = nombreIngresado.value;
    if(nombre === "Mariajose") {
        mensajeBienvenida.textContent = `Hola, bienvenid@ ${nombre}`;
        mensajeBienvenida.style.color = "blue"; 
        mensajeBienvenida.style.fontWeight = "bold";
    } else {
        mensajeBienvenida.textContent = `Hola, bienvenid@ ${nombre}`;
        mensajeBienvenida.style.color = "black";
        mensajeBienvenida.style.fontWeight = "normal"; 
    }
};
        


// Función para aumentar la calificación
const aumentarCalificacion = () => {
    if (calificacionInicial < 70) {
        calificacionInicial++;
        notaCalificacion.textContent = calificacionInicial;
    }
};



// Función para disminuir la calificación
const disminuirCalificacion = () => {
    if (calificacionInicial > 10) {
        calificacionInicial--;
        notaCalificacion.textContent = calificacionInicial;
    }
};


// Asignar eventos
botonEnviar.addEventListener("click", mostrarMensaje);
botonAumentar.addEventListener("click", aumentarCalificacion);
botonDisminuir.addEventListener("click", disminuirCalificacion);