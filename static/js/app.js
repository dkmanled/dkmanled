// app.js
// Contiene la lógica principal para la aplicación DK Fest Tracker.

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
    const addFiestaBtn = document.getElementById('add-fiesta-btn');
    const tasksGrid = document.getElementById('tasks-grid');
    const festivalsTableBody = document.getElementById('festivals-table-body');
    const searchInput = document.getElementById('search-input');

    // Modal de Edición
    const modal = document.getElementById('edit-modal');
    const modalReadOnlyName = document.getElementById('modal-readonly-name');
    const modalReadOnlyMonth = document.getElementById('modal-readonly-month');
    const modalReadOnlyLocation = document.getElementById('modal-readonly-location');
    const modalReadOnlyProvince = document.getElementById('modal-readonly-province');
    const editForm = document.getElementById('edit-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const closeModalButton = document.getElementById('close-modal-btn');
    const editId = document.getElementById('edit-id');
    const editContactName = document.getElementById('edit-contactName');
    const editContactPhone = document.getElementById('edit-contactPhone');
    const editEmail = document.getElementById('edit-email');
    const editStatus = document.getElementById('edit-status');
    const editNotes = document.getElementById('edit-notes');

    // Modal de Agregar Fiesta
    const addFiestaModal = document.getElementById('add-fiesta-modal');
    const addFiestaForm = document.getElementById('add-fiesta-form');
    const cancelAddBtn = document.getElementById('cancel-add-btn');
    const closeAddModalButton = document.getElementById('close-add-modal-btn');
    const addName = document.getElementById('add-name');
    const addMonth = document.getElementById('add-month');
    const addLocation = document.getElementById('add-location');
    const addProvince = document.getElementById('add-province');
    const addContactNameInput = document.getElementById('add-contactName'); // Renombrado para evitar conflicto
    const addContactPhoneInput = document.getElementById('add-contactPhone'); // Renombrado
    const addEmailInput = document.getElementById('add-email'); // ID 'add-email' en el modal de agregar, renombrado
    const addNotesInput = document.getElementById('add-notes'); // Renombrado

    const FULL_MONTH_NAMES = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // --- MANEJO DE DATOS ---
    async function loadData() {
        console.log("DK Fest Tracker: Cargando datos desde /api/festivals...");
        try {
            const response = await fetch('/api/festivals');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            AppState.festivals = await response.json();
            console.log(`DK Fest Tracker: ${AppState.festivals.length} festivales cargados.`);
            generateDailyTasks();
            render();
        } catch (error) {
            console.error("DK Fest Tracker: Error cargando festivales desde backend:", error);
            // Fallback a initialFestivals de data.js si está disponible
            if (typeof initialFestivals !== 'undefined' && Array.isArray(initialFestivals)) {
                 console.warn("DK Fest Tracker: Backend falló. Cargando desde initialFestivals (data.js).");
                 AppState.festivals = initialFestivals.map(f => ({...f})); // Copia profunda
                 generateDailyTasks();
                 render();
            } else {
                tasksGrid.innerHTML = `<p class="text-gray-400 col-span-full text-center py-10">Error al cargar datos del servidor. Intenta recargar.</p>`;
                festivalsTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-gray-400">Error al cargar datos.</td></tr>`;
            }
        }
    }

    function getFestivalById(id) {
        return AppState.festivals.find(festival => festival.id === id);
    }

    async function updateFestivalInBackend(updatedFestivalData) {
        console.log("DK Fest Tracker: Actualizando festival ID:", updatedFestivalData.id, "en backend.");
        try {
            const response = await fetch(`/api/festivals/${updatedFestivalData.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedFestivalData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, msg: ${errorData.error}`);
            }
            const returnedFestival = await response.json();

            const index = AppState.festivals.findIndex(f => f.id === returnedFestival.id);
            if (index !== -1) AppState.festivals[index] = returnedFestival;

            const dailyTaskIndex = AppState.dailyTasks.findIndex(t => t && t.id === returnedFestival.id);
            if (dailyTaskIndex !== -1) {
                 AppState.dailyTasks[dailyTaskIndex] = returnedFestival;
                 localStorage.setItem('dkDailyTasks', JSON.stringify({
                    date: new Date().toDateString(),
                    tasks: AppState.dailyTasks.map(task => ({id: task.id, name: task.name, status: task.status})) // Guardar subconjunto
                }));
            }
            console.log("DK Fest Tracker: Festival actualizado OK en AppState y backend.");
            return true;
        } catch (error) {
            console.error("DK Fest Tracker: Error actualizando festival en backend:", error);
            alert(`Error al guardar: ${error.message}`);
            return false;
        }
    }

    async function addFiestaToBackend(newFiestaData) {
        console.log("DK Fest Tracker: Agregando nueva fiesta a backend:", newFiestaData);
        try {
            const response = await fetch('/api/festivals', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newFiestaData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, msg: ${errorData.error}`);
            }
            const createdFestival = await response.json();
            AppState.festivals.push(createdFestival);
            console.log("DK Fest Tracker: Nueva fiesta agregada OK a AppState y backend.");
            return createdFestival;
        } catch (error) {
            console.error("DK Fest Tracker: Error agregando nueva fiesta a backend:", error);
            alert(`Error al agregar: ${error.message}`);
            return null;
        }
    }

    function generateDailyTasks() {
        console.log("DK Fest Tracker: Verificando/Generando tareas diarias...");
        const storedTasksData = JSON.parse(localStorage.getItem('dkDailyTasks'));
        const todayString = new Date().toDateString();

        if (storedTasksData && storedTasksData.date === todayString && Array.isArray(storedTasksData.tasks)) {
            console.log("DK Fest Tracker: Cargando tareas diarias desde localStorage.");
            AppState.dailyTasks = storedTasksData.tasks
                .map(taskStub => AppState.festivals.find(f => f.id === taskStub.id)) // Obtener objeto completo
                .filter(Boolean); // Filtrar nulos si alguna tarea no se encontró
        } else {
            generateNewDailyTasks();
        }
    }

    function generateNewDailyTasks() {
        console.log("DK Fest Tracker: Generando NUEVAS tareas diarias...");
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-11
        const currentYear = now.getFullYear();

        const potentialTasks = AppState.festivals.filter(f => {
            if (f.status !== 'Pendiente') return false;
            const festivalMonth = parseInt(f.month, 10) - 1;
            let targetMonthFuture = (currentMonth + 4) % 12;
            let targetYearFuture = currentYear;
            if (currentMonth + 4 >= 12) targetYearFuture++;

            return festivalMonth === targetMonthFuture && (!f.year || parseInt(f.year, 10) === targetYearFuture);
        });

        console.log(`DK Fest Tracker: ${potentialTasks.length} tareas potenciales para 4 meses en el futuro.`);
        AppState.dailyTasks = potentialTasks.sort(() => 0.5 - Math.random()).slice(0, 10);
        console.log(`DK Fest Tracker: ${AppState.dailyTasks.length} tareas diarias seleccionadas.`);

        localStorage.setItem('dkDailyTasks', JSON.stringify({
            date: new Date().toDateString(),
            tasks: AppState.dailyTasks.map(task => ({id: task.id, name: task.name, status: task.status})) // Guardar solo un subconjunto
        }));
        console.log("DK Fest Tracker: Nuevas tareas diarias guardadas en localStorage.");
    }

    // --- RENDERIZACIÓN ---
    function render() {
        if (AppState.currentView === 'tasks') {
            tasksView.classList.remove('hidden');
            allFestivalsView.classList.add('hidden');
            viewTasksBtn.classList.add('bg-[#01ff1d]', 'text-[#090f0a]');
            viewTasksBtn.classList.remove('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]');
            viewAllBtn.classList.add('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]');
            viewAllBtn.classList.remove('bg-[#01ff1d]', 'text-[#090f0a]');
            renderTasks();
        } else {
            tasksView.classList.add('hidden');
            allFestivalsView.classList.remove('hidden');
            viewAllBtn.classList.add('bg-[#01ff1d]', 'text-[#090f0a]');
            viewAllBtn.classList.remove('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]');
            viewTasksBtn.classList.add('text-[#01ff1d]', 'border-2', 'border-[#01ff1d]');
            viewTasksBtn.classList.remove('bg-[#01ff1d]', 'text-[#090f0a]');
            renderAllFestivals(searchInput.value);
        }
    }

    function renderTasks() {
        tasksGrid.innerHTML = AppState.dailyTasks.length === 0 ?
            `<p class="text-gray-400 col-span-full text-center py-10">No hay tareas sugeridas (Pendientes a 4 meses).<br>Agrega fiestas o revisa "Todas las Fiestas".</p>` :
            AppState.dailyTasks.map(festival => festival ? `
                <div class="task-card bg-[#0c140d] p-4 rounded-lg shadow-md border border-gray-800 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-lg text-white truncate mb-1" title="${festival.name}">${festival.name}</h3>
                        <p class="text-sm text-gray-400 mb-0.5">${festival.location}</p>
                        <p class="text-sm text-gray-500 mb-0.5">${festival.province}</p>
                        <p class="text-xs text-gray-500 mt-1">Mes: ${FULL_MONTH_NAMES[festival.month]}</p>
                    </div>
                    <button data-id="${festival.id}" class="manage-btn mt-3 w-full px-3 py-2 text-sm font-bold bg-[#01ff1d] text-[#090f0a] rounded-md">Gestionar</button>
                </div>` : '').join('');
    }

    function renderAllFestivals(filter = '') {
        const lowerFilter = filter.toLowerCase().trim();
        const filtered = AppState.festivals.filter(f =>
            Object.values(f).some(val => String(val).toLowerCase().includes(lowerFilter)) ||
            (f.month && FULL_MONTH_NAMES[f.month] && FULL_MONTH_NAMES[f.month].toLowerCase().includes(lowerFilter))
        );

        if (filtered.length === 0) {
            festivalsTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-gray-400">No se encontraron fiestas.</td></tr>`;
            return;
        }

        const grouped = filtered.reduce((acc, f) => {
            (acc[f.province || "Sin Provincia"] = acc[f.province || "Sin Provincia"] || []).push(f);
            return acc;
        }, {});

        festivalsTableBody.innerHTML = Object.keys(grouped).sort().map(provinceName => {
            const provinceFestivalsHtml = grouped[provinceName]
                .sort((a, b) => (parseInt(a.month, 10) - parseInt(b.month, 10)) || a.name.localeCompare(b.name))
                .map(f => {
                    const statusClass = f.status ? f.status.replace(/\s+/g, '-') : 'Pendiente';
                    const rowStatusClass = f.status ? `row-status-${statusClass}` : '';
                    return `
                        <tr class="bg-[#0c140d] border-b border-gray-800 hover:bg-gray-800/60 ${rowStatusClass}">
                            <td class="p-4"><div class="status-dot status-${statusClass}-dot" title="${f.status}"></div></td>
                            <th scope="row" class="px-6 py-4 font-medium text-white">${f.name}</th>
                            <td class="px-6 py-4 text-gray-300">${FULL_MONTH_NAMES[f.month]}</td>
                            <td class="px-6 py-4 text-gray-300">${f.location}</td>
                            <td class="px-6 py-4 text-gray-300">${f.province}</td>
                            <td class="px-6 py-4 text-gray-300">${f.status}</td>
                            <td class="px-6 py-4"><button data-id="${f.id}" class="manage-btn font-medium text-[#01ff1d] hover:underline">Gestionar</button></td>
                        </tr>`;
                }).join('');
            return `<tr class="province-header"><td colspan="7">${provinceName}</td></tr>${provinceFestivalsHtml}`;
        }).join('');
    }

    // --- MODALES ---
    function openEditModal(id) {
        const f = getFestivalById(id);
        if (!f) return;
        modalReadOnlyName.textContent = f.name;
        modalReadOnlyMonth.textContent = FULL_MONTH_NAMES[f.month] || 'N/A';
        modalReadOnlyLocation.textContent = f.location;
        modalReadOnlyProvince.textContent = f.province;
        editId.value = f.id;
        editContactName.value = f.contactName || '';
        editContactPhone.value = f.contactPhone || '';
        editEmail.value = f.email || '';
        editStatus.value = f.status;
        editNotes.value = f.notes || '';
        modal.classList.remove('hidden', 'opacity-0');
        setTimeout(() => modal.querySelector('.modal-content').classList.remove('-translate-y-10'), 10);
    }

    function closeEditModal() {
        modal.classList.add('opacity-0');
        modal.querySelector('.modal-content').classList.add('-translate-y-10');
        setTimeout(() => { modal.classList.add('hidden'); editForm.reset(); editId.value = ''; }, 250);
    }

    function openAddModal() {
        addFiestaForm.reset();
        addFiestaModal.classList.remove('hidden', 'opacity-0');
        setTimeout(() => addFiestaModal.querySelector('.modal-content').classList.remove('-translate-y-10'), 10);
    }

    function closeAddModal() {
        addFiestaModal.classList.add('opacity-0');
        addFiestaModal.querySelector('.modal-content').classList.add('-translate-y-10');
        setTimeout(() => { addFiestaModal.classList.add('hidden'); addFiestaForm.reset(); }, 250);
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        viewTasksBtn.addEventListener('click', () => { AppState.currentView = 'tasks'; render(); });
        viewAllBtn.addEventListener('click', () => { AppState.currentView = 'all'; render(); });
        addFiestaBtn.addEventListener('click', openAddModal);
        searchInput.addEventListener('input', e => { if (AppState.currentView === 'all') renderAllFestivals(e.target.value); });
        document.body.addEventListener('click', e => {
            if (e.target.closest('.manage-btn')) openEditModal(parseInt(e.target.closest('.manage-btn').dataset.id));
        });

        // Edit Modal
        cancelBtn.addEventListener('click', closeEditModal);
        closeModalButton.addEventListener('click', closeEditModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeEditModal(); });
        editForm.addEventListener('submit', async e => {
            e.preventDefault();
            const id = parseInt(editId.value);
            if (isNaN(id)) return;
            const success = await updateFestivalInBackend({
                id,
                contactName: editContactName.value.trim(),
                contactPhone: editContactPhone.value.trim(),
                email: editEmail.value.trim(),
                status: editStatus.value,
                notes: editNotes.value.trim(),
            });
            if (success) { closeEditModal(); render(); }
        });

        // Add Modal
        cancelAddBtn.addEventListener('click', closeAddModal);
        closeAddModalButton.addEventListener('click', closeAddModal);
        addFiestaModal.addEventListener('click', e => { if (e.target === addFiestaModal) closeAddModal(); });
        addFiestaForm.addEventListener('submit', async e => {
            e.preventDefault();
            const data = {
                name: addName.value.trim(),
                month: parseInt(addMonth.value),
                location: addLocation.value.trim(),
                province: addProvince.value.trim(),
                contactName: addContactNameInput.value.trim(),
                contactPhone: addContactPhoneInput.value.trim(),
                email: addEmailInput.value.trim(), // Corregido para usar la variable correcta del input de email del modal de agregar
                notes: addNotesInput.value.trim(),
                // status se establece en backend
            };
            if (!data.name || !data.month || !data.location || !data.province) {
                alert("Nombre, Mes, Lugar y Provincia son obligatorios."); return;
            }
            const created = await addFiestaToBackend(data);
            if (created) { closeAddModal(); AppState.currentView = 'all'; loadData(); /* Recarga y renderiza todo */ }
        });
    }

    // --- INICIALIZACIÓN ---
    async function initApp() {
        console.log("DK Fest Tracker: Inicializando...");
        const criticalElements = [tasksView, allFestivalsView, viewTasksBtn, viewAllBtn, addFiestaBtn, tasksGrid, festivalsTableBody, searchInput, modal, editForm, addFiestaModal, addFiestaForm];
        if (criticalElements.some(el => !el)) {
            alert("Error: Faltan elementos del DOM. App no puede iniciar."); return;
        }
        setupEventListeners();
        await loadData(); // Carga inicial y primer renderizado
        console.log("DK Fest Tracker: App inicializada.");
    }

    initApp();
});
