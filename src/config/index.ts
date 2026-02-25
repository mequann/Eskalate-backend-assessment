export const config = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret",
  DATABASE_URL: process.env.DATABASE_URL || "",
};
