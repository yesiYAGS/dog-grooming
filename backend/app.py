import os
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
EMAIL_USER = os.environ.get("EMAIL_USER", "")
EMAIL_PASS = os.environ.get("EMAIL_PASS", "")
EMAIL_DEST = os.environ.get("EMAIL_DEST", "")

SERVICIOS = [
    {"id": "corte", "nombre": "Corte de pelo", "duracion": "45 min", "precio": "$15.000"},
    {"id": "banio", "nombre": "Baño", "duracion": "30 min", "precio": "$10.000"},
    {"id": "unas", "nombre": "Corte de uñas", "duracion": "15 min", "precio": "$5.000"},
]

DB = os.path.join(os.path.dirname(__file__), "citas.db")

HORARIOS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00",
]


def init_db():
    with sqlite3.connect(DB) as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS citas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                telefono TEXT NOT NULL,
                email TEXT NOT NULL,
                perro TEXT NOT NULL,
                servicio TEXT NOT NULL,
                fecha TEXT NOT NULL,
                hora TEXT NOT NULL,
                creada_en TEXT NOT NULL
            )
        """)


def enviar_email(cita: dict):
    if not EMAIL_USER or not EMAIL_PASS or not EMAIL_DEST:
        print("[EMAIL] Variables de entorno no configuradas, omitiendo envío.")
        return

    asunto = f"Nueva reserva — {cita['nombre']} ({cita['servicio']})"
    cuerpo = f"""
Nueva reserva en Peluquería Canina:

Cliente : {cita['nombre']}
Teléfono: {cita['telefono']}
Email   : {cita['email']}
Perro   : {cita['perro']}
Servicio: {cita['servicio']}
Fecha   : {cita['fecha']}
Hora    : {cita['hora']}
""".strip()

    msg = MIMEMultipart()
    msg["From"] = EMAIL_USER
    msg["To"] = EMAIL_DEST
    msg["Subject"] = asunto
    msg.attach(MIMEText(cuerpo, "plain", "utf-8"))

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as smtp:
        smtp.starttls()
        smtp.login(EMAIL_USER, EMAIL_PASS)
        smtp.sendmail(EMAIL_USER, EMAIL_DEST, msg.as_string())

    print(f"[EMAIL] Reserva enviada a {EMAIL_DEST}")


@app.route("/api/servicios")
def get_servicios():
    return jsonify(SERVICIOS)


@app.route("/api/horarios")
def get_horarios():
    return jsonify(HORARIOS)


@app.route("/api/citas", methods=["POST"])
def crear_cita():
    data = request.get_json()

    campos = ["nombre", "telefono", "email", "perro", "servicio", "fecha", "hora"]
    for campo in campos:
        if not data.get(campo, "").strip():
            return jsonify({"error": f"El campo '{campo}' es requerido."}), 400

    servicio_nombre = next(
        (s["nombre"] for s in SERVICIOS if s["id"] == data["servicio"]), data["servicio"]
    )

    cita = {**data, "servicio": servicio_nombre}

    with sqlite3.connect(DB) as con:
        con.execute(
            """INSERT INTO citas
               (nombre, telefono, email, perro, servicio, fecha, hora, creada_en)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                cita["nombre"], cita["telefono"], cita["email"], cita["perro"],
                cita["servicio"], cita["fecha"], cita["hora"],
                datetime.now().strftime("%Y-%m-%d %H:%M"),
            ),
        )

    try:
        enviar_email(cita)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")

    return jsonify({"ok": True, "cita": cita}), 201


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
