import amqp from "amqplib";
import { getDelayMs, isWithinQuietHours } from "../utils/quiteHours.helper.js";
import { sendNotification } from "../controllers/notification.controller.js";
import { Notification } from "../models/notification.model.js";

let channel;
let connection;
let isConsuming = false;

const MAIN_QUEUE = "notification_queue";
const DELAY_QUEUE = "notification_delay_queue";

async function connect() {
  try {
    const RABBIT_URL = process.env.RABBIT_URL;
    connection = await amqp.connect(RABBIT_URL);
    channel = await connection.createChannel();

    await channel.prefetch(1);

    console.log("Connected to RabbitMQ");

    await channel.assertQueue(MAIN_QUEUE, { durable: true });

    await channel.assertQueue(DELAY_QUEUE, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": "",
        "x-dead-letter-routing-key": MAIN_QUEUE,
      },
    });

    connection.on("close", () => {
      console.error("RabbitMQ connection closed. Reconnecting...");
      channel = null;
      isConsuming = false;
      setTimeout(connect, 3000);
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    await subscribeToQueue();
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error.message);
    channel = null;
    setTimeout(connect, 5000);
  }
}

async function subscribeToQueue() {
  if (!channel || isConsuming) return;

  isConsuming = true;

  channel.consume(MAIN_QUEUE, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    try {
      if (
        data.quietHours?.enabled &&
        isWithinQuietHours(data.quietHours.start, data.quietHours.end)
      ) {
        const delay = getDelayMs(data.quietHours.end);

        channel.sendToQueue(DELAY_QUEUE, Buffer.from(JSON.stringify(data)), {
          expiration: delay.toString(),
          persistent: true,
        });

        channel.ack(msg);
        return;
      }

      await sendNotification(data);
      await Notification.findByIdAndUpdate(data._id, { status: "sent" });

      channel.ack(msg);
      console.log("Notification processed");
    } catch (error) {
      console.error("Error processing notification:", error.message);

      if (error.code === "EAUTH") {
        channel.ack(msg);
        return;
      }

      channel.nack(msg, false, true);
    }
  });
}

async function publishToQueue(queueName, message) {
  if (!channel) await connect();
  if (!channel) return;

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}

export { connect, publishToQueue };
