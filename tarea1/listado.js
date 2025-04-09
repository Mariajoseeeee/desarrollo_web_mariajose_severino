document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('tablaActividades');
    const detalle = document.getElementById('detalleActividad');
  
    // Datos ficticios completos para mostrar en detalle
    const actividades = {
        1: {
          inicio: "2025-03-28 12:00",
          termino: "2025-03-28 14:00",
          comuna: "Santiago",
          sector: "Beauchef 850, Terraza",
          tema: "Escuela de Boxeo",
          nombreOrganizador: "Decana",
          fotos: ["hasbullaboxeo.jpg"]
        },
        2: {
          inicio: "2025-03-29 19:00",
          termino: "2025-03-29 20:00",
          comuna: "Ñuñoa",
          sector: "Plaza",
          tema: "Cómo deshidratar fruta",
          nombreOrganizador: "Benjamin Estupiñan",
          fotos: ["fruta.webp"]
        },
        3: {
          inicio: "2022-03-30 18:00",
          termino: "-",
          comuna: "Santiago",
          sector: "Parque O´higgins",
          tema: "Música urbana",
          nombreOrganizador: "Denisse Godoy",
          fotos: ["urbana.jpg"]
        },
        4: {
          inicio: "2025-09-05 09:00",
          termino: "2025-09-05 12:00",
          comuna: "Las Condes",
          sector: "Centro Cultural",
          tema: "Exposición de Arte Contemporáneo",
          nombreOrganizador: "Dania Diez",
          fotos: ["arte.jpg"]
        },
        5: {
          inicio: "2025-05-07 10:00",
          termino: "2025-05-07 12:00",
          comuna: "Maipu",
          sector: "Teatro Municipal",
          tema: "Teatro Infantil: 'La Sirenita'",
          nombreOrganizador: "Matias Bustos",
          fotos: ["teatro.jpg"]
        }
      };
      
  
    tabla.querySelectorAll('tr[data-id]').forEach(fila => {
      fila.addEventListener('click', () => {
        const id = fila.dataset.id;
        const act = actividades[id];
        detalle.innerHTML = `
          <h2>Detalle de Actividad</h2>
          <p><strong>Inicio:</strong> ${act.inicio}</p>
          <p><strong>Término:</strong> ${act.termino}</p>
          <p><strong>Comuna:</strong> ${act.comuna}</p>
          <p><strong>Sector:</strong> ${act.sector}</p>
          <p><strong>Tema:</strong> ${act.tema}</p>
          <p><strong>Organizador:</strong> ${act.nombreOrganizador}</p>
          <div>
            ${act.fotos.map(foto => `
              <img src="${foto}" width="320" height="240" style="margin: 10px; cursor: pointer;" onclick="ampliarImagen('${foto}')">
            `).join('')}
          </div>
          <button onclick="volverAlListado()">Volver al listado</button>
          <a href="index.html">Volver a la portada</a>
        `;
        tabla.style.display = 'none';
        detalle.style.display = 'block';
      });
    });
  });
  
  function volverAlListado() {
    document.getElementById('tablaActividades').style.display = 'table';
    document.getElementById('detalleActividad').style.display = 'none';
  }
  
  function ampliarImagen(src) {
    const img = document.getElementById('imgGrande');
    img.src = src;
    document.getElementById('imagenAmpliada').style.display = 'block';
  }
  
  function cerrarImagen() {
    document.getElementById('imagenAmpliada').style.display = 'none';
  }
  