import { server } from "./app.js";
import { connectDB } from "./src/config/db.js";
import { connect } from "./src/config/rabbitmq.js";
import { connectRedis } from "./src/config/redis.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const mode = process.env.NODE_ENV;

connectDB()
  .then(async () => {
    await connectRedis();
    await connect();
    server.listen(process.env.PORT, () => {
      console.log(
        `Server is running on ${mode} mode and port ${process.env.PORT}`,
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });