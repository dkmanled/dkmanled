<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Simulate WordPress functions if not in WordPress
if (!function_exists('get_header')) {
    function get_header() { /* echo "<!-- Header -->"; */ }
}
if (!function_exists('get_footer')) {
    function get_footer() { /* echo "<!-- Footer -->"; */ }
}

// --- Database Connection ---
$pdo = null;
try {
    $dbPath = __DIR__ . '/crm_database.sqlite';
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // Useful for fetching associative arrays
} catch (PDOException $e) {
    // Instead of dying, flash a message and log error if possible, then allow page to render gracefully
    error_log("Database connection failed: " . $e->getMessage() . " (DB Path: " . $dbPath . ")");
    flash_message("Error crítico: No se pudo conectar a la base de datos. Contacte al administrador.", "danger");
    // $pdo remains null, subsequent DB operations should check for this.
}

// --- `url_for` function (Basic Implementation) ---
// Placed after PDO setup and helper function definitions,
// but before any other GET/POST routing that leads to HTML display.

if (isset($_GET['action']) && $_GET['action'] === 'export_csv' && isset($pdo) && $pdo) { // Ensure $pdo is not null
    // Fetch Contacts based on filters (similar to main display logic, but no pagination)
    $sql = "SELECT * FROM contacts";
    $whereClauses = [];
    $bindings = [];

    // Apply filters from GET parameters if they exist
    if (!empty($_GET['filter_tipo_entidad'])) {
        $whereClauses[] = "tipo_entidad = :tipo_entidad";
        $bindings[':tipo_entidad'] = $_GET['filter_tipo_entidad'];
    }
    if (!empty($_GET['filter_estado_cliente'])) {
        $whereClauses[] = "estado_cliente = :estado_cliente";
        $bindings[':estado_cliente'] = $_GET['filter_estado_cliente'];
    }
    // Note: One could add more filters here if needed, e.g., filter_nombre_contacto

    if (!empty($whereClauses)) {
        $sql .= " WHERE " . implode(" AND ", $whereClauses);
    }
    $sql .= " ORDER BY id ASC"; // Or any preferred order for export

    $stmt = $pdo->prepare($sql);
    $stmt->execute($bindings);
    $contacts_to_export = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Set HTTP headers for CSV download
    header('Content-Type: text/csv; charset=utf-8');
    // Adding time to filename to prevent browser caching issues with same-day downloads
    header('Content-Disposition: attachment; filename="contacts_export_' . date('Y-m-d_H-i-s') . '.csv"');

    $output = fopen('php://output', 'w');

    // Define CSV Headers (Ensure these match the order in $row below)
    $headers = [
        'ID', 'Nombre Contacto', 'Teléfono', 'Email', 'Tipo Entidad', 'Nombre Entidad/Evento',
        'Fecha Evento (Estimada)', 'Localidad Evento', 'Provincia Evento', 'Valor Presupuesto (ARS)',
        'Presupuesto Enviado', 'Estado Cliente', 'Requiere Seguimiento', 'Fecha Próximo Seguimiento',
        'Notas Seguimiento', 'Origen Contacto', 'Contacto Interesado En', 'Estado Pedido',
        'Canal Comunicación Preferido', 'Fecha Último Mensaje (Chat)', 'Estado Charla',
        'Notas Adicionales', 'Cliente Valioso', 'Fecha Creación', 'Fecha Actualización'
    ];
    fputcsv($output, $headers);

    // Write data rows
    foreach ($contacts_to_export as $contact) {
        // Safely decode JSON and implode, defaulting to empty string if decode fails or not an array
        $interesado_en_array = json_decode($contact['contacto_interesado_en'] ?? '[]', true);
        $interesado_en_str = '';
        if (is_array($interesado_en_array)) {
            $interesado_en_str = implode(', ', $interesado_en_array);
        }

        $row = [
            $contact['id'] ?? '',
            $contact['nombre_contacto'] ?? '',
            $contact['telefono'] ?? '',
            $contact['email'] ?? '',
            $contact['tipo_entidad'] ?? '',
            $contact['nombre_entidad_evento'] ?? '',
            $contact['fecha_evento'] ?? '',
            $contact['localidad_evento'] ?? '',
            $contact['provincia_evento'] ?? '',
            $contact['valor_presupuesto'] ?? '',
            $contact['presupuesto_enviado'] ?? '',
            $contact['estado_cliente'] ?? '',
            $contact['requiere_seguimiento'] ?? '',
            $contact['fecha_proximo_seguimiento'] ?? '',
            $contact['notas_seguimiento'] ?? '',
            $contact['origen_contacto'] ?? '',
            $interesado_en_str,
            $contact['estado_pedido'] ?? '',
            $contact['canal_comunicacion_preferido'] ?? '',
            $contact['fecha_ultimo_mensaje'] ?? '',
            $contact['estado_charla'] ?? '',
            $contact['notas_adicionales'] ?? '',
            (isset($contact['is_valuable']) && $contact['is_valuable'] == 1 ? 'Sí' : 'No'),
            $contact['created_at'] ?? '',
            $contact['updated_at'] ?? ''
        ];
        fputcsv($output, $row);
    }

    fclose($output);
    exit; // Crucial to prevent any further HTML or other output
}
// End of the new export_csv block

if (!function_exists('url_for')) {
    function url_for($routeName, $params = []) {
        $url = $_SERVER['PHP_SELF'];
        $queryParams = [];

        switch ($routeName) {
            case 'static':
                return htmlspecialchars($params['filename']); // Assumes files are in the same directory or accessible path
            case 'mark_reminder_done':
                $queryParams['action'] = 'mark_reminder_done';
                $queryParams['contact_id'] = $params['contact_id'] ?? null;
                break;
            case 'edit_contact_page':
                 $queryParams['action'] = 'edit_contact_page';
                 $queryParams['contact_id'] = $params['contact_id'] ?? null;
                 break;
            case 'export_csv':
                 $queryParams['action'] = 'export_csv';
                 // Preserve current filters for export
                 if (!empty($params['filter_tipo_entidad'])) $queryParams['filter_tipo_entidad'] = $params['filter_tipo_entidad'];
                 if (!empty($params['filter_estado_cliente'])) $queryParams['filter_estado_cliente'] = $params['filter_estado_cliente'];
                 break;
            case 'import_contacts_page':
                 $queryParams['action'] = 'import_contacts_page';
                 break;
            case 'index':
            default:
                // For index, params are usually filters and page
                $queryParams = $params;
                break;
        }
        // Clean null params
        $queryParams = array_filter($queryParams, function($value) { return $value !== null; });

        if (!empty($queryParams)) {
            $url .= '?' . http_build_query($queryParams);
        }
        return htmlspecialchars($url);
    }
}

// --- Flashed Messages ---
if (!function_exists('get_flashed_messages')) {
    function get_flashed_messages($with_categories = true) { // Param $with_categories matches template
        $messages = $_SESSION['flashed_messages'] ?? [];
        unset($_SESSION['flashed_messages']);
        return $messages; // Template expects array of ['category' => ..., 'message' => ...]
    }
}
if (!function_exists('flash_message')) {
    function flash_message($message, $category = 'info') {
        $_SESSION['flashed_messages'][] = ['category' => $category, 'message' => $message];
    }
}

// --- Initialize variables for the template ---
$form_data = $_SESSION['form_data_transfer'] ?? []; // Used for repopulating form after process_chat or errors
unset($_SESSION['form_data_transfer']);

$is_edit_mode = false; // Flag to indicate if the form is in edit mode
$editing_contact_id = null; // ID of the contact being edited

$pending_reminders = []; // Array of contact objects/arrays
$contacts = [];    // Array of contact objects/arrays for the main list
$parsed_chat_messages = $_SESSION['parsed_chat_messages'] ?? []; // Parsed chat messages
unset($_SESSION['parsed_chat_messages']);

$dropdown_options = [
    'tipo_entidad' => ['Eventos Sociales/Privados', 'Boliche', 'Dirección de Cultura y Entidades Gubernamentales', 'Productor de Eventos/Local', 'Otros'],
    'provincias' => ['Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'],
    'presupuesto_enviado' => ['Sí', 'No', 'Pendiente'],
    'estado_cliente' => ['Prospecto', 'Contactado', 'Interesado', 'Negociación', 'Ganado', 'Perdido', 'Stand By'],
    'requiere_seguimiento' => ['Sí', 'No'],
    'origen_contacto' => ['WhatsApp', 'Formulario Web', 'Referido', 'Publicidad Online', 'Llamada Directa', 'Otro'],
    'contacto_interesado_en' => ['Servicio Laser', 'DJ', 'Iluminación', 'Sonido', 'Fotografía', 'Catering'],
    'estado_pedido' => ['Consulta Inicial', 'Presupuesto Enviado', 'En Negociación', 'Confirmado', 'En Preparación', 'Entregado', 'Cancelado'],
    'canal_comunicacion' => ['WhatsApp', 'Email', 'Llamada Telefónica', 'Reunión Presencial'],
    'estado_charla' => ['Activa', 'En Espera de Respuesta Cliente', 'En Espera de Respuesta Interna', 'Finalizada Positivamente', 'Finalizada Negativamente', 'Requiere Seguimiento']
];

$current_filters = [
    'filter_tipo_entidad' => $_GET['filter_tipo_entidad'] ?? '',
    'filter_estado_cliente' => $_GET['filter_estado_cliente'] ?? '',
    'filter_nombre_contacto' => $_GET['filter_nombre_contacto'] ?? '', // Added for search from reminder
];

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;
$items_per_page = 10; // Or make this configurable
$total_pages = 1;
$total_items = 0;

// --- Logic for POST actions and data fetching would go here ---
// This will be expanded in subsequent subtasks.
// For now, this subtask focuses on setting up the structure and variables.

// --- (DB dependent logic will be wrapped in if ($pdo) { ... } ) ---
if ($pdo) {
    // --- Fetch Contacts (Main List) ---
    $baseSql = "SELECT * FROM contacts";
    $countSql = "SELECT COUNT(*) FROM contacts";
    $whereClauses = [];
    $bindings = [];

    if (!empty($current_filters['filter_tipo_entidad'])) {
        $whereClauses[] = "tipo_entidad = :tipo_entidad";
        $bindings[':tipo_entidad'] = $current_filters['filter_tipo_entidad'];
    }
    if (!empty($current_filters['filter_estado_cliente'])) {
        $whereClauses[] = "estado_cliente = :estado_cliente";
        $bindings[':estado_cliente'] = $current_filters['filter_estado_cliente'];
    }
     if (!empty($current_filters['filter_nombre_contacto'])) {
        // This is a simple exact match, could be LIKE for partial search
        $whereClauses[] = "nombre_contacto = :nombre_contacto";
        $bindings[':nombre_contacto'] = $current_filters['filter_nombre_contacto'];
    }

    if (!empty($whereClauses)) {
        $baseSql .= " WHERE " . implode(" AND ", $whereClauses);
        $countSql .= " WHERE " . implode(" AND ", $whereClauses);
    }

    // Get total items for pagination
    $stmtCount = $pdo->prepare($countSql);
    $stmtCount->execute($bindings);
    $total_items = (int)$stmtCount->fetchColumn();
    $total_pages = ceil($total_items / $items_per_page);
    if ($page > $total_pages && $total_pages > 0) $page = $total_pages; // Adjust if page is out of bounds
    if ($page < 1) $page = 1;


    $offset = ($page - 1) * $items_per_page;
    $baseSql .= " ORDER BY id DESC LIMIT :limit OFFSET :offset";
    $bindings[':limit'] = $items_per_page;
    $bindings[':offset'] = $offset;

    $stmt = $pdo->prepare($baseSql);
    $stmt->execute($bindings);
    $contacts = $stmt->fetchAll();

    // --- Fetch Pending Reminders ---
    // Contacts that require follow-up and the date is today or in the past (meaning overdue or due)
    // Or, if you want strictly future: fecha_proximo_seguimiento >= date('Y-m-d')
    $today = date('Y-m-d');
    $stmtReminders = $pdo->prepare(
        "SELECT * FROM contacts
         WHERE requiere_seguimiento = 'Sí'
         AND fecha_proximo_seguimiento IS NOT NULL
         AND fecha_proximo_seguimiento <= :today
         ORDER BY fecha_proximo_seguimiento ASC"
    );
    $stmtReminders->execute([':today' => $today]);
    $pending_reminders_raw = $stmtReminders->fetchAll();

    // Process pending reminders to match template expectations
    $pending_reminders = [];
    foreach ($pending_reminders_raw as $pr) {
        $pr_processed = $pr;
        $pr_processed['fecha_seguimiento'] = $pr['fecha_proximo_seguimiento']; // Map DB field to template field
        // 'notas_seguimiento' is already correctly named from DB.
        $pending_reminders[] = $pr_processed;
    }

} else {
    // Mock data if no DB connection, useful for frontend development without DB
    /*
    $contacts = [
        ['id' => 1, 'nombre_contacto' => 'John Doe (Mock)', 'telefono' => '123456', 'email' => 'john@example.com', 'tipo_entidad' => 'Boliche', 'estado_cliente' => 'Interesado', 'fecha_ultimo_mensaje' => '2023-10-26', 'requiere_seguimiento' => 'Sí', 'fecha_proximo_seguimiento' => '2023-11-01', 'is_valuable' => 1],
    ];
    $pending_reminders = [
        ['id' => 1, 'nombre_contacto' => 'Jane Smith (Mock Reminder)', 'telefono' => '789012', 'fecha_seguimiento' => '2023-10-27', 'notas_seguimiento' => 'Follow up on proposal.']
    ];
    $total_items = count($contacts);
    $total_pages = 1;
    flash_message("Warning: Database not connected. Displaying mock data.", "warning");
    */
}


// --- Handle Form Submissions (POST request) ---
// This part will be expanded for 'save_contact' and 'process_chat'
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $pdo) {
    $action = $_POST['action'] ?? '';

    // Persist all submitted data in session for form repopulation or processing across redirects
    // This ensures that if any action fails or needs to show data back on the form, it's available.
    $_SESSION['form_data_transfer'] = $_POST;

    if ($action === 'save_contact') {
        $nombre_contacto = trim($_POST['nombre_contacto'] ?? '');
        $telefono = trim($_POST['telefono'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $tipo_entidad = trim($_POST['tipo_entidad'] ?? '');
        $nombre_entidad_evento = trim($_POST['nombre_entidad_evento'] ?? '');
        $fecha_evento = !empty($_POST['fecha_evento']) ? trim($_POST['fecha_evento']) : null;
        $localidad_evento = trim($_POST['localidad_evento'] ?? '');
        $provincia_evento = trim($_POST['provincia_evento'] ?? '');
        $valor_presupuesto_raw = $_POST['valor_presupuesto'] ?? '';
        // Ensure that empty string for number results in null, not 0, if desired, or handle appropriately.
        $valor_presupuesto = $valor_presupuesto_raw !== '' ? filter_var($valor_presupuesto_raw, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : null;
        $presupuesto_enviado = trim($_POST['presupuesto_enviado'] ?? '');
        $estado_cliente = trim($_POST['estado_cliente'] ?? '');
        $requiere_seguimiento = trim($_POST['requiere_seguimiento'] ?? 'No'); // Default if not submitted
        $fecha_proximo_seguimiento = !empty($_POST['fecha_seguimiento']) ? trim($_POST['fecha_seguimiento']) : null; // Form: fecha_seguimiento -> DB: fecha_proximo_seguimiento
        $notas_seguimiento_form = trim($_POST['notas_seguimiento'] ?? ''); // Use a different var name to avoid confusion with db column name in this scope
        $origen_contacto = trim($_POST['origen_contacto'] ?? '');

        $contacto_interesado_en_array = $_POST['contacto_interesado_en'] ?? [];
        // Ensure it's an array before encoding, default to empty JSON array string.
        $contacto_interesado_en_json = (is_array($contacto_interesado_en_array) && !empty($contacto_interesado_en_array)) ? json_encode($contacto_interesado_en_array) : '[]';

        $estado_pedido = trim($_POST['estado_pedido'] ?? '');
        $canal_comunicacion_preferido = trim($_POST['canal_comunicacion'] ?? ''); // Form name: canal_comunicacion
        $fecha_ultimo_mensaje = !empty($_POST['fecha_ultimo_mensaje']) ? trim($_POST['fecha_ultimo_mensaje']) : null;
        $estado_charla = trim($_POST['estado_charla'] ?? '');
        $notas_adicionales = trim($_POST['notas_adicionales'] ?? '');
        $is_valuable = (isset($_POST['is_valuable']) && $_POST['is_valuable'] == '1') ? 1 : 0;

        if (empty($nombre_contacto)) {
            flash_message('Nombre de Contacto es requerido.', 'danger');
            // $_SESSION['form_data_transfer'] is already set with current $_POST
            header("Location: " . url_for('index'));
            exit;
        }

        try {
            $sql = "INSERT INTO contacts (
                        nombre_contacto, telefono, email, tipo_entidad, nombre_entidad_evento, fecha_evento,
                        localidad_evento, provincia_evento, valor_presupuesto, presupuesto_enviado,
                        estado_cliente, requiere_seguimiento, fecha_proximo_seguimiento, notas_seguimiento,
                        origen_contacto, contacto_interesado_en, estado_pedido, canal_comunicacion_preferido,
                        fecha_ultimo_mensaje, estado_charla, notas_adicionales, is_valuable, created_at, updated_at
                    ) VALUES (
                        :nombre_contacto, :telefono, :email, :tipo_entidad, :nombre_entidad_evento, :fecha_evento,
                        :localidad_evento, :provincia_evento, :valor_presupuesto, :presupuesto_enviado,
                        :estado_cliente, :requiere_seguimiento, :fecha_proximo_seguimiento, :notas_seguimiento_form,
                        :origen_contacto, :contacto_interesado_en, :estado_pedido, :canal_comunicacion_preferido,
                        :fecha_ultimo_mensaje, :estado_charla, :notas_adicionales, :is_valuable, datetime('now', 'localtime'), datetime('now', 'localtime')
                    )";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':nombre_contacto' => $nombre_contacto, ':telefono' => $telefono, ':email' => $email,
                ':tipo_entidad' => $tipo_entidad, ':nombre_entidad_evento' => $nombre_entidad_evento, ':fecha_evento' => $fecha_evento,
                ':localidad_evento' => $localidad_evento, ':provincia_evento' => $provincia_evento, ':valor_presupuesto' => $valor_presupuesto,
                ':presupuesto_enviado' => $presupuesto_enviado, ':estado_cliente' => $estado_cliente, ':requiere_seguimiento' => $requiere_seguimiento,
                ':fecha_proximo_seguimiento' => $fecha_proximo_seguimiento, ':notas_seguimiento_form' => $notas_seguimiento_form,
                ':origen_contacto' => $origen_contacto, ':contacto_interesado_en' => $contacto_interesado_en_json,
                ':estado_pedido' => $estado_pedido, ':canal_comunicacion_preferido' => $canal_comunicacion_preferido,
                ':fecha_ultimo_mensaje' => $fecha_ultimo_mensaje, ':estado_charla' => $estado_charla, ':notas_adicionales' => $notas_adicionales,
                ':is_valuable' => $is_valuable
            ]);

            flash_message('Contacto guardado exitosamente!', 'success');
            unset($_SESSION['form_data_transfer']); // Clear form data from session on successful save
            header("Location: " . url_for('index'));
            exit;

        } catch (PDOException $e) {
            flash_message('Error al guardar el contacto: ' . $e->getMessage(), 'danger');
            // $_SESSION['form_data_transfer'] ensures form repopulates with submitted data
            header("Location: " . url_for('index'));
            exit;
        }

    } elseif ($action === 'update_contact') { // <<< ADD THIS BLOCK
        $contact_id = filter_input(INPUT_POST, 'contact_id', FILTER_VALIDATE_INT);

        // Repopulate $form_data with current submission for display in case of error
        // $_SESSION['form_data_transfer'] = $_POST; // This is already done at the start of POST handling

        if (!$contact_id) {
            flash_message('ID de contacto inválido para actualizar.', 'danger');
            header("Location: " . url_for('index'));
            exit;
        }

        // Retrieve and sanitize all fields (similar to save_contact)
        $nombre_contacto = trim($_POST['nombre_contacto'] ?? '');
        $telefono = trim($_POST['telefono'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $tipo_entidad = trim($_POST['tipo_entidad'] ?? '');
        $nombre_entidad_evento = trim($_POST['nombre_entidad_evento'] ?? '');
        $fecha_evento = !empty($_POST['fecha_evento']) ? trim($_POST['fecha_evento']) : null;
        $localidad_evento = trim($_POST['localidad_evento'] ?? '');
        $provincia_evento = trim($_POST['provincia_evento'] ?? '');
        $valor_presupuesto_raw = $_POST['valor_presupuesto'] ?? '';
        $valor_presupuesto = $valor_presupuesto_raw !== '' ? filter_var($valor_presupuesto_raw, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : null;
        $presupuesto_enviado = trim($_POST['presupuesto_enviado'] ?? '');
        $estado_cliente = trim($_POST['estado_cliente'] ?? '');
        $requiere_seguimiento = trim($_POST['requiere_seguimiento'] ?? 'No');
        $fecha_proximo_seguimiento = !empty($_POST['fecha_seguimiento']) ? trim($_POST['fecha_seguimiento']) : null;
        $notas_seguimiento_form = trim($_POST['notas_seguimiento'] ?? '');
        $origen_contacto = trim($_POST['origen_contacto'] ?? '');
        $contacto_interesado_en_array = $_POST['contacto_interesado_en'] ?? [];
        $contacto_interesado_en_json = (is_array($contacto_interesado_en_array) && !empty($contacto_interesado_en_array)) ? json_encode($contacto_interesado_en_array) : '[]';
        $estado_pedido = trim($_POST['estado_pedido'] ?? '');
        $canal_comunicacion_preferido = trim($_POST['canal_comunicacion'] ?? '');
        $fecha_ultimo_mensaje = !empty($_POST['fecha_ultimo_mensaje']) ? trim($_POST['fecha_ultimo_mensaje']) : null;
        $estado_charla = trim($_POST['estado_charla'] ?? '');
        $notas_adicionales = trim($_POST['notas_adicionales'] ?? '');
        $is_valuable = (isset($_POST['is_valuable']) && $_POST['is_valuable'] == '1') ? 1 : 0;

        if (empty($nombre_contacto)) {
            flash_message('Nombre de Contacto es requerido para actualizar.', 'danger');
            // Set up for re-rendering the edit form with error
            $is_edit_mode = true;
            $editing_contact_id = $contact_id;
            // $form_data is already populated from $_POST or $_SESSION['form_data_transfer']
            // Allow script to continue to render the HTML part, which will show the form in edit mode
        } else {
            try {
                $sql = "UPDATE contacts SET
                            nombre_contacto = :nombre_contacto, telefono = :telefono, email = :email,
                            tipo_entidad = :tipo_entidad, nombre_entidad_evento = :nombre_entidad_evento, fecha_evento = :fecha_evento,
                            localidad_evento = :localidad_evento, provincia_evento = :provincia_evento, valor_presupuesto = :valor_presupuesto,
                            presupuesto_enviado = :presupuesto_enviado, estado_cliente = :estado_cliente,
                            requiere_seguimiento = :requiere_seguimiento, fecha_proximo_seguimiento = :fecha_proximo_seguimiento,
                            notas_seguimiento = :notas_seguimiento_form, origen_contacto = :origen_contacto,
                            contacto_interesado_en = :contacto_interesado_en, estado_pedido = :estado_pedido,
                            canal_comunicacion_preferido = :canal_comunicacion_preferido, fecha_ultimo_mensaje = :fecha_ultimo_mensaje,
                            estado_charla = :estado_charla, notas_adicionales = :notas_adicionales, is_valuable = :is_valuable,
                            updated_at = datetime('now', 'localtime')
                        WHERE id = :id";

                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':nombre_contacto' => $nombre_contacto, ':telefono' => $telefono, ':email' => $email,
                    ':tipo_entidad' => $tipo_entidad, ':nombre_entidad_evento' => $nombre_entidad_evento, ':fecha_evento' => $fecha_evento,
                    ':localidad_evento' => $localidad_evento, ':provincia_evento' => $provincia_evento, ':valor_presupuesto' => $valor_presupuesto,
                    ':presupuesto_enviado' => $presupuesto_enviado, ':estado_cliente' => $estado_cliente,
                    ':requiere_seguimiento' => $requiere_seguimiento, ':fecha_proximo_seguimiento' => $fecha_proximo_seguimiento,
                    ':notas_seguimiento_form' => $notas_seguimiento_form, ':origen_contacto' => $origen_contacto,
                    ':contacto_interesado_en' => $contacto_interesado_en_json, ':estado_pedido' => $estado_pedido,
                    ':canal_comunicacion_preferido' => $canal_comunicacion_preferido, ':fecha_ultimo_mensaje' => $fecha_ultimo_mensaje,
                    ':estado_charla' => $estado_charla, ':notas_adicionales' => $notas_adicionales, ':is_valuable' => $is_valuable,
                    ':id' => $contact_id
                ]);

                flash_message('Contacto actualizado exitosamente!', 'success');
                unset($_SESSION['form_data_transfer']);
                header("Location: " . url_for('index'));
                exit;

            } catch (PDOException $e) {
                flash_message('Error al actualizar el contacto: ' . $e->getMessage(), 'danger');
                $is_edit_mode = true;
                $editing_contact_id = $contact_id;
                // Allow script to continue to render the HTML part with error
            }
        }
    // End of new elseif block
    } elseif ($action === 'process_chat') {
        $chat_input = $_POST['chat_input'] ?? '';
        $current_form_data = $_POST; // Start with all submitted form data, includes chat_input

        $parsed_info = [];
        if (preg_match('/Nombre: (.*?)(?:
|$)/i', $chat_input, $matches)) { $parsed_info['nombre_contacto'] = trim($matches[1]); }
        if (preg_match('/Tel(?:éfono)?: (\+?[0-9\s().-]+)/i', $chat_input, $matches)) { $parsed_info['telefono'] = trim($matches[1]); }
        if (preg_match('/Email: ([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i', $chat_input, $matches)) { $parsed_info['email'] = trim($matches[1]); }

        foreach ($parsed_info as $key => $value) { $current_form_data[$key] = $value; }
        $_SESSION['form_data_transfer'] = $current_form_data;

        $simulated_parsed_messages = [];
        $lines = explode("
", trim($chat_input));
        foreach($lines as $line){
            $trimmed_line = trim($line);
            if($trimmed_line === "") continue;

            if (preg_match('/^(\d{1,2}:\d{2}(?: [AP]M)?) - (.*?): (.*)$/', $trimmed_line, $parts) ||
                preg_match('/^\[(.*?)\] (.*?): (.*)$/', $trimmed_line, $parts)) {
                 $simulated_parsed_messages[] = ['timestamp_str' => trim($parts[1]), 'sender' => trim($parts[2]), 'message' => trim($parts[3])];
            } else {
                 $simulated_parsed_messages[] = ['timestamp_str' => date('d/m/Y H:i'), 'sender' => 'Unknown', 'message' => $trimmed_line];
            }
        }
         if(empty($simulated_parsed_messages) && !empty(trim($chat_input))) {
            $simulated_parsed_messages[] = ['timestamp_str' => date('H:i'), 'sender' => 'Chat Log', 'message' => 'Contenido del chat procesado (simulado). No se detectaron mensajes individuales.'];
        }
        $_SESSION['parsed_chat_messages'] = $simulated_parsed_messages;

        flash_message('Chat procesado (simulado). Revise los campos poblados y los mensajes.', 'info');
        header("Location: " . url_for('index'));
        exit;

    } elseif ($action === 'mark_reminder_done') {
        $contact_id = $_POST['contact_id'] ?? null;

        $redirect_params = ['page' => $_POST['current_page'] ?? '1'];
        if (!empty($_POST['current_filter_tipo_entidad'])) $redirect_params['filter_tipo_entidad'] = $_POST['current_filter_tipo_entidad'];
        if (!empty($_POST['current_filter_estado_cliente'])) $redirect_params['filter_estado_cliente'] = $_POST['current_filter_estado_cliente'];

        if ($contact_id) {
            try {
                $stmt_get_notes = $pdo->prepare("SELECT notas_seguimiento FROM contacts WHERE id = :id");
                $stmt_get_notes->execute([':id' => $contact_id]);
                $existing_notes = $stmt_get_notes->fetchColumn();

                $completion_note = "Seguimiento completado el " . date('Y-m-d H:i') . ".";
                $new_notes = $existing_notes ? trim($existing_notes) . "
" . $completion_note : $completion_note;

                $stmt = $pdo->prepare("UPDATE contacts SET requiere_seguimiento = 'No', notas_seguimiento = :notas, fecha_proximo_seguimiento = NULL, updated_at = datetime('now', 'localtime') WHERE id = :id");
                $stmt->execute([':notas' => $new_notes, ':id' => $contact_id]);
                flash_message('Recordatorio marcado como hecho.', 'success');
            } catch (PDOException $e) {
                flash_message('Error al marcar recordatorio: ' . $e->getMessage(), 'danger');
            }
        } else {
            flash_message('ID de contacto no válido para marcar recordatorio.', 'danger');
        }
        header("Location: " . url_for('index', $redirect_params));
        exit;
    }
}

// If it's a POST request, and not handled by an action above (e.g. validation error before action or no specific pdo action),
// $form_data should be populated from $_POST for immediate display of submitted values.
// If it's a GET, $form_data comes from $_SESSION['form_data_transfer'] (e.g. after a redirect or from chat processing).
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_SESSION['form_data_transfer'])) { // If form_data_transfer was unset (e.g. successful save)
    $form_data = []; // Clear form data if it was a successful POST action that cleared session data
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $form_data = $_POST; // Repopulate from current POST if it's still relevant (e.g. validation fail before redirect)
}
// Note: $form_data is already initialized from $_SESSION['form_data_transfer'] at the beginning of the script for GET requests.
// The logic here is to ensure that for POST requests, $form_data reflects the current POST if session data wasn't cleared by a successful action.

// --- Handle GET actions like loading a contact for editing ---
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'edit_contact_page' && $pdo) {
    $contact_id_to_edit = filter_input(INPUT_GET, 'contact_id', FILTER_VALIDATE_INT);

    if ($contact_id_to_edit) {
        $stmt = $pdo->prepare("SELECT * FROM contacts WHERE id = :id");
        $stmt->execute([':id' => $contact_id_to_edit]);
        $contact_to_edit = $stmt->fetch();

        if ($contact_to_edit) {
            $is_edit_mode = true;
            $editing_contact_id = $contact_id_to_edit;
            $form_data = $contact_to_edit; // Populate form data with contact details

            // Handle JSON string for 'contacto_interesado_en'
            if (!empty($form_data['contacto_interesado_en'])) {
                $decoded_intereses = json_decode($form_data['contacto_interesado_en'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $form_data['contacto_interesado_en'] = $decoded_intereses;
                } else {
                    // Handle potential JSON decode error, maybe log it or set to empty array
                    $form_data['contacto_interesado_en'] = [];
                }
            } else {
                $form_data['contacto_interesado_en'] = [];
            }

            // Map database field 'fecha_proximo_seguimiento' to form field 'fecha_seguimiento'
            if (!empty($form_data['fecha_proximo_seguimiento'])) {
                $form_data['fecha_seguimiento'] = $form_data['fecha_proximo_seguimiento'];
            }
             // Ensure 'requiere_seguimiento' is correctly set for the form if it's null or empty from DB
            // The form expects 'Sí' or 'No'. Assuming default is 'No' if not explicitly 'Sí'.
            $form_data['requiere_seguimiento'] = ($form_data['requiere_seguimiento'] === 'Sí') ? 'Sí' : 'No';


        } else {
            flash_message('Contacto no encontrado para editar.', 'danger');
            header("Location: " . url_for('index'));
            exit;
        }
    } else {
        flash_message('ID de contacto no válido para editar.', 'danger');
        header("Location: " . url_for('index'));
        exit;
    }
}


// The rest of the original HTML template from the issue description follows.
// Make sure this PHP block is closed before the HTML starts,
// or integrate get_header() / get_footer() appropriately.
?>
<?php
/**
 * Template Name: CRM Laserman
 */
get_header(); // This was the original first line of PHP in the template
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WhatsApp CRM</title>
    <link rel="stylesheet" href="<?php echo url_for('static', ['filename' => 'style.css']); ?>">
</head>
<body>
    <?php
    // Corrected to use PHP variables
    $flashed_messages_list = get_flashed_messages(true);
    // Renamed template variable `messages` to `flashed_messages_list` to avoid conflict with parsed chat messages
    ?>
    <?php if (!empty($flashed_messages_list)): ?>
        <ul class="flashes">
        <?php foreach ($flashed_messages_list as $message_item): ?>
          <li class="flash-<?php echo htmlspecialchars($message_item['category']); ?>"><?php echo htmlspecialchars($message_item['message']); ?></li>
        <?php endforeach; ?>
        </ul>
    <?php endif; ?>

    <?php if (isset($pending_reminders) && !empty($pending_reminders)): ?>
    <div class="reminders-section" style="margin-bottom: 20px; padding: 15px; border: 1px solid #ffc107; background-color: #fff3cd; border-radius: 5px;">
        <h3><span style="color: #856404;">⚠️</span> Recordatorios de Seguimiento Pendientes</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <?php foreach ($pending_reminders as $reminder): ?>
                <li style="border-bottom: 1px solid #ffeeba; padding-bottom: 10px; margin-bottom: 10px;">
                    <strong>Contacto:</strong> <?php echo htmlspecialchars($reminder['nombre_contacto'] ?? 'N/A'); ?>
                    <?php if (!empty($reminder['telefono'])): ?>
                        (<a href="tel:<?php echo htmlspecialchars($reminder['telefono']); ?>"><?php echo htmlspecialchars($reminder['telefono']); ?></a>)
                    <?php endif; ?><br>
                    <strong>Fecha de Seguimiento:</strong> <span style="font-weight: bold; color: #dc3545;"><?php echo htmlspecialchars($reminder['fecha_seguimiento'] ?? ''); ?></span><br>
                    <strong>Notas:</strong> <pre style="white-space: pre-wrap; font-family: inherit; margin: 5px 0; max-height: 100px; overflow-y: auto; background-color: #fefefe; border: 1px dashed #ddd; padding: 5px;"><?php echo htmlspecialchars($reminder['notas_seguimiento'] ?? 'Sin notas.'); ?></pre>
                    <small>(ID Contacto: <?php echo htmlspecialchars($reminder['id']); ?>)</small>
                    <div style="margin-top: 8px;">
                        <form method="POST" action="<?php echo url_for('mark_reminder_done', ['contact_id' => $reminder['id']]); ?>" style="display: inline;">
                            <input type="hidden" name="current_page" value="<?php echo htmlspecialchars($page); ?>">
                            <input type="hidden" name="current_filter_tipo_entidad" value="<?php echo htmlspecialchars($current_filters['filter_tipo_entidad'] ?? ''); ?>">
                            <input type="hidden" name="current_filter_estado_cliente" value="<?php echo htmlspecialchars($current_filters['filter_estado_cliente'] ?? ''); ?>">
                            <button type="submit" class="button button-small button-success">Marcar como Hecho</button>
                        </form>
                        <a href="<?php echo url_for('index', ['page' => 1, 'filter_nombre_contacto' => $reminder['nombre_contacto']]); ?>#contact_table_anchor" class="button button-small" style="margin-left: 5px;">Buscar Contacto</a>
                    </div>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php elseif (isset($pending_reminders) && empty($pending_reminders)): ?>
    <div class="reminders-section" style="margin-bottom: 20px; padding: 10px; border: 1px solid #c3e6cb; background-color: #d4edda; border-radius: 5px;">
        <p style="color: #155724; margin:0;">¡Todo al día! No hay recordatorios de seguimiento pendientes. 👍</p>
    </div>
    <?php endif; ?>

    <h1>WhatsApp Chat Processor</h1>
    <form method="POST" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>">
        <div>
            <h2>Paste Chat Text Here:</h2>
            <textarea id="chatInput" name="chat_input" rows="10" cols="80" placeholder="Paste your exported WhatsApp chat text here..."><?php echo htmlspecialchars($form_data['chat_input'] ?? ''); ?></textarea>
        </div>

        <h2>Contact & Event Details:</h2>

        <label for="nombre_contacto">Nombre Contacto:</label>
        <input type="text" id="nombre_contacto" name="nombre_contacto" value="<?php echo htmlspecialchars($form_data['nombre_contacto'] ?? ''); ?>"><br>

        <label for="telefono">Teléfono:</label>
        <input type="text" id="telefono" name="telefono" value="<?php echo htmlspecialchars($form_data['telefono'] ?? ''); ?>"><br>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($form_data['email'] ?? ''); ?>"><br>

        <label for="tipo_entidad">Tipo de Entidad Principal:</label>
        <select name="tipo_entidad" id="tipo_entidad">
            <option value="" <?php if (empty($form_data['tipo_entidad'])) echo 'selected'; ?>>-- Seleccione una categoría --</option>
            <?php foreach ($dropdown_options['tipo_entidad'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['tipo_entidad'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label for="nombre_entidad_evento">Nombre Entidad/Evento:</label>
        <input type="text" id="nombre_entidad_evento" name="nombre_entidad_evento" value="<?php echo htmlspecialchars($form_data['nombre_entidad_evento'] ?? ''); ?>"><br>

        <label for="fecha_evento">Fecha Evento (Estimada):</label>
        <input type="date" id="fecha_evento" name="fecha_evento" value="<?php echo htmlspecialchars($form_data['fecha_evento'] ?? ''); ?>"><br>

        <label for="localidad_evento">Localidad Evento:</label>
        <input type="text" id="localidad_evento" name="localidad_evento" value="<?php echo htmlspecialchars($form_data['localidad_evento'] ?? ''); ?>"><br>

        <label for="provincia_evento">Provincia Evento:</label>
        <select name="provincia_evento" id="provincia_evento">
            <?php foreach ($dropdown_options['provincias'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['provincia_evento'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label for="valor_presupuesto">Valor del Presupuesto (ARS):</label>
        <input type="number" id="valor_presupuesto" name="valor_presupuesto" value="<?php echo htmlspecialchars($form_data['valor_presupuesto'] ?? '2600000'); ?>"><br>

        <label for="presupuesto_enviado">Presupuesto Enviado:</label>
        <select name="presupuesto_enviado" id="presupuesto_enviado">
            <?php foreach ($dropdown_options['presupuesto_enviado'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['presupuesto_enviado'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label for="estado_cliente">Estado Cliente:</label>
        <select name="estado_cliente" id="estado_cliente">
            <?php foreach ($dropdown_options['estado_cliente'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['estado_cliente'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label for="requiere_seguimiento">Requiere Seguimiento:</label>
        <select name="requiere_seguimiento" id="requiere_seguimiento">
            <?php foreach ($dropdown_options['requiere_seguimiento'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['requiere_seguimiento'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label for="fecha_seguimiento">Fecha Próximo Seguimiento:</label>
        <input type="date" id="fecha_seguimiento" name="fecha_seguimiento" value="<?php echo htmlspecialchars($form_data['fecha_seguimiento'] ?? ''); ?>"><br>

        <label for="notas_seguimiento">Notas de Seguimiento:</label><br>
        <textarea id="notas_seguimiento" name="notas_seguimiento" rows="3" cols="50"><?php echo htmlspecialchars($form_data['notas_seguimiento'] ?? ''); ?></textarea><br>

        <label for="origen_contacto">Origen del Contacto:</label>
        <select name="origen_contacto" id="origen_contacto">
            <?php foreach ($dropdown_options['origen_contacto'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['origen_contacto'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label>Contacto Interesado en:</label><br>
        <?php foreach ($dropdown_options['contacto_interesado_en'] as $option): ?>
        <input type="checkbox" name="contacto_interesado_en[]" value="<?php echo htmlspecialchars($option); ?>" <?php if (isset($form_data['contacto_interesado_en']) && is_array($form_data['contacto_interesado_en']) && in_array($option, $form_data['contacto_interesado_en'])) echo 'checked'; ?>> <?php echo htmlspecialchars($option); ?><br>
        <?php endforeach; ?>
        <br>

        <label for="estado_pedido">Estado del Pedido:</label>
        <select name="estado_pedido" id="estado_pedido">
            <?php foreach ($dropdown_options['estado_pedido'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['estado_pedido'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label for="canal_comunicacion">Canal Comunicación Preferido:</label>
        <select name="canal_comunicacion" id="canal_comunicacion">
            <?php foreach ($dropdown_options['canal_comunicacion'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['canal_comunicacion'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label for="fecha_ultimo_mensaje">Fecha Último Mensaje (del chat):</label>
        <input type="date" id="fecha_ultimo_mensaje" name="fecha_ultimo_mensaje" value="<?php echo htmlspecialchars($form_data['fecha_ultimo_mensaje'] ?? ''); ?>"><br>

        <label for="estado_charla">Estado de la Charla:</label>
        <select name="estado_charla" id="estado_charla">
            <?php foreach ($dropdown_options['estado_charla'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($form_data['estado_charla'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select><br>

        <label for="notas_adicionales">Notas Adicionales:</label><br>
        <textarea id="notas_adicionales" name="notas_adicionales" rows="3" cols="50"><?php echo htmlspecialchars($form_data['notas_adicionales'] ?? ''); ?></textarea><br>

        <div>
            <label for="is_valuable">Cliente Valioso:</label>
            <input type="checkbox" name="is_valuable" id="is_valuable" value="1" <?php if (!empty($form_data['is_valuable']) && ($form_data['is_valuable'] == 1 || $form_data['is_valuable'] == 'on')) echo 'checked'; ?>>
        </div>
        <hr>
        <?php if ($is_edit_mode && $editing_contact_id): ?>
            <input type="hidden" name="contact_id" value="<?php echo htmlspecialchars($editing_contact_id); ?>">
        <?php endif; ?>
        <button type="submit" name="action" value="process_chat">Process Chat & Populate Fields</button>
        <?php if ($is_edit_mode): ?>
            <button type="submit" name="action" value="update_contact" style="margin-left: 10px;">Update Contact Details</button>
        <?php else: ?>
            <button type="submit" name="action" value="save_contact" style="margin-left: 10px;">Save Current Details as New Contact</button>
        <?php endif; ?>
    </form>
    <hr>

    <h2>Filtros de Contactos</h2>
    <form method="GET" action="<?php echo url_for('index'); ?>">
        <label for="filter_tipo_entidad">Filtrar por Tipo de Entidad:</label>
        <select name="filter_tipo_entidad" id="filter_tipo_entidad">
            <option value="">Todos</option>
            <?php foreach ($dropdown_options['tipo_entidad'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($current_filters['filter_tipo_entidad'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select>

        <label for="filter_estado_cliente" style="margin-left: 10px;">Filtrar por Estado Cliente:</label>
        <select name="filter_estado_cliente" id="filter_estado_cliente">
            <option value="">Todos</option>
            <?php foreach ($dropdown_options['estado_cliente'] as $option): ?>
            <option value="<?php echo htmlspecialchars($option); ?>" <?php if (($current_filters['filter_estado_cliente'] ?? '') == $option) echo 'selected'; ?>><?php echo htmlspecialchars($option); ?></option>
            <?php endforeach; ?>
        </select>
        <button type="submit" style="margin-left: 10px;">Filtrar</button>
        <a href="<?php echo url_for('index'); ?>" style="margin-left: 10px;">Limpiar Filtros</a>
    </form>
    <div style="margin-top: 15px; margin-bottom: 15px;">
        <a href="<?php echo url_for('export_csv', ['filter_tipo_entidad' => $current_filters['filter_tipo_entidad'] ?? '', 'filter_estado_cliente' => $current_filters['filter_estado_cliente'] ?? '']); ?>" class="button">Exportar a CSV (Vista Actual Filtrada)</a>
        <a href="<?php echo url_for('export_csv'); ?>" class="button" style="margin-left:10px;">Exportar Todo a CSV</a>
        <a href="<?php echo url_for('import_contacts_page'); ?>" class="button" style="margin-left:10px; background-color: #17a2b8;">Importar desde CSV</a>
    </div>
    <hr>
    <div id="contact_table_anchor"></div>
    <div>
        <h2>Parsed Chat Messages:</h2>
        <?php if (!empty($parsed_chat_messages)): ?>
            <pre>
            <?php foreach ($parsed_chat_messages as $msg): ?>
Timestamp: <?php echo htmlspecialchars($msg['timestamp_str'] ?? ''); ?>
Sender: <?php echo htmlspecialchars($msg['sender'] ?? ''); ?>
Message: <?php echo htmlspecialchars($msg['message'] ?? ''); ?>
---
            <?php endforeach; ?>
            </pre>
        <?php else: ?>
            <p>(Parsed messages will be displayed here after processing chat text)</p>
        <?php endif; ?>
    </div>
    <div>
        <h2>Contactos Guardados</h2>
        <?php if (!empty($contacts)): ?>
        <table border="1" style="width:100%; border-collapse: collapse; margin-top:10px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Tipo Entidad</th>
                    <th>Estado Cliente</th>
                    <th>Último Mensaje (Fecha)</th>
                    <th>Requiere Seguimiento</th>
                    <th>Fecha Seguimiento</th>
                    <th>Valioso?</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($contacts as $contact): ?>
                <?php
                    $row_class = 'color-otros'; // Default class
                    if (($contact['tipo_entidad'] ?? '') == 'Eventos Sociales/Privados') $row_class = 'color-eventos-sociales';
                    elseif (($contact['tipo_entidad'] ?? '') == 'Boliche') $row_class = 'color-boliche';
                    elseif (($contact['tipo_entidad'] ?? '') == 'Dirección de Cultura y Entidades Gubernamentales') $row_class = 'color-cultura-gob';
                    elseif (($contact['tipo_entidad'] ?? '') == 'Productor de Eventos/Local') $row_class = 'color-productor';
                ?>
                <tr class="<?php echo $row_class; ?>">
                    <td><?php echo htmlspecialchars($contact['id'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($contact['nombre_contacto'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($contact['telefono'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($contact['email'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($contact['tipo_entidad'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($contact['estado_cliente'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($contact['fecha_ultimo_mensaje'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($contact['requiere_seguimiento'] ?? ''); ?></td>
                    <td><?php echo htmlspecialchars($contact['fecha_proximo_seguimiento'] ?? ''); ?></td> <!-- Changed from fecha_seguimiento to match db -->
                    <td><?php echo (($contact['is_valuable'] ?? 0) == 1) ? '⭐' : 'No'; ?></td>
                    <td>
                        <a href="<?php echo url_for('edit_contact_page', ['contact_id' => $contact['id']]); ?>" class="button button-small button-edit">Editar</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php else: ?>
        <p>No hay contactos guardados o que coincidan con el filtro.</p>
        <?php endif; ?>

        <?php if (isset($total_pages) && $total_pages > 1): ?>
        <div class="pagination" style="margin-top: 20px; text-align: center;">
            <?php if ($page > 1): ?>
                <a href="<?php echo url_for('index', array_merge(array_filter($current_filters), ['page' => $page - 1])); ?>" class="button">&laquo; Anterior</a>
            <?php else: ?>
                <span class="button disabled">&laquo; Anterior</span>
            <?php endif; ?>

            <span style="margin: 0 10px;">Página <?php echo $page; ?> de <?php echo $total_pages; ?> (<?php echo $total_items; ?> contactos)</span>

            <?php if ($page < $total_pages): ?>
                <a href="<?php echo url_for('index', array_merge(array_filter($current_filters), ['page' => $page + 1])); ?>" class="button">Siguiente &raquo;</a>
            <?php else: ?>
                <span class="button disabled">Siguiente &raquo;</span>
            <?php endif; ?>
        </div>
        <?php elseif (isset($total_items) && $total_items > 0): ?>
        <p style="text-align: center; margin-top:10px;">Mostrando <?php echo $total_items; ?> contacto(s).</p>
        <?php endif; ?>
    </div>
    <script>
        // Basic JS can go here later if needed
    </script>
</body>
</html>
<?php get_footer(); // Original last line ?>
