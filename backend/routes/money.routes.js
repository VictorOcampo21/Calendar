const express = require('express');
const router = express.Router();

// TODO: Implementar controladores de dinero/transacciones
// const moneyController = require('../controllers/money.controller');

// Rutas para gestión de dinero/transacciones
router.get('/', (req, res) => {
  res.json({ message: 'Money routes - GET all transactions' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Money routes - CREATE new transaction' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Money routes - GET transaction ${req.params.id}` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Money routes - UPDATE transaction ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Money routes - DELETE transaction ${req.params.id}` });
});

module.exports = router;