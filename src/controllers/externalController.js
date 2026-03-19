const pool = require('../config/db');



const crearProducto = async (req, res) => {
    const { nombre, precio, stock, descripcion, imagen_url, id_categoria, youtube_id} = req.body

    try {

        if (!nombre || !precio || !id_categoria) {
            res.status(400).json({msg: "El nombre, precio y categoría son obligatorios"})
        }


        await pool.query(`
                INSERT INTO productos
                (nombre, precio, stock, descripcion, imagen_url, id_categoria, youtube_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [nombre, precio, stock || 0, descripcion || '', imagen_url || '', id_categoria, youtube_id || null])

            
        res.status(201).json[{msg: "Producto subido exitosamente"}]

    } catch (e) {
        console.log(e)
        res.status(400).json({err: e})
    }

}


const poblarProductos = async (request, response) => {
    try {
        // Fetch FakeStoreApi
        const apiFetch = await fetch('http://fakestoreapi.com/products');
        const products = await apiFetch.json();
        // console.log(products)

        let inserciones = 0;

        const categoriasDB = await pool.query('SELECT id, nombre FROM categorias');

        const categoriasDict = {}
        for (const cat of categoriasDB.rows) {
        categoriasDict[cat.nombre] = cat.id
        }


        // Destructurar el objeto
        for(const product of products){
            const { title, price, description, image, category} = product;

            const stock = Math.floor(Math.random() * 50) + 1;

            const id_categoria = categoriasDict[category];

            const query = `
                INSERT INTO productos
                (nombre, precio, stock, descripcion, imagen_url, id_categoria)
                VALUES ($1, $2, $3, $4, $5, $6)
            `

            await pool.query(query, [title, price, stock, description, image, id_categoria]);

            inserciones++;
        }
        response.status(200).json(
            {
                mensaje: "Carga masiva exitosa", 
                cantidad: inserciones
            }
        );
    } catch (error) {
        console.log(`Error: ${error}`);
        response.status(500).json({error: error.message})
    }
};


const poblarCategorias = async (req, res) => {
    try {
        const apiFetch = await fetch('http://fakestoreapi.com/products');
        const categorias = await apiFetch.json();
        let inserciones = 0;

        for(const categoria of categorias){
            const {category} = categoria

            const {rows} = await pool.query('SELECT * FROM categorias WHERE nombre = $1', [category])

            if (rows.length === 0) {
                await pool.query('INSERT INTO categorias (nombre) VALUES ($1)', [category])
                inserciones++
            }
        }
        res.status(200).json(
            {
                mensaje: "Carga masiva exitosa", 
                cantidad: inserciones
            }
        );


    } catch(error){
        console.log(`Error: ${error}`);
        res.status(500).json({error: error.message})
    }
}


const buscarProducto = async (req,res) => {
    try {
        const busqueda = req.params.busqueda

        const {rows} = await pool.query(`
            SELECT 
                p.nombre, 
                p.descripcion, 
                c.nombre AS categoria, 
                p.precio, 
                p.stock
            FROM productos p
            JOIN categorias c ON p.id_categoria = c.id
            WHERE p.nombre ILIKE $1 OR p.descripcion ILIKE $1
        `,
        [`%${busqueda}%`]
        )

        res.status(200).json(rows)
    } catch (error){
        console.log(error)
        res.status(500).json({error: error})
    }
}



const buscarCategoria = async (req,res) => {
    try {
        let results = []
        const busqueda = req.params.busqueda

        const {rows} = await pool.query(
            'SELECT nombre FROM categorias WHERE nombre ILIKE $1',
            [`%${busqueda}%`]
        )

        for (const producto of rows){
            results.push(producto.nombre)
        }

        res.status(200).json({resultados: results})
    } catch (error){
        console.log(error)
        res.status(500).json({error: error})
    }
}

const verProductos = async (req,res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.nombre, p.descripcion, c.nombre AS categoria, p.precio, p.stock
            FROM productos p
            JOIN categorias c ON p.id_categoria = c.id
        `)

        res.status(200).json(rows);
    } catch (error){
        console.log(error)
        res.status(500).json({error: error})
    }
}


module.exports = { poblarProductos, poblarCategorias, buscarProducto, buscarCategoria, verProductos, crearProducto };
