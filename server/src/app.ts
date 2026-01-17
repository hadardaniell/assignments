import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "./routes-tsoa/routes"; 
import swaggerDoc from './swagger/swagger.json';
import { errorMiddleware } from './common';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const uploadDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// חשיפת הקבצים לצפייה
app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
  res.send('Server is running! Go to /docs for Swagger');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

RegisterRoutes(app); 

app.use(errorMiddleware);

export default app;