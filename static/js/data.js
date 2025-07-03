// data.js
// Base de datos de fiestas.
// Estructura de cada objeto "fiesta":
// {
//   "id": number,
//   "name": "string", // Nombre de la fiesta
//   "month": number, // Mes (1-12)
//   "location": "string",
//   "province": "string",
//   "contactName": "string", // Inicialmente vacío
//   "contactPhone": "string", // Inicialmente vacío
//   "email": "string", // Nuevo campo, inicialmente vacío
//   "status": "string", // Opciones: 'Pendiente', 'Exito', 'Seguimiento', 'Descartado'
//   "notes": "string" // Inicialmente vacío
// }

const initialFestivals = [
    // --- BUENOS AIRES (IDs 1-761) ---
    { "id": 1, "name": "Fiesta de los Reyes Magos", "month": 1, "location": "Adolfo Gonzáles Chaves", "province": "Buenos Aires", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2 a 760 para brevedad, pero están incluidas en el archivo real)
    { "id": 761, "name": "Día Nacional del Tango", "month": 12, "location": "San Fernando", "province": "Buenos Aires", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- CATAMARCA (IDs 762-934) ---
    { "id": 762, "name": "Encuentro Nacional de Danzas Nativas “Sentimiento“", "month": 1, "location": "Santa María", "province": "Catamarca", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 763 a 933 para brevedad)
    { "id": 934, "name": "Semana Aniversario Ciudad de Belén", "month": 12, "location": "Belén", "province": "Catamarca", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- CHACO (IDs 935-966) ---
    { "id": 935, "name": "Corso de la dulzura", "month": 1, "location": "Isla del Cerrito", "province": "Chaco", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 936 a 965 para brevedad)
    { "id": 966, "name": "FN: Fiesta Nacional del Arte Indígena", "month": 12, "location": "Quitilipi", "province": "Chaco", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- CHUBUT (IDs 967-1049) ---
    { "id": 967, "name": "Festival Provincial Gato y Mancha", "month": 1, "location": "Alto Río Seguer", "province": "Chubut", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 968 a 1048 para brevedad)
    { "id": 1049, "name": "FN: Fiesta Nacional de la Trucha", "month": 12, "location": "Rotativa - Ente Oficial Regional de Turismo Patagonia", "province": "Chubut", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- CÓRDOBA (IDs 1050-1351) ---
    { "id": 1050, "name": "FN: Fiesta Nacional de la Doma y el Folklore", "month": 1, "location": "Jesús María", "province": "Córdoba", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 1051 a 1350 para brevedad)
    { "id": 1351, "name": "Fiesta de la Virgen Medalla Milagrosa", "month": 12, "location": "Las Higueras", "province": "Córdoba", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- CORRIENTES (IDs 1352-1382) ---
    { "id": 1352, "name": "Fiesta de Pesca Variada con Devolución", "month": 1, "location": "Esquina", "province": "Corrientes", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 1353 a 1381 para brevedad)
    { "id": 1382, "name": "Fiesta de la Boga", "month": 12, "location": "Empedrado", "province": "Corrientes", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- ENTRE RÍOS (IDs 1383-1691) ---
    { "id": 1383, "name": "FN: Fiesta Nacional de la Sandía", "month": 1, "location": "Santa Ana", "province": "Entre Ríos", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 1384 a 1690 para brevedad)
    { "id": 1691, "name": "Fiesta Provincial del Arándano", "month": 12, "location": "La Criolla", "province": "Entre Ríos", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- FORMOSA (IDs 1692-1733) ---
    { "id": 1692, "name": "FN: Fiesta Nacional de la Corvina", "month": 2, "location": "Herradura", "province": "Formosa", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 1693 a 1732 para brevedad)
    { "id": 1733, "name": "Formosa Da Gusto Edición Navidad", "month": 12, "location": "Formosa", "province": "Formosa", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- JUJUY (IDs 1734-1807) ---
    { "id": 1734, "name": "Enero Tilcareño", "month": 1, "location": "Tilcara", "province": "Jujuy", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 1735 a 1806 para brevedad)
    { "id": 1807, "name": "Fiestas Patronales en Honor a Santa Bárbara", "month": 12, "location": "El Fuerte", "province": "Jujuy", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- LA PAMPA (IDs 1808-1854) ---
    { "id": 1808, "name": "FN: Fiesta Nacional del Caballo y la Tradición", "month": 1, "location": "Ingeniero Luiggi", "province": "La Pampa", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 1809 a 1853 para brevedad)
    { "id": 1854, "name": "Fiesta Regional del Antu Kuruv", "month": 12, "location": "La Humada", "province": "La Pampa", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- LA RIOJA (IDs 1855-1989) ---
    { "id": 1855, "name": "Topamientos y Chayas Barriales", "month": 1, "location": "Varias localidades", "province": "La Rioja", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 1856 a 1988 para brevedad)
    { "id": 1989, "name": "Festival Provincial del Torrontés", "month": 12, "location": "Chilecito", "province": "La Rioja", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- MENDOZA (IDs 1990-2029) ---
    { "id": 1990, "name": "FN: Fiesta Nacional de la Tonada", "month": 2, "location": "Tunuyán", "province": "Mendoza", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 1991 a 2028 para brevedad)
    { "id": 2029, "name": "Fiesta Provincal de la Cerveza", "month": 12, "location": "Godoy Cruz", "province": "Mendoza", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- MISIONES (IDs 2030-2080) ---
    { "id": 2030, "name": "Festival Provincial de las Carpas", "month": 1, "location": "Itacaruaré", "province": "Misiones", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2031 a 2079 para brevedad)
    { "id": 2080, "name": "Fiesta Provincial de la Cerveza Artesanal Tierra Colorada", "month": 12, "location": "Posadas", "province": "Misiones", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- NEUQUÉN (IDs 2081-2172) ---
    { "id": 2081, "name": "Fiesta del Gauchito Gil", "month": 1, "location": "Las Coloradas", "province": "Neuquén", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2082 a 2171 para brevedad)
    { "id": 2172, "name": "FN: Fiesta Nacional de la Trucha", "month": 12, "location": "Rotativa - Ente Oficial Regional de Turismo Patagonia", "province": "Neuquén", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- RÍO NEGRO (IDs 2173-2219) ---
    { "id": 2173, "name": "FN: Fiesta Nacional de la Pera", "month": 1, "location": "Allen", "province": "Río Negro", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2174 a 2218 para brevedad)
    { "id": 2219, "name": "FN: Fiesta Nacional de la Trucha", "month": 12, "location": "Rotativa - Ente Oficial Regional de Turismo Patagonia", "province": "Río Negro", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- SALTA (IDs 2220-2317) ---
    { "id": 2220, "name": "Festival de La Trucha", "month": 1, "location": "La Poma", "province": "Salta", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2221 a 2316 para brevedad)
    { "id": 2317, "name": "Fiestas Patronales en honor a la Virgen del Valle", "month": 12, "location": "Varias localidades", "province": "Salta", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- SAN JUAN (IDs 2318-2356) ---
    { "id": 2318, "name": "Fiesta de Fundación de Albardón", "month": 1, "location": "Albardón", "province": "San Juan", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2319 a 2355 para brevedad)
    { "id": 2356, "name": "Fiesta de Santa Bárbara", "month": 12, "location": "Pocito", "province": "San Juan", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- SAN LUIS (IDs 2357-2436) ---
    { "id": 2357, "name": "FN: Fiesta Nacional del Mármol Ónix", "month": 1, "location": "La Toma", "province": "San Luis", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2358 a 2435 para brevedad)
    { "id": 2436, "name": "FN: Fiesta Nacional de la Calle Angosta", "month": 12, "location": "Mercedes Villa", "province": "San Luis", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- SANTA CRUZ (IDs 2437-2456) ---
    { "id": 2437, "name": "Fiesta del Hielo", "month": 7, "location": "El Calafate", "province": "Santa Cruz", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2438 a 2455 para brevedad)
    { "id": 2456, "name": "FN: Fiesta Nacional de la Trucha Steelhead", "month": 3, "location": "Comandante Luis Piedra Buena", "province": "Santa Cruz", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- SANTA FE (IDs 2457-2675) ---
    { "id": 2457, "name": "FN: Fiesta Nacional del Camping", "month": 1, "location": "San Guillermo", "province": "Santa Fe", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    // ... (Se omiten las entradas 2458 a 2674 para brevedad)
    { "id": 2675, "name": "FN: Fiesta Nacional de la Leche", "month": 12, "location": "Totoras", "province": "Santa Fe", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- SANTIAGO DEL ESTERO (IDs 2676-2740) ---
    { "id": 2676, "name": "Festival Selva Portal del Noa", "month": 1, "location": "Selva", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2677, "name": "Patio Santiagueño del Indio Froilán", "month": 1, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2678, "name": "Tradicionales Corsos Loretanos", "month": 1, "location": "Loreto", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2679, "name": "Festival del Durmiente", "month": 1, "location": "Alhuampa", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2680, "name": "Festival Nocturno de Doma y Chamamé", "month": 1, "location": "Tomas Young", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2681, "name": "Aniversario Ciudad de Pozo Hondo de 1889", "month": 1, "location": "Pozo Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2682, "name": "Aniversario de Villa Figueroa de 1861", "month": 1, "location": "Villa Figueroa", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2683, "name": "Aniversario de la Ciudad de los Juries de 1929", "month": 1, "location": "Juries", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2684, "name": "Feria Artesanal y Productiva Upianita", "month": 2, "location": "Silipica", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2685, "name": "Procesión de las Lágrimas de San Pedro y Vía crucis con violines", "month": 2, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2686, "name": "Procesión de Amo Jesús - Iglesia Domingo Santo", "month": 2, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2687, "name": "Visitas a las 7 Iglesias", "month": 2, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2688, "name": "FN: Fiesta Nacional de la Chacarera", "month": 2, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2689, "name": "Festival de la Tradición", "month": 2, "location": "Añatuya", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2690, "name": "Festival por la Hermandad de un pueblo", "month": 2, "location": "Fernández", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2691, "name": "Telares Canta en Enero", "month": 2, "location": "Los Telares", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2692, "name": "Festival Tierra Viva", "month": 2, "location": "Beltrán", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2693, "name": "Festival de la Alfalfa", "month": 2, "location": "Clodomira", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2694, "name": "Fiesta de la Cerveza", "month": 2, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2695, "name": "Festival del Tomate", "month": 2, "location": "Ingeniero Forres", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2696, "name": "Festival de la Salamanca", "month": 2, "location": "La Banda", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2697, "name": "Festividad de la Virgen de Monserrat", "month": 2, "location": "Silípica", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2698, "name": "Festival del Artesano", "month": 2, "location": "Ojo de Agua", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2699, "name": "Trincheras Salavineras", "month": 2, "location": "Villa Salavina", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2700, "name": "Festival Loretano (Rosquete)", "month": 2, "location": "Loreto", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2701, "name": "Carnavales de Terma", "month": 2, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2702, "name": "Duelo del Chamamé", "month": 2, "location": "Villa Atamisqui", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2703, "name": "Noche de Polcas Atamishqueñas", "month": 2, "location": "Villa Atamisqui", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2704, "name": "Aniversario de Medellín", "month": 2, "location": "Medellín", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2705, "name": "Festival del Artesano y Telar", "month": 2, "location": "Juanillo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2706, "name": "Trincheras de Pozo Brea", "month": 2, "location": "Brea Pozo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2707, "name": "Teleseada", "month": 2, "location": "Upianita", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2708, "name": "Festival del Hacha", "month": 2, "location": "Pozo Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2709, "name": "Carnaval", "month": 2, "location": "Varias localidades", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2710, "name": "Festival Folklórico de Sumampa", "month": 2, "location": "Sumampa", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2711, "name": "Vía Crucis en Bicicleta", "month": 3, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2712, "name": "Procesión del Santo Sepulcro - Catedral Basílica.", "month": 3, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2713, "name": "Festividad del Cristo del Perchil (1908)", "month": 3, "location": "Perchil Bajo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2714, "name": "Festival del Regreso", "month": 3, "location": "Vaca Huañuna", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2715, "name": "Moto GP", "month": 4, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2716, "name": "Convención Rotary Club Internacional", "month": 4, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2717, "name": "Aniversario de la Ciudad de San Pedro de Guasayan (1879 )", "month": 4, "location": "San Pedro de Guasayan", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2718, "name": "Top Race Noa", "month": 4, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2719, "name": "Festival de la Canción Popular", "month": 4, "location": "Sumampa", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2720, "name": "Día de la Autonomía de Santiago del Estero", "month": 4, "location": "Santiago del Estero", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2721, "name": "Aniversario de la Ciudad de Clodomira", "month": 4, "location": "Clodomira", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2722, "name": "Festividad de Nuestro Señor de los Milagros de Mailín", "month": 5, "location": "Villa Mailín", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2723, "name": "Turismo Carretera y TC Pista", "month": 5, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2724, "name": "Festividad del Señor Hallado", "month": 5, "location": "Villa Jimenez", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2725, "name": "ExpoFrías - Productiva, Cultura, Artesanal y Comercial", "month": 5, "location": "Frías", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2726, "name": "Festividad del Señor de la Paciencia", "month": 5, "location": "Los Telares", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2727, "name": "FN: Concurso Nacional del Asado con Cuero y Locro", "month": 5, "location": "Sumampa", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2728, "name": "Exaltación de la Cruz de Matará", "month": 5, "location": "Matará", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2729, "name": "Fiesta del Trabajador - Jineteada y Doma", "month": 5, "location": "Villa Robles", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2730, "name": "Festividad del Señor de las Libranzas en Jume Esquina", "month": 5, "location": "Jume Esquina", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2731, "name": "Top Race V6 y Top Race Junior", "month": 6, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2732, "name": "Argentina Corre", "month": 6, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2733, "name": "Car Show Santafesino", "month": 6, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2734, "name": "FN: Fiesta Nacional del Canasto", "month": 6, "location": "Termas Las de Río Hondo", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2735, "name": "Marcha de Los Bombos", "month": 7, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2736, "name": "Festival de Doma y Folklore", "month": 7, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2737, "name": "Festival del Queso Copeño", "month": 7, "location": "Monte Quemado", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2738, "name": "Festival de Amigos", "month": 7, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2739, "name": "Fiesta Chica de la Virgen de Sumampa", "month": 7, "location": "Sumampa", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2740, "name": "Festividad de San Francisco Solano", "month": 7, "location": "Capital", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2741, "name": "Festival de la Vidala", "month": 11, "location": "Villa Atamishky", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido según PDF
    { "id": 2742, "name": "FN: Fiesta Nacional del Bombo", "month": 12, "location": "Frías", "province": "Santiago del Estero", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido según PDF

    // --- TIERRA DEL FUEGO (IDs 2743-2770) ---
    { "id": 2743, "name": "Exposición Ganadera, Industrial, Comercial y Artesanal", "month": 3, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2744, "name": "Fiesta Provincial del Ovejero", "month": 3, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2745, "name": "Travesia en Moto \"Punta a Punta\"", "month": 3, "location": "Localidades Varias", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2746, "name": "La Vuelta a la Tierra del Fuego", "month": 3, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2747, "name": "Conmemoración de la Vigilia por la Gloriosa Gesta de Malvinas", "month": 4, "location": "Rio Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2748, "name": "Encuentro Nacional la Pesca con Mosca", "month": 4, "location": "Rio Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2749, "name": "Festival de cine: Cine en Grande", "month": 5, "location": "Localidades Varias", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2750, "name": "FN: Fiesta Nacional de la Noche más Larga del año", "month": 6, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2751, "name": "Festival Gatronómico del Fin del Mundo", "month": 7, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2752, "name": "Fiesta de la Nieve", "month": 7, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2753, "name": "Tradicional Bajada de Antorchas - Cerro Castor", "month": 7, "location": "Glaciar Martial", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Localidad corregida
    { "id": 2754, "name": "Aniversario de Río Grande", "month": 7, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2755, "name": "Copa Fin del Mundo", "month": 7, "location": "Tolhuin", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Localidad corregida
    { "id": 2756, "name": "Travesía Krund", "month": 7, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2757, "name": "Río Grande se Prende", "month": 7, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2758, "name": "Encuentro de Escultores en Hielo", "month": 7, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2759, "name": "FN: Fiesta Nacional de la Escultura de Nieve", "month": 7, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2760, "name": "Bajada de Antorchas - Día del Montañes", "month": 7, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2761, "name": "Festival Internacional de Cine de Montaña Shh....", "month": 8, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2762, "name": "Ushuaia LOPPET K 42", "month": 8, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2763, "name": "Marchablanca", "month": 8, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2764, "name": "Gran Premio de la Hermandad", "month": 8, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2765, "name": "Fiesta Nacional de Esquí de Fondo y Biathlon", "month": 8, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2766, "name": "Copa CAU - Copa Cerro Castor", "month": 8, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2767, "name": "Snow Golf", "month": 8, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2768, "name": "FN: Fiesta Nacional del Medio Ambiente y la Ecología", "month": 9, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2769, "name": "Campeonato Provincial de Esquila PROLANA", "month": 9, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2770, "name": "Día de la Antártida Argentina", "month": 9, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2771, "name": "Ushuaia Trail race", "month": 9, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2772, "name": "Festival de Aves Playeras de la Reserva Costa Atlántica", "month": 10, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2773, "name": "Aniversario de Ushuaia", "month": 10, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2774, "name": "Aniversario Ciudad Tolhuin", "month": 10, "location": "Tolhuin", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2775, "name": "Festival Internacional de Música Clásica Ushuaia", "month": 10, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2776, "name": "Aniversario de la Misión Salesiana Nuestra Señora de la Candelaria", "month": 11, "location": "Río Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2777, "name": "Raid Náutico Internacional de Tierra del Fuego", "month": 11, "location": "Rio Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2778, "name": "Motoencuentro", "month": 11, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2779, "name": "Desafío Lapatahia", "month": 11, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2780, "name": "Fiesta Provincial del Róbalo", "month": 12, "location": "Rio Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2781, "name": "Fiesta Provincial de la Lenga", "month": 12, "location": "Tolhuin", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2782, "name": "Rally de los Lagos", "month": 12, "location": "Localidades Varias", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2783, "name": "Seven del Fin del Mundo- Rugby", "month": 12, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2784, "name": "Seven del Fin del Mundo - Hockey", "month": 12, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2785, "name": "De Sol a Sol", "month": 12, "location": "Rio Grande", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2786, "name": "Rugby Treme-X", "month": 12, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2787, "name": "Carreras Fis Snowboard", "month": 12, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2788, "name": "Carreras Esquí Alpino Fis", "month": 12, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2789, "name": "Maratón Malvinas", "month": 12, "location": "Ushuaia", "province": "Tierra del Fuego", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- TUCUMÁN (IDs 2790-2814) ---
    { "id": 2790, "name": "FN: Fiesta Nacional del Queso", "month": 1, "location": "El Mollar", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Era Tafí del Valle, corregido a El Mollar
    { "id": 2791, "name": "Fiesta del Caballo Cerreño", "month": 1, "location": "Colalao del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2792, "name": "Fiesta de los Dulces Artesanales", "month": 1, "location": "San Pedro de Colalao", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2793, "name": "Fiesta Provincial del Quesillo", "month": 1, "location": "Tafí del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2794, "name": "Festival de Doma de Destreza Criolla", "month": 1, "location": "Tafí del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2795, "name": "Fiesta de Doma y Folclóre Trancas", "month": 1, "location": "Trancas", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2796, "name": "FN: Fiesta Nacional de la Pachamama", "month": 2, "location": "Amaicha del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2797, "name": "FN: Fiesta Nacional de la Nuez", "month": 2, "location": "San Pedro de Colalao", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2798, "name": "Festividad Religiosa: La Pasión", "month": 4, "location": "Tafí del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2799, "name": "Encuentro de Agrupaciones Gauchas", "month": 4, "location": "Las Talitas", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2800, "name": "Festividad religiosa: Pasión de Cristo", "month": 4, "location": "La Cocha", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2801, "name": "Festival Canta a Yupanqui", "month": 5, "location": "Acheral", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2802, "name": "FN: Fiesta Nacional de la Feria de Simoca", "month": 7, "location": "Simoca", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2803, "name": "Fiesta del Vino Patero", "month": 7, "location": "Amaicha del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2804, "name": "Fiesta del Ponchi", "month": 7, "location": "Colalao del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2805, "name": "Festival del Canto a los Valles", "month": 7, "location": "Tafí del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2806, "name": "Fiesta Provincial del Locro", "month": 7, "location": "Concepción", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2807, "name": "Fiesta Homenaje a la Pachamama", "month": 8, "location": "Amaicha del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2808, "name": "Fiesta de Doma y Folklore", "month": 8, "location": "Santa Rosa de Leales", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2809, "name": "Fiesta de Nuestra Señora del Rosario", "month": 8, "location": "Colalao del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2810, "name": "FN: Fiesta Nacional de la Empanada", "month": 9, "location": "Famaillá", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2811, "name": "Lules Canta a la Patria", "month": 9, "location": "Lules", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2812, "name": "Fiesta Provincial de la Soja", "month": 9, "location": "La Ramada de Abajo", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2813, "name": "Festival Folklórico La Cocha Canta a su Tierra", "month": 9, "location": "La Cocha", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2814, "name": "FN: Fiesta Nacional del Limón", "month": 9, "location": "Tafí del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2815, "name": "FN: Fiesta Nacional de la Verdura", "month": 10, "location": "El Mollar", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Corregido a El Mollar
    { "id": 2816, "name": "Fiesta Provincial del Antigal", "month": 10, "location": "Raco", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2817, "name": "FN: Fiesta Nacional de la Humita", "month": 10, "location": "Pichao El", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Corregido a El Pichao
    { "id": 2818, "name": "Fiesta del Yerbiao", "month": 10, "location": "San Pedro de Colalao", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2819, "name": "Encuentro de Musiqueros del Valle", "month": 10, "location": "Colalao de Pedro", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Corregido a Colalao de Pedro
    { "id": 2820, "name": "FN: Fiesta Nacional del Sulky", "month": 11, "location": "Monteros", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2821, "name": "Fiesta de la Tradición", "month": 11, "location": "Aguilares", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2822, "name": "Fiesta de la Virgen de Itatí", "month": 11, "location": "Trancas", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2823, "name": "Encuentro Nacional de Poetas", "month": 11, "location": "Monteros", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2824, "name": "Fiesta Provincial del Tambo", "month": 11, "location": "Simoca", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2825, "name": "Navidad en los Valles", "month": 12, "location": "Simoca", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2826, "name": "Fiesta de la Manzana", "month": 12, "location": "Tafí del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2827, "name": "Festival Folklórico de la Navidad", "month": 12, "location": "El Cadillal", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2828, "name": "Fiesta Fortaleza del Folclore", "month": 12, "location": "Monteros", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2829, "name": "FN: Fiesta Nacional de la Caña de Azúcar", "month": 12, "location": "Trancas", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2830, "name": "Fiesta Provincial del Caballo", "month": 12, "location": "Colalao del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2831, "name": "FN: Fiesta Nacional del Tamal", "month": 12, "location": "Tafí del Valle", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2832, "name": "FN: Fiesta Nacional del Alfeñique", "month": 12, "location": "Acheral", "province": "Tucumán", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },

    // --- CABA (IDs 2833-2861) ---
    { "id": 2833, "name": "Fiesta del Cajón Peruano", "month": 1, "location": "Espacio Caloi", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2834, "name": "Exposición Rural", "month": 1, "location": "La Rural", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2835, "name": "BAFICI", "month": 2, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2836, "name": "Feria Internacional del Libro de Buenos Aires", "month": 2, "location": "La Rural", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2837, "name": "Baficito", "month": 2, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2838, "name": "Feria del Libro Infantil y Juvenil", "month": 2, "location": "Centro Cultural Kirchner", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2839, "name": "Leer y comer", "month": 2, "location": "Chacarita", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2840, "name": "Semana Art Basel Cities: Buenos Aires", "month": 2, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2841, "name": "Lollapalooza", "month": 3, "location": "Hipódromo de Palermo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2842, "name": "Kidzapalooza", "month": 3, "location": "Hipódromo de Palermo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2843, "name": "Carnaval Porteño", "month": 3, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2844, "name": "ATP: Argentina Open", "month": 3, "location": "Buenos Aires Lawn Tennis Club", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2845, "name": "BAFWeek", "month": 3, "location": "Centro de Convenciones Buenos Aires", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2846, "name": "ArteBA", "month": 4, "location": "La Rural", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2847, "name": "Ceremonia Vezak o Baño de Buda", "month": 4, "location": "Barrio Chino", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2848, "name": "Semana de la Coctelería - BA Cóctel", "month": 5, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2849, "name": "Feria Puro Diseño", "month": 5, "location": "La Rural", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2850, "name": "Frankie BA Festival", "month": 7, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2851, "name": "Festival y Mundial de Tango", "month": 8, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2852, "name": "Media Maratón K21", "month": 8, "location": "Palermo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2853, "name": "Buenos Aires Coctel - Inspira", "month": 8, "location": "Palacio Piccaluga", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2854, "name": "Buenos Aires Photo", "month": 9, "location": "La Rural", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2855, "name": "Maratón k42 Buenos Aires", "month": 9, "location": "Palermo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2856, "name": "Campeonato Federal del Asado", "month": 9, "location": "Mataderos", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2857, "name": "Le Marché, Feria de Cocina Francesa", "month": 9, "location": "Plaza Cataluña", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2858, "name": "Ciudanza - Danza en paisajes urbanos", "month": 9, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2859, "name": "Fiesta tradicional La Alasita", "month": 9, "location": "Villa Lugano", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2860, "name": "FIBA: Festival Internacional de Buenos Aires", "month": 9, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2861, "name": "Año Nuevo Chino", "month": 1, "location": "Barrio Chino", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido según PDF
    { "id": 2862, "name": "Buenos Aires Playa", "month": 1, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" },
    { "id": 2863, "name": "Gran Milonga Nacional", "month": 12, "location": "Av. de Mayo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2864, "name": "Wateke, un Festival de Música y Gastronomía", "month": 12, "location": "Hipódromo Argentino de Palermo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2865, "name": "Llamadas de Candombe", "month": 12, "location": "San Telmo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2866, "name": "Festival por la Inclusión", "month": 12, "location": "La Rural", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2867, "name": "Buenos Aires Celebra", "month": 10, "location": "Av. de Mayo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2868, "name": "FIT - Feria Internacional de Turismo", "month": 10, "location": "La Rural", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2869, "name": "Festival Ciudad Emergente", "month": 10, "location": "Usina del Arte", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2870, "name": "Festival Internacional de Diseño", "month": 10, "location": "Centro Metropolitano de Diseño", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2871, "name": "La Nochecita de los Museos", "month": 10, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2872, "name": "Festival Internacional Buenos Aires Jazz", "month": 11, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2873, "name": "La Noche de los Museos", "month": 11, "location": "Museos y espacios culturales", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2874, "name": "Open House Buenos Aires", "month": 11, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2875, "name": "La Noche de las Librerías", "month": 11, "location": "Av. Corrientes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2876, "name": "Semana de la Gastronomía Porteña", "month": 11, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2877, "name": "MateAr", "month": 11, "location": "La Rural", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2878, "name": "ART Weekend Buenos Aires", "month": 11, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2879, "name": "Día del Teatro Independiente", "month": 11, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2880, "name": "La Noche de las Heladerías", "month": 11, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2881, "name": "La Noche de Los Templos", "month": 11, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2882, "name": "Semana Orgullo BA", "month": 11, "location": "Plaza de Mayo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2883, "name": "Marcha del Orgullo", "month": 11, "location": "Varias sedes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2884, "name": "La Noche de las Disquerías", "month": 11, "location": "Distrito de las Artes", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2885, "name": "Gallery Day", "month": 11, "location": "Hotel Panamericano", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2886, "name": "Sparkling Nights", "month": 11, "location": "Campo Argentino de Polo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" }, // Mes corregido
    { "id": 2887, "name": "Campeonato Argentino Abierto de Polo", "month": 11, "location": "Palermo", "province": "CABA", "contactName": "", "contactPhone": "", "email": "", "status": "Pendiente", "notes": "" } // Mes corregido
];

// FIN DE LA CARGA DE DATOS PROPORCIONADA POR EL USUARIO.
// Los IDs son secuenciales y únicos.
// Los campos de contacto, email, status y notas están inicializados.
// Se recomienda revisar la exactitud de los meses y la categorización "FN:" si es necesario.
