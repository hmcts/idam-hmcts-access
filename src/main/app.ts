import * as path from 'path';

import { HTTPError } from './HttpError';
import { AppInsights } from './modules/appinsights';
import { Container } from './modules/awilix';
import { HealthCheck } from './modules/health';
import { Helmet } from './modules/helmet';
import { Nunjucks } from './modules/nunjucks';
import { PropertiesVolume } from './modules/properties-volume';

import { WebpackDev } from './modules/webpack-dev';
import routes from './routes';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';

const { Logger } = require('@hmcts/nodejs-logging');

export const app = express();
app.locals.developmentMode = process.env.NODE_ENV !== 'production';

const logger = Logger.getLogger('app');

new PropertiesVolume().enableFor(app);
new AppInsights().enable();
new Nunjucks().enableFor(app);
new WebpackDev().enableFor(app);
// secure the application by adding various HTTP headers to its responses
new Helmet().enableFor(app);
new HealthCheck().enableFor(app);
new Container().enableFor(app);

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});
routes(app);

// returning "not found" page for requests with paths not resolved by the router
app.use((req, res) => {
  res.status(404);
  res.render('not-found');
});

// error handler
app.use((err: HTTPError, req: express.Request, res: express.Response) => {
  logger.error(`${err.stack || err}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = app.locals.developmentMode ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
