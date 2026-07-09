"use strict";

var mazo = [];
var palos = ["♠", "♣", "♥", "♦"];
var valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var manoJugador = [];
var manoCrupier = [];
var saldoJugador = 500; 
var apuestaActual = 0;

function crearMazo() {
    var i, j, carta;
    mazo = []; 
    for (i = 0; i < palos.length; i++) {
        for (j = 0; j < valores.length; j++) {
            carta = {
                palo: palos[i],
                valor: valores[j],
                puntaje: calcularPuntaje(valores[j])
            };
            mazo.push(carta); 
        }
    }
}

function calcularPuntaje(valorCarta) {
    if (valorCarta === "J" || valorCarta === "Q" || valorCarta === "K") {
        return 10;
    } else if (valorCarta === "A") {
        return 11;
    } else {
        return parseInt(valorCarta);
    }
}

function mezclarMazo() {
    var i, j, cartaTemporal;
    for (i = mazo.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        cartaTemporal = mazo[i];
        mazo[i] = mazo[j];
        mazo[j] = cartaTemporal;
    }
}

function repartirCarta(manoDestino) {
    var cartaSacada = mazo.pop(); 
    manoDestino.push(cartaSacada); 
    return cartaSacada;
}

function calcularPuntajeTotal(mano) {
    var suma = 0;
    var cantidadAses = 0;
    var i;
    for (i = 0; i < mano.length; i++) {
        suma = suma + mano[i].puntaje;
        if (mano[i].valor === "A") {
            cantidadAses = cantidadAses + 1;
        }
    }
    while (suma > 21 && cantidadAses > 0) {
        suma = suma - 10; 
        cantidadAses = cantidadAses - 1; 
    }
    return suma;
}