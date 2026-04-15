from database import get_db_connection, init_db

def seed_locales():
    # Asegurar que las tablas existan
    init_db()

    conn = get_db_connection()

    locales = [
        ("Club Blondie", "Av. Libertador Bernardo O'Higgins 2879", "Santiago", -33.4502, -70.6765, True, 85, "Discoteca icónica con múltiples pistas.", "@blondiecl", "+56 2 2681 7561"),
        ("Club de la Unión", "Av. Libertador Bernardo O'Higgins 1091", "Santiago", -33.4447, -70.6517, False, 70, "Club social tradicional.", "@clubdelaunion", "+56 2 2633 3611"),
        ("Club Ambar", "Ernesto Pinto Lagarrigue 154", "Recoleta", -33.4339, -70.6358, True, 80, "Famoso por su música electrónica.", "@clubambar", "+56 9 1234 5678"),
        ("OVO Nightclub", "Av. España 198", "Viña del Mar", -33.0112, -71.5518, True, 90, "Ubicado dentro del Casino Enjoy.", "@enjoy_vina", "+56 32 284 6000"),
        ("Terraza Bellavista", "Pio Nono 59", "Recoleta", -33.4355, -70.6345, True, 75, "Excelente vista y ambiente.", "@terrazabellavista", "+56 9 8765 4321"),
        ("Club Chocolate", "Ernesto Pinto Lagarrigue 192", "Recoleta", -33.4335, -70.6358, True, 82, "Centro de eventos y discoteca.", "@clubchocolate", "+56 2 2777 9999"),
        ("Club Room", "Av. Vitacura 9307", "Vitacura", -33.3855, -70.5482, True, 88, "Ambiente exclusivo en el sector oriente.", "@clubroomcl", "+56 9 5555 4444"),
        ("Havana Salsa", "Domeyko 2341", "Santiago", -33.4567, -70.6654, True, 72, "Especializado en ritmos latinos.", "@havanasalsa", "+56 2 2671 2222"),
        ("Club Subterraneo", "Paseo Orrego Luco 46", "Providencia", -33.4234, -70.6123, True, 84, "Ubicado en el corazón de Providencia.", "@clubsubterraneo", "+56 2 2233 4455"),
        ("La Feria", "Constitución 275", "Providencia", -33.4331, -70.6341, True, 86, "Referente de la música electrónica en Chile.", "@laferiaclub", "+56 2 2735 8433")
    ]

    for nombre, direccion, comuna, lat, lng, apto, score, desc, ig, tel in locales:
        conn.execute('''
            INSERT OR IGNORE INTO locales (
                google_place_id, nombre, direccion, comuna, latitud, longitud,
                apto_show, score, justificacion, tipo, status, instagram, telefono
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            f"seed_{nombre.lower().replace(' ', '_')}", nombre, direccion, comuna, lat, lng,
            apto, score, desc, "Discoteca", "Exito", f"https://instagram.com/{ig[1:]}", tel
        ))

    conn.commit()
    conn.close()
    print("Locales de ejemplo cargados en bouncers.db")

if __name__ == "__main__":
    seed_locales()
