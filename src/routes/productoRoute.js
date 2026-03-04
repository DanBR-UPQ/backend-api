const express = require('express');
const { poblarProductos, poblarCategorias, buscarProducto, buscarCategoria, verProductos, crearProducto } = require('../controllers/externalController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/poblar', poblarProductos);
router.post('/poblarCats', poblarCategorias);
router.get('/buscar/:busqueda', buscarProducto)
router.get('/categoria/:busqueda', buscarCategoria)
router.get('/verProductos', verProductos)
router.post('/',authMiddleware, crearProducto)

module.exports = router;