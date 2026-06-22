export const env = {
  PORT: process.env.PORT,
  CORS_ORIGIN:
    process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:8081",
};
