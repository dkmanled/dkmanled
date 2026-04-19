// app.js v2 - DK Fest Tracker
document.addEventListener('DOMContentLoaded', () => {
    const AppState = {
        festivals: [],
        filteredFestivals: [],
        view: 'tasks', // 'tasks', 'all' or 'map'
        selectedMonth: null,
        searchTerm: '',
        map: null,
        mapMarkers: []
    };

    // DOM Elements
    const festivalsGrid = document.getElementById('festivals-grid');
    const searchInput = document.getElementById('search-input');
    const monthChips = document.getElementById('month-chips');
    const viewTitle = document.getElementById('view-title');
    const noResults = document.getElementById('no-results');

    const viewTasksBtn = document.getElementById('view-tasks-btn');
    const viewAllBtn = document.getElementById('view-all-btn');
    const viewMapBtn = document.getElementById('view-map-btn');
    const mapView = document.getElementById('map-view');
    const floatingAddBtn = document.getElementById('floating-add-btn');

    // Modal Elements
    const modal = document.getElementById('festival-modal');
    const festivalForm = document.getElementById('festival-form');
    const modalHeading = document.getElementById('modal-heading');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelFormBtn = document.getElementById('cancel-form-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const googleSearchBtn = document.getElementById('google-search-btn');

    // AI Elements
    const toggleAiBtn = document.getElementById('toggle-ai-btn');
    const aiSection = document.getElementById('ai-section');
    const aiInput = document.getElementById('ai-input');
    const aiExtractBtn = document.getElementById('ai-extract-btn');
    const aiResults = document.getElementById('ai-results');

    const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const PROVINCE_COORDS = {
        "BUENOS AIRES": [-36.6769, -60.5588],
        "CABA": [-34.6037, -58.3816],
        "CIUDAD DE BUENOS AIRES": [-34.6037, -58.3816],
        "CATAMARCA": [-28.4696, -65.7852],
        "CHACO": [-26.3864, -60.7658],
        "CHUBUT": [-43.3002, -68.5944],
        "CORDOBA": [-31.4201, -64.1888],
        "CORRIENTES": [-28.4689, -58.8344],
        "ENTRE RIOS": [-32.0589, -59.2014],
        "FORMOSA": [-24.8949, -59.9324],
        "JUJUY": [-23.1895, -65.292],
        "LA PAMPA": [-37.1319, -65.4469],
        "LA RIOJA": [-29.685, -67.4851],
        "MENDOZA": [-34.6299, -68.5831],
        "MISIONES": [-26.8753, -54.6543],
        "NEUQUEN": [-38.9411, -70.0522],
        "RIO NEGRO": [-40.3344, -67.575],
        "SALTA": [-24.7821, -65.4232],
        "SAN JUAN": [-30.8654, -68.8896],
        "SAN LUIS": [-33.7577, -66.0281],
        "SANTA CRUZ": [-48.8154, -69.9559],
        "SANTA FE": [-30.7069, -60.9498],
        "SANTIAGO DEL ESTERO": [-27.7824, -64.2669],
        "TIERRA DEL FUEGO": [-54.8019, -68.303],
        "TUCUMAN": [-26.8241, -65.2226]
    };

    function normalizeProvince(prov) {
        if (!prov) return "";
        let n = prov.toUpperCase().trim();
        n = n.replace("PROVINCIA DE ", "");
        n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quitar acentos
        if (n.includes("CAPITAL FEDERAL") || n === "CIUDAD AUTONOMA DE BUENOS AIRES") return "CABA";
        if (n === "ISLA APIPE GRANDE") return "CORRIENTES";
        return n;
    }

    // --- INITIALIZATION ---
    async function init() {
        renderMonthChips();
        await fetchFestivals();
        setupEventListeners();
        render();
    }

    // --- DATA FETCHING ---
    async function fetchFestivals() {
        try {
            const response = await fetch('/api/festivals');
            AppState.festivals = await response.json();
            console.log(`Cargados ${AppState.festivals.length} eventos.`);
        } catch (error) {
            showToast('Error al cargar datos', 'error');
        }
    }

    // --- RENDER FUNCTIONS ---
    function render() {
        filterData();
        if (AppState.view === 'map') {
            renderMap();
        } else {
            renderGrid();
        }
        updateUIState();
    }

    function renderMonthChips() {
        monthChips.innerHTML = `<button data-month="all" class="month-chip px-4 py-1 rounded-full bg-slate-800 text-xs font-bold border border-slate-700 whitespace-nowrap active">TODOS</button>`;
        MONTH_NAMES.forEach((month, index) => {
            monthChips.innerHTML += `<button data-month="${index + 1}" class="month-chip px-4 py-1 rounded-full bg-slate-800 text-xs font-bold border border-slate-700 whitespace-nowrap">${month.toUpperCase()}</button>`;
        });
    }

    function filterData() {
        const lowerSearch = AppState.searchTerm.toLowerCase();

        if (AppState.view === 'tasks') {
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

            AppState.filteredFestivals = AppState.festivals.filter(f => {
                const matchesSearch = f.name.toLowerCase().includes(lowerSearch) ||
                                     f.location.toLowerCase().includes(lowerSearch) ||
                                     f.province.toLowerCase().includes(lowerSearch);

                // For tasks, we show current and next month if they are "Pendiente"
                const isUpcoming = (f.month === currentMonth || f.month === nextMonth) && f.status === 'Pendiente';
                return matchesSearch && isUpcoming;
            });

            // Sort by month, then day
            AppState.filteredFestivals.sort((a, b) => {
                if (a.month !== b.month) return a.month - b.month;
                return (a.day || 0) - (b.day || 0);
            });

        } else {
            AppState.filteredFestivals = AppState.festivals.filter(f => {
                const matchesSearch = f.name.toLowerCase().includes(lowerSearch) ||
                                     f.location.toLowerCase().includes(lowerSearch) ||
                                     f.province.toLowerCase().includes(lowerSearch);
                const matchesMonth = !AppState.selectedMonth || f.month === AppState.selectedMonth;
                return matchesSearch && matchesMonth;
            });

            // Sort alphabetically by name
            AppState.filteredFestivals.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    function renderGrid() {
        festivalsGrid.innerHTML = '';
        festivalsGrid.classList.remove('hidden');
        mapView.classList.add('hidden');

        if (AppState.filteredFestivals.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
            AppState.filteredFestivals.forEach(f => {
                const card = createCard(f);
                festivalsGrid.appendChild(card);
            });
        }
    }

    function initMap() {
        if (AppState.map) return;

        AppState.map = L.map('map-container').setView([-38.4161, -63.6167], 4);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(AppState.map);
    }

    function renderMap() {
        festivalsGrid.classList.add('hidden');
        mapView.classList.remove('hidden');
        noResults.classList.add('hidden');

        initMap();

        // Clear markers
        AppState.mapMarkers.forEach(m => AppState.map.removeLayer(m));
        AppState.mapMarkers = [];

        // Group by province
        const byProvince = {};
        AppState.filteredFestivals.forEach(f => {
            const prov = normalizeProvince(f.province);
            if (!byProvince[prov]) byProvince[prov] = [];
            byProvince[prov].push(f);
        });

        Object.keys(byProvince).forEach(prov => {
            const coords = PROVINCE_COORDS[prov];
            if (!coords) return;

            const fests = byProvince[prov];
            const radius = Math.min(25, 8 + Math.sqrt(fests.length) * 2);

            const marker = L.circleMarker(coords, {
                radius: radius,
                fillColor: '#22c55e',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(AppState.map);

            let popupContent = `<div class="p-2 min-w-[200px]"><h4 class="font-bold text-green-400 mb-2 border-b border-slate-700 pb-1">${prov} (${fests.length})</h4>`;
            fests.forEach(f => {
                popupContent += `<div class="mb-2 text-xs">
                    <a href="#" onclick="window.appOpenModalById(${f.id}); return false;" class="font-bold hover:text-green-400 block">${f.name}</a>
                    <span class="text-slate-400">${f.location} - ${f.day || '??'}/${f.month}</span>
                </div>`;
            });
            popupContent += `</div>`;

            marker.bindPopup(popupContent);
            AppState.mapMarkers.push(marker);
        });

        // Trigger resize to fix leaflet grey tiles
        setTimeout(() => AppState.map.invalidateSize(), 100);
    }

    window.appOpenModalById = (id) => {
        const f = AppState.festivals.find(fest => fest.id === id);
        if (f) openModal(f);
    };

    function createCard(f) {
        const div = document.createElement('div');
        div.className = `card relative overflow-hidden rounded-2xl p-5 border-2 shadow-xl cursor-pointer status-${f.status}`;

        // Icon based on status
        let statusIcon = '';
        if (f.status === 'Exito') statusIcon = '✅';
        else if (f.status === 'Seguimiento') statusIcon = '⏳';
        else if (f.status === 'Descartado') statusIcon = '❌';
        else statusIcon = '⚪';

        div.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-white/50">${f.province}</span>
                <span class="text-sm">${statusIcon}</span>
            </div>
            <h3 class="text-lg font-bold leading-tight mb-1 drop-shadow-md">${f.name}</h3>
            <p class="text-sm font-medium text-white/80 mb-4">${f.location}</p>

            <div class="flex flex-wrap items-center gap-2 mt-auto">
                <div class="bg-black/20 rounded-lg px-2 py-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-[10px] font-bold">${f.day || '??'} ${MONTH_NAMES[f.month - 1]}</span>
                </div>
                ${f.directorName ? `
                <div class="bg-black/20 rounded-lg px-2 py-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-[10px] font-bold truncate max-w-[80px]">${f.directorName}</span>
                </div>` : ''}

                <div class="flex gap-1 ml-auto">
                    ${f.contactPhone ? `
                        <a href="tel:${f.contactPhone}" class="p-2 bg-white/20 rounded-full hover:bg-white/40 transition stop-propagation">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </a>
                        <a href="https://wa.me/${f.contactPhone.replace(/\D/g, '')}" target="_blank" class="p-2 bg-green-500/50 rounded-full hover:bg-green-500 transition stop-propagation">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.43 0 9.856-4.426 9.858-9.855.002-5.43-4.425-9.856-9.855-9.856-5.431 0-9.856 4.426-9.858 9.855-.001 1.938.529 3.814 1.532 5.466l-1.005 3.67 3.771-.99c1.62.88 3.326 1.34 5.037 1.34zm10.978-7.419c-.312-.156-1.848-.912-2.134-1.017-.286-.105-.494-.156-.701.156-.207.312-.806 1.017-.988 1.225-.182.208-.364.234-.676.078-.312-.156-1.317-.485-2.51-1.548-.928-.827-1.554-1.849-1.735-2.16-.182-.312-.019-.481.137-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.701-1.691-.961-2.313-.253-.607-.511-.525-.701-.535-.181-.01-.389-.011-.597-.011s-.546.078-.832.39c-.286.312-1.092 1.066-1.092 2.6s1.118 3.015 1.274 3.223c.156.208 2.2 3.36 5.331 4.712.744.321 1.325.513 1.777.657.748.237 1.428.203 1.966.123.6-.089 1.848-.755 2.108-1.483.259-.728.259-1.353.182-1.483-.078-.13-.286-.208-.598-.364z"/>
                            </svg>
                        </a>
                    ` : ''}
                    ${f.facebook ? `
                        <a href="${f.facebook.startsWith('http') ? f.facebook : 'https://' + f.facebook}" target="_blank" class="p-2 bg-blue-600/50 rounded-full hover:bg-blue-600 transition stop-propagation">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                            </svg>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        div.addEventListener('click', () => openModal(f));

        // Prevent modal from opening when clicking action buttons
        div.querySelectorAll('.stop-propagation').forEach(el => {
            el.addEventListener('click', (e) => e.stopPropagation());
        });

        return div;
    }

    function updateUIState() {
        const btns = [viewTasksBtn, viewAllBtn, viewMapBtn];
        btns.forEach(btn => {
            btn.classList.remove('bg-green-500', 'text-[#0f172a]');
            btn.classList.add('bg-slate-800', 'text-slate-300');
        });

        if (AppState.view === 'tasks') {
            viewTasksBtn.classList.add('bg-green-500', 'text-[#0f172a]');
            viewTasksBtn.classList.remove('bg-slate-800', 'text-slate-300');
            viewTitle.textContent = "Próximos Eventos (Pendientes)";
        } else if (AppState.view === 'all') {
            viewAllBtn.classList.add('bg-green-500', 'text-[#0f172a]');
            viewAllBtn.classList.remove('bg-slate-800', 'text-slate-300');
            viewTitle.textContent = AppState.selectedMonth ? `Eventos de ${MONTH_NAMES[AppState.selectedMonth - 1]}` : "Todos los Eventos";
        } else if (AppState.view === 'map') {
            viewMapBtn.classList.add('bg-green-500', 'text-[#0f172a]');
            viewMapBtn.classList.remove('bg-slate-800', 'text-slate-300');
            viewTitle.textContent = "Vista de Mapa";
        }
    }

    // --- MODAL LOGIC ---
    function openModal(f = null) {
        if (f) {
            modalHeading.textContent = "Editar Evento";
            document.getElementById('form-id').value = f.id;
            document.getElementById('form-name').value = f.name;
            document.getElementById('form-day').value = f.day || '';
            document.getElementById('form-month').value = f.month;
            document.getElementById('form-location').value = f.location;
            document.getElementById('form-province').value = f.province;
            document.getElementById('form-directorName').value = f.directorName || '';
            document.getElementById('form-contactPhone').value = f.contactPhone || '';
            document.getElementById('form-email').value = f.email || '';
            document.getElementById('form-facebook').value = f.facebook || '';
            document.getElementById('form-status').value = f.status;
            document.getElementById('form-notes').value = f.notes || '';
            deleteBtn.classList.remove('hidden');
        } else {
            modalHeading.textContent = "Nuevo Evento";
            festivalForm.reset();
            document.getElementById('form-id').value = '';
            document.getElementById('form-month').value = new Date().getMonth() + 1;
            document.getElementById('form-status').value = 'Pendiente';
            deleteBtn.classList.add('hidden');
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Navigation
        viewTasksBtn.addEventListener('click', () => {
            AppState.view = 'tasks';
            render();
        });

        viewAllBtn.addEventListener('click', () => {
            AppState.view = 'all';
            render();
        });

        viewMapBtn.addEventListener('click', () => {
            AppState.view = 'map';
            render();
        });

        floatingAddBtn.addEventListener('click', () => openModal());

        // Search
        searchInput.addEventListener('input', (e) => {
            AppState.searchTerm = e.target.value;
            render();
        });

        // Month Chips
        monthChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.month-chip');
            if (!chip) return;

            document.querySelectorAll('.month-chip').forEach(c => c.classList.remove('active', 'bg-green-500', 'text-[#0f172a]'));
            chip.classList.add('active', 'bg-green-500', 'text-[#0f172a]');

            const month = chip.dataset.month;
            AppState.selectedMonth = month === 'all' ? null : parseInt(month);
            // Switch to 'all' only if we were in 'tasks' view
            if (AppState.view === 'tasks') AppState.view = 'all';
            render();
        });

        // Modal
        closeModalBtn.addEventListener('click', closeModal);
        cancelFormBtn.addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

        festivalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('form-id').value;
            const data = {
                name: document.getElementById('form-name').value,
                day: parseInt(document.getElementById('form-day').value) || null,
                month: parseInt(document.getElementById('form-month').value),
                location: document.getElementById('form-location').value,
                province: document.getElementById('form-province').value,
                directorName: document.getElementById('form-directorName').value,
                contactPhone: document.getElementById('form-contactPhone').value,
                email: document.getElementById('form-email').value,
                facebook: document.getElementById('form-facebook').value,
                status: document.getElementById('form-status').value,
                notes: document.getElementById('form-notes').value
            };

            try {
                const url = id ? `/api/festivals/${id}` : '/api/festivals';
                const method = id ? 'PUT' : 'POST';
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showToast(id ? 'Actualizado correctamente' : 'Agregado correctamente', 'success');
                    await fetchFestivals();
                    closeModal();
                    render();
                }
            } catch (error) {
                showToast('Error al guardar', 'error');
            }
        });

        // Delete button
        deleteBtn.addEventListener('click', async () => {
            const id = document.getElementById('form-id').value;
            if (!id) return;

            if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return;

            try {
                const response = await fetch(`/api/festivals/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    showToast('Evento eliminado', 'success');
                    await fetchFestivals();
                    closeModal();
                    render();
                }
            } catch (error) {
                showToast('Error al eliminar', 'error');
            }
        });

        // Google Search
        googleSearchBtn.addEventListener('click', () => {
            const name = document.getElementById('form-name').value;
            const location = document.getElementById('form-location').value;
            const query = encodeURIComponent(`Director de Cultura ${location} ${name} 2023 2026`);
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
        });

        // AI Toggle
        toggleAiBtn.addEventListener('click', () => {
            aiSection.classList.toggle('hidden');
        });

        // AI Extract
        aiExtractBtn.addEventListener('click', async () => {
            const text = aiInput.value.trim();
            if (!text) return;

            aiExtractBtn.disabled = true;
            aiExtractBtn.textContent = 'PROCESANDO...';

            try {
                const response = await fetch('/api/extract-info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });

                const data = await response.json();
                aiResults.classList.remove('hidden');
                aiResults.innerHTML = `
                    <p class="font-bold text-green-400 mb-1">Datos extraídos:</p>
                    <p>Director: ${data.directorName || '??'}</p>
                    <p>Tel: ${data.contactPhone || '??'}</p>
                    <p>Email: ${data.email || '??'}</p>
                    <button id="apply-ai-btn" class="mt-2 text-green-400 underline font-bold">APLICAR A FORMULARIO</button>
                `;

                document.getElementById('apply-ai-btn').onclick = () => {
                    if (data.directorName) document.getElementById('form-directorName').value = data.directorName;
                    if (data.contactPhone) document.getElementById('form-contactPhone').value = data.contactPhone;
                    if (data.email) document.getElementById('form-email').value = data.email;
                    if (data.facebook) document.getElementById('form-facebook').value = data.facebook;
                    showToast('Datos aplicados', 'info');
                };

            } catch (error) {
                showToast('Error en extracción AI', 'error');
            } finally {
                aiExtractBtn.disabled = false;
                aiExtractBtn.textContent = 'EXTRAER DATOS';
            }
        });
    }

    // --- HELPERS ---
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            info: 'bg-blue-600'
        };
        toast.className = `${colors[type]} text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl transition-all duration-500 translate-y-10 opacity-0 pointer-events-auto`;
        toast.textContent = message;

        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 10);

        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    init();
});
