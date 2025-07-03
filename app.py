import os
import json
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

    # Campos que se pueden actualizar desde el modal de edición
    editable_fields = ['contactName', 'contactPhone', 'email', 'status', 'notes']
    for field in editable_fields:
        if field in data:
            festival_to_update[field] = data[field]

    # Asegurar que los campos no editables se mantengan si no vienen, o tomar del original
    # (Esto es más para PUT, pero bueno tenerlo en cuenta)
    # festival_to_update['name'] = data.get('name', festival_to_update['name'])
    # festival_to_update['month'] = data.get('month', festival_to_update['month'])
    # festival_to_update['location'] = data.get('location', festival_to_update['location'])
    # festival_to_update['province'] = data.get('province', festival_to_update['province'])


    save_festivals()
    return jsonify(festival_to_update)

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
        "month": data.get('month'),
        "location": data.get('location'),
        "province": data.get('province'),
        "contactName": data.get('contactName', ""),
        "contactPhone": data.get('contactPhone', ""),
        "email": data.get('email', ""),
        "status": data.get('status', "Pendiente"), # Por defecto a Pendiente
        "notes": data.get('notes', "")
    }

    festivals_data.append(new_festival)
    save_festivals()
    return jsonify(new_festival), 201

if __name__ == '__main__':
    load_festivals()
    app.run(debug=True)
