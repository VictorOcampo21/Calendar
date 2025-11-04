# 📅 Calendar App

Una aplicación de calendario full-stack construida con React y Node.js.

## 🚀 Características

- 📱 Interfaz de usuario responsiva con React
- 🔧 API RESTful con Express.js
- 📊 Base de datos MySQL con Sequelize ORM
- 💰 Gestión de transacciones financieras
- 🏷️ Sistema de categorías
- 📅 Funcionalidades completas de calendario

## 🏗️ Estructura del Proyecto

```
Calendar/
├── backend/                 # API Server (Node.js + Express)
│   ├── config/             # Configuración de base de datos
│   ├── controllers/        # Controladores de la API
│   ├── models/             # Modelos de Sequelize
│   ├── routes/             # Rutas de la API
│   ├── services/           # Lógica de negocio
│   ├── middleware/         # Middleware personalizado
│   ├── app.js              # Configuración de Express
│   ├── server.js           # Punto de entrada del servidor
│   └── package.json        # Dependencias del backend
│
├── frontend/               # Cliente React
│   ├── public/             # Archivos estáticos
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas/Vistas principales
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Servicios API
│   │   ├── utils/          # Utilidades
│   │   └── ...            # Archivos de React estándar
│   └── package.json        # Dependencias del frontend
│
├── shared/                 # Configuraciones compartidas
├── docs/                   # Documentación
├── .env                    # Variables de entorno (no versionado)
├── .gitignore             # Archivos ignorados por Git
└── package.json           # Scripts principales del proyecto
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **MySQL** - Base de datos
- **CORS** - Manejo de políticas CORS
- **dotenv** - Gestión de variables de entorno

### Frontend
- **React** - Biblioteca de UI
- **Axios** - Cliente HTTP
- **React Testing Library** - Testing

## ⚙️ Configuración e Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Calendar
```

### 2. Instalar dependencias
```bash
# Instalar todas las dependencias (backend + frontend)
npm run install:all
```

### 3. Configurar variables de entorno

#### Backend
Copia el archivo de ejemplo y configura tus variables:
```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env`:
```env
PORT=3000
NODE_ENV=development

DB_NAME=tu_basedatos
DB_USER=usuario
DB_PASS=contraseña
DB_HOST=localhost

FRONTEND_URL=http://localhost:3001
```

#### Frontend
Copia el archivo de ejemplo:
```bash
cp frontend/.env.example frontend/.env
```

El archivo `frontend/.env` ya tiene la configuración correcta para desarrollo.

### 4. Configurar la base de datos
1. Crear una base de datos MySQL
2. Actualizar las credenciales en `backend/.env`

## 🚀 Ejecutar la aplicación

### Desarrollo (Backend + Frontend simultáneamente)
```bash
npm run dev
```

### Ejecutar por separado

#### Solo Backend
```bash
npm run backend:dev
```

#### Solo Frontend
```bash
npm run frontend:start
```

### Producción
```bash
# Construir frontend
npm run build

# Ejecutar backend
npm run backend:start
```

## 📡 API Endpoints

### Calendar
- `GET /api/calendar` - Obtener todos los eventos
- `POST /api/calendar` - Crear nuevo evento
- `GET /api/calendar/:id` - Obtener evento específico
- `PUT /api/calendar/:id` - Actualizar evento
- `DELETE /api/calendar/:id` - Eliminar evento

### Money/Transactions
- `GET /api/money` - Obtener todas las transacciones
- `POST /api/money` - Crear nueva transacción
- `GET /api/money/:id` - Obtener transacción específica
- `PUT /api/money/:id` - Actualizar transacción
- `DELETE /api/money/:id` - Eliminar transacción

### Categories
- `GET /api/category` - Obtener todas las categorías
- `POST /api/category` - Crear nueva categoría
- `GET /api/category/:id` - Obtener categoría específica
- `PUT /api/category/:id` - Actualizar categoría
- `DELETE /api/category/:id` - Eliminar categoría

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar backend y frontend en modo desarrollo
- `npm run backend:dev` - Ejecutar solo backend con nodemon
- `npm run backend:start` - Ejecutar backend en modo producción
- `npm run frontend:start` - Ejecutar solo frontend
- `npm run frontend:build` - Construir frontend para producción
- `npm run install:all` - Instalar dependencias en todos los proyectos
- `npm run build` - Construir frontend

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Notas de Desarrollo

- El backend corre en puerto **3000**
- El frontend corre en puerto **3001**
- La comunicación entre frontend y backend está configurada mediante CORS
- Las variables de entorno están separadas por ambiente (backend/frontend)

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.