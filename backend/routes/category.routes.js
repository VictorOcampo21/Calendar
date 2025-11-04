const express = require('express');
const router = express.Router();

// TODO: Implementar controladores de categorías
// const categoryController = require('../controllers/category.controller');

// Rutas para gestión de categorías
router.get('/', (req, res) => {
  res.json({ message: 'Category routes - GET all categories' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Category routes - CREATE new category' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Category routes - GET category ${req.params.id}` });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Category routes - UPDATE category ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Category routes - DELETE category ${req.params.id}` });
});

module.exports = router;