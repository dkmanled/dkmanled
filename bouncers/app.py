from flask import Flask, render_template, jsonify, request
import os
import sqlite3
import math
import threading
import time
from database import get_db_connection, init_db
from seed_geo import populate_geo
from scanner import search_places_serper, search_social_serper, process_with_openrouter

app = Flask(__name__)

# Configuración básica
API_KEYS = {
    "SERPER": os.getenv("SERPER_API_KEY", ""),
    "OPENROUTER": os.getenv("OPENROUTER_API_KEY", "")
}

def run_spider(comunas, radius):
    """Proceso de fondo que escanea cada comuna"""
    if not API_KEYS["SERPER"]:
        print("Spider cancelado: SERPER_API_KEY no configurada.")
        return

    for comuna in comunas:
        nombre_comuna = comuna['nombre']
        print(f"Spider: Escaneando {nombre_comuna}...")

        # 1. Buscar en Google Maps
        query = f"discoteca discoteque nightclub boliche en {nombre_comuna}, Chile"
        places = search_places_serper(query, API_KEYS["SERPER"])

        for place in places:
            # Evitar duplicados por google_place_id
            place_id = place.get('cid') # Serper usa cid como id único de maps
            conn = get_db_connection()
            exists = conn.execute('SELECT id FROM locales WHERE google_place_id = ?', (str(place_id),)).fetchone()

            if exists:
                conn.close()
                continue

            # 2. Si no tiene teléfono, buscar en Google Search (Sabueso)
            social_info = {}
            has_phone = bool(place.get('phoneNumber'))

            if not has_phone and API_KEYS["SERPER"]:
                search_query = f"{place.get('title')} {nombre_comuna} instagram facebook twitter"
                social_info = search_social_serper(search_query, API_KEYS["SERPER"])

            # 3. Procesar con IA (OpenRouter)
            enriched_data = {}
            if API_KEYS["OPENROUTER"]:
                raw_text = f"Nombre: {place.get('title')}, Dirección: {place.get('address')}, Rating: {place.get('rating')}, PhoneInMaps: {place.get('phoneNumber')}, InfoExtra: {social_info}"
                enriched_data = process_with_openrouter(raw_text, API_KEYS["OPENROUTER"])

            # 4. Guardar en Base de Datos
            try:
                final_data = {
                    "google_place_id": str(place_id),
                    "nombre": place.get('title'),
                    "direccion": place.get('address'),
                    "comuna": nombre_comuna,
                    "latitud": place.get('latitude'),
                    "longitud": place.get('longitude'),
                    "telefono": place.get('phoneNumber') or (enriched_data.get('telefono') if enriched_data else ""),
                    "rating": place.get('rating'),
                    "user_ratings_total": place.get('ratingCount'),
                    "tipo": enriched_data.get('tipo') if enriched_data else "Pendiente",
                    "apto_show": enriched_data.get('apto_show') if enriched_data else False,
                    "justificacion": enriched_data.get('justificacion') if enriched_data else "",
                    "instagram": enriched_data.get('instagram') if enriched_data else "",
                    "facebook": enriched_data.get('facebook') if enriched_data else "",
                    "twitter": enriched_data.get('twitter') if enriched_data else "",
                    "whatsapp": enriched_data.get('whatsapp') if enriched_data else "",
                    "email": enriched_data.get('email') if enriched_data else "",
                    "contacto_nombre": enriched_data.get('contacto_nombre') if enriched_data else "",
                    "score": enriched_data.get('score') if enriched_data else 0
                }

                conn.execute('''
                    INSERT INTO locales (
                        google_place_id, nombre, direccion, comuna, latitud, longitud,
                        telefono, rating, user_ratings_total, tipo, apto_show,
                        justificacion, instagram, facebook, twitter, whatsapp, email,
                        contacto_nombre, score
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    final_data["google_place_id"], final_data["nombre"], final_data["direccion"],
                    final_data["comuna"], final_data["latitud"], final_data["longitud"],
                    final_data["telefono"], final_data["rating"], final_data["user_ratings_total"],
                    final_data["tipo"], final_data["apto_show"], final_data["justificacion"],
                    final_data["instagram"], final_data["facebook"], final_data["twitter"],
                    final_data["whatsapp"], final_data["email"], final_data["contacto_nombre"],
                    final_data["score"]
                ))
                conn.commit()
            except Exception as e:
                print(f"Error guardando local {place.get('title')}: {e}")
            finally:
                conn.close()

        # Pequeño delay para no saturar APIs
        time.sleep(1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/status')
def status():
    return jsonify({
        "status": "online",
        "project": "Bouncers Chile",
        "keys_configured": {
            "serper": bool(API_KEYS["SERPER"]),
            "openrouter": bool(API_KEYS["OPENROUTER"])
        }
    })

@app.route('/api/locales')
def get_locales():
    conn = get_db_connection()
    locales = conn.execute('SELECT * FROM locales ORDER BY score DESC, fecha_hallazgo DESC').fetchall()
    conn.close()
    return jsonify([dict(l) for l in locales])

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2) * math.sin(dLat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

@app.route('/api/radar', methods=['POST'])
def start_radar():
    data = request.json
    city_name = data.get('city')
    radius = int(data.get('radius', 100))

    conn = get_db_connection()
    base_city = conn.execute('SELECT * FROM comunas WHERE nombre LIKE ?', (f'%{city_name}%',)).fetchone()

    if not base_city:
        conn.close()
        return jsonify({"error": "Ciudad no encontrada en la base de datos de Chile"}), 404

    lat_base = base_city['latitud']
    lon_base = base_city['longitud']

    all_comunas = conn.execute('SELECT * FROM comunas').fetchall()
    comunas_en_radio = []

    for comuna in all_comunas:
        dist = haversine(lat_base, lon_base, comuna['latitud'], comuna['longitud'])
        if dist <= radius:
            comunas_en_radio.append({
                "nombre": comuna['nombre'],
                "distancia": round(dist, 2),
                "lat": comuna['latitud'],
                "lng": comuna['longitud']
            })

    conn.execute('INSERT INTO historial_busquedas (latitud, longitud, radio) VALUES (?, ?, ?)',
                 (lat_base, lon_base, radius))
    conn.commit()
    conn.close()

    # Iniciar el SPIDER en un hilo separado
    thread = threading.Thread(target=run_spider, args=(comunas_en_radio, radius))
    thread.daemon = True
    thread.start()

    return jsonify({
        "centro": {"nombre": base_city['nombre'], "lat": lat_base, "lng": lon_base},
        "radio": radius,
        "comunas_afectadas": comunas_en_radio,
        "total_comunas": len(comunas_en_radio),
        "spider_status": "started"
    })

if __name__ == '__main__':
    # Inicialización automática
    if not os.path.exists(os.path.join(os.path.dirname(__file__), 'bouncers.db')):
        print("Inicializando base de datos por primera vez...")
        init_db()
        populate_geo()

    app.run(debug=True, port=5001)
