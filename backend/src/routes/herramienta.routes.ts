import { Router } from 'express';

import { herramientaController } from '../controllers/herramienta.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  crearCategoriaSchema,
  actualizarCategoriaSchema,
  crearHerramientaSchema,
  actualizarHerramientaSchema,
} from '../../../shared/schemas/index.js';

const router = Router();

router.get('/categorias', herramientaController.obtenerCategorias);

router.post('/categorias', authenticate, validate(crearCategoriaSchema), herramientaController.crearCategoria);

router.put('/categorias/:id', authenticate, validate(actualizarCategoriaSchema), herramientaController.actualizarCategoria);

router.delete('/categorias/:id', authenticate, herramientaController.eliminarCategoria);

router.get('/', herramientaController.obtenerHerramientas);

router.get('/:id', herramientaController.obtenerHerramientaPorId);

router.post('/', authenticate, validate(crearHerramientaSchema), herramientaController.crearHerramienta);

router.put('/:id', authenticate, validate(actualizarHerramientaSchema), herramientaController.actualizarHerramienta);

router.delete('/:id', authenticate, herramientaController.eliminarHerramienta);

export default router;
