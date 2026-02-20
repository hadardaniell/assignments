import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from "./routes-tsoa/routes"; 
import swaggerDoc from './swagger/swagger.json';
import { errorMiddleware } from './common';
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { upload } from './common/multer';

const app = express();

app.use(cors({
  origin: '*', 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email']
}));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/profile');
  }
);

app.get('/', (req, res) => {
  res.send('Server is running! Go to /docs for Swagger');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(upload.any());

RegisterRoutes(app); 

app.use(errorMiddleware);

export default app;