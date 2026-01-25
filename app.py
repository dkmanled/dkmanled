import os
import json
import re
from flask import Flask, jsonify, request, render_template, abort

app = Flask(__name__, static_folder='static', template_folder='templates')

FESTIVALS_FILE = 'festivals.json'
festivals_data = []

def load_festivals():
    global festivals_data
    try:
        if os.path.exists(FESTIVALS_FILE):
            with open(FESTIVALS_FILE, 'r', encoding='utf-8') as f:
                festivals_data = json.load(f)
        else:
            festivals_data = []
            save_festivals() # Create the file if it doesn't exist
            app.logger.info(f"'{FESTIVALS_FILE}' no encontrado, se creó uno vacío.")
    except Exception as e:
        festivals_data = []
        app.logger.error(f"Error cargando {FESTIVALS_FILE}: {e}")

def save_festivals():
    global festivals_data
    try:
        with open(FESTIVALS_FILE, 'w', encoding='utf-8') as f:
            json.dump(festivals_data, f, ensure_ascii=False, indent=4)
    except Exception as e:
        app.logger.error(f"Error guardando {FESTIVALS_FILE}: {e}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/festivals', methods=['GET'])
def get_festivals():
    return jsonify(festivals_data)

@app.route('/api/festivals/<int:festival_id>', methods=['DELETE'])
def delete_festival(festival_id):
    global festivals_data
    festivals_data = [f for f in festivals_data if f.get('id') != festival_id]
    save_festivals()
    return '', 204

@app.route('/api/festivals/<int:festival_id>', methods=['PUT'])
def update_festival_data(festival_id):
    global festivals_data
    data = request.get_json()
    if not data:
        abort(400, description="No se proporcionaron datos JSON.")

    festival_to_update = None
    for festival in festivals_data:
        if festival.get('id') == festival_id:
            festival_to_update = festival
            break

    if not festival_to_update:
        abort(404, description=f"Fiesta con ID {festival_id} no encontrada.")

    # Campos que se pueden actualizar
    fields_to_update = [
        'name', 'day', 'month', 'location', 'province',
        'directorName', 'contactPhone', 'email', 'facebook',
        'status', 'notes'
    ]
    for field in fields_to_update:
        if field in data:
            festival_to_update[field] = data[field]

    save_festivals()
    return jsonify(festival_to_update)

@app.route('/api/extract-info', methods=['POST'])
def extract_info():
    data = request.get_json()
    if not data or 'text' not in data:
        abort(400, description="No se proporcionó texto.")

    text = data['text']
    # Aquí iría la llamada real a la API de Claude si tuviéramos la Key.
    # Por ahora, haremos una extracción básica con Regex o devolveremos un objeto vacío para que el usuario complete.

    extracted = {
        "directorName": "",
        "contactPhone": "",
        "email": "",
        "facebook": ""
    }

    # Intento simple de extraer algo (ejemplo)
    phone_match = re.search(r'(\+?\d[\d\s-]{7,})', text)
    if phone_match:
        extracted["contactPhone"] = phone_match.group(1).strip()

    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if email_match:
        extracted["email"] = email_match.group(0)

    # El usuario puede mejorar esto integrando Anthropic SDK aquí.

    return jsonify(extracted)

@app.route('/api/festivals', methods=['POST'])
def add_new_festival():
    global festivals_data
    data = request.get_json()
    if not data:
        abort(400, description="No se proporcionaron datos JSON.")

    required_fields = ['name', 'month', 'location', 'province']
    for field in required_fields:
        if field not in data or not data[field]:
            abort(400, description=f"Campo obligatorio '{field}' faltante o vacío.")

    # Generar nuevo ID
    new_id = 1
    if festivals_data:
        new_id = max(f.get('id', 0) for f in festivals_data) + 1

    new_festival = {
        "id": new_id,
        "name": data.get('name'),
        "day": data.get('day'),
        "month": data.get('month'),
        "location": data.get('location'),
        "province": data.get('province'),
        "directorName": data.get('directorName', ""),
        "contactPhone": data.get('contactPhone', ""),
        "email": data.get('email', ""),
        "facebook": data.get('facebook', ""),
        "status": data.get('status', "Pendiente"),
        "notes": data.get('notes', "")
    }

    festivals_data.append(new_festival)
    save_festivals()
    return jsonify(new_festival), 201

load_festivals()

if __name__ == '__main__':
    app.run(debug=True)
