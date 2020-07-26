import { RejectUnauthorizedMiddleware } from './reject-unauthorized.middleware';

describe('RejectUnauthorizedMiddleware', () => {
  it('should be defined', () => {
    expect(new RejectUnauthorizedMiddleware()).toBeDefined();
  });
});
