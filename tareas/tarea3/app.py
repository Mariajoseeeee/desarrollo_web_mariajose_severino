from flask import Flask, request, redirect, render_template, url_for, jsonify
from database.db import Session, Comuna, Actividad, Foto, ContactarPor, ActividadTema, Comentario
from datetime import datetime, timezone
import os
import hashlib
from werkzeug.utils import secure_filename
import filetype
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from sqlalchemy.orm import joinedload

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def index():
    with Session() as session:
        actividades = session.query(Actividad).options(
            joinedload(Actividad.temas),
            joinedload(Actividad.comuna),
            joinedload(Actividad.fotos)
        ).order_by(Actividad.id.desc()).limit(5).all()

    # Capturar parámetro msg para mostrar mensajes
    msg = request.args.get('msg', '')

    mensaje = ''
    if msg == 'actividad_agregada':
        mensaje = "La actividad fue agregada correctamente."

    return render_template('index.html', actividades=actividades, mensaje=mensaje)


@app.route('/agregar_actividad', methods=['GET', 'POST'])
def agregar_actividad():
    if request.method == 'POST':
        errores = []

        region_id = request.form.get('region')
        comuna_id = request.form.get('comuna')
        sector = request.form.get('sector')
        nombre = request.form.get('nombre', '').strip()
        email = request.form.get('email', '').strip()
        telefono = request.form.get('telefono', '').strip()
        contactar_por = request.form.get('contactar-por')
        dia_hora_inicio = request.form.get('dia-hora-inicio')
        dia_hora_fin = request.form.get('dia-hora-fin')
        descripcion = request.form.get('descripcion', '').strip()
        temas = request.form.getlist('temas')
        glosa_otro = request.form.get("tema-otro", "").strip()
        identificador = None 
        
        with Session() as session:
            # Validar región y comuna
            if not region_id:
                errores.append("Debe seleccionar una región.")
            if not comuna_id:
                errores.append("Debe seleccionar una comuna.")
            else:
                comuna_obj = session.query(Comuna).filter_by(id=int(comuna_id)).first()
                if not comuna_obj:
                    errores.append("Comuna no encontrada.")

            # Validar nombre y email
            if not nombre or len(nombre) > 200:
                errores.append("El nombre del organizador es obligatorio y debe tener hasta 200 caracteres.")
            if not email or len(email) > 100 or "@" not in email:
                errores.append("El email es obligatorio, válido y con menos de 100 caracteres.")

            # Validar teléfono
            if telefono and len(telefono) > 15:
                errores.append("El teléfono debe tener hasta 15 caracteres.")

            # Validar fecha y hora
            try:
                inicio_dt = datetime.fromisoformat(dia_hora_inicio)
            except Exception:
                errores.append("Fecha y hora de inicio inválida.")
                inicio_dt = None

            fin_dt = None
            if dia_hora_fin:
                try:
                    fin_dt = datetime.fromisoformat(dia_hora_fin)
                    if inicio_dt and fin_dt <= inicio_dt:
                        errores.append("La fecha de término debe ser posterior a la de inicio.")
                except Exception:
                    errores.append("Fecha y hora de término inválida.")

            # Validar temas
            temas_validos = ['música', 'deporte', 'ciencias', 'religión', 'política', 'tecnología', 'juegos', 'baile', 'comida', 'otro']
            if not temas:
                errores.append("Debe seleccionar al menos un tema.")

            temas_procesados = []
            for t in temas:
                t = t.strip().lower()
                if t not in temas_validos:
                    errores.append(f"Tema inválido: {t}")
                elif t == "otro":
                    if not glosa_otro:
                        errores.append("Debe especificar el tema si selecciona 'otro'.")
                    elif len(glosa_otro) > 15:
                        errores.append("La descripción del tema 'otro' debe tener máximo 15 caracteres.")

                temas_procesados.append((t, glosa_otro if t == "otro" else None))

            # Validar descripción
            if descripcion and len(descripcion) > 500:
                errores.append("La descripción debe tener menos de 500 caracteres.")

            # Validar fotos
            fotos = request.files.getlist('fotos[]')
            fotos_guardadas = []
            if not fotos or all(f.filename == '' for f in fotos):
                errores.append("Debe subir al menos una foto.")
            else:
                for foto in fotos:
                    if foto.filename == '':
                        continue
                    if not allowed_file(foto.filename):
                        errores.append(f"Archivo '{foto.filename}' no tiene una extensión permitida.")
                        continue
                    tipo = filetype.guess(foto)
                    if tipo is None or tipo.extension not in ALLOWED_EXTENSIONS:
                        errores.append(f"Archivo '{foto.filename}' no es un tipo de imagen válido.")
                        continue
                    filename_hash = hashlib.sha256(secure_filename(foto.filename).encode('utf-8')).hexdigest()
                    img_filename = f"{filename_hash}.{tipo.extension}"
                    path = os.path.join(app.config['UPLOAD_FOLDER'], img_filename)
                    foto.save(path)
                    fotos_guardadas.append(img_filename)

            # Validar red social
            if contactar_por:
                identificador = request.form.get("id-red-social", "").strip()
                if contactar_por != "whatsapp":
                    if not identificador:
                        errores.append("Debe ingresar un identificador para el medio de contacto.")
                    elif len(identificador) < 4 or len(identificador) > 50:
                        errores.append("El identificador del contacto debe tener entre 4 y 50 caracteres.")

            if errores:
                return render_template('form.html', errores=errores, datos=request.form)

            # Crear actividad
            nueva_actividad = Actividad(
                comuna_id=int(comuna_id),
                sector=sector,
                nombre=nombre,
                email=email,
                celular=telefono,
                dia_hora_inicio=inicio_dt,
                dia_hora_termino=fin_dt,
                descripcion=descripcion
            )

            for tema, glosa in temas_procesados:
                nueva_actividad.temas.append(ActividadTema(tema=tema, glosa_otro=glosa))

            for f in fotos_guardadas:
                nueva_actividad.fotos.append(Foto(ruta_archivo=f, nombre_archivo=f))

            if contactar_por:
                nuevo_contacto = ContactarPor(
                    nombre=contactar_por,
                    identificador=identificador,
                    actividad=nueva_actividad
                )
                nueva_actividad.contactos.append(nuevo_contacto)

            try:
                session.add(nueva_actividad)
                session.commit()
                # Redirigir a index con mensaje
                return redirect(url_for('index', msg='actividad_agregada'))
            
            except SQLAlchemyError as e:
                session.rollback()
                error = f"Error guardando la actividad: {str(e.__dict__['orig'])}"
                return render_template('form.html', error=error, datos=request.form)

    return render_template('form.html')


@app.route('/listado')
def listado():
    page = request.args.get('page', 1, type=int)
    per_page = 5
    with Session() as session:
        total_actividades = session.query(Actividad).count()
        total_paginas = (total_actividades + per_page - 1) // per_page

        actividades = session.query(Actividad).options(
            joinedload(Actividad.temas),
            joinedload(Actividad.comuna),
            joinedload(Actividad.fotos)
        ).order_by(Actividad.dia_hora_inicio.desc()) \
            .offset((page - 1) * per_page).limit(per_page).all()

    return render_template(
        'list.html',
        actividades=actividades,
        pagina_actual=page,
        total_paginas=total_paginas
    )

@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')

@app.route('/api/comentarios/<int:actividad_id>')
def api_comentarios(actividad_id):
    with Session() as session:
        comentarios = session.query(Comentario).filter_by(actividad_id=actividad_id).order_by(Comentario.fecha.desc()).all()
        resultado = [
            {
                "nombre": c.nombre,
                "texto": c.texto,
                "fecha": c.fecha.strftime('%d-%m-%Y %H:%M')
            } for c in comentarios
        ]
    return jsonify(resultado)


@app.route('/api/comentarios', methods=['POST'])
def api_agregar_comentario():
    with Session() as session:
        try:
            data = request.json
            actividad_id = data.get('actividad_id')
            nombre = data.get('nombre', '').strip()
            texto = data.get('texto', '').strip()

            errores = []
            if not actividad_id:
                errores.append("Falta el ID de la actividad.")
            if not nombre or len(nombre) < 3 or len(nombre) > 80:
                errores.append("El nombre debe tener entre 3 y 80 caracteres.")
            if not texto or len(texto) < 5:
                errores.append("El comentario debe tener al menos 5 caracteres.")

            if errores:
                return jsonify({"success": False, "errores": errores}), 400

            comentario = Comentario(
                actividad_id=int(actividad_id),
                nombre=nombre,
                texto=texto,
                fecha=datetime.now(timezone.utc)
            )

            session.add(comentario)
            session.commit()
            return jsonify({"success": True})

        except SQLAlchemyError as e:
            session.rollback()
            return jsonify({"success": False, "errores": [str(e)]}), 500


@app.route('/actividad/<int:actividad_id>')
def detalle_actividad(actividad_id):
    with Session() as session:
        actividad = session.query(Actividad).options(
            joinedload(Actividad.temas),
            joinedload(Actividad.comuna),
            joinedload(Actividad.fotos),
            joinedload(Actividad.comentarios)
        ).filter(Actividad.id == actividad_id).first()

        if not actividad:
            return "Actividad no encontrada", 404

    return render_template('detalle_actividad.html', actividad=actividad)
@app.route("/api/estadisticas/por-dia")
def actividades_por_dia():
    with Session() as session:
        resultados = (
            session.query(func.date(Actividad.dia_hora_inicio), func.count())
            .group_by(func.date(Actividad.dia_hora_inicio))
            .all()
        )
        datos = [{"dia": r[0].strftime("%Y-%m-%d"), "cantidad": r[1]} for r in resultados]
    return jsonify(datos)

@app.route("/api/estadisticas/por-tipo")
def actividades_por_tipo():
    with Session() as session:
        resultados = (
            session.query(ActividadTema.tema, func.count())
            .group_by(ActividadTema.tema)
            .all()
        )
        datos = [{"tipo": r[0] if r[0] != "otro" else "Otro", "cantidad": r[1]} for r in resultados]
    return jsonify(datos)

@app.route("/api/estadisticas/por-horario")
def actividades_por_horario():
    with Session() as session:
        resultados = session.query(Actividad.dia_hora_inicio).all()
        conteo = {}

        for (fecha,) in resultados:
            if fecha:
                mes = fecha.strftime("%Y-%m")
                hora = fecha.hour
                if mes not in conteo:
                    conteo[mes] = {"mañana": 0, "mediodía": 0, "tarde": 0}
                if hora < 12:
                    conteo[mes]["mañana"] += 1
                elif hora < 18:
                    conteo[mes]["mediodía"] += 1
                else:
                    conteo[mes]["tarde"] += 1

        datos = [{"mes": m, **v} for m, v in sorted(conteo.items())]
    return jsonify(datos)

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
