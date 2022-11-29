import url from './urls';
import { Application } from 'express';

export class Routes {
  public enableFor(app: Application): void {
    const cradle = app.locals.container.cradle;
    app.get(url.HOME, cradle.homeController.get);

    // Not Found and Errors
    app.use(cradle.errorController.notFound);
    app.use(cradle.errorController.error);
  }
}
