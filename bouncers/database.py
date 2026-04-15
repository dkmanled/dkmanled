import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'bouncers.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Tabla de Regiones de Chile
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS regiones (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL
    )
    ''')

    # Tabla de Comunas de Chile
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS comunas (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        region_id INTEGER,
        latitud REAL,
        longitud REAL,
        FOREIGN KEY (region_id) REFERENCES regiones (id)
    )
    ''')

    # Tabla de Locales
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS locales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_place_id TEXT UNIQUE,
        nombre TEXT NOT NULL,
        direccion TEXT,
        comuna TEXT,
        region TEXT,
        latitud REAL,
        longitud REAL,
        tipo TEXT,
        apto_show BOOLEAN,
        justificacion TEXT,
        telefono TEXT,
        whatsapp TEXT,
        email TEXT,
        instagram TEXT,
        facebook TEXT,
        twitter TEXT,
        contacto_nombre TEXT,
        rating REAL,
        user_ratings_total INTEGER,
        score INTEGER,
        status TEXT DEFAULT 'Pendiente',
        fecha_hallazgo TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Tabla de Búsquedas Realizadas (Historial para no repetir)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS historial_busquedas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitud REAL,
        longitud REAL,
        radio INTEGER,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Base de datos inicializada correctamente.")
