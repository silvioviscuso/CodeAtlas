/**
 * Example test file
 * Demonstrates testing patterns for CodeAtlas backend
 */

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  // Example: Testing a service function
  // it('should authenticate user with GitHub', async () => {
  //   const result = await authService.handleGitHubCallback('test-code');
  //   expect(result).toHaveProperty('token');
  //   expect(result.user).toHaveProperty('email');
  // });
});
