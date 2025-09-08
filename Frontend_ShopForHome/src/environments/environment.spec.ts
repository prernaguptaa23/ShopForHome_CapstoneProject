import { environment } from './environment';

describe('environment', () => {
  it('should have apiUrl and production properties', () => {
    expect(environment).toBeTruthy();
    expect(environment.apiUrl).toBeDefined();
    expect(environment.production).toBeDefined();
  });
});
