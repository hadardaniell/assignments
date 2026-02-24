import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "./routes-tsoa/routes"; 
import swaggerDoc from './swagger/swagger.json';
import { errorMiddleware } from './common';
import cors from 'cors';
import path from 'path';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.send('Server is running! Go to /docs for Swagger');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

RegisterRoutes(app); 

app.use(errorMiddleware);

export default app;