export const env = {
  PORT: process.env.PORT,
  E2B_API_KEY: process.env.E2B_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  E2B_TEMPLATE_ID: process.env.E2B_TEMPLATE_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN:
    process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:8081",
};
