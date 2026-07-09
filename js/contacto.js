"use strict";

var btnEnviar = document.getElementById("btn-enviar");
var inputNombre = document.getElementById("nombre-contacto");
var inputEmail = document.getElementById("email-contacto");
var inputMensaje = document.getElementById("mensaje-contacto");
var errorFormulario = document.getElementById("error-formulario");

btnEnviar.addEventListener("click", function() {
    var nombre = inputNombre.value.trim();
    var email = inputEmail.value.trim();
    var mensaje = inputMensaje.value.trim();
    var errores = "";
    var regexAlfanumerico = /^[a-zA-Z0-9\s]+$/;
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var asunto;
    var cuerpoMail;

    if (nombre === "" || regexAlfanumerico.test(nombre) === false) {
        errores = errores + "El nombre debe ser alfanumérico. ";
    }
    if (regexEmail.test(email) === false) {
        errores = errores + "El correo no es válido. ";
    }
    if (mensaje.length <= 5) {
        errores = errores + "El mensaje debe tener más de 5 letras. ";
    }

    if (errores !== "") {
        errorFormulario.textContent = errores; 
    } else {
        errorFormulario.textContent = ""; 
        asunto = "Contacto desde Juego Web Blackjack";
        cuerpoMail = "Nombre: " + nombre + "%0A" + "Mensaje: " + mensaje;
        window.location.href = "mailto:" + email + "?subject=" + asunto + "&body=" + cuerpoMail;
    }
});