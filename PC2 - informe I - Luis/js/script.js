let promedios = []

async function generarInforme(){

  // Fecha
  const now = new Date();
  document.querySelector("#fecha").textContent =
    "Generado el " + now.toLocaleDateString() + " a las " + now.toLocaleTimeString();

  //  Acceso asíncrono al JSON
  const response = await fetch("/datos/calificaciones.json");
  const data = await response.json();
  const alumni = data.alumnado;

  const tbody = document.querySelector("#tabla");
  tbody.innerHTML = "";

  const sumAsignaturas = {
    matematicas: 0,
    lengua: 0,
    historia: 0,
    ciencias: 0
  };

  for(const a of alumni){
    const notas = Object.values(a.notas);
    const promedioAlumnx =
      notas.reduce((acc,n)=>acc+n,0) / notas.length;

    sumAsignaturas.matematicas += a.notas.matematicas;
    sumAsignaturas.lengua += a.notas.lengua;
    sumAsignaturas.historia += a.notas.historia;
    sumAsignaturas.ciencias += a.notas.ciencias;

    tbody.innerHTML += `
      <tr>
        <td>${a.nombre}</td>
        <td>${a.notas.matematicas}</td>
        <td>${a.notas.lengua}</td>
        <td>${a.notas.historia}</td>
        <td>${a.notas.ciencias}</td>
        <td><strong>${promedioAlumnx.toFixed(2)}</strong></td>
      </tr>
    `;
  }

  // Promedios por asignatura
  const ul = document.querySelector("#promediosAsignatura");
  ul.innerHTML = "";

  const totalAlumni = alumni.length;

  for(const asig in sumAsignaturas){
    const media = sumAsignaturas[asig] / totalAlumni;
    promedios.push(sumAsignaturas[asig] / totalAlumni);

    ul.innerHTML += `<li>${asig}: ${media.toFixed(2)}</li>`;
  }
}

// Primera generación
generarInforme();
console.log(promedios)