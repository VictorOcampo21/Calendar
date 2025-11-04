# 🛠️ Guía de Desarrollo

Esta guía contiene información específica para desarrolladores que trabajen en el proyecto Calendar.

## 📁 Estructura de Carpetas Detallada

### Backend (`/backend`)
```
backend/
├── config/              # Configuraciones
│   └── db.js           # Configuración de Sequelize
├── controllers/         # Controladores de la API
│   └── calendar.controller.js
├── models/             # Modelos de base de datos
│   └── Event.js
├── routes/             # Definición de rutas
│   ├── calendar.routes.js
│   ├── money.routes.js
│   └── category.routes.js
├── services/           # Lógica de negocio
├── middleware/         # Middleware personalizado
├── app.js              # Configuración de Express
├── server.js           # Punto de entrada
└── package.json        # Dependencias del backend
```

### Frontend (`/frontend`)
```
frontend/
├── public/             # Archivos estáticos
├── src/
│   ├── components/     # Componentes reutilizables
│   │   ├── Calendar.js
│   │   └── Calendar.css
│   ├── pages/          # Páginas principales
│   ├── hooks/          # Custom hooks
│   │   └── useCalendar.js
│   ├── services/       # Servicios de API
│   │   └── api.js
│   ├── utils/          # Funciones utilitarias
│   ├── App.js          # Componente principal
│   └── index.js        # Punto de entrada
└── package.json        # Dependencias del frontend
```

## 🔧 Convenciones de Desarrollo

### Nomenclatura de Archivos
- **Componentes React**: PascalCase (`Calendar.js`, `EventCard.js`)
- **Hooks**: camelCase con prefijo `use` (`useCalendar.js`, `useAuth.js`)
- **Servicios**: camelCase (`api.js`, `authService.js`)
- **Controladores**: camelCase con sufijo `.controller.js` (`calendar.controller.js`)
- **Modelos**: PascalCase (`Event.js`, `Category.js`)
- **Rutas**: camelCase con sufijo `.routes.js` (`calendar.routes.js`)

### Estructura de Respuestas API
Todas las respuestas de la API deben seguir este formato:
```json
{
  "success": true|false,
  "message": "Descripción de la operación",
  "data": {} | [],
  "error": "Mensaje de error (solo si success: false)"
}
```

### Variables de Entorno
- **Backend**: Usar `process.env.VARIABLE_NAME`
- **Frontend**: Usar `process.env.REACT_APP_VARIABLE_NAME`

## 🗄️ Base de Datos

### Convenciones
- Nombres de tablas: plural y snake_case (`events`, `user_categories`)
- Nombres de columnas: snake_case (`created_at`, `user_id`)
- Claves primarias: `id` (autoincrement)
- Timestamps: `created_at`, `updated_at` (automáticos con Sequelize)

### Relaciones Esperadas
```
events
├── category_id → categories.id
└── user_id → users.id (futuro)

transactions (money)
├── category_id → categories.id
└── user_id → users.id (futuro)

categories
└── user_id → users.id (futuro)
```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Variables de Producción
Asegúrate de configurar estas variables en producción:

**Backend**:
```env
NODE_ENV=production
PORT=3000
DB_NAME=calendar_prod
DB_USER=prod_user
DB_PASS=secure_password
DB_HOST=production-db-host
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend**:
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 🔍 Debugging

### Backend
```bash
# Con logs detallados
DEBUG=* npm run dev

# Solo logs de la aplicación
DEBUG=app:* npm run dev
```

### Frontend
- Usa React Developer Tools
- Revisa la consola del navegador
- Usa `console.log` estratégicamente

## 📚 Recursos Adicionales

- [Documentación de Express.js](https://expressjs.com/)
- [Documentación de Sequelize](https://sequelize.org/)
- [Documentación de React](https://reactjs.org/)
- [Guía de Hooks de React](https://reactjs.org/docs/hooks-intro.html)