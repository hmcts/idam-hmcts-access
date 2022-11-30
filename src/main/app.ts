import path from 'path';
import { AppInsights } from './modules/appinsights';
import { Container } from './modules/awilix';
import { HealthCheck } from './modules/health';
import { Helmet } from './modules/helmet';
import { LanguageToggle } from './modules/i18n';
import { InfoCheck } from './modules/info';
import { Nunjucks } from './modules/nunjucks';
import { PropertiesVolume } from './modules/properties-volume';
import { Proxy } from './modules/proxy';
import { Routes } from './modules/routes';
import { WebpackDev } from './modules/webpack-dev';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';

export const app = express();

app.locals.developmentMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

new PropertiesVolume().enableFor(app);
new AppInsights().enable();
new Nunjucks().enableFor(app);
new WebpackDev().enableFor(app);
new Helmet().enableFor(app);
new LanguageToggle().enableFor(app);
new Container().enableFor(app);

new HealthCheck().enableFor(app);
new InfoCheck().enableFor(app);
new Proxy().enableFor(app);
new Routes().enableFor(app);
