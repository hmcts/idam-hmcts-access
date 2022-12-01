#!/usr/bin/env node
import fs from 'fs';
import https from 'https';
import path from 'path';
import { app } from './app';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('server');
const port: number = parseInt(process.env.PORT || '3100', 10);

if (app.locals.developmentMode) {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
  const sslOptions = {
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
  };

  const server = https.createServer(sslOptions, app);
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });
}
