
// Función asíncrona para obtener datos y renderizar informe

async function generarInforme() {
    // fetch busca el archivo.
  const response = await fetch('datos/calificaciones.json');
  // Extraemos el objeto 'alumnado' del JSON convertido a objeto JS
  const { alumnado } = await response.json();

  // Localiza el elemento con ID "fecha" y le mete la fecha del sistema con formato local (dd/mm/aaaa)
  document.getElementById("fecha").textContent = `Generado el: ${new Date().toLocaleDateString()}`;

  // 1. Filas de la tabla 
  document.getElementById("tabla").innerHTML = alumnado.map(alumno => {
    const notas = Object.values(alumno.notas);
    const promedio = (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2);
    return `<tr>
              <td>${alumno.nombre}</td>
              ${notas.map(n => `<td>${n}</td>`).join('')}
              <td><strong>${promedio}</strong></td>
            </tr>`;
  }).join('');

  /// CÁLCULO DE PROMEDIOS GENERALES POR ASIGNATURA
  const nombresAsignaturas = Object.keys(alumnado[0].notas);
  const listaHTML = nombresAsignaturas.map(materia => {
    const suma = alumnado.reduce((acc, alu) => acc + alu.notas[materia], 0);
    const media = (suma / alumnado.length).toFixed(2);
    return `<li><strong>${materia.toUpperCase()}:</strong> ${media}</li>`;
  }).join('');

  // Inyectamos la lista de promedios en el <ul> correspondiente
  document.getElementById("promediosAsignatura").innerHTML = listaHTML;
}

// ASIGNACIÓN DE EVENTOS (INTERACTIVIDAD)
document.getElementById("generar-informe").onclick = generarInforme;

// // Cuando se hace clic en guardar, se abre el menú de impresión del sistema (PDF nativo)
document.getElementById("guardar-pdf").onclick = () => window.print();