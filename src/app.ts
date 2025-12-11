import express from 'express';
import recipeRouter from './routes/recipe.routes';
// import userRouter from './routes/user.tsoa';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "./routes-tsoa/routes"; 
import swaggerDoc from './swagger/swagger.json';


const app = express();

app.use(express.json());

app.use('/api/recipes', recipeRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

RegisterRoutes(app); 

export default app;
