"use strict";

var nombreJugador = "";
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
var cajaMensajes = document.querySelector(".area-mensajes"); 
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
var numeroMano = 0;

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
    cajaMensajes.style.backgroundColor = ""; 
    
    if (isNaN(cantidadIngresada) || cantidadIngresada <= 0) {
        mensajeJuez.textContent = "Error: Ingresá un monto válido mayor a $0.";
        return;
    }
    if (cantidadIngresada > saldoJugador) {
        mensajeJuez.textContent = "Error: Fondos insuficientes. Tu saldo es de $" + saldoJugador;
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

    if (document.activeElement === inputNombre && tecla === "Enter") {
        btnComenzar.click();
        return;
    }
    if (document.activeElement === inputApuesta && tecla === "Enter") {
        evento.preventDefault(); 
        btnApostar.click();
        return;
    }
    if (document.activeElement.tagName === "INPUT") {
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
        nuevaCartaVisual.style.color = "red";
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
        mensajeJuez.textContent = "¡Te pasaste de 21! Has perdido la apuesta.";
        btnPedir.disabled = true;
        btnPlantarse.disabled = true;
        determinarGanador();
    } else if (puntosJugador === 21) {
        mensajeJuez.textContent = "¡Llegaste a 21 clavados! Turno del crupier.";
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
        cajaMensajes.style.backgroundColor = "darkred";
        registrarEnHistorial("Perdiste $" + apuestaActual + " (Te pasaste)", "#ef4444");
    } else if (puntosCrupier > 21) {
        mensajeJuez.textContent = "¡El crupier se pasó de 21! ¡GANASTE!";
        cajaMensajes.style.backgroundColor = "darkgreen";
        registrarEnHistorial("Ganaste $" + (apuestaActual * 2) + " (Crupier se pasó)", "#4ade80");
        pagarVictoria();
    } else if (puntosJugador > puntosCrupier) {
        mensajeJuez.textContent = "¡Tenés mejor mano! ¡GANASTE!";
        cajaMensajes.style.backgroundColor = "darkgreen";
        registrarEnHistorial("Ganaste $" + (apuestaActual * 2) + " (Mejor mano)", "#4ade80");
        pagarVictoria();
    } else if (puntosJugador < puntosCrupier) {
        mensajeJuez.textContent = "El casino tiene mejor mano. Perdiste.";
        cajaMensajes.style.backgroundColor = "darkred";
        registrarEnHistorial("Perdiste $" + apuestaActual + " (Mano menor)", "#ef4444");
    } else {
        mensajeJuez.textContent = "¡Es un empate! Recuperás tu dinero.";
        cajaMensajes.style.backgroundColor = "dimgray";
        registrarEnHistorial("Empate (Recuperás $" + apuestaActual + ")", "#9ca3af");
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

function registrarEnHistorial(resultado, colorTexto) {
    var nuevoItem = document.createElement("li");
    numeroMano = numeroMano + 1;
    nuevoItem.textContent = "Mano #" + numeroMano + " - " + resultado;
    nuevoItem.style.color = colorTexto;
    nuevoItem.style.padding = "5px 0";
    nuevoItem.style.borderBottom = "1px solid #333";
    listaHistorial.insertBefore(nuevoItem, listaHistorial.firstChild);
    localStorage.setItem("Blackjack_Historial_" + nombreJugador, listaHistorial.innerHTML);
}

inputNombre.focus();