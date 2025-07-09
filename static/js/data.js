// Array de aniversarios de localidades, con IDs y campos CRM
const anniversariesData = [
    // Enero
    { id: 1, day: 1, month: 1, city: "Villa de Merlo", province: "San Luis", info: "Refundación 1797", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 2, day: 1, month: 1, city: "SILVA", province: "SANTA FE", info: "Fundación 1892.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 3, day: 1, month: 1, city: "VILLA ESPAÑA", province: "BUENOS AIRES", info: "Inauguración estación 1895.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 4, day: 1, month: 1, city: "CARLOS TOMAS SOURIGUES", province: "BUENOS AIRES", info: "Inauguración estación 1872.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 5, day: 1, month: 1, city: "ALPA CORRAL", province: "CÓRDOBA", info: "Referencia a Merced de Tierras (1673). Fecha simbólica.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 6, day: 1, month: 1, city: "VILLA MUGUETA", province: "SANTA FE", info: "Fundación 1892.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 7, day: 1, month: 1, city: "VICENTE LOPEZ", province: "BUENOS AIRES", info: "Referencia a inauguración estación de tren (1863). Municipio creado 1905.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 8, day: 1, month: 1, city: "CARMEN DE ARECO", province: "BUENOS AIRES", info: "Referencia a nombramiento del primer Alcalde de Hermandad (1812).", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 9, day: 2, month: 1, city: "COGHLAN", province: "CIUDAD DE BUENOS AIRES", info: "Referencia a Día del Barrio.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 10, day: 2, month: 1, city: "VILLA BOSCH (EST. JUAN MARIA BOSCH)", province: "BUENOS AIRES", info: "Referencia a Día del Barrio.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 11, day: 2, month: 1, city: "VILLA RAMALLO", province: "BUENOS AIRES", info: "Fundación 1886.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 12, day: 3, month: 1, city: "GENERAL MANSILLA", province: "BUENOS AIRES", info: "Fundación Estación Bartolomé Bavio 1887.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 13, day: 3, month: 1, city: "CONESA", province: "BUENOS AIRES", info: "Fundación 1884.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 14, day: 3, month: 1, city: "TEZANOS PINTO", province: "ENTRE RÍOS", info: "Fundación 1910.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 15, day: 3, month: 1, city: "CORONEL BOGADO", province: "SANTA FE", info: "Fundación 1909.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 16, day: 4, month: 1, city: "José Marmol", province: "BUENOS AIRES", info: "Habilitación estación de tren 1884", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 17, day: 4, month: 1, city: "CORONEL DORREGO", province: "BUENOS AIRES", info: "Fundación 1887.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 18, day: 5, month: 1, city: "Colonia Hinojo", province: "BUENOS AIRES", info: "Llegada de los primeros colonos alemanes del Volga 1878", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 19, day: 7, month: 1, city: "TRES LOMAS", province: "BUENOS AIRES", info: "Fundación 1906.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 20, day: 8, month: 1, city: "CARLOS CASARES", province: "BUENOS AIRES", info: "Fundación 1889.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 21, day: 10, month: 1, city: "GENERAL PACHECO", province: "BUENOS AIRES", info: "Fundación 1876.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 22, day: 12, month: 1, city: "VILLA DOLORES", province: "CÓRDOBA", info: "Fundación 1853", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 23, day: 14, month: 1, city: "BARREAL", province: "SAN JUAN", info: "Fundación 1866.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 24, day: 14, month: 1, city: "SAN HILARIO", province: "FORMOSA", info: "Referencia a Fiesta Patronal (San Hilario).", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 25, day: 19, month: 1, city: "MAQUINCHAO", province: "RÍO NEGRO", info: "Fundación 1905.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 26, day: 20, month: 1, city: "VILLA PEHUENIA", province: "NEUQUÉN", info: "Fundación 1989.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 27, day: 20, month: 1, city: "MOQUEHUE", province: "NEUQUÉN", info: "Parte de Villa Pehuenia.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 28, day: 20, month: 1, city: "SAN FABIAN", province: "SANTA FE", info: "Referencia a Fiesta Patronal (San Fabián).", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 29, day: 21, month: 1, city: "CARHUE", province: "BUENOS AIRES", info: "Fundación 1877.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    { id: 30, day: 22, month: 1, city: "EL MAITEN", province: "CHUBUT", info: "Fundación 1939.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" },
    // ... (AQUÍ DEBES CONTINUAR AGREGANDO EL RESTO DE TUS ~800 ENTRADAS,
    //      ASEGURÁNDOTE DE QUE CADA UNA TENGA UN 'id' ÚNICO Y SECUENCIAL,
    //      Y LOS CAMPOS contactName, contactPhone, email, status, notes INICIALIZADOS)
    // EJEMPLO DEL ÚLTIMO ELEMENTO DE TU LISTA ORIGINAL (DEBERÁS CALCULAR SU ID CORRECTO EN LA SECUENCIA):
    // { id: 830, day: 30, month: 12, city: "PALOMAR", province: "SANTIAGO DEL ESTERO", info: "Fecha de Fundación.", contactName: "", contactPhone: "", email: "", status: "Pendiente", notes: "" }
];

// Este código es para asegurar que todos los objetos tengan los campos necesarios
// y un ID si por alguna razón no se asignaron todos manualmente arriba.
// Lo ideal es que cada objeto en la lista de arriba ya tenga su 'id' y los campos nuevos.
let nextGeneratedId = anniversariesData.length > 0 ? Math.max(0, ...anniversariesData.filter(a => typeof a.id === 'number').map(a => a.id)) + 1 : 1;

anniversariesData.forEach((ann, index) => {
  // Asignar ID si no existe
  if (ann.id === undefined) {
    // Si estamos aquí, significa que la lista de arriba no fue completada manualmente con todos los IDs.
    // Esta es una forma de intentar asignar IDs secuenciales a los restantes.
    // Buscamos el ID más alto ya asignado para continuar la secuencia.
    const maxIdSoFar = anniversariesData
        .filter(a => typeof a.id === 'number')
        .reduce((max, item) => Math.max(max, item.id), 0);
    ann.id = maxIdSoFar + 1 + index; // Esto podría necesitar ajuste si hay huecos o si el index no es fiable.
                                     // La mejor solución es asignar todos los IDs manualmente arriba.
                                     // Para simplificar, si el ID es undefined, se le asigna el siguiente nextGeneratedId
     ann.id = nextGeneratedId++;
  }

  // Asegurar que los campos nuevos existan, con valores por defecto si no están
  ann.contactName = ann.contactName || "";
  ann.contactPhone = ann.contactPhone || "";
  ann.email = ann.email || "";
  ann.status = ann.status || "Pendiente";
  ann.notes = ann.notes || "";
});

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = anniversariesData;
} else {
    window.anniversariesData = anniversariesData;
}
