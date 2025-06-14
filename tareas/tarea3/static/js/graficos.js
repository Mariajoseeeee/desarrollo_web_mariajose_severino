document.addEventListener("DOMContentLoaded", () => {
  const miPaleta = [
    '#d63384',  
    '#ffb6c1',  
    '#c71585',  
    '#ff69b4',  
    '#a70b59',  
    '#5c014d'  
  ];

  fetch("/api/estadisticas/por-dia")
    .then(res => res.json())
    .then(data => {
      Highcharts.chart("grafico-lineas", {
        colors: miPaleta,
        chart: { 
          type: "line",
          backgroundColor: '#fff0f5' // mismo fondo que el body
        },
        title: { 
          text: "Actividades por Día",
          style: { color: '#c71585', fontWeight: 'bold' }
        },
        xAxis: { 
          categories: data.map(d => d.dia),
          labels: { style: { color: '#5c014d' } }
        },
        yAxis: { 
          title: { 
            text: "Cantidad",
            style: { color: '#5c014d' }
          },
          labels: { style: { color: '#5c014d' } }
        },
        series: [{ 
          name: "Actividades", 
          data: data.map(d => d.cantidad)
        }],
        tooltip: {
          backgroundColor: '#ffe6f0',
          style: { color: '#a70b59' }
        }
      });
    });

  fetch("/api/estadisticas/por-tipo")
    .then(res => res.json())
    .then(data => {
      Highcharts.chart("grafico-torta", {
        colors: miPaleta,
        chart: { 
          type: "pie",
          backgroundColor: '#fff0f5'
        },
        title: { 
          text: "Actividades por Tipo",
          style: { color: '#c71585', fontWeight: 'bold' }
        },
        series: [{
          name: "Cantidad",
          data: data.map(d => ({ name: d.tipo, y: d.cantidad })),
          showInLegend: true
        }],
        tooltip: {
          backgroundColor: '#ffe6f0',
          style: { color: '#a70b59' }
        },
        legend: {
          itemStyle: { color: '#5c014d', fontWeight: 'bold' }
        }
      });
    });

  fetch("/api/estadisticas/por-horario")
    .then(res => res.json())
    .then(data => {
      Highcharts.chart("grafico-barras", {
        colors: miPaleta,
        chart: { 
          type: "column",
          backgroundColor: '#fff0f5'
        },
        title: { 
          text: "Actividades por Mes y Horario",
          style: { color: '#c71585', fontWeight: 'bold' }
        },
        xAxis: { 
          categories: data.map(d => d.mes),
          labels: { style: { color: '#5c014d' } }
        },
        yAxis: { 
          title: { 
            text: "Cantidad",
            style: { color: '#5c014d' }
          },
          labels: { style: { color: '#5c014d' } }
        },
        series: [
          { name: "Mañana", data: data.map(d => d.mañana) },
          { name: "Mediodía", data: data.map(d => d.mediodía) },
          { name: "Tarde", data: data.map(d => d.tarde) }
        ],
        tooltip: {
          backgroundColor: '#ffe6f0',
          style: { color: '#a70b59' }
        },
        legend: {
          itemStyle: { color: '#5c014d', fontWeight: 'bold' }
        }
      });
    });
});
