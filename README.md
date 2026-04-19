# DK Fest Tracker v2

Este repositorio contiene la Versión 2 del rastreador de festivales y aniversarios para DK Laser.

## Características
- **Optimizado para Móvil**: Diseño minimalista basado en tarjetas (Cards).
- **Sincronización en Tiempo Real**: Base de datos centralizada en el servidor (`festivals.json`).
- **Gestión de Contactos**: Campos para Director de Cultura (2023-2026), Teléfono, Email y Facebook.
- **Vista de Mapa**: Visualización geográfica de festivales agrupados por provincia con escalado logarítmico.
- **Acciones Rápidas**: Botones para llamar, enviar WhatsApp o abrir Facebook con un clic.
- **Búsqueda Inteligente**: Botón "Buscar en Google" que genera la consulta ideal para encontrar al responsable de cultura.
- **Integración con Claude AI**: Sección para procesar textos y extraer datos automáticamente.
- **Coloreado Dinámico**: Toda la tarjeta cambia de color según el estado (Éxito, Seguimiento, Descartado).

## Instalación
1. Clonar el repositorio.
2. Instalar dependencias: `pip install -r requirements.txt`.
3. Ejecutar la aplicación: `python app.py`.

## Uso
- La vista principal muestra eventos de los próximos 30 días con estado "Pendiente".
- Usa la barra de búsqueda o los filtros de mes para encontrar cualquier evento.
- Haz clic en una tarjeta para editar o agregar información.
