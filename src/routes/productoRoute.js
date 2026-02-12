const express = require('express');
const { poblarProductos, poblarCategorias, buscarProducto, buscarCategoria } = require('../controllers/externalController');
const router = express.Router();

router.post('/poblar', poblarProductos);
router.post('/poblarCats', poblarCategorias);
router.get('/buscar/:busqueda', buscarProducto)
router.get('/categoria/:busqueda', buscarCategoria)

module.exports = router;