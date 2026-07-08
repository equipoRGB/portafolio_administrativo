import { Router } from 'express';
import multer from 'multer';

import { informacionController } from '../controllers/informacion.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { actualizarInformacionSchema } from '../../../shared/schemas/index.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', informacionController.obtener);

router.put('/', authenticate, validate(actualizarInformacionSchema), informacionController.actualizar);

router.put('/fotografia', authenticate, upload.single('fotografia'), informacionController.actualizarFotografia);

router.delete('/fotografia', authenticate, informacionController.eliminarFotografia);

export default router;
