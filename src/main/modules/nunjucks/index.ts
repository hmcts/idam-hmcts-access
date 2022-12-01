import * as path from 'path';
import * as flags from '../../app/feature-flags/flags';
import * as express from 'express';
import * as nunjucks from 'nunjucks';

export class Nunjucks {
  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');
    nunjucks.configure(path.join(__dirname, '..', '..', 'steps'), {
      autoescape: true,
      watch: app.locals.developmentMode,
      express: app,
    });

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      req.app.locals.container.cradle.flagService
        .getAllFlagValues()
        .then(flagValues => {
          res.locals.flagService = {
            getFlagValue: flagValues,
            flags,
          };
        })
        .finally(next);
    });
  }
}
