process.env.NODE_ENV = 'test';
process.env.MONGODB_URI =
  process.env.TEST_MONGODB_URI ?? 'mongodb://127.0.0.1:27017/gateplus_test';
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? 'test-secret-jwt-untuk-automated-test-gateplus';
process.env.JWT_EXPIRES_IN = '1h';
