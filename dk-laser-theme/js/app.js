// app.js
// Contiene la lógica principal para la aplicación DK Fest Tracker.
// Gestiona el estado de la aplicación, la manipulación de datos (localStorage, datos iniciales),
// la renderización de vistas (Tareas del Día, Todas las Fiestas), la interacción con el modal de edición,
// y la configuración de todos los event listeners necesarios.

document.addEventListener('DOMContentLoaded', () => {
    // Estado global de la aplicación
    const AppState = {
        festivals: [], // Array para almacenar todos los festivales
        dailyTasks: [], // Array para almacenar las 10 tareas diarias seleccionadas
        currentView: 'tasks' // Vista actual: 'tasks' o 'all'
    };

    // --- Selección de Elementos del DOM ---
    // Se almacenan en variables para acceso rápido y evitar múltiples querySelector.
    // Vistas principales
    const tasksView = document.getElementById('tasks-view');
    const allFestivalsView = document.getElementById('all-festivals-view');
    // Botones de navegación
    const viewTasksBtn = document.getElementById('view-tasks-btn');
    const viewAllBtn = document.getElementById('view-all-btn');
    // Contenedores para renderizar contenido
    const tasksGrid = document.getElementById('tasks-grid'); // Para tarjetas de tareas diarias
    const festivalsTableBody = document.getElementById('festivals-table-body'); // Para filas en la tabla de todos los festivales
    // Input de búsqueda
    const searchInput = document.getElementById('search-input');

    // Elementos del Modal de Edición
    const modal = document.getElementById('edit-modal');
    // Campos no editables (se muestran como texto)
    const modalReadOnlyName = document.getElementById('modal-readonly-name');
    const modalReadOnlyMonth = document.getElementById('modal-readonly-month');
    const modalReadOnlyLocation = document.getElementById('modal-readonly-location');
    const modalReadOnlyProvince = document.getElementById('modal-readonly-province');
    // Formulario y sus campos editables
    const editForm = document.getElementById('edit-form');
    const cancelBtn = document.getElementById('cancel-btn'); // Botón "Cancelar" del formulario modal
    const closeModalButton = document.getElementById('close-modal-btn'); // Botón 'x' para cerrar el modal

    const editId = document.getElementById('edit-id'); // Campo oculto para el ID del festival
    const editContactName = document.getElementById('edit-contactName');
    const editContactPhone = document.getElementById('edit-contactPhone');
    const editEmail = document.getElementById('edit-email');
    const editStatus = document.getElementById('edit-status');
    const editNotes = document.getElementById('edit-notes');

    // Constante para nombres completos de meses (usado en UI)
    const FULL_MONTH_NAMES = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // --- MANEJO DE DATOS ---

    /**
     * Carga los datos de los festivales.
     * Intenta cargar desde localStorage. Si no hay datos, usa `initialFestivals` de `data.js`.
     * Luego, guarda los datos en localStorage si es la primera carga.
     * Finalmente, genera las tareas diarias.
     */
    function loadData() {
        console.log("DK Fest Tracker: Intentando cargar datos...");
        const storedFestivals = localStorage.getItem('dkFestivals');
        if (storedFestivals) {
            console.log("DK Fest Tracker: Festivales encontrados en localStorage.");
            AppState.festivals = JSON.parse(storedFestivals);
        } else {
            console.log("DK Fest Tracker: No hay festivales en localStorage, usando initialFestivals de data.js.");
            if (typeof initialFestivals !== 'undefined' && Array.isArray(initialFestivals)) {
                // Se realiza una copia profunda para evitar modificar el array original `initialFestivals`
                AppState.festivals = initialFestivals.map(f => ({...f}));
            } else {
                console.error("DK Fest Tracker: initialFestivals no está definido o no es un array. Asegúrate que data.js se carga antes y define esta variable.");
                AppState.festivals = []; // Fallback a un array vacío para evitar errores mayores
            }
            saveData(); // Guardar los datos iniciales en localStorage
        }
        console.log(`DK Fest Tracker: ${AppState.festivals.length} festivales cargados en AppState.`);
        generateDailyTasks();
    }

    /**
     * Guarda el array `AppState.festivals` completo en localStorage.
     */
    function saveData() {
        console.log("DK Fest Tracker: Guardando festivales en localStorage...");
        localStorage.setItem('dkFestivals', JSON.stringify(AppState.festivals));
        console.log("DK Fest Tracker: Festivales guardados.");
    }

    /**
     * Obtiene un festival específico por su ID desde `AppState.festivals`.
     * @param {number} id - El ID del festival a buscar.
     * @returns {Object|undefined} El objeto del festival si se encuentra, sino undefined.
     */
    function getFestivalById(id) {
        return AppState.festivals.find(festival => festival.id === id);
    }

    /**
     * Actualiza un festival existente en `AppState.festivals` y en localStorage.
     * También actualiza el festival si está presente en la lista de tareas diarias.
     * @param {Object} updatedFestivalData - El objeto del festival con los datos actualizados.
     * @returns {boolean} True si la actualización fue exitosa, false en caso contrario.
     */
    function updateFestival(updatedFestivalData) {
        console.log("DK Fest Tracker: Intentando actualizar festival ID:", updatedFestivalData.id);
        const index = AppState.festivals.findIndex(festival => festival.id === updatedFestivalData.id);
        if (index !== -1) {
            // Fusiona los datos antiguos con los nuevos, asegurando que los campos no editables no se pierdan
            AppState.festivals[index] = { ...AppState.festivals[index], ...updatedFestivalData };
            saveData(); // Persiste todos los festivales

            // Actualizar el mismo festival en dailyTasks si existe para mantener la UI consistente
            const dailyTaskIndex = AppState.dailyTasks.findIndex(task => task && task.id === updatedFestivalData.id);
            if (dailyTaskIndex !== -1) {
                console.log("DK Fest Tracker: Actualizando tarea diaria también.");
                AppState.dailyTasks[dailyTaskIndex] = {...AppState.dailyTasks[dailyTaskIndex], ...updatedFestivalData};
                // Persistir las tareas diarias actualizadas
                const today = new Date().toDateString();
                localStorage.setItem('dkDailyTasks', JSON.stringify({
                    date: today,
                    tasks: AppState.dailyTasks // Contiene los objetos completos
                }));
            }
            console.log("DK Fest Tracker: Festival actualizado con éxito.", AppState.festivals[index]);
            return true;
        }
        console.error("DK Fest Tracker: Error, no se encontró el festival para actualizar. ID:", updatedFestivalData.id);
        return false;
    }

    /**
     * Genera o carga las tareas diarias.
     * Si hay tareas para hoy en localStorage, las carga.
     * Sino, filtra festivales 'Pendientes' de los próximos 4 meses, selecciona 10 aleatoriamente,
     * y los guarda en localStorage.
     */
    function generateDailyTasks() {
        console.log("DK Fest Tracker: Generando/Verificando tareas diarias...");
        const storedTasksData = JSON.parse(localStorage.getItem('dkDailyTasks'));
        const today = new Date().toDateString();

        // Si ya existen tareas para hoy y son válidas (contienen objetos de tareas)
        if (storedTasksData && storedTasksData.date === today && Array.isArray(storedTasksData.tasks)) {
            console.log("DK Fest Tracker: Cargando tareas diarias desde localStorage para hoy.");
            // Mapear para asegurar que se usan los objetos más recientes de AppState.festivals,
            // en caso de que un festival haya sido editado después de generar las tareas.
            AppState.dailyTasks = storedTasksData.tasks.map(task => getFestivalById(task.id)).filter(Boolean);
        } else {
            console.log("DK Fest Tracker: Generando nuevas tareas diarias para hoy:", today);
            const now = new Date();
            const currentMonth = now.getMonth(); // 0-11 (Enero es 0)
            const currentYear = now.getFullYear();

            // Filtrar festivales que estén pendientes y ocurran en los próximos 4 meses.
            const potentialTasks = AppState.festivals.filter(f => {
                if (f.status !== 'Pendiente') return false;

                const festivalMonth = f.month - 1; // Ajustar mes del festival a 0-11

                // Iterar por los próximos 4 meses (mes actual + 3 siguientes)
                for (let i = 0; i < 4; i++) {
                    let targetMonth = currentMonth + i;
                    let targetYear = currentYear;
                    if (targetMonth > 11) { // Manejo de cambio de año
                        targetMonth -= 12;
                        targetYear += 1;
                    }
                    // Comprobar si el mes y año del festival coinciden con el mes y año objetivo
                    if (festivalMonth === targetMonth && (!f.year || f.year === targetYear)) {
                        return true;
                    }
                }
                return false;
            });

            console.log(`DK Fest Tracker: ${potentialTasks.length} tareas potenciales encontradas con estado 'Pendiente' en los próximos 4 meses.`);

            // Mezclar aleatoriamente y tomar hasta 10
            const shuffled = potentialTasks.sort(() => 0.5 - Math.random());
            AppState.dailyTasks = shuffled.slice(0, 10);
            console.log(`DK Fest Tracker: ${AppState.dailyTasks.length} tareas diarias seleccionadas.`);

            // Guardar las tareas (objetos completos) y la fecha de generación en localStorage
            localStorage.setItem('dkDailyTasks', JSON.stringify({
                date: today,
                tasks: AppState.dailyTasks
            }));
            console.log("DK Fest Tracker: Nuevas tareas diarias guardadas en localStorage.");
        }
    }

    // --- RENDERIZACIÓN DE VISTAS ---

    /**
     * Renderiza la vista actual (Tareas del Día o Todas las Fiestas) y actualiza el estilo de los botones de navegación.
     */
    function render() {
        console.log("DK Fest Tracker: Renderizando vista:", AppState.currentView);
        if (AppState.currentView === 'tasks') {
            tasksView.classList.remove('hidden');
            allFestivalsView.classList.add('hidden');
            // Estilo para botón de navegación activo/inactivo
            viewTasksBtn.classList.add('bg-[#01ff1d]', 'text-[#090f0a]');
            viewTasksBtn.classList.remove('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]', 'hover:bg-[#01ff1d]', 'hover:text-[#090f0a]');
            viewAllBtn.classList.add('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]', 'hover:bg-[#01ff1d]', 'hover:text-[#090f0a]');
            viewAllBtn.classList.remove('bg-[#01ff1d]', 'text-[#090f0a]');
            renderTasks();
        } else { // Vista 'all' (Todas las Fiestas)
            tasksView.classList.add('hidden');
            allFestivalsView.classList.remove('hidden');
            // Estilo para botón de navegación activo/inactivo
            viewAllBtn.classList.add('bg-[#01ff1d]', 'text-[#090f0a]');
            viewAllBtn.classList.remove('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]', 'hover:bg-[#01ff1d]', 'hover:text-[#090f0a]');
            viewTasksBtn.classList.add('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]', 'hover:bg-[#01ff1d]', 'hover:text-[#090f0a]');
            viewTasksBtn.classList.remove('bg-[#01ff1d]', 'text-[#090f0a]');
            renderAllFestivals(searchInput.value); // Renderizar con el valor actual del filtro de búsqueda
        }
    }

    /**
     * Renderiza las tarjetas de las tareas diarias en `tasksGrid`.
     */
    function renderTasks() {
        tasksGrid.innerHTML = ''; // Limpiar contenedor
        if (!AppState.dailyTasks || AppState.dailyTasks.length === 0) {
            tasksGrid.innerHTML = `<p class="text-gray-400 col-span-full text-center py-10">No hay tareas sugeridas para hoy (o para los próximos 4 meses con estado 'Pendiente').<br>¡Puedes buscar en "Todas las Fiestas" o esperar a mañana!</p>`;
            return;
        }
        AppState.dailyTasks.forEach(festival => {
            // Salvaguarda por si un festival en dailyTasks es undefined (debido a un ID no encontrado)
            if (!festival) {
                console.warn("DK Fest Tracker: Tarea diaria encontrada como undefined, omitiendo renderizado de esta tarjeta.");
                return;
            }
            // Creación de la tarjeta HTML para cada tarea diaria
            const card = `
                <div class="bg-[#0c140d] p-4 rounded-lg shadow-md border border-gray-800 hover:border-[#01ff1d] transition-all duration-200 ease-in-out transform hover:scale-105 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-lg text-white truncate mb-1" title="${festival.name}">${festival.name}</h3>
                        <p class="text-sm text-gray-400 mb-0.5">${festival.location}</p>
                        <p class="text-sm text-gray-500 mb-0.5">${festival.province}</p>
                        <p class="text-xs text-gray-500 mt-1">Mes: ${FULL_MONTH_NAMES[festival.month]}</p>
                    </div>
                    <button data-id="${festival.id}" class="manage-btn mt-3 w-full px-3 py-2 text-sm font-bold bg-[#01ff1d] text-[#090f0a] rounded-md transition hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#01ff1d]">Gestionar</button>
                </div>
            `;
            tasksGrid.innerHTML += card;
        });
    }

    /**
     * Renderiza la tabla de todos los festivales en `festivalsTableBody`.
     * Aplica un filtro si se proporciona.
     * @param {string} [filter=''] - El término de búsqueda para filtrar los festivales.
     */
    function renderAllFestivals(filter = '') {
        festivalsTableBody.innerHTML = ''; // Limpiar contenedor
        const lowercasedFilter = filter.toLowerCase().trim();

        // Filtrar festivales por nombre, lugar, provincia, mes (nombre completo) o estado
        const filteredFestivals = AppState.festivals.filter(f =>
            f.name.toLowerCase().includes(lowercasedFilter) ||
            f.location.toLowerCase().includes(lowercasedFilter) ||
            f.province.toLowerCase().includes(lowercasedFilter) ||
            (f.month && FULL_MONTH_NAMES[f.month] && FULL_MONTH_NAMES[f.month].toLowerCase().includes(lowercasedFilter)) ||
            f.status.toLowerCase().includes(lowercasedFilter)
        );

        if (filteredFestivals.length === 0) {
            festivalsTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-gray-400">No se encontraron fiestas con el criterio de búsqueda.</td></tr>`;
            return;
        }

        // Ordenar alfabéticamente por nombre antes de renderizar
        filteredFestivals.sort((a,b) => a.name.localeCompare(b.name)).forEach(festival => {
            // Generar clase CSS para el punto de estado (ej: 'status-Pendiente', 'status-En-Seguimiento')
            const statusClass = festival.status.replace(/\s+/g, '-') || 'Pendiente';
            // Creación de la fila HTML para cada festival
            const row = `
                <tr class="bg-[#0c140d] border-b border-gray-800 hover:bg-gray-800/60 transition-colors duration-150">
                    <td class="p-4 align-middle"><div class="status-dot status-${statusClass}" title="${festival.status}"></div></td>
                    <th scope="row" class="px-6 py-4 font-medium text-white whitespace-nowrap align-middle">${festival.name}</th>
                    <td class="px-6 py-4 text-gray-300 align-middle">${FULL_MONTH_NAMES[festival.month]}</td>
                    <td class="px-6 py-4 text-gray-300 align-middle">${festival.location}</td>
                    <td class="px-6 py-4 text-gray-300 align-middle">${festival.province}</td>
                    <td class="px-6 py-4 text-gray-300 align-middle">${festival.status}</td>
                    <td class="px-6 py-4 align-middle">
                        <button data-id="${festival.id}" class="manage-btn font-medium text-[#01ff1d] hover:underline focus:outline-none focus:ring-1 focus:ring-[#01ff1d] rounded">Gestionar</button>
                    </td>
                </tr>
            `;
            festivalsTableBody.innerHTML += row;
        });
    }

    // --- LÓGICA DEL MODAL DE EDICIÓN ---

    /**
     * Abre el modal de edición y lo puebla con los datos del festival seleccionado.
     * @param {number} id - El ID del festival a editar.
     */
    function openModal(id) {
        const festival = getFestivalById(id);
        if (!festival) {
            console.error("DK Fest Tracker: Festival no encontrado para ID:", id);
            return;
        }
        console.log("DK Fest Tracker: Abriendo modal para:", festival.name);

        // Poblar campos no editables
        modalReadOnlyName.textContent = festival.name;
        modalReadOnlyMonth.textContent = FULL_MONTH_NAMES[festival.month] || 'N/A'; // 'N/A' si el mes no es válido
        modalReadOnlyLocation.textContent = festival.location;
        modalReadOnlyProvince.textContent = festival.province;

        // Poblar campos editables del formulario
        editId.value = festival.id; // Importante: establecer el ID oculto
        editContactName.value = festival.contactName || ''; // Usar string vacío si el campo es null/undefined
        editContactPhone.value = festival.contactPhone || '';
        editEmail.value = festival.email || '';
        editStatus.value = festival.status;
        editNotes.value = festival.notes || '';

        // Mostrar el modal con transición
        modal.classList.remove('hidden', 'opacity-0');
        // Pequeño delay para asegurar que la transición CSS se aplique después de quitar 'hidden'
        setTimeout(() => {
          modal.classList.remove('opacity-0');
          modal.querySelector('.modal-content').classList.remove('-translate-y-10');
        }, 10);
    }

    /**
     * Cierra el modal de edición y resetea el formulario.
     */
    function closeModal() {
        console.log("DK Fest Tracker: Cerrando modal.");
        // Aplicar clases para la transición de salida
        modal.classList.add('opacity-0');
        modal.querySelector('.modal-content').classList.add('-translate-y-10');
        // Ocultar el modal después de que la transición termine
        setTimeout(() => {
            modal.classList.add('hidden');
            editForm.reset(); // Limpiar los campos del formulario
            editId.value = ''; // Limpiar el ID oculto
        }, 250); // Duración debe coincidir con la transición CSS (opacity 0.25s)
    }

    // --- CONFIGURACIÓN DE EVENT LISTENERS ---

    /**
     * Configura todos los event listeners principales de la aplicación.
     */
    function setupEventListeners() {
        console.log("DK Fest Tracker: Configurando event listeners...");
        // Navegación entre vistas
        viewTasksBtn.addEventListener('click', () => {
            AppState.currentView = 'tasks';
            render();
        });

        viewAllBtn.addEventListener('click', () => {
            AppState.currentView = 'all';
            render();
        });

        // Búsqueda en la tabla de "Todas las Fiestas"
        searchInput.addEventListener('input', (e) => {
            renderAllFestivals(e.target.value);
        });

        // Manejo de clics en botones "Gestionar" (delegación de eventos en el body)
        // Esto es más eficiente que añadir un listener a cada botón individualmente,
        // especialmente si los botones se añaden/eliminan dinámicamente.
        document.body.addEventListener('click', (e) => {
            const manageButton = e.target.closest('.manage-btn'); // Busca el botón o su ancestro más cercano con la clase
            if (manageButton) {
                const id = parseInt(manageButton.dataset.id);
                if (!isNaN(id)) {
                    openModal(id);
                } else {
                    console.error("DK Fest Tracker: ID de festival inválido en botón gestionar:", manageButton.dataset.id);
                }
            }
        });

        // Botón "Cancelar" dentro del modal
        if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // Botón de cierre 'x' del modal
        if (closeModalButton) { // closeModalButton es el ID del botón con '&times;'
            closeModalButton.addEventListener('click', closeModal);
        }

        // Cerrar modal si se hace clic fuera de su contenido (en el overlay)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Si el clic fue directamente en el div del modal (overlay)
                closeModal();
            }
        });

        // Envío del formulario de edición
        editForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir recarga de página
            console.log("DK Fest Tracker: Formulario de edición enviado.");
            const id = parseInt(editId.value);
            if (isNaN(id)) { // Validación básica del ID
                console.error("DK Fest Tracker: ID de festival inválido en el formulario de edición.");
                return;
            }

            const festivalOriginal = getFestivalById(id);
            if (!festivalOriginal) { // Asegurarse que el festival aún existe
                console.error("DK Fest Tracker: No se encontró el festival original para actualizar. ID:", id);
                closeModal();
                return;
            }

            // Construir objeto con los datos actualizados, manteniendo los no editables del original
            const updatedFestivalData = {
                id: festivalOriginal.id,
                name: festivalOriginal.name,
                month: festivalOriginal.month,
                location: festivalOriginal.location,
                province: festivalOriginal.province,
                // Campos que sí se editan
                contactName: editContactName.value.trim(),
                contactPhone: editContactPhone.value.trim(),
                email: editEmail.value.trim(),
                status: editStatus.value,
                notes: editNotes.value.trim(),
            };

            if (updateFestival(updatedFestivalData)) {
                console.log("DK Fest Tracker: Festival actualizado con éxito en AppState y localStorage.");
            } else {
                console.error("DK Fest Tracker: Error al actualizar el festival.");
            }

            closeModal();
            render(); // Re-renderizar la vista actual para reflejar los cambios
        });
        console.log("DK Fest Tracker: Event listeners configurados.");
    }

    // --- INICIALIZACIÓN DE LA APLICACIÓN ---

    /**
     * Función principal que inicializa la aplicación.
     * Verifica elementos DOM, carga datos, configura listeners y renderiza la vista inicial.
     */
    function initApp() {
        console.log("DK Fest Tracker: Inicializando la aplicación...");
        // Verificación crucial de elementos del DOM para evitar errores tempranos
        if (!tasksView || !allFestivalsView || !viewTasksBtn || !viewAllBtn || !tasksGrid || !festivalsTableBody || !searchInput || !modal || !editForm || !cancelBtn || !editId || !editContactName || !editContactPhone || !editEmail || !editStatus || !editNotes || !modalReadOnlyName || !closeModalButton) {
            console.error("DK Fest Tracker: Error Crítico - Uno o más elementos del DOM no se encontraron. Verifica los IDs en index.html y app.js.");
            const missing = [
                {el: tasksView, id: 'tasks-view'}, {el: allFestivalsView, id: 'all-festivals-view'},
                {el: viewTasksBtn, id: 'view-tasks-btn'}, {el: viewAllBtn, id: 'view-all-btn'},
                {el: tasksGrid, id: 'tasks-grid'}, {el: festivalsTableBody, id: 'festivals-table-body'},
                {el: searchInput, id: 'search-input'}, {el: modal, id: 'edit-modal'},
                {el: editForm, id: 'edit-form'}, {el: cancelBtn, id: 'cancel-btn'}, {el: closeModalButton, id: 'close-modal-btn'},
                {el: editId, id: 'edit-id'}, {el: editContactName, id: 'edit-contactName'},
                {el: editContactPhone, id: 'edit-contactPhone'}, {el: editEmail, id: 'edit-email'},
                {el: editStatus, id: 'edit-status'}, {el: editNotes, id: 'edit-notes'},
                {el: modalReadOnlyName, id: 'modal-readonly-name'} // Añadir el resto de campos readonly si es necesario
            ].filter(item => !item.el).map(item => item.id);
            alert(`Error: No se pudieron encontrar los siguientes elementos del DOM: ${missing.join(', ')}. La aplicación no funcionará correctamente.`);
            return; // Detener la inicialización si faltan elementos críticos
        }
        loadData(); // Cargar datos primero
        setupEventListeners(); // Luego configurar listeners
        render(); // Finalmente, renderizar la vista inicial
        console.log("DK Fest Tracker: Aplicación inicializada y primera renderización completada.");
    }

    // Iniciar la aplicación cuando el DOM esté listo
    initApp();
});
