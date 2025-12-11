import express from 'express';
import recipeRouter from './routes/recipe.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import commentsRouter from './routes/comments.routes';

const app = express();

app.use(express.json());

app.use('/api/recipes', recipeRouter);
app.use('/api/comments', commentsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
