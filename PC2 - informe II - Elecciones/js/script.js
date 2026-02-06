/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   CARGA DE DATOS
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
async function cargarElecciones() {
  const response = await fetch("/datos/elecciones.json");
  const data = await response.json();
  return data.elecciones;
}

/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   OBTENER ELECCIÓN POR AÑO
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
function obtenerEleccionPorAnio(elecciones, anio) {
  return elecciones.find(e => e.anio === anio);
}

/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   LISTADO DE RESULTADOS
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
function crearListadoResultados(eleccion) {
  return eleccion.resultados.map(r => ({
    partido: r.partido,
    siglas: r.siglas,
    votos: r.votos,
    concejales: r.concejales
  }));
}

/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   TOTAL DE VOTOS
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
function calcularTotalVotos(eleccion) {
  return eleccion.resultados.reduce((total, r) => total + r.votos, 0);
}

/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   PARTICIPACIÓN REAL
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
function calcularParticipacionReal(eleccion) {
  const votosTotales = calcularTotalVotos(eleccion);
  return {
    censo: eleccion.censo,
    votos: votosTotales,
    porcentaje: (votosTotales / eleccion.censo) * 100
  };
}

/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   DATOS PARA GRÁFICO
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
function datosParaGrafico(eleccion) {
  return {
    labels: eleccion.resultados.map(r => r.siglas),
    votos: eleccion.resultados.map(r => r.votos)
  };
}

/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   INFORME PRINCIPAL (DATOS)
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
async function generarInforme(anio) {
  const elecciones = await cargarElecciones();
  const eleccion = obtenerEleccionPorAnio(elecciones, anio);

  return {
    anio: eleccion.anio,
    fechaEleccion: eleccion.fecha_eleccion,
    resultados: crearListadoResultados(eleccion),
    totalVotos: calcularTotalVotos(eleccion),
    participacion: calcularParticipacionReal(eleccion),
    grafico: datosParaGrafico(eleccion)
  };
}



/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   PINTAR INFORME EN TEMPLATE
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
function pintarInformeEnTemplate(informe, selector) {
  const contenedor = document.querySelector(selector);
  contenedor.innerHTML = "";

  const template = document.querySelector("#tpl-informe");
  //.cloneNode -> clonamos el nodo
  const clone = template.content.cloneNode(true);

  clone.querySelector(".titulo").textContent =
    `Resultados municipales ${informe.anio}`;

  clone.querySelector(".fecha").textContent =
    `Elecciones celebradas el ${informe.fechaEleccion}`;

  const tbody = clone.querySelector(".tablaResultados");

  for (const r of informe.resultados) {
    tbody.innerHTML += `
      <tr>
        <td><figure><img src="img/${r.siglas.toLowerCase()}.svg" class="logo" alt="Logotipo del partido ${r.partido}"><figcaption>${r.partido}</figcaption></figure></td>
        <td>${r.siglas}</td>
        <td>${r.votos}</td>
        <td>${r.concejales}</td>
      </tr>
    `;
  }

  clone.querySelector(".totalVotos").textContent =
    `${informe.totalVotos} votos emitidos`;

  clone.querySelector(".participacion").textContent =
    `${informe.participacion.votos} votos sobre ${informe.participacion.censo}
     (${informe.participacion.porcentaje.toFixed(2)} %)`;

  // Insertamos en el DOM
  contenedor.append(clone);

  // Buscamos el canvas REAL
  const canvas = contenedor.querySelector(".graficoTarta");

  if (canvas) {
    pintarGraficoTarta(canvas, informe.grafico);
  }
}

/* (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)=
   ARRANQUE
   (◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)(◕‿◕)= */
async function mostrarInforme(anio, selector) {
  const informe = await generarInforme(anio);
  pintarInformeEnTemplate(informe, selector);
}

//En el segundo parámetro se utiliza css porque en la funcion pintarInformeTemplate
//utilizamos querySelector
mostrarInforme(2022, '#caja-1');
mostrarInforme(2022, '#caja-2');


function imprimirGraficoTarta(){
  const config = {
  type: 'pie',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Pie Chart'
      }
    }
  },
};
}