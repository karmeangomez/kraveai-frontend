# KraveAI Frontend

Este es el paquete completo del frontend de KraveAI. Estructura modular, lista para conectar con backend en Render y desplegar vía Netlify.

## Contenido
- `index.html`: Pantalla principal con botones funcionales.
- `styles.css`: Estilos globales del sistema (tema oscuro).
- `theme.js`: Control centralizado de colores y visuales.
- `manifest.json`: Configuración como app web (PWA para iOS).
- `netlify.toml`: Configuración Netlify para routing.
- `modules/`: Contiene los módulos por red social y funciones internas.
- `assets/icons/`: Logos de redes sociales y modo bestia.
- `modules/clientes/`: Base de ficha y lista de clientes.

## Cómo usar
1. Sube esta carpeta como repositorio a GitHub.
2. Conéctala a Netlify.
3. Verás la app estilo iOS en pantalla completa.

Cualquier archivo puede modificarse por separado. Todos los estilos responden al archivo `theme.js`.