import HomeController from '../../../../main/steps/home/HomeController';
import locale from '../../../../main/steps/home/locale';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

describe('HomeController', () => {
  const homeController = new HomeController();

  describe('get', () => {
    test('Renders home nunjucks template', () => {
      const req = mockRequest();
      const res = mockResponse();

      homeController.get(req, res);

      expect(res.render).toHaveBeenCalledWith(expect.any(String), { locale });
    });
  });
});
