import { Response } from 'express';

export const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.header = jest.fn();
  res.attachment = jest.fn();
  res.send = jest.fn();
  res.locals = {};
  res.status = jest.fn();
  return res as Response;
};
