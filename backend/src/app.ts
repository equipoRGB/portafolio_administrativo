import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import informacionRoutes from './routes/informacion.routes.js';
import experienciaRoutes from './routes/experiencia.routes.js';
import herramientaRoutes from './routes/herramienta.routes.js';
import proyectoRoutes from './routes/proyecto.routes.js';
import mensajeRoutes from './routes/mensaje.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/informacion', informacionRoutes);
app.use('/api/experiencias', experienciaRoutes);
app.use('/api/herramientas', herramientaRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/mensajes', mensajeRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
