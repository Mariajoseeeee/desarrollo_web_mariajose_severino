# Tarea 1 - Mariajose Severino

Esta entrega corresponde a la Tarea 1 del curso, que consiste en una app web para gestionar actividades recreativas. Incluye una portada, un formulario para registrar nuevas actividades, un listado con detalles y una sección con estadísticas visuales.

## Decisiones y detalles relevantes

###  Regiones y comunas

Me costo un poco poner el js ya que cada región tiene asociada su lista de comunas. Cuando el usuario selecciona una región, el `select` de comuna se actualiza automáticamente, use varios tutoriales de formularios interactivos en Stack Overflow para una creacion de selectores dependientes, pero lo personalicé bastante para que se ajustara a cómo estaban organizados los campos del formulario. Esta parte fue clave para que la experiencia al llenar el formulario fuera más fluida.

### Validaciones del formulario

El formulario está validado completamente con JavaScript. Se revisa que:
- El nombre tenga al menos 3 caracteres,
- El email tenga formato válido,
- El teléfono solo contenga dígitos,
- Las fechas estén completas y en orden,
- Si se selecciona "Otro" en tema, que se especifique.


###  Listado y detalle de actividades

En el listado se muestran todas las actividades registradas en una tabla. Al hacer clic sobre una fila, se muestra un detalle con toda la información y las fotos. 

También quise que las imágenes se pudieran ampliar, así que usé una capa flotante ('div' con fondo oscuro) que se activa al hacer clic. Esto lo vi en un ejemplo de W3Schools y me pareció útil adaptarlo para mostrar las imágenes más grandes sin salir de la vista actual, aun que puede que haya quedado un poco confuso el codigo lo intente adaptar.

### Diseño y estilo

En cuanto al diseño, use CSS basico con un color rosado como predominante, porque quería que fuera mas calido. Use bordes redondeados, algo de sombreado y una tipografía clara. Nada muy elaborado, pero suficiente para darle identidad.

### Estadísticas

Los datos son inventados, como pedía el enunciado, y los gráficos los generé en Excel,luego los exporté como imágenes PNG.

## Navegación

- La **portada** ('index.html') tiene acceso a todas las secciones.
- Desde el **formulario** se pueden agregar nuevas actividades, con validaciones completas.
- En el **listado**, cada actividad puede verse en detalle.
- En **estadísticas**, se pueden ver visualizaciones generales.

---

