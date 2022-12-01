import { Response } from 'express';

export const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.attachment = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.locals = {};
  res.status = jest.fn().mockReturnValue(res);
  return res as Response;
};
