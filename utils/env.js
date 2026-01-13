export function requiredEnv(name) {
    const value = process.env[name];
    if (!value) {
      throw new Error(
        `[ENV ERROR] Environment variable ${name} is required but not set`
      );
    }
    return value;
  }  