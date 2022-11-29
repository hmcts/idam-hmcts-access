import { HTTPError } from '../../HttpError';
import locale from './locale';
import { Logger } from '@hmcts/nodejs-logging';
import { Request, Response } from 'express';

export default class ErrorController {
  private templatePath = 'error/view';

  constructor(private logger: Logger) {}

  public notFound = (req: Request, res: Response): void => {
    res.status(404);
    res.render(this.templatePath, { locale: locale.notFound });
  };

  public error = (err: HTTPError, req: Request, res: Response): void => {
    this.logger.error(`${err.stack || err}`);

    res.locals.message = err.message;
    res.status(err.status || 500);
    res.render(this.templatePath, { locale: locale.error });
  };
}
