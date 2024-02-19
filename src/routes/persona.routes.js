import {Router} from 'express'
import { validacionPersona } from '../middlewares/middleware.js';
import {
    obtenerPersonas,
    obtenerPersona,
    crearPersona,
    eliminarPersona,
    actualizarPersona
} from '../controllers/persona.controller.js'
import { esCliente, esEmpleado, verificarToken } from '../middlewares/authJwt.js';

const router = Router()


router.get('/',verificarToken, esEmpleado,obtenerPersonas);
router.get('/:id',verificarToken, esCliente,obtenerPersona);
router.post('/',verificarToken,esEmpleado,validacionPersona,crearPersona);
router.put('/:id', verificarToken,actualizarPersona);
router.delete('/:id',verificarToken,esEmpleado, eliminarPersona)


export default router