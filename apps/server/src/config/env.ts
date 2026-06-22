export const env = {
  PORT: process.env.PORT,
  E2B_TEMPLATE_ID: process.env.E2B_TEMPLATE_ID,
  CORS_ORIGIN:
    process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:8081",
};
