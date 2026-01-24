import { server } from "./app.js";
import { connectDB } from "./src/config/db.js";
import { subscribeToQueue } from "./src/config/rabbitmq.js";
import { sendNotification } from "./src/controllers/notification.controller.js";

subscribeToQueue(sendNotification);

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
