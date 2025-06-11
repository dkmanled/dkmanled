<?php
// setup_db.php
try {
    $dbPath = __DIR__ . '/crm_database.sqlite';
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // SQL for creating tables
    $sql = "
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_contacto TEXT,
        telefono TEXT,
        email TEXT,
        tipo_entidad TEXT,
        nombre_entidad_evento TEXT,
        fecha_evento TEXT,
        localidad_evento TEXT,
        provincia_evento TEXT,
        valor_presupuesto REAL,
        presupuesto_enviado TEXT,
        estado_cliente TEXT,
        requiere_seguimiento TEXT,
        fecha_proximo_seguimiento TEXT,
        notas_seguimiento TEXT,
        origen_contacto TEXT,
        contacto_interesado_en TEXT,
        estado_pedido TEXT,
        canal_comunicacion_preferido TEXT,
        fecha_ultimo_mensaje TEXT,
        estado_charla TEXT,
        notas_adicionales TEXT,
        is_valuable INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contact_id INTEGER,
        timestamp_str TEXT,
        sender TEXT,
        message TEXT,
        created_at TEXT,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_tipo_entidad ON contacts(tipo_entidad);
    CREATE INDEX IF NOT EXISTS idx_contacts_estado_cliente ON contacts(estado_cliente);
    CREATE INDEX IF NOT EXISTS idx_contacts_fecha_proximo_seguimiento ON contacts(fecha_proximo_seguimiento);
    CREATE INDEX IF NOT EXISTS idx_contacts_requiere_seguimiento ON contacts(requiere_seguimiento);
    ";

    $pdo->exec($sql);
    echo "Database and tables created successfully at: " . realpath($dbPath) . PHP_EOL;

    // Check if pdo_sqlite is enabled
    if (extension_loaded('pdo_sqlite')) {
        echo "PDO SQLite extension is enabled." . PHP_EOL;
    } else {
        echo "WARNING: PDO SQLite extension is NOT enabled." . PHP_EOL;
    }

} catch (PDOException $e) {
    die("Error creating database/tables: " . $e->getMessage() . PHP_EOL);
}
?>
