import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  isProduction,

  services: {
    MongoDB_URL: isProduction
      ? process.env.MONGODB_URL
      : "mongodb://localhost:27017",

    Redis_URL: isProduction
      ? process.env.REDIS_URL
      : "redis://localhost:6379",

    RabbitMQ_URL: isProduction
      ? process.env.RABBIT_URL
      : "amqp://localhost:5672",
  },
};
