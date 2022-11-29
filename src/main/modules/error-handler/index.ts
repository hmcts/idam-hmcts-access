import { HTTPError } from '../../HttpError';
import { Logger } from '@hmcts/nodejs-logging';
import { Application, Request, Response } from 'express';
const logger = Logger.getLogger('app');

export class ErrorHandler {
  private notFoundTemplate = 'common/not-found';
  private errorTemplate = 'common/error';

  public enableFor(app: Application): void {
    app.use((req, res) => {
      res.status(404);
      res.render(this.notFoundTemplate);
    });

    app.use((err: HTTPError, req: Request, res: Response) => {
      logger.error(`${err.stack || err}`);

      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = app.locals.developmentMode ? err : {};
      res.status(err.status || 500);
      res.render(this.errorTemplate);
    });
  }
}
