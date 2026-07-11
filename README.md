## Blackjack

Proyecto final para la materia **Desarrollo y Arquitecturas Web** de la Universidad Abierta Interamericana (UAI).

## Descripción
Este proyecto es una aplicación web interactiva del clásico juego de casino Blackjack.

## Tecnologías Utilizadas
* **HTML5:** Estructura semántica, sin uso de estilos ni scripts en línea.
* **CSS3:** Maquetación utilizando Flexbox (responsivo con Media Queries) y uso de `reset.css`.
* **JavaScript (ES5):** Lógica del motor del juego aislada, uso de `"use strict"`, y sin dependencias de librerías externas.

## Funcionalidades Implementadas
El juego cumple con todos los requerimientos obligatorios y suma varios deseados:
* **Motor Matemático:** Cálculo dinámico de puntajes, incluyendo el valor variable del As (1 u 11).
* **Persistencia de Datos:** Guardado automático del saldo del jugador y el historial de manos utilizando `LocalStorage`.
* **Accesibilidad:** Soporte de controles por teclado (Enter para apostar, Flechas direccionales para pedir o plantarse).
* **Formulario de Contacto:** Validaciones estrictas con Expresiones Regulares (RegEx) para nombre, email y longitud de mensaje, conectando con el cliente de correo del sistema.
* **Interfaz Dinámica:** Actualización de estados y mensajes en tiempo real sin recargar la página.

## Instalación y Uso
El proyecto es completamente funcional directamente desde el navegador, sin necesidad de servidores locales ni instalación de dependencias:
1. Clonar el repositorio en tu máquina local.
2. Abrir el archivo `index.html` con cualquier navegador web moderno.