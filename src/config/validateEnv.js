const dotenv = require("dotenv");
dotenv.config();

// Validate required environment variables
const requiredEnvs = ["PORT", "MONGO_DB", "ACCESS_TOKEN", "REFRESH_TOKEN"];

const validateEnv = () => {
  const missingEnvs = [];

  requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
      missingEnvs.push(env);
    }
  });

  if (missingEnvs.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missingEnvs.join(", ")}`
    );
  }

  console.log("✅ All environment variables validated successfully");
};

module.exports = validateEnv;
