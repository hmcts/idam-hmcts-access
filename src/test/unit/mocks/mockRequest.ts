import { Request } from 'express';

export const mockRequest = (): Request => {
  const req: Partial<Request> = {};
  req.query = {};
  req.body = jest.fn().mockReturnValue(req);
  return req as Request;
};
