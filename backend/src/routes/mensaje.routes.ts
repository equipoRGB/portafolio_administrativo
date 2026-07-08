import { Router } from 'express';

import { mensajeController } from '../controllers/mensaje.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { crearMensajeSchema, actualizarEstadoMensajeSchema } from '../../../shared/schemas/index.js';

const router = Router();

router.post('/', validate(crearMensajeSchema), mensajeController.crear);

router.get('/', authenticate, mensajeController.obtenerTodos);

router.get('/:id', authenticate, mensajeController.obtenerPorId);

router.put('/:id/estado', authenticate, validate(actualizarEstadoMensajeSchema), mensajeController.actualizarEstado);

router.delete('/:id', authenticate, mensajeController.eliminar);

export default router;
