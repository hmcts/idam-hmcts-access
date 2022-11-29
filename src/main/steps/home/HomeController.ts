import locale from './locale';
import { Request, Response } from 'express';

export default class HomeController {
  private templatePath = __dirname + '/view';

  public get = (req: Request, res: Response): void => {
    res.render(this.templatePath, { locale });
  };
}
