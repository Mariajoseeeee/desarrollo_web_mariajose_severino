# Ejercicio 3

**Nombre**: Mariajose Severino

---
## Observaciones
Tenga en cuenta las siguientes observaciones al realizar el ejercicio:

- El ejercicio es de carácter **personal**; la copia será penalizada con **nota mínima**.
- De ser necesario investigar, usted esta **autorizado a utilizar internet** como herramienta.
- El uso de modelos generativos de lenguaje como **ChatGPT está estrictamente prohibido** y será penalizado con **nota mínima**. 

## Pregunta 1
En el curso hemos hablado sobre cómo el input del usuario puede ser malicioso. Un ejemplo de esto son las inyecciones SQL, una de las vulnerabilidades más populares. Ésta consiste en que input hecho por el usuario permite inyectar código en las sentencias SQL que usamos (cómo cuando guardamos algo en la base de datos).

A pesar de ser una de las vulnerabilidades más recurrentes en aplicaciones web, no es la única donde el input del usuario juega una mala pasada. Otro ejemplo es el llamado **Server Side Template Injection** (SSTI). Investigue y explique brevemente en qué consiste esta vulnerabilidad.

**Respuesta**:
El Server Side Template Injection, es tipo de ataque de inyeccion mediante el cual el atacante inyecta un pedazo de codigo malicioso dentro de una plantilla del lado del servidor, esto sucede por malas validaciones de los inputs y porque el servidor interpreta el input ingresado como una parte de la plantilla, en el peor caso el atacante puede llegar a tener el control total del servidor.
(Me base en https://www.north-networks.com/que-es-server-side-template-injection/)

## Pregunta 2

Usted cuenta con el siguiente proyecto de flask:
```bash
flask_app
├── app.py
├── static
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   └── code.js
│   └── svg
│       └── icon.svg
└── templates
    ├── base.html
    └── ruta.html
```
En donde `app.py` tiene las siguientes rutas:
```python
@app.route("/", methods=["GET"])
def index():
    return render_template("ruta.html")

@app.route("/<num>", methods=["GET"])
def index_param(num):
    return render_template("ruta.html", num=int(num))
```
Y `base.html` tiene la siguiente forma:
```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>{% block title %}{% endblock %}</title>
    {% block css %}{% endblock %}
  </head>
  <body>
    {% block content %}{% endblock %}
    {% block javascript %}{% endblock %}
  </body>
</html>
```

El objetivo de esta pregunta es que usted rellene los bloques de la template `ruta.html` **utilizando funcionalidades de `Jinja`** tal que se cumplan los siguientes requerimientos:

1. Se enlaza al documento HTML el archivo `styles.css`
2. Se incluye el codigo javascript en `code.js`.
3. En caso de que se entregue una variable `num` en el url, se debera mostrar `num` veces la imagen `icon.svg`.
4. En caso de que no se entregue `num`, se debera mostrar un parrafo que diga "*No se entrego un valor*".

**Respuesta:**

```html
{% extends 'base.html' %}

{% block title %}Ruta{% endblock %}

{% block css %}
    <!-- PROGRAME AQUI! -->
     <link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}" >
{% endblock %}

{% block content %}
    <h1>RUTA!</h1>
    <!-- PROGRAME AQUI! -->
    {% if num is not none %}
      {% for i in range(num) %}
      <img src="{{ url_for('static', filename='svg/icon.svg') }}" alt="icon.svg">
      {% endfor %}
    {% else %}
      <p>No se entrego un valor.</p>
    {% endif %}
{% endblock %}

{% block javascript %}
    <!-- PROGRAME AQUI! -->
       <script src="{{ url_for('static', filename='js/code.js') }}" defer></script>
{% endblock %}
```
**Hint:** para ubicar archivos use la funcion `url_for` de `Jinja`.

## Pregunta 3
Usted está haciendo una aplicación Flask y su archivo de rutas se ve así:

```python
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/exito')
def exito():
  return "Respondiste correctamente!"

@app.route('/malo')
def malo():
  return "Respondiste mal :("

@app.route('/pregunta', method=('GET', 'POST'))
def pregunta():
  return render_template('pregunta.html')
```

En este momento la aplicación envía el HTML *pregunta.html* con un formulario como el siguiente:

```html
<form action="pregunta" method="post" enctype="multipart/form-data">
  <label for="pregunta">Pregunta</label>
  <input id="mi-input" name="pregunta" type="text">
  <button type="submit">Enviar</button>
</form>
```

Complete la función `pregunta` para que al enviar el formulario valide que el texto enviado en el formulario:
- No tenga la palabra "pizza" (Solo la palabra, algo como "pixxzza" está permitido)
- Tenga al menos 5 caracteres y máximo 30
- Tenga por lo menos un carácter y un digito. DEBE hacer esta validación con una expresión regular.

HINT: expresion = r'^(?=.*[a-zA-Z])(?=.*\d)'

Si cumple todas estas condiciones redireccione al usuario a la ruta `exito`, de lo contrario redirija a la ruta `malo`. Sólo puede programar en Python en el espacio que se proporciona en la respuesta.

Reciba el formulario si el método es `POST`, tome el input, escriba y use la función `validar_input` para validar el input.

**Respuesta**:

```python
# IMPORTE LO QUE TENGA QUE IMPORTAR DE FLASK U OTRA LIBRERÍA
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/exito')
def exito():
  return "Respondiste correctamente!"

@app.route('/malo')
def malo():
  return "Respondiste mal :o"

def validar_input(mi_input):
  # VALIDE SU INPUT AQUI
  if 'pizza' in mi_input:
    return False
  if len(mi_input) < 5 or len(mi_input) > 30:
    return False
  expresion = r'^(?=.*[a-zA-Z])(?=.*\d)'

  return re.match(expresion, mi_input) is not None

@app.route('/pregunta', method=('GET', 'POST'))
def pregunta():
  # COMPLETE AQUI LA LÓGICA DE SU RUTA
  if request.method == 'POST':
    text = request.form.get('pregunta', '')
    if validar_input(text):
      return redirect(url_for('exito'))
    else:
      return redirect(url_for('malo'))

  return render_template('pregunta.html')
```