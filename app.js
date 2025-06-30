// app.js
// Contiene la lógica principal para la aplicación DK Fest Tracker.
// Gestiona el estado de la aplicación, la manipulación de datos (localStorage, datos iniciales),
// la renderización de vistas (Tareas del Día, Todas las Fiestas), la interacción con el modal de edición,
// y la configuración de todos los event listeners necesarios.

document.addEventListener('DOMContentLoaded', () => {
    // Estado global de la aplicación
    const AppState = {
        festivals: [],
        dailyTasks: [],
        currentView: 'tasks'
    };

    // --- Selección de Elementos del DOM ---
    const tasksView = document.getElementById('tasks-view');
    const allFestivalsView = document.getElementById('all-festivals-view');
    const viewTasksBtn = document.getElementById('view-tasks-btn');
    const viewAllBtn = document.getElementById('view-all-btn');
    const tasksGrid = document.getElementById('tasks-grid');
    const festivalsTableBody = document.getElementById('festivals-table-body');
    const searchInput = document.getElementById('search-input');

    const modal = document.getElementById('edit-modal');
    const modalReadOnlyName = document.getElementById('modal-readonly-name');
    const modalReadOnlyMonth = document.getElementById('modal-readonly-month');
    const modalReadOnlyLocation = document.getElementById('modal-readonly-location');
    const modalReadOnlyProvince = document.getElementById('modal-readonly-province');

    const editForm = document.getElementById('edit-form');
    const cancelBtn = document.getElementById('cancel-btn');

    let closeModalButton; // Se asignará e inicializará en openModal por primera vez
    let isCloseModalButtonListenerAttached = false; // Flag para asegurar que el listener se añade solo una vez

    const editId = document.getElementById('edit-id');
    const editContactName = document.getElementById('edit-contactName');
    const editContactPhone = document.getElementById('edit-contactPhone');
    const editEmail = document.getElementById('edit-email');
    const editStatus = document.getElementById('edit-status');
    const editNotes = document.getElementById('edit-notes');

    const FULL_MONTH_NAMES = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // --- MANEJO DE DATOS ---
    function loadData() {
        console.log("DK Fest Tracker: Intentando cargar datos...");
        const storedFestivals = localStorage.getItem('dkFestivals');
        if (storedFestivals) {
            console.log("DK Fest Tracker: Festivales encontrados en localStorage.");
            AppState.festivals = JSON.parse(storedFestivals);
        } else {
            console.log("DK Fest Tracker: No hay festivales en localStorage, usando initialFestivals de data.js.");
            if (typeof initialFestivals !== 'undefined' && Array.isArray(initialFestivals)) {
                AppState.festivals = initialFestivals.map(f => ({...f}));
            } else {
                console.error("DK Fest Tracker: initialFestivals no está definido o no es un array.");
                AppState.festivals = [];
            }
            saveData();
        }
        console.log(`DK Fest Tracker: ${AppState.festivals.length} festivales cargados.`);
        generateDailyTasks();
    }

    function saveData() {
        console.log("DK Fest Tracker: Guardando festivales en localStorage...");
        localStorage.setItem('dkFestivals', JSON.stringify(AppState.festivals));
        console.log("DK Fest Tracker: Festivales guardados.");
    }

    function getFestivalById(id) {
        return AppState.festivals.find(festival => festival.id === id);
    }

    function updateFestival(updatedFestivalData) {
        console.log("DK Fest Tracker: Intentando actualizar festival ID:", updatedFestivalData.id);
        const index = AppState.festivals.findIndex(festival => festival.id === updatedFestivalData.id);
        if (index !== -1) {
            AppState.festivals[index] = { ...AppState.festivals[index], ...updatedFestivalData };
            saveData();

            const dailyTaskIndex = AppState.dailyTasks.findIndex(task => task && task.id === updatedFestivalData.id);
            if (dailyTaskIndex !== -1) {
                AppState.dailyTasks[dailyTaskIndex] = {...AppState.dailyTasks[dailyTaskIndex], ...updatedFestivalData};
                const today = new Date().toDateString();
                localStorage.setItem('dkDailyTasks', JSON.stringify({
                    date: today,
                    tasks: AppState.dailyTasks
                }));
            }
            console.log("DK Fest Tracker: Festival actualizado.", AppState.festivals[index]);
            return true;
        }
        console.error("DK Fest Tracker: Error al actualizar, festival no encontrado. ID:", updatedFestivalData.id);
        return false;
    }

    function generateDailyTasks() {
        console.log("DK Fest Tracker: Generando/Verificando tareas diarias...");
        const storedTasksData = JSON.parse(localStorage.getItem('dkDailyTasks'));
        const today = new Date().toDateString();

        if (storedTasksData && storedTasksData.date === today && Array.isArray(storedTasksData.tasks)) {
            console.log("DK Fest Tracker: Cargando tareas diarias desde localStorage.");
            AppState.dailyTasks = storedTasksData.tasks.map(task => getFestivalById(task.id)).filter(Boolean);
        } else {
            console.log("DK Fest Tracker: Generando nuevas tareas diarias para:", today);
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const potentialTasks = AppState.festivals.filter(f => {
                if (f.status !== 'Pendiente') return false;
                const festivalMonth = f.month - 1;
                for (let i = 0; i < 4; i++) {
                    let targetMonth = currentMonth + i;
                    let targetYear = currentYear;
                    if (targetMonth > 11) {
                        targetMonth -= 12;
                        targetYear += 1;
                    }
                    if (festivalMonth === targetMonth && (!f.year || f.year === targetYear)) {
                        return true;
                    }
                }
                return false;
            });

            console.log(`DK Fest Tracker: ${potentialTasks.length} tareas potenciales.`);
            const shuffled = potentialTasks.sort(() => 0.5 - Math.random());
            AppState.dailyTasks = shuffled.slice(0, 10);
            console.log(`DK Fest Tracker: ${AppState.dailyTasks.length} tareas diarias seleccionadas.`);

            localStorage.setItem('dkDailyTasks', JSON.stringify({
                date: today,
                tasks: AppState.dailyTasks
            }));
            console.log("DK Fest Tracker: Nuevas tareas diarias guardadas.");
        }
    }

    // --- RENDERIZACIÓN DE VISTAS ---
    function render() {
        // (sin cambios en esta función, se omite por brevedad, es igual a la anterior)
        console.log("DK Fest Tracker: Renderizando vista:", AppState.currentView);
        if (AppState.currentView === 'tasks') {
            tasksView.classList.remove('hidden');
            allFestivalsView.classList.add('hidden');
            viewTasksBtn.classList.add('bg-[#01ff1d]', 'text-[#090f0a]');
            viewTasksBtn.classList.remove('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]', 'hover:bg-[#01ff1d]', 'hover:text-[#090f0a]');
            viewAllBtn.classList.add('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]', 'hover:bg-[#01ff1d]', 'hover:text-[#090f0a]');
            viewAllBtn.classList.remove('bg-[#01ff1d]', 'text-[#090f0a]');
            renderTasks();
        } else {
            tasksView.classList.add('hidden');
            allFestivalsView.classList.remove('hidden');
            viewAllBtn.classList.add('bg-[#01ff1d]', 'text-[#090f0a]');
            viewAllBtn.classList.remove('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]', 'hover:bg-[#01ff1d]', 'hover:text-[#090f0a]');
            viewTasksBtn.classList.add('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]', 'hover:bg-[#01ff1d]', 'hover:text-[#090f0a]');
            viewTasksBtn.classList.remove('bg-[#01ff1d]', 'text-[#090f0a]');
            renderAllFestivals(searchInput.value);
        }
    }

    function renderTasks() {
        // (sin cambios en esta función, se omite por brevedad, es igual a la anterior)
        tasksGrid.innerHTML = '';
        if (!AppState.dailyTasks || AppState.dailyTasks.length === 0) {
            tasksGrid.innerHTML = `<p class="text-gray-400 col-span-full text-center py-10">No hay tareas sugeridas para hoy (o para los próximos 4 meses con estado 'Pendiente').<br>¡Puedes buscar en "Todas las Fiestas" o esperar a mañana!</p>`;
            return;
        }
        AppState.dailyTasks.forEach(festival => {
            if (!festival) {
                console.warn("DK Fest Tracker: Tarea diaria encontrada como undefined, omitiendo renderizado.");
                return;
            }
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

    function renderAllFestivals(filter = '') {
        // (sin cambios en esta función, se omite por brevedad, es igual a la anterior)
        festivalsTableBody.innerHTML = '';
        const lowercasedFilter = filter.toLowerCase().trim();

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

        filteredFestivals.sort((a,b) => a.name.localeCompare(b.name)).forEach(festival => {
            const statusClass = festival.status.replace(/\s+/g, '-') || 'Pendiente';
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
    function openModal(id) {
        const festival = getFestivalById(id);
        if (!festival) {
            console.error("DK Fest Tracker: Festival no encontrado para ID:", id);
            return;
        }
        console.log("DK Fest Tracker: Abriendo modal para:", festival.name);

        // Intentar obtener y configurar el botón 'x' del modal si aún no se ha hecho
        if (!closeModalButton) {
            console.log("DK Fest Tracker: Intentando encontrar 'close-modal-btn' por primera vez en openModal.");
            closeModalButton = document.getElementById('close-modal-btn');
            if (closeModalButton && !isCloseModalButtonListenerAttached) {
                console.log("DK Fest Tracker: Botón 'close-modal-btn' encontrado. Añadiendo event listener.");
                closeModalButton.addEventListener('click', closeModal);
                isCloseModalButtonListenerAttached = true;
            } else if (!closeModalButton) {
                console.error("DK Fest Tracker: El botón 'close-modal-btn' NO fue encontrado en openModal.");
            }
        }

        modalReadOnlyName.textContent = festival.name;
        modalReadOnlyMonth.textContent = FULL_MONTH_NAMES[festival.month] || 'N/A';
        modalReadOnlyLocation.textContent = festival.location;
        modalReadOnlyProvince.textContent = festival.province;

        editId.value = festival.id;
        editContactName.value = festival.contactName || '';
        editContactPhone.value = festival.contactPhone || '';
        editEmail.value = festival.email || '';
        editStatus.value = festival.status;
        editNotes.value = festival.notes || '';

        modal.classList.remove('hidden');
        setTimeout(() => {
          modal.classList.remove('opacity-0');
          modal.querySelector('.modal-content').classList.remove('-translate-y-10');
        }, 10);
    }

    function closeModal() {
        console.log("DK Fest Tracker: Cerrando modal.");
        modal.classList.add('opacity-0');
        modal.querySelector('.modal-content').classList.add('-translate-y-10');
        setTimeout(() => {
            modal.classList.add('hidden');
            editForm.reset();
            editId.value = '';
        }, 250);
    }

    // --- CONFIGURACIÓN DE EVENT LISTENERS ---
    function setupEventListeners() {
        console.log("DK Fest Tracker: Configurando event listeners básicos...");
        viewTasksBtn.addEventListener('click', () => {
            AppState.currentView = 'tasks';
            render();
        });

        viewAllBtn.addEventListener('click', () => {
            AppState.currentView = 'all';
            render();
        });

        searchInput.addEventListener('input', (e) => {
            renderAllFestivals(e.target.value);
        });

        document.body.addEventListener('click', (e) => {
            const manageButton = e.target.closest('.manage-btn');
            if (manageButton) {
                const id = parseInt(manageButton.dataset.id);
                if (!isNaN(id)) {
                    openModal(id);
                } else {
                    console.error("DK Fest Tracker: ID de festival inválido:", manageButton.dataset.id);
                }
            }
        });

        if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("DK Fest Tracker: Formulario de edición enviado.");
            const id = parseInt(editId.value);
            if (isNaN(id)) {
                console.error("DK Fest Tracker: ID de festival inválido en formulario.");
                return;
            }

            const festivalOriginal = getFestivalById(id);
            if (!festivalOriginal) {
                console.error("DK Fest Tracker: No se encontró festival original. ID:", id);
                closeModal();
                return;
            }

            const updatedFestivalData = {
                id: festivalOriginal.id,
                name: festivalOriginal.name,
                month: festivalOriginal.month,
                location: festivalOriginal.location,
                province: festivalOriginal.province,
                contactName: editContactName.value.trim(),
                contactPhone: editContactPhone.value.trim(),
                email: editEmail.value.trim(),
                status: editStatus.value,
                notes: editNotes.value.trim(),
            };

            if (updateFestival(updatedFestivalData)) {
                console.log("DK Fest Tracker: Festival actualizado.");
            } else {
                console.error("DK Fest Tracker: Error al actualizar festival.");
            }

            closeModal();
            render();
        });
        console.log("DK Fest Tracker: Event listeners básicos configurados.");
    }

    // --- INICIALIZACIÓN DE LA APLICACIÓN ---
    function initApp() {
        console.log("DK Fest Tracker: Inicializando la aplicación...");
        const criticalElements = [
            {el: tasksView, id: 'tasks-view'}, {el: allFestivalsView, id: 'all-festivals-view'},
            {el: viewTasksBtn, id: 'view-tasks-btn'}, {el: viewAllBtn, id: 'view-all-btn'},
            {el: tasksGrid, id: 'tasks-grid'}, {el: festivalsTableBody, id: 'festivals-table-body'},
            {el: searchInput, id: 'search-input'}, {el: modal, id: 'edit-modal'},
            {el: editForm, id: 'edit-form'}, {el: cancelBtn, id: 'cancel-btn'},
            {el: editId, id: 'edit-id'}, {el: editContactName, id: 'edit-contactName'},
            {el: editContactPhone, id: 'edit-contactPhone'}, {el: editEmail, id: 'edit-email'},
            {el: editStatus, id: 'edit-status'}, {el: editNotes, id: 'edit-notes'},
            {el: modalReadOnlyName, id: 'modal-readonly-name'}
        ];

        const missingElements = criticalElements.filter(item => !item.el).map(item => item.id);

        if (missingElements.length > 0) {
            const errorMessage = `DK Fest Tracker: Error Crítico - No se pudieron encontrar los siguientes elementos del DOM: ${missingElements.join(', ')}. La aplicación no funcionará correctamente.`;
            console.error(errorMessage);
            alert(errorMessage.replace("DK Fest Tracker: Error Crítico - ", "Error: ")); // Mensaje más amigable para el alert
            return;
        }

        loadData();
        setupEventListeners(); // Configura la mayoría de los listeners
        render();

        // Intento de configurar el listener del botón 'x' del modal DESPUÉS de la primera renderización.
        // No se incluye en la verificación crítica inicial porque su listener se puede añadir más tarde.
        // La lógica para encontrarlo y añadir el listener ahora está en openModal.
        // Si aún no se encuentra, el console.error dentro de openModal lo indicará la primera vez que se abra el modal.

        console.log("DK Fest Tracker: Aplicación inicializada y primera renderización completada.");
    }

    initApp();
});
