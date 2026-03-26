import { server } from "./app.js";
import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const mode = process.env.NODE_ENV;

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(
        `Server is running on ${mode} mode and port ${process.env.PORT}`,
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
