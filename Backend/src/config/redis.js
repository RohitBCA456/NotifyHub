import { createClient } from "redis";
import { config } from "../../urlConfig.js";

const client = createClient({
  url: config.services.Redis_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();

    console.log(`connected to redis`);
  }
};

export const clearRedis = async () => {
  if (client.isOpen) {
    await client.flushDb();
  }
};

export const closeRedis = async () => {
  if (client.isOpen) {
    await client.quit();
  }
};

export { client };
