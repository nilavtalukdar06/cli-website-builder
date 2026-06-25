export const env = {
  PORT: process.env.PORT,
  E2B_API_KEY: process.env.E2B_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  E2B_TEMPLATE_ID: process.env.E2B_TEMPLATE_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN:
    process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:8081",
  VERIFICATION_URL: process.env.VERIFICATION_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
};
