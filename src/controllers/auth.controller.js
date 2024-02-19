import {pool} from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {SECRET_KEY} from '../config.js';

export const login = async (req, res) => {
    const {usuario, password} = req.body;
    
    try {
        const [rows] = await pool.query(
        "SELECT * FROM usuario WHERE usuario = ? ",
        [usuario]
        );

        if (rows.length <= 0)
        return res.status(404).json({
            mesagge: "Usuario no encontrado",
        });

        const validPassword = bcrypt.compareSync(password, rows[0].password);

        if (!validPassword) {
            return res.status(400).json({
            mesagge: "Contraseña incorrecta",
            });
        }
        const token = jwt.sign({id: rows[0].id_usuario},SECRET_KEY,{
            expiresIn: 60 * 60 * 24
        })

        res.status(200).json({
            token
        });

    } catch (error) {
        return res.status(500).json({
        mesagge: "Error Interno del Servidor",
        error: error.message,
        });
    }

} 

export const registrar = async (req, res) => {
  const { nombres, apellidos, telefono, correo,rol,cargo,usuario,password } = req.body;

  const roles = ["empleado", "cliente"];

  try {
    // Validar campos únicos
    const correoExiste = await pool.query(
      "SELECT id_persona FROM persona WHERE correo = ?",
      [correo]
    );

    if (correoExiste[0].length > 0) {
      return res.status(400).json({
        message: "Correo electronico ya se encuentra registrado",
      });
    }

    const usuarioExiste = await pool.query(
      "SELECT id_usuario FROM usuario WHERE usuario = ?",
      [usuario]
    );

    if (usuarioExiste[0].length > 0) {
      return res.status(400).json({
        message: "Usuario ya se encuentra registrado",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      nombres: 50,
      apellidos: 50,
      telefono: 15,
      correo: 70,
      usuario: 50,
      password: 50,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }
   
    const [rows] = await pool.query(
      "INSERT INTO persona (nombres, apellidos, telefono, correo ) VALUES (?,?,?,?)",
      [nombres, apellidos, telefono, correo]
    );

    //Crear Usuario
    if(usuario && password){

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        let passwordHash = hash;
        console.log(passwordHash)

      await pool.query(
        "INSERT INTO usuario (id_persona,usuario,password) VALUES (?,?,?)",
        [rows.insertId,usuario,passwordHash]
      );

    }

    //Creamos rol 

    if(rol){
      if (!roles.includes(rol)) {
        return res.status(400).json({
          message: "Rol no valido",
        });
      }
        if(rol === "empleado"){
          if(!cargo){
            await pool.query(
            `INSERT INTO empleado (id_persona,cargo) VALUES (?,manicurista)`,
            [rows.insertId]
          );
          }else{
            await pool.query(
            `INSERT INTO empleado (id_persona,cargo) VALUES (?,?)`,
            [rows.insertId,cargo]
          );
          }
          
    }
  }else{
      await pool.query(
        `INSERT INTO cliente (id_persona) VALUES (?)`,
        [rows.insertId]
      );
    }

    console.log('Llego aqui')

    //Respuesta Token
    const token = jwt.sign({id: rows.insertId},SECRET_KEY,{
      expiresIn: 60 * 60 * 24
    })

    res.status(200).json({
        token
    });
   


    } catch (error) {
      return res.status(500).json({
        mesagge: "Error Interno del Servidor",
        error: error.message,
      });
    }
    }
    
