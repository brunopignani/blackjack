"use strict";

var pantallaInicio = document.getElementById("pantalla-inicio");
var pantallaJuego = document.getElementById("pantalla-juego");
var inputNombre = document.getElementById("input-nombre");
var errorNombre = document.getElementById("error-nombre");
var btnComenzar = document.getElementById("btn-comenzar");
var tituloJugador = document.getElementById("titulo-jugador");
var inputApuesta = document.getElementById("input-apuesta");
var btnApostar = document.getElementById("btn-apostar");
var spanSaldo = document.getElementById("saldo-jugador");
var mensajeJuez = document.getElementById("mensaje-juez");
var spanPuntajeJugador = document.getElementById("puntaje-jugador");
var spanPuntajeCrupier = document.getElementById("puntaje-crupier");
var divCartasJugador = document.getElementById("cartas-jugador");
var divCartasCrupier = document.getElementById("cartas-crupier");
var btnPedir = document.getElementById("btn-pedir");
var btnPlantarse = document.getElementById("btn-plantarse");
var btnReglas = document.getElementById("btn-reglas");
var btnVolverReglas = document.getElementById("btn-volver-reglas");
var pantallaReglas = document.getElementById("pantalla-reglas");
var listaHistorial = document.getElementById("lista-historial");
var cajaMensajes = document.querySelector(".area-mensajes"); 
var numeroMano = 0;
var nombreJugador = "";

btnComenzar.addEventListener("click", function() {
    var nombreIngresado = inputNombre.value.trim(); 
    var saldoGuardado;
    var historialGuardado;
    
    if (nombreIngresado.length < 3) {
        errorNombre.textContent = "Error: El nombre debe tener al menos 3 letras.";
    } else {
        errorNombre.textContent = "";
        nombreJugador = nombreIngresado; 
        saldoGuardado = localStorage.getItem("Blackjack_Saldo_" + nombreJugador);
        
        if (saldoGuardado !== null) {
            saldoJugador = parseInt(saldoGuardado);
        } else {
            saldoJugador = 500;
        }
        
        actualizarYGuardarSaldo();
        historialGuardado = localStorage.getItem("Blackjack_Historial_" + nombreJugador);
        
        if (historialGuardado !== null) {
            listaHistorial.innerHTML = historialGuardado; 
        } else {
            listaHistorial.innerHTML = ""; 
            numeroMano = 0; 
        }
        
        pantallaInicio.classList.add("oculto");
        pantallaJuego.classList.remove("oculto");
        
        if (tituloJugador !== null) {
            tituloJugador.textContent = "Mano de " + nombreJugador;
        }
        setTimeout(function() {
            inputApuesta.focus();
        }, 100);    
    }
});

btnApostar.addEventListener("click", function() {
    var cantidadIngresada = parseInt(inputApuesta.value);
    
    mensajeJuez.textContent = "";
    
    cajaMensajes.classList.remove("mensaje-ganador");
    cajaMensajes.classList.remove("mensaje-perdedor");
    cajaMensajes.classList.remove("mensaje-empate");
    mensajeJuez.classList.remove("texto-error");
    
    if (!cantidadIngresada || cantidadIngresada <= 0) {
        mensajeJuez.textContent = "Error: Ingresá un monto válido mayor a $0.";
        mensajeJuez.classList.add("texto-error");
        return;
    }
    if (cantidadIngresada > saldoJugador) {
        mensajeJuez.textContent = "Error: Fondos insuficientes. Tu saldo es de $" + saldoJugador;
        mensajeJuez.classList.add("texto-error");
        return;
    }
    
    apuestaActual = cantidadIngresada;
    saldoJugador = saldoJugador - apuestaActual;
    actualizarYGuardarSaldo();
    mensajeJuez.textContent = "¡Apostaste $" + apuestaActual + "! Repartiendo cartas...";
    inputApuesta.disabled = true;
    btnApostar.disabled = true;
    iniciarPartida();
});

btnPedir.addEventListener("click", function() {
    jugadorPideCarta();
});

btnPlantarse.addEventListener("click", function() {
    jugarTurnoCrupier();
});

btnReglas.addEventListener("click", function() {
    pantallaInicio.classList.add("oculto");
    pantallaReglas.classList.remove("oculto");
});

btnVolverReglas.addEventListener("click", function() {
    pantallaReglas.classList.add("oculto");
    pantallaInicio.classList.remove("oculto");
});

document.addEventListener("keydown", function(evento) {
    var tecla = evento.key; 

    if (evento.target === inputNombre && tecla === "Enter") {
        btnComenzar.click();
        return;
    }
    if (evento.target === inputApuesta && tecla === "Enter") {
        evento.preventDefault(); 
        btnApostar.click();
        return;
    }
    if (evento.target.tagName === "INPUT") {
        return; 
    }
    if (tecla === "Enter" && btnApostar.disabled === false && pantallaJuego.classList.contains("oculto") === false) {
        btnApostar.click();
    } else if (tecla === "ArrowRight" && btnPedir.disabled === false) {
        evento.preventDefault(); 
        btnPedir.click();
    } else if (tecla === "ArrowLeft" && btnPlantarse.disabled === false) {
        evento.preventDefault(); 
        btnPlantarse.click();
    }
});

function dibujarCartaEnMesa(carta, contenedorDestino) {
    var nuevaCartaVisual = document.createElement("div"); 
    nuevaCartaVisual.classList.add("carta-fisica"); 
    nuevaCartaVisual.textContent = carta.valor + carta.palo; 
    
    if (carta.palo === "♥" || carta.palo === "♦") {
        nuevaCartaVisual.classList.add("carta-roja");
    }
    
    contenedorDestino.appendChild(nuevaCartaVisual);
}

function iniciarPartida() {
    var cartaJ1, cartaJ2, cartaC1, cartaC2, puntosJugador;
    
    manoJugador = [];
    manoCrupier = [];
    crearMazo();
    mezclarMazo();
    
    divCartasJugador.textContent = ""; 
    divCartasCrupier.textContent = "";
    
    cartaJ1 = repartirCarta(manoJugador);
    dibujarCartaEnMesa(cartaJ1, divCartasJugador);
    cartaJ2 = repartirCarta(manoJugador);
    dibujarCartaEnMesa(cartaJ2, divCartasJugador);
    
    cartaC1 = repartirCarta(manoCrupier);
    dibujarCartaEnMesa(cartaC1, divCartasCrupier);
    cartaC2 = repartirCarta(manoCrupier);
    
    puntosJugador = calcularPuntajeTotal(manoJugador); 
    spanPuntajeJugador.textContent = puntosJugador;
    spanPuntajeCrupier.textContent = cartaC1.puntaje;
    
    btnPedir.disabled = false;
    btnPlantarse.disabled = false;
    
    if (puntosJugador === 21) {
        mensajeJuez.textContent = "¡BLACKJACK NATURAL! Turno del crupier.";
        jugarTurnoCrupier();
    }
}

function jugadorPideCarta() {
    var nuevaCarta = repartirCarta(manoJugador);
    var puntosJugador = calcularPuntajeTotal(manoJugador);
    
    dibujarCartaEnMesa(nuevaCarta, divCartasJugador);
    spanPuntajeJugador.textContent = puntosJugador;

    if (puntosJugador > 21) {
        btnPedir.disabled = true;
        btnPlantarse.disabled = true;
        determinarGanador();
    } else if (puntosJugador === 21) {
        jugarTurnoCrupier();
    } else {
        mensajeJuez.textContent = "Tu puntaje es " + puntosJugador + ". ¿Pedís carta o te plantás?";
    }
}

function jugarTurnoCrupier() {
    var i, puntosCrupier, nuevaCarta;
    
    btnPedir.disabled = true;
    btnPlantarse.disabled = true;
    mensajeJuez.textContent = "Turno del crupier...";
    divCartasCrupier.textContent = "";
    
    for (i = 0; i < manoCrupier.length; i++) {
        dibujarCartaEnMesa(manoCrupier[i], divCartasCrupier);
    }

    puntosCrupier = calcularPuntajeTotal(manoCrupier);
    spanPuntajeCrupier.textContent = puntosCrupier;

    while (puntosCrupier < 17) {
        nuevaCarta = repartirCarta(manoCrupier);
        dibujarCartaEnMesa(nuevaCarta, divCartasCrupier);
        puntosCrupier = calcularPuntajeTotal(manoCrupier);
        spanPuntajeCrupier.textContent = puntosCrupier;
    }
    determinarGanador();
}

function determinarGanador() {
    var puntosJugador = calcularPuntajeTotal(manoJugador);
    var puntosCrupier = calcularPuntajeTotal(manoCrupier);

    if (puntosJugador > 21) {
        mensajeJuez.textContent = "Te pasaste de 21. El casino gana.";
        cajaMensajes.classList.add("mensaje-perdedor");
        registrarEnHistorial("Perdiste $" + apuestaActual + " (Te pasaste)", "historial-perdido");
    } else if (puntosCrupier > 21) {
        mensajeJuez.textContent = "¡El crupier se pasó de 21! ¡GANASTE!";
        cajaMensajes.classList.add("mensaje-ganador");
        registrarEnHistorial("Ganaste $" + (apuestaActual * 2) + " (Crupier se pasó)", "historial-ganado");
        pagarVictoria();
    } else if (puntosJugador > puntosCrupier) {
        mensajeJuez.textContent = "¡Tenés mejor mano! ¡GANASTE!";
        cajaMensajes.classList.add("mensaje-ganador");
        registrarEnHistorial("Ganaste $" + (apuestaActual * 2) + " (Mejor mano)", "historial-ganado");
        pagarVictoria();
    } else if (puntosJugador < puntosCrupier) {
        mensajeJuez.textContent = "El casino tiene mejor mano. Perdiste.";
        cajaMensajes.classList.add("mensaje-perdedor");
        registrarEnHistorial("Perdiste $" + apuestaActual + " (Mano menor)", "historial-perdido");
    } else {
        mensajeJuez.textContent = "¡Es un empate! Recuperás tu dinero.";
        cajaMensajes.classList.add("mensaje-empate");
        registrarEnHistorial("Empate (Recuperás $" + apuestaActual + ")", "historial-empate");
        devolverApuesta();
    }

    inputApuesta.disabled = false;
    btnApostar.disabled = false;
    inputApuesta.value = "";
    inputApuesta.focus();
}

function pagarVictoria() {
    var ganancia = apuestaActual * 2; 
    saldoJugador = saldoJugador + ganancia;
    actualizarYGuardarSaldo();
}

function devolverApuesta() {
    saldoJugador = saldoJugador + apuestaActual;
    actualizarYGuardarSaldo();
}

function actualizarYGuardarSaldo() {
    spanSaldo.textContent = saldoJugador;
    localStorage.setItem("Blackjack_Saldo_" + nombreJugador, saldoJugador);
}

function registrarEnHistorial(resultado, claseColor) {
    var nuevoItem = document.createElement("li");
    numeroMano = numeroMano + 1;
    nuevoItem.textContent = "Mano #" + numeroMano + " - " + resultado;
    
    nuevoItem.classList.add("item-historial");
    nuevoItem.classList.add(claseColor);
    
    listaHistorial.appendChild(nuevoItem);
    localStorage.setItem("Blackjack_Historial_" + nombreJugador, listaHistorial.innerHTML);
}

inputNombre.focus();