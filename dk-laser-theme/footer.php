</div> <!-- closing #app -->
    <!-- Modal for Editing -->
    <div id="edit-modal" class="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 hidden opacity-0">
        <div class="modal-content transform -translate-y-10 bg-[#0c140d] rounded-lg shadow-2xl w-full max-w-lg mx-4 border-2 border-[#01ff1d]">
            <div class="p-6">
                <h3 id="modal-title" class="text-2xl font-bold text-white mb-4">Gestionar Fiesta</h3>
                <form id="edit-form">
                    <input type="hidden" id="edit-id">

                    <!-- Campos no editables -->
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-400">Nombre Fiesta</label>
                        <p id="modal-readonly-name" class="mt-1 text-white"></p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-400">Mes</label>
                            <p id="modal-readonly-month" class="mt-1 text-white"></p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400">Lugar</label>
                            <p id="modal-readonly-location" class="mt-1 text-white"></p>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-400">Provincia</label>
                        <p id="modal-readonly-province" class="mt-1 text-white"></p>
                    </div>
                    <hr class="border-gray-700 my-4">

                    <!-- Campos editables -->
                    <div class="space-y-4">
                        <div>
                            <label for="edit-contactName" class="block text-sm font-medium text-gray-300">Nombre Contacto</label>
                            <input type="text" id="edit-contactName" class="mt-1 w-full p-2 bg-[#090f0a] border border-gray-700 rounded-md focus:ring-2 focus:ring-[#01ff1d] outline-none placeholder-gray-500">
                        </div>
                        <div>
                            <label for="edit-contactPhone" class="block text-sm font-medium text-gray-300">Teléfono Contacto</label>
                            <input type="text" id="edit-contactPhone" class="mt-1 w-full p-2 bg-[#090f0a] border border-gray-700 rounded-md focus:ring-2 focus:ring-[#01ff1d] outline-none placeholder-gray-500">
                        </div>
                        <div>
                            <label for="edit-email" class="block text-sm font-medium text-gray-300">Email Contacto</label>
                            <input type="email" id="edit-email" class="mt-1 w-full p-2 bg-[#090f0a] border border-gray-700 rounded-md focus:ring-2 focus:ring-[#01ff1d] outline-none placeholder-gray-500">
                        </div>
                        <div>
                            <label for="edit-status" class="block text-sm font-medium text-gray-300">Estado</label>
                            <select id="edit-status" class="mt-1 w-full p-2 bg-[#090f0a] border border-gray-700 rounded-md focus:ring-2 focus:ring-[#01ff1d] outline-none">
                                <option value="Pendiente">Pendiente</option>
                                <option value="Exito">Exito</option>
                                <option value="Seguimiento">Seguimiento</option>
                                <option value="Descartado">Descartado</option>
                            </select>
                        </div>
                        <div>
                            <label for="edit-notes" class="block text-sm font-medium text-gray-300">Notas</label>
                            <textarea id="edit-notes" rows="3" class="mt-1 w-full p-2 bg-[#090f0a] border border-gray-700 rounded-md focus:ring-2 focus:ring-[#01ff1d] outline-none placeholder-gray-500"></textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" id="cancel-btn" class="px-4 py-2 text-sm font-bold text-gray-300 border-2 border-gray-600 rounded-md transition hover:bg-gray-700">Cancelar</button>
                        <button type="submit" class="px-4 py-2 text-sm font-bold bg-[#01ff1d] text-[#090f0a] rounded-md transition hover:bg-opacity-80">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
<?php wp_footer(); ?>
</body>
</html>
