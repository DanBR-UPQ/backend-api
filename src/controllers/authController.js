const pool = require('../config/db')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const { email, password} = req.body

    try {
        const userExist = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])

        if (userExist.rows.length > 0){
            return res.status(400).json({msj: "El usuario ya existe"})
        }

        const salt = await bcrypt.genSalt(10) // Le pone sal 10 veces
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = await pool.query(
            'INSERT INTO usuarios (email,password) VALUES ($1, $2)',
            [email, passwordHash]
        )

        res.status(201).json({
            msg: "Usuario registrado exitosamente",
            user: newUser.rows[0]
        })


    } catch (error){
        console.log(error)
        res.status(500).json({error: "Error en el servidor"})
    }
}

module.exports = {register}