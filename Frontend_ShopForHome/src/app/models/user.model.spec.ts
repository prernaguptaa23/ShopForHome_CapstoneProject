import { User } from "./user.model";

describe('User', () => {
  it('should create an instance', () => {
    const user: User = {
      id: 1,
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Test@123',  // optional
      role: 'Customer',
      createdAt: '2025-09-05',
      updatedAt: '2025-09-05'
    };
    expect(user).toBeTruthy();
  });
});
