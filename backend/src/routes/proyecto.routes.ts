import { Router } from 'express';
import multer from 'multer';

import { proyectoController } from '../controllers/proyecto.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { crearProyectoSchema, actualizarProyectoSchema } from '../../../shared/schemas/index.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/publicados', proyectoController.obtenerPublicados);

router.get('/', authenticate, proyectoController.obtenerTodos);

router.get('/:id', proyectoController.obtenerPorId);

router.post('/', authenticate, validate(crearProyectoSchema), proyectoController.crear);

router.put('/:id', authenticate, validate(actualizarProyectoSchema), proyectoController.actualizar);

router.delete('/:id', authenticate, proyectoController.eliminar);

router.put('/:id/imagen', authenticate, upload.single('imagen'), proyectoController.actualizarImagen);

router.delete('/:id/imagen', authenticate, proyectoController.eliminarImagen);

export default router;
