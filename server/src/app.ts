import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "./routes-tsoa/routes"; 
import swaggerDoc from './swagger/swagger.json';
import { errorMiddleware } from './common';
import cors from 'cors';


const app = express();

app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

RegisterRoutes(app); 

app.use(errorMiddleware);

export default app;
