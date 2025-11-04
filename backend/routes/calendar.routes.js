const express = require('express');
const router = express.Router();

// TODO: Implementar controladores de calendario
// const calendarController = require('../controllers/calendar.controller');

// Rutas para el calendario
router.get('/', (req, res) => {
  res.json({ message: 'Calendar routes - GET all events' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Calendar routes - CREATE new event' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Calendar routes - GET event ${req.params.id}` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Calendar routes - UPDATE event ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Calendar routes - DELETE event ${req.params.id}` });
});

module.exports = router;