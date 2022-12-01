import NotFoundController from '../../../../main/steps/not-found/NotFoundController';
import locale from '../../../../main/steps/not-found/locale.json';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

describe('NotFoundController', () => {
  const notFoundController = new NotFoundController();
  const templatePath = 'not-found/view';

  test('Renders not found nunjucks template', () => {
    const req = mockRequest();
    const res = mockResponse();

    notFoundController.any(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.render).toHaveBeenCalledWith(templatePath, { locale });
  });
});
