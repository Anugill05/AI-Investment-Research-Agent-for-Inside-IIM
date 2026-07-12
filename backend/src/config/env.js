import dotenv from "dotenv";
dotenv.config();

function get(name, fallback = undefined) {
  return process.env[name] ?? fallback;
}

export const env = {
  PORT: get("PORT", "5000"),
  NODE_ENV: get("NODE_ENV", "development"),
  CLIENT_URL: get("CLIENT_URL", "http://localhost:5173"),
  DATABASE_URL: get("DATABASE_URL"),
  JWT_SECRET: get("JWT_SECRET", "dev_secret_change_me"),
  JWT_EXPIRES_IN: get("JWT_EXPIRES_IN", "7d"),
  GEMINI_API_KEY: get("GEMINI_API_KEY"),
  GEMINI_MODEL: get("GEMINI_MODEL", "gemini-flash-latest"),
  GNEWS_API_KEY: get("GNEWS_API_KEY"),
  FEAR_GREED_API_URL: get("FEAR_GREED_API_URL", "https://api.alternative.me/fng/"),
};

export default env;
