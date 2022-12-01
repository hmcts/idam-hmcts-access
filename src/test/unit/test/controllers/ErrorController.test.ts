import { HTTPError } from '../../../../main/HttpError';
import ErrorController from '../../../../main/steps/error/ErrorController';
import locale from '../../../../main/steps/error/locale.json';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

describe('ErrorController', () => {
  const mockLogger = {
    error: jest.fn(),
  };
  const errorController = new ErrorController(mockLogger);
  const templatePath = 'error/view';

  test('Renders error nunjucks template', () => {
    const req = mockRequest();
    const res = mockResponse();
    const error = new HTTPError(500, 'Some error');

    errorController.any(error, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(mockLogger.error).toHaveBeenCalledWith(error.stack);
    expect(res.render).toHaveBeenCalledWith(templatePath, { locale });
  });
});
