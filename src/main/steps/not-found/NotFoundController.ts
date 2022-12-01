import locale from './locale.json';
import { Request, Response } from 'express';

export default class NotFoundController {
  private templatePath = 'not-found/view';

  public any = (req: Request, res: Response): void => {
    res.status(404).render(this.templatePath, { locale });
  };
}
