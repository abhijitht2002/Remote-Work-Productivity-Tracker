import dotenv from "dotenv";
dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};

if (!env.mongoUri) {
  console.log("MONGO_URI not found");
  process.exit(1);
}

if (!env.jwtSecret) {
  console.log("JWT_SECRET not found");
  process.exit(1);
}

export default env;
