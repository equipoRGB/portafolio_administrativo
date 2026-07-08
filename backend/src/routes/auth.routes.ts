import { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, actualizarUsuarioSchema } from '../../../shared/schemas/index.js';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);

router.get('/usuario', authenticate, authController.obtenerUsuario);

router.put('/usuario', authenticate, validate(actualizarUsuarioSchema), authController.cambiarNombreUsuario);

router.put('/contrasena', authenticate, authController.cambiarContrasena);

export default router;
