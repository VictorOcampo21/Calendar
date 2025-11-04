const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
const calendarRoutes = require('./routes/calendar.routes');
const moneyRoutes = require('./routes/money.routes');
const categoryRoutes = require('./routes/category.routes');

// Usar rutas
app.use('/api/calendar', calendarRoutes);
app.use('/api/money', moneyRoutes);
app.use('/api/category', categoryRoutes);

module.exports = app;
