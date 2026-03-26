import { createClient } from "redis";
import { config } from "../../urlConfig.js";

const client = createClient({
  url: config.services.Redis_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.on("connect", () => console.log("Connected to Redis"));

export { client };
