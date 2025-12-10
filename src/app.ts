import express from 'express';
import recipeRouter from './routes/recipe.routes';

const app = express();

app.use(express.json());

app.use('/api/recipes', recipeRouter);

export default app;
