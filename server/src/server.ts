import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';

import app from './app';
import { connectDB } from './db';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const HTTP_PORT = Number(process.env.PORT || 3000);
const HTTPS_PORT = Number(process.env.HTTPS_PORT || 443);

const PORT = Number(process.env.PORT || 3000);

const ENABLE_HTTPS_IN_PROD = process.env.ENABLE_HTTPS_IN_PROD === 'true';

function createHttpsServer() {
  const keyPath =
    process.env.SSL_KEY_PATH ||
    path.join(process.cwd(), 'certs', 'localhost-key.pem');

  const certPath =
    process.env.SSL_CERT_PATH ||
    path.join(process.cwd(), 'certs', 'localhost-cert.pem');

  const key = fs.readFileSync(keyPath);
  const cert = fs.readFileSync(certPath);

  return https.createServer({ key, cert }, app);
}

async function startServer() {
  await connectDB();

  if (NODE_ENV !== "production") {
    http.createServer(app).listen(HTTP_PORT, () => {
      console.log(`Server is running on http://localhost:${HTTP_PORT}`);
      console.log(`Swagger docs available at http://localhost:${HTTP_PORT}/docs`);
    });
    return;
  }
  const keyPath = process.env.SSL_KEY_PATH;
  const certPath = process.env.SSL_CERT_PATH;

  if (!keyPath || !certPath) {
    throw new Error("Missing SSL_KEY_PATH or SSL_CERT_PATH in production");
  }

  const key = fs.readFileSync(keyPath);
  const cert = fs.readFileSync(certPath);

  https.createServer({ key, cert }, app).listen(HTTPS_PORT, () => {
    console.log(`Server is running on https://localhost:${HTTPS_PORT}`);
    console.log(`Swagger docs available at https://localhost:${HTTPS_PORT}/docs`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
