const API_KEY = "JF5G7A73MZ6RLHRQXP5S9WDBD";

// Ult ciu
let ultimaCiudad = "";

const formulario = document.getElementById("formulario");
const inputCiudad = document.getElementById("ciudad");
const botonRefrescar = document.getElementById("btn-refrescar");
const mensaje = document.getElementById("mensaje");
const seccionActual = document.getElementById("actual");
const seccionPasado = document.getElementById("pasado");
const seccionFuturo = document.getElementById("futuro");


async function pedirClima(ciudad) {
  mensaje.className = "";
  mensaje.textContent = "Cargando...";

  const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
    + ciudad + "/yesterday/tomorrow?unitGroup=metric&include=hours,current&key=" + API_KEY;
//?:instruExtra.unitGroup=metric&include=hours:sistemaMetrico,climaPorHora.tengoPermiso




 //Rapi
  const respuesta = await fetch(url);

  //ERROR
  if (respuesta.ok === false) {
    //ponle la etiqueta css error
    mensaje.className = "error";
    mensaje.textContent = "No se encontró esa ciudad";
    return;
  }
//trduce json
  const datos = await respuesta.json();
  console.log(datos); 

  ultimaCiudad = ciudad;//buscar actualizar
  mensaje.textContent = "";//borra cargando

  //solo condicciones Actuales
  const actual = datos.currentConditions;
  //insertHTML
  seccionActual.innerHTML =
    "<h2>" + datos.resolvedAddress + "</h2>" +
    "<p class='condicion'>" + actual.conditions + "</p>" +
    "<p class='temperatura'>" + actual.temp + " °C</p>" +
    "<p>Viento: " + actual.windspeed + " km/h</p>" +
    "<p>Probabilidad de lluvia: " + actual.precipprob + " %</p>";



//junta horas de ayer hoy y mañana, concatena lista
  const horas = datos.days[0].hours.concat(datos.days[1].hours, datos.days[2].hours);



//segundos
  const ahora = actual.datetimeEpoch; 
// 24 horas, en segundos
  const unDia = 24 * 60 * 60;       

  seccionPasado.innerHTML = "";
  seccionFuturo.innerHTML = "";

  // pasa las horas
  for (let i = 0; i < horas.length; i++) {
    const hora = horas[i];

    // Nueva  targeta
    const tarjeta =
      "<div class='hora'>" +
      //CORTA EL 00 SOBRANTE
        "<p class='hora-titulo'>" + hora.datetime.substring(0, 5) + "</p>" +
        "<p>" + hora.temp + " °C</p>" +
        "<p>" + hora.conditions + "</p>" +
        "<p>Lluvia: " + hora.precipprob + " %</p>" +
      "</div>";
//ultimas 24h va a pasado
    if (hora.datetimeEpoch >= ahora - unDia && hora.datetimeEpoch < ahora) {
      seccionPasado.innerHTML += tarjeta;//suma y acumula
    }
//proximas 24h pega en futuro
    if (hora.datetimeEpoch >= ahora && hora.datetimeEpoch <= ahora + unDia) {
      seccionFuturo.innerHTML += tarjeta;
    }
  }
}
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // evito que la página se recargue
  pedirClima(inputCiudad.value);//pedriClima busca
});
//actualizar
botonRefrescar.addEventListener("click", function () {
  if (ultimaCiudad === "") {
    mensaje.className = "error";
    mensaje.textContent = "Primero busca una ciudad";
    return;
  }
  pedirClima(ultimaCiudad);
});