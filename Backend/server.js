import { app, server } from "./app.js";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";
import { subscribeToQueue } from "./src/config/rabbitmq.js";
import { sendNotification } from "./src/controllers/notification.controller.js";

subscribeToQueue(sendNotification);


connectDB()
  .then(() => {

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });

    initSocket(server);
    
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
