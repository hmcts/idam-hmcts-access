import locale from './locale.json';
import { Request, Response } from 'express';

export default class HomeController {
  private templatePath = 'home/view';

  public get = (req: Request, res: Response): void => {
    res.render(this.templatePath, { locale });
  };
}
