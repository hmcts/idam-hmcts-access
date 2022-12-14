import HomeController from '../../../../main/steps/home/HomeController';
import locale from '../../../../main/steps/home/locale.json';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

describe('HomeController', () => {
  const homeController = new HomeController();
  const templatePath = 'home/view';

  describe('get', () => {
    test('Renders home nunjucks template', () => {
      const req = mockRequest();
      const res = mockResponse();

      homeController.get(req, res);

      expect(res.render).toHaveBeenCalledWith(templatePath, { locale });
    });
  });
});
