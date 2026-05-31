import { RequestIdMiddleware } from './request-id.middleware';
import { Request, Response } from 'express';

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    req = { headers: {} };
    res = { setHeader: jest.fn() };
    next = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should set x-request-id on the Request headers', () => {
    middleware.use(req as Request, res as Response, next);

    expect(req.headers!['x-request-id']).toBeDefined();
  });

  it('should set X-Request-Id on the Response', () => {
    middleware.use(req as Request, res as Response, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      'X-Request-Id',
      expect.any(String),
    );
  });

  it('should use the same id on both request and response', () => {
    middleware.use(req as Request, res as Response, next);

    const requestId = req.headers!['x-request-id'] as string;
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', requestId);
  });

  it('should call next()', () => {
    middleware.use(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
