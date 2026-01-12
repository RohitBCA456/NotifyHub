
# NotifyHub

NotifyHub is a real-time notification service designed for third-party applications. It allows apps to send notifications to their users via Email, SMS, and In-App (real-time) channels using a single unified backend. The system is built with scalability and extensibility in mind using event-driven architecture.

## Features

- Multi-channel notifications (Email, SMS, In-App)
- Real-time in-app notifications using Socket.IO
- Third-party app integration using API keys
- Background processing with RabbitMQ
- User preference management (opt-in/out, quiet hours)
- JWT-based authentication for dashboard access
- Modular and scalable backend architecture

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- RabbitMQ
- Socket.IO
- JWT Authentication
- Twilio (SMS)
- Nodemailer (Email)

## Folder Structure

```
Backend/
├── middleware/
│   ├── auth.middleware.js
│   └── socket.middleware.js
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── rabbitmq.js
│   │   └── socket.js
│   ├── controllers/
│   │   ├── analytics.controller.js
│   │   ├── notification.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── app.model.js
│   │   ├── deliveryLogs.model.js
│   │   ├── notification.model.js
│   │   ├── user.model.js
│   │   └── userPreference.model.js
│   ├── routes/
│   │   ├── analytics.routes.js
│   │   ├── notification.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   ├── generateApiKey.js
│   │   └── globalLogger.js
│   └── workers/
│       ├── email.worker.js
│       ├── inapp.worker.js
│       └── sms.worker.js
├── app.js
├── server.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RABBITMQ_URL=your_rabbitmq_url
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=your_twilio_phone
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FRONTEND_URL=http://localhost:3000
```

4. Start the server
```bash
npm run dev
```

## API Routes

### User Routes

- POST `/save-credentials`
- GET `/logout`
- POST `/create-app`

### Notification Routes

- POST `/send-notification`

### Analytics Routes

- Coming soon

## Models Overview

### User
- username
- email
- sessionId
- webToken

### App
- name
- userId
- channel
- apiKey

### Notification
- userId
- appId
- channel (email, sms, push)
- to
- subject
- message
- status

### UserPreference
- email, sms, inapp preferences
- quiet hours configuration

## In-App Notification Architecture

- Uses Socket.IO namespace `/inapp`
- Third-party apps connect using API Key and userId
- Backend emits real-time notifications scoped by appId and userId
- No webhook polling required

## RabbitMQ Workflow

1. Notification request received
2. Notification saved in database
3. Published to RabbitMQ queue
4. Worker processes notification
5. Notification sent via selected channel
6. Status updated in database
7. Real-time status pushed via Socket.IO

## Using NotifyHub as a Third-Party

1. Register and create an app
2. Get generated API Key
3. Use API Key to send notifications
4. Connect to `/inapp` socket namespace for real-time notifications

## Contribution

Contributions are welcome. Please fork the repository and submit a pull request with clear description.
