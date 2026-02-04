async function generarInforme() {
  const response = await fetch('datos/calificaciones.json');
  const { alumnado } = await response.json();

  document.getElementById("fecha").textContent = `Generado el: ${new Date().toLocaleDateString()}`;

  // 1. Filas de la tabla (Tu código)
  document.getElementById("tabla").innerHTML = alumnado.map(alumno => {
    const notas = Object.values(alumno.notas);
    const promedio = (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2);
    return `<tr>
              <td>${alumno.nombre}</td>
              ${notas.map(n => `<td>${n}</td>`).join('')}
              <td><strong>${promedio}</strong></td>
            </tr>`;
  }).join('');

  // 2. Promedios por asignatura (Lo nuevo)
  const nombresAsignaturas = Object.keys(alumnado[0].notas);
  const listaHTML = nombresAsignaturas.map(materia => {
    const suma = alumnado.reduce((acc, alu) => acc + alu.notas[materia], 0);
    const media = (suma / alumnado.length).toFixed(2);
    return `<li><strong>${materia.toUpperCase()}:</strong> ${media}</li>`;
  }).join('');

  document.getElementById("promediosAsignatura").innerHTML = listaHTML;
}

// 3. Activar botones
document.getElementById("generar-informe").onclick = generarInforme;
document.getElementById("guardar-pdf").onclick = () => window.print();