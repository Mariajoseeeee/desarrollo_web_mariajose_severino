# Tarea 3 - Actividades Sociales

Esta tarea extiende la Tarea 2 incorporando funcionalidades de comentarios y estadísticas. 

---

### Comentarios

Se agregó un sistema de comentarios por actividad usando JavaScript y AJAX (fetch). Esto permitió que al hacer clic en una actividad se cargaran sus comentarios sin recargar la página. También se incluye un formulario para agregar comentarios, que hace una petición POST en segundo plano. Si los datos eran válidos (nombre entre 3 y 80 caracteres, texto mínimo 5), se guardaba el comentario en la base de datos y se mostraba de inmediato. Esto mejoró la experiencia del usuario y mantuvo la página más interactiva. También se manejaron errores del servidor de forma que se mostraran mensajes sin romper la interfaz.


---

### Estadísticas

Para mostrar estadísticas de actividades se implementaron tres rutas API en Flask:  
- `/api/estadisticas/por-dia`  
- `/por-tipo`  
- `/por-horario`  

Estas rutas devuelven datos en formato JSON. Luego, un archivo JS (`graficos.js`) los consume con `fetch` y los muestra usando Highcharts.


---

### Formato de fechas

Uno de los detalles que más ajustes requirió fue el manejo de fechas. En el formulario se pidió que el campo de inicio se prellenara con la fecha y hora actual en formato `yyyy-mm-ddThh:mm`. 

Para mostrar las fechas en las vistas (`index`, `listado`, `detalle`), se usó el formato `dd-mm-yyyy hh:mm` mediante `strftime`. Esto mejoró la presentación general y mantuvo coherencia visual.

---

### Manejo de sesión con SQLAlchemy

Algunos errores (`InvalidRequestError`) aparecieron por usar una sesión de base de datos global. Para evitar problemas con conexiones simultáneas, se reemplazó `session` por bloques `with Session() as session:` en todas las rutas. Esto ayudó a evitar conflictos y errores al hacer queries o inserts concurrentes.
