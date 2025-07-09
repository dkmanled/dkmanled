document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('monthFilter');
    const weekSelect = document.getElementById('weekFilter');
    const searchInput = document.getElementById('searchInput'); // Corregido el ID
    const tableBody = document.getElementById('anniversaryTableBody');
    const noResultsMessage = document.getElementById('no-results-message');

    // Asegurarse de que anniversariesData está disponible globalmente
    let localAnniversaries = window.anniversariesData || [];

    // Para el modal de edición (se completará más adelante)
    const editModal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-title');
    const editForm = document.getElementById('edit-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const closeModalBtn = document.getElementById('close-modal-btn'); // Asumiendo que este es el ID del botón de cerrar en el modal de edición

    // Para el modal de agregar (se completará más adelante)
    const addFiestaBtn = document.getElementById('add-fiesta-btn');
    const addFiestaModal = document.getElementById('add-fiesta-modal');
    const addFiestaForm = document.getElementById('add-fiesta-form');
    const cancelAddBtn = document.getElementById('cancel-add-btn');
    const closeAddModalBtn = document.getElementById('close-add-modal-btn');


    function formatDate(day, month) {
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
        return `${formattedDay}/${formattedMonth}`;
    }

    function getStatusClass(status) {
        switch (status) {
            case 'Exito': return 'bg-green-500';
            case 'Seguimiento': return 'bg-yellow-400';
            case 'Descartado': return 'bg-red-500';
            case 'Pendiente':
            default:
                return 'bg-gray-500';
        }
    }

    function renderTable(dataToDisplay) {
        tableBody.innerHTML = ''; // Limpiar tabla

        if (dataToDisplay.length === 0) {
            noResultsMessage.classList.remove('hidden');
            tableBody.innerHTML = ''; // Asegurar que la tabla esté vacía
        } else {
            noResultsMessage.classList.add('hidden');
            dataToDisplay.forEach((ann, index) => { // Añadir index para usar como ID temporal si no hay IDs únicos
                const row = tableBody.insertRow();
                row.className = 'hover:bg-gray-700 transition-colors duration-150 ease-in-out';

                // Aplicar clases de estado para resaltado de fila
                if (ann.status === 'Exito') {
                    row.classList.add('row-status-Exito');
                } else if (ann.status === 'Seguimiento') {
                    row.classList.add('row-status-Seguimiento');
                } else if (ann.status === 'Descartado') {
                    row.classList.add('row-status-Descartado');
                }
                // Para 'Pendiente', no se añade clase de fondo específica, usará el default.


                row.insertCell().textContent = formatDate(ann.day, ann.month);
                row.cells[0].className = 'px-4 py-2 text-center';

                row.insertCell().textContent = ann.city;
                row.cells[1].className = 'px-4 py-2';

                row.insertCell().textContent = ann.province;
                row.cells[2].className = 'px-4 py-2';

                row.insertCell().textContent = ann.info || '-';
                row.cells[3].className = 'px-4 py-2 max-w-xs truncate';

                row.insertCell().textContent = ann.contactName || '-';
                row.cells[4].className = 'px-4 py-2';

                row.insertCell().textContent = ann.contactPhone || '-';
                row.cells[5].className = 'px-4 py-2';

                row.insertCell().textContent = ann.email || '-';
                row.cells[6].className = 'px-4 py-2';

                row.insertCell().textContent = ann.notes || '-';
                row.cells[7].className = 'px-4 py-2 max-w-xs truncate';

                const statusCell = row.insertCell();
                statusCell.className = 'px-4 py-2 text-center';
                const statusDot = document.createElement('div');
                statusDot.className = `status-dot ${getStatusClass(ann.status)} mx-auto`;
                statusDot.title = ann.status;
                statusCell.appendChild(statusDot);

                const actionCell = row.insertCell();
                actionCell.className = 'px-4 py-2 text-center';
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'px-3 py-1 text-sm font-bold bg-blue-600 text-white rounded-md transition hover:bg-blue-700';
                editButton.dataset.id = ann.id || index; // Usar ID si existe, sino index
                editButton.addEventListener('click', () => openEditModal(ann.id || index));
                actionCell.appendChild(editButton);
            });
        }
    }

    function filterAnniversaries() {
        const selectedMonthValue = monthSelect.value;
        const selectedWeekValue = weekSelect.value;
        const searchTerm = searchInput.value.toLowerCase();

        let filteredResults = localAnniversaries;

        if (selectedMonthValue) {
            const monthNum = parseInt(selectedMonthValue);
            filteredResults = filteredResults.filter(ann => ann.month === monthNum);
        }

        if (selectedWeekValue) {
            const weekNum = parseInt(selectedWeekValue);
            filteredResults = filteredResults.filter(ann => {
                const day = ann.day;
                switch (weekNum) {
                    case 1: return day >= 1 && day <= 7;
                    case 2: return day >= 8 && day <= 14;
                    case 3: return day >= 15 && day <= 21;
                    case 4: return day >= 22 && day <= 28;
                    case 5: return day >= 29;
                    default: return true;
                }
            });
        }

        if (searchTerm) {
            filteredResults = filteredResults.filter(ann =>
                ann.city.toLowerCase().includes(searchTerm) ||
                ann.province.toLowerCase().includes(searchTerm) ||
                ann.info.toLowerCase().includes(searchTerm) ||
                (ann.contactName && ann.contactName.toLowerCase().includes(searchTerm)) ||
                (ann.notes && ann.notes.toLowerCase().includes(searchTerm))
            );
        }
        renderTable(filteredResults);
    }

    // --- Lógica para Modales (a completar) ---

    // Open Edit Modal
    function openEditModal(anniversaryIdOrIndex) {
        const isUsingIndex = typeof anniversaryIdOrIndex === 'number' && !localAnniversaries.find(a => a.id === anniversaryIdOrIndex);
        const anniversary = isUsingIndex
            ? localAnniversaries[anniversaryIdOrIndex]
            : localAnniversaries.find(a => a.id === anniversaryIdOrIndex);

        if (!anniversary) {
            console.error("Aniversario no encontrado:", anniversaryIdOrIndex);
            return;
        }

        // Poblar campos no editables (o que se editan de forma especial)
        document.getElementById('modal-readonly-name').textContent = anniversary.city; // Usamos 'city' como nombre principal aquí
        document.getElementById('modal-readonly-month').textContent = new Date(2000, anniversary.month - 1, 1).toLocaleString('es-ES', { month: 'long' });
        document.getElementById('modal-readonly-location').textContent = anniversary.city; // Repetido, podría ser 'info' o algo más si se desea
        document.getElementById('modal-readonly-province').textContent = anniversary.province;

        // Poblar campos editables del formulario
        document.getElementById('edit-id').value = anniversary.id || anniversaryIdOrIndex; // Guardar el ID o índice
        // Para editar fechas, necesitamos campos específicos en el modal
        // Asumiremos que el modal de edición tendrá campos: edit-day, edit-month
        const editDayInput = document.getElementById('edit-day'); // Necesitas añadir este input al modal HTML
        const editMonthSelect = document.getElementById('edit-month'); // Necesitas añadir este select al modal HTML

        if(editDayInput) editDayInput.value = anniversary.day;
        if(editMonthSelect) editMonthSelect.value = anniversary.month;

        document.getElementById('edit-city').value = anniversary.city; // Añadir input edit-city al modal
        document.getElementById('edit-province').value = anniversary.province; // Añadir input edit-province al modal
        document.getElementById('edit-info').value = anniversary.info; // Añadir textarea edit-info al modal

        document.getElementById('edit-contactName').value = anniversary.contactName || "";
        document.getElementById('edit-contactPhone').value = anniversary.contactPhone || "";
        document.getElementById('edit-email').value = anniversary.email || "";
        document.getElementById('edit-status').value = anniversary.status || "Pendiente";
        document.getElementById('edit-notes').value = anniversary.notes || "";

        modalTitle.textContent = `Gestionar Aniversario: ${anniversary.city}`;
        editModal.classList.remove('hidden', 'opacity-0');
        editModal.querySelector('.modal-content').classList.remove('-translate-y-10');
    }

    // Close Edit Modal
    function closeEditModal() {
        editForm.reset();
        editModal.classList.add('opacity-0');
        editModal.querySelector('.modal-content').classList.add('-translate-y-10');
        setTimeout(() => {
            editModal.classList.add('hidden');
        }, 250);
    }
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeEditModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeEditModal);

    // Handle Edit Form Submission
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const idValue = document.getElementById('edit-id').value;
        // Determinar si el ID es un número (índice) o un ID real si los datos tuvieran IDs únicos.
        // Para este caso, asumimos que si es un número podría ser un índice si no se encuentra un ID.
        let annIndex = localAnniversaries.findIndex(a => (a.id && a.id.toString() === idValue) || (a.id === undefined && localAnniversaries.indexOf(a).toString() === idValue) );

        if (annIndex === -1 && !isNaN(parseInt(idValue))) { // Si no se encontró por ID pero idValue es un número, probar como índice
             const potentialIndex = parseInt(idValue);
             if (potentialIndex >= 0 && potentialIndex < localAnniversaries.length) {
                 // Si el objeto en ese índice no tiene ID o su ID no coincide, se asume que es el índice.
                 if (localAnniversaries[potentialIndex].id === undefined || localAnniversaries[potentialIndex].id.toString() !== idValue ) {
                    // Esta lógica es compleja si los IDs no son consistentes. Simplificamos:
                    // Si el idValue es numérico y no hay `a.id` que coincida, intentamos usarlo como índice si es válido
                 }
             }
        }
         // Re-simplificando la búsqueda del índice:
        const originalId = idValue; // Puede ser el ID real o el índice original pasado a openEditModal
        annIndex = localAnniversaries.findIndex((ann, idx) => (ann.id && ann.id.toString() === originalId) || idx.toString() === originalId);


        if (annIndex !== -1) {
            const dayInput = document.getElementById('edit-day');
            const monthInput = document.getElementById('edit-month');
            const cityInput = document.getElementById('edit-city');
            const provinceInput = document.getElementById('edit-province');
            const infoInput = document.getElementById('edit-info');


            localAnniversaries[annIndex].day = dayInput ? parseInt(dayInput.value) : localAnniversaries[annIndex].day;
            localAnniversaries[annIndex].month = monthInput ? parseInt(monthInput.value) : localAnniversaries[annIndex].month;
            localAnniversaries[annIndex].city = cityInput ? cityInput.value : localAnniversaries[annIndex].city;
            localAnniversaries[annIndex].province = provinceInput ? provinceInput.value : localAnniversaries[annIndex].province;
            localAnniversaries[annIndex].info = infoInput ? infoInput.value : localAnniversaries[annIndex].info;

            localAnniversaries[annIndex].contactName = document.getElementById('edit-contactName').value;
            localAnniversaries[annIndex].contactPhone = document.getElementById('edit-contactPhone').value;
            localAnniversaries[annIndex].email = document.getElementById('edit-email').value;
            localAnniversaries[annIndex].status = document.getElementById('edit-status').value;
            localAnniversaries[annIndex].notes = document.getElementById('edit-notes').value;

            // Si no tenía ID, se le asigna uno nuevo (esto puede pasar si se editó un elemento que fue añadido sin ID explícito)
            if (!localAnniversaries[annIndex].id) {
                localAnniversaries[annIndex].id = localAnniversaries.length > 0 ? Math.max(...localAnniversaries.filter(a=>a.id).map(a => a.id)) + 1 : 1;
            }

            filterAnniversaries(); // Re-renderizar
            closeEditModal();
        } else {
            console.error("No se pudo guardar el aniversario. ID/Índice no encontrado:", idValue);
        }
    });

    // Open Add Modal
    addFiestaBtn.addEventListener('click', () => {
        addFiestaModal.classList.remove('hidden');
        addFiestaModal.classList.remove('opacity-0');
        addFiestaModal.querySelector('.modal-content').classList.remove('-translate-y-10');
    });

    // Close Add Modal
    function closeAddModal() {
        addFiestaForm.reset();
        addFiestaModal.classList.add('opacity-0');
        addFiestaModal.querySelector('.modal-content').classList.add('-translate-y-10');
        setTimeout(() => {
            addFiestaModal.classList.add('hidden');
        }, 250); // Coincidir con la duración de la transición
    }
    closeAddModalBtn.addEventListener('click', closeAddModal);
    cancelAddBtn.addEventListener('click', closeAddModal);

    // Handle Add Fiesta Form Submission
    addFiestaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAnniversary = {
            day: parseInt(document.getElementById('add-day').value),
            month: parseInt(document.getElementById('add-month').value),
            city: document.getElementById('add-city').value,
            province: document.getElementById('add-province').value,
            info: document.getElementById('add-info').value,
            contactName: document.getElementById('add-contactName').value,
            contactPhone: document.getElementById('add-contactPhone').value,
            email: document.getElementById('add-email').value,
            status: document.getElementById('add-status').value,
            notes: document.getElementById('add-notes').value,
            id: localAnniversaries.length > 0 ? Math.max(...localAnniversaries.map(a => a.id || 0)) + 1 : 1 // Generar nuevo ID
        };
        localAnniversaries.push(newAnniversary);
        // Aquí podrías llamar a una función para guardar los datos si tuvieras persistencia
        filterAnniversaries(); // Re-renderizar la tabla
        closeAddModal();
    });

    // --- Event Listeners para filtros ---
    monthSelect.addEventListener('change', filterAnniversaries);
    weekSelect.addEventListener('change', filterAnniversaries);
    searchInput.addEventListener('input', filterAnniversaries);

    // Inicialización
    renderTable(localAnniversaries);
});
