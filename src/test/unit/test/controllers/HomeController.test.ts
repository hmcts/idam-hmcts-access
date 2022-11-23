import HomeController from '../../../../main/controllers/HomeController';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

describe('HomeController', () => {
  const homeController = new HomeController();

  describe('get', () => {
    test('Renders home nunjucks template', () => {
      const req = mockRequest();
      const res = mockResponse();

      homeController.get(req, res);

      expect(res.render).toHaveBeenCalledWith('home');
    });
  });
});
