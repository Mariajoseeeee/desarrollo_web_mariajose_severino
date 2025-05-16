from flask import Flask, request, redirect, render_template, url_for
from database.db import session, Region, Comuna, Actividad, Foto, ContactarPor, ActividadTema
from datetime import datetime
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'static/uploads'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def index():
    ultimas = session.query(Actividad).order_by(Actividad.id.desc()).limit(5).all()
    return render_template("index.html", actividades=ultimas)

@app.route("/agregar_actividad", methods=["POST"])
def agregar_actividad():
    try:
        comuna_id = int(request.form["comuna"])
        sector = request.form["sector"]
        nombre = request.form["nombre"]
        email = request.form["email"]
        celular = request.form.get("telefono") or None
        inicio = datetime.fromisoformat(request.form["dia-hora-inicio"])
        termino = request.form.get("dia-hora-fin")
        descripcion = request.form.get("descripcion")

        if termino:
            termino = datetime.fromisoformat(termino)
        else:
            termino = None

        nueva = Actividad(
            comuna_id=comuna_id,
            sector=sector,
            nombre=nombre,
            email=email,
            celular=celular,
            dia_hora_inicio=inicio,
            dia_hora_termino=termino,
            descripcion=descripcion
        )
        session.add(nueva)
        session.commit()

        act_id = nueva.id

        # Guardar tema
        tema = request.form.get("tema", "").lower()
        glosa = request.form.get("tema-otro") if tema == "otro" else None
        if tema:
            tema_entry = ActividadTema(actividad_id=act_id, tema=tema, glosa_otro=glosa)
            session.add(tema_entry)

        # Guardar forma de contacto
        medio = request.form.get("contactar-por", "").lower()
        identificador = None
        for key in request.form:
            if key.startswith("id-red-social-"):
                identificador = request.form[key]
                break
        if medio and identificador:
            contacto = ContactarPor(actividad_id=act_id, nombre=medio, identificador=identificador)
            session.add(contacto)

        # Guardar fotos
        fotos = request.files.getlist("fotos")
        for foto in fotos:
            if foto.filename == "":
                continue
            filename = secure_filename(foto.filename)
            ruta_relativa = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            foto.save(ruta_relativa)
            nueva_foto = Foto(
                actividad_id=act_id,
                ruta_archivo=ruta_relativa,
                nombre_archivo=filename
            )
            session.add(nueva_foto)

        session.commit()
        return redirect(url_for("index"))

    except Exception as e:
        session.rollback()
        return f"Error al registrar actividad: {e}", 500
