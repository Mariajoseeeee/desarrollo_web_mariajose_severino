# Tarea 2 – Sistema Web para Gestión de Actividades


Este proyecto es la Tarea 2 de Progrmacion Web, que consiste en un sistema web desarrollado con Flask para agregar, listar y visualizar actividades, con manejo de imágenes y temas adaptado a la Tarea 1.

## Resumen General

El sistema permite a los usuarios agregar actividades mediante un formulario, que pide: nombre, comuna, fechas, organizador, descripción, temas asociados y fotos. Luego, se pueden listar las actividades, ver detalles y ampliar imágenes.

## Estructura del Proyecto

- **app.py**: Controlador principal de la aplicación Flask. Aquí se manejan las rutas, la lógica de recepción y validación de formularios, la interacción con la base de datos y el renderizado de vistas.

- **database/db.py**: Contiene los modelos SQLAlchemy que representan las tablas y relaciones de la base de datos (actividad, comuna, región, fotos, temas, medios de contacto).

- **templates/**: Carpeta con las plantillas Jinja2 que generan el HTML dinámico para listar actividades, mostrar detalles.

- **static/**: Contiene los archivos estáticos: CSS para estilos, JS para validaciones en frontend y lógica dinámica, y la carpeta `uploads/` para las imágenes subidas.

## Cambios y Consideraciones Importantes

### Migración a Plantillas Dinamicas

Al inicio en mi Tarea 1, el HTML era más estático, con poca o ninguna dinámica, cuando mostraba una actividad toda estaba estatica en el HTML. Se decidió migrar a plantillas Jinja2 para:

- Permitir la inserción dinámica de datos desde Flask.
- Reutilizar componentes y hacer el código más limpio y modular.
- Integrar ciclos y condicionales para mostrar temas, fotos y detalles.

Este cambio implicó reescribir bastante código HTML y adaptar JavaScript y CSS para que funcionaran bien con los nuevos bloques dinámicos, lo cual me llevo harto tiempo y fue un poco confuso, pero se pudo para poder usara mejor Flask.

### Validaciones y Seguridad

Se implementaron validaciones en dos niveles:

- **Backend (Flask):** Validación estricta de todos los campos, incluyendo:
  - Campos obligatorios, longitud máxima y formatos (emails, fechas, teléfonos).
  - Validación lógica (fecha término mayor a inicio).
  - Validación y sanitización de archivos: sólo se permiten extensiones específicas, y se valida el tipo MIME con la librería `filetype`.
  - Renombrado seguro de archivos usando hashes para evitar colisiones y posibles ataques.
  - Control y guardado correcto de múltiples temas y fotos.

- **Frontend (JavaScript):** Validaciones para mejorar la experiencia de usuario, evitando enviar formularios con errores y mostrando mensajes claros, basicamente igual que la Tarea 1.

### Manejo de Temas y Fotos

- El formulario permite seleccionar múltiples temas, incluyendo la opción “otro” con un campo adicional para especificar.
- Las fotos se pueden subir múltiples, se validan y guardan en disco sin sobrescribir archivos existentes.
- En el detalle de la actividad, se muestran todos los temas con su respectiva descripción cuando es “otro”, y se pueden ampliar las fotos haciendo click.
