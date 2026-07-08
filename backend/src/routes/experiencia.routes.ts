import { Router } from 'express';

import { experienciaController } from '../controllers/experiencia.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { crearExperienciaSchema, actualizarExperienciaSchema } from '../../../shared/schemas/index.js';

const router = Router();

router.get('/', experienciaController.obtenerTodas);

router.get('/:id', experienciaController.obtenerPorId);

router.post('/', authenticate, validate(crearExperienciaSchema), experienciaController.crear);

router.put('/:id', authenticate, validate(actualizarExperienciaSchema), experienciaController.actualizar);

router.delete('/:id', authenticate, experienciaController.eliminar);

export default router;
