const express = require('express');
const { poblarProductos, poblarCategorias, buscarProducto, buscarCategoria, verProductos } = require('../controllers/externalController');
const router = express.Router();

router.post('/poblar', poblarProductos);
router.post('/poblarCats', poblarCategorias);
router.get('/buscar/:busqueda', buscarProducto)
router.get('/categoria/:busqueda', buscarCategoria)
router.get('/verProductos', verProductos)

module.exports = router;