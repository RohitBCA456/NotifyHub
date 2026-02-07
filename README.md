
# NotifyHub

NotifyHub is a real-time notification service designed for third-party applications. It allows apps to send notifications to their users via Email, SMS, and In-App (real-time) channels using a single unified backend. The system is built with scalability and extensibility in mind using event-driven architecture.

## 🚀 Live Demo
**[View Live App](https://notifyhub-fh7h.onrender.com)** *(Note: Initial load may take 50s due to Render's free tier spin-up)*

## Features

- Multi-channel notifications: Support for Email (Resend), SMS (Twilio), and In-App (Socket.IO).

- Event-Driven Architecture: High-performance background processing using RabbitMQ.

- Dockerized Backend: Fully containerized backend service for consistent deployment and environment parity.

- Real-time In-App Notifications: Instant delivery using Socket.IO namespaces.

- Third-party Integration: Secure app integration via unique API Keys.

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- RabbitMQ
- Socket.IO
- JWT Authentication
- Twilio (SMS)
- Resend (Email)
- Docker

## Folder Structure

```
├── Backend
│   ├── sampleData
│   │   └── notifications.json
│   ├── src
│   │   ├── config
│   │   │   ├── db.js
│   │   │   ├── rabbitmq.js
│   │   │   └── socket.js
│   │   ├── controllers
│   │   │   ├── analytics.controller.js
│   │   │   ├── notification.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── socket.middleware.js
│   │   ├── models
│   │   │   ├── app.model.js
│   │   │   ├── notification.model.js
│   │   │   ├── user.model.js
│   │   │   └── userPreference.model.js
│   │   ├── routes
│   │   │   ├── analytics.routes.js
│   │   │   ├── notification.routes.js
│   │   │   └── user.routes.js
│   │   ├── services
│   │   │   ├── projectStats.service.js
│   │   │   └── stats.service.js
│   │   ├── utils
│   │   │   ├── generateApiKey.js
│   │   │   ├── quiteHours.helper.js
│   │   │   └── rateLimiter.js
│   │   └── workers
│   │       ├── email.work.js
│   │       ├── inapp.worker.js
│   │       └── sms.worker.js
│   ├── .dockerignore
│   ├── .gitignore
│   ├── app.js
│   ├── dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── Frontend
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── Store
│   │   │   ├── store.js
│   │   │   └── userSlice.js
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── ApiKeyDisplay.jsx
│   │   │   ├── AppWrapper.jsx
│   │   │   ├── Chart.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSectionAboutUs.jsx
│   │   │   ├── HeroSectionDashboard.jsx
│   │   │   ├── HeroSectionDocs.jsx
│   │   │   ├── HeroSectionInProjects.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Notifcation.jsx
│   │   │   ├── RootLayout.jsx
│   │   │   ├── ScrollTop.jsx
│   │   │   ├── UserSync.jsx
│   │   │   └── ViewApiKey.jsx
│   │   ├── context
│   │   │   └── ThemeContext.jsx
│   │   ├── pages
│   │   │   ├── CreateProject.page.jsx
│   │   │   ├── NotificationPreference.page.jsx
│   │   │   ├── Profile.page.jsx
│   │   │   ├── Setting.page.jsx
│   │   │   └── ViewProject.page.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .dockerignore
│   ├── .gitignore
│   ├── README.md
│   ├── dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .dockerignore
├── README.md
└── docker-compose.yml
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
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=your_frontend_url
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
- GET  `/fetch-projects`
- DELETE  `/delete-project`

### Notification Routes

- POST `/send-notification`
- POST `/update-preferences`
- GET  `/get-preferences/:appId`

### Analytics Routes

- GET  `/stats`
- GET  `/project-stats/:projectId`
- GET  `/chart-data/:projectId`

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

# Future Upgrades & Roadmap

This document outlines the planned enhancements for **NotifyHub** to improve performance, reliability, and developer experience.

---

## 1. Performance Optimization (Caching)
**Goal:** Reduce database load and decrease dashboard latency.

- **Redis Integration:** Implement Redis as a caching layer for frequently accessed data such as:
    - User session data (webTokens).
    - Project analytics and notification stats.
    - User preferences (to avoid DB lookups on every notification trigger).
- **Cache Invalidation Strategy:** Implement a TTL (Time-to-Live) and event-based invalidation logic to ensure data consistency between MongoDB and Redis.



---

## 2. DevOps & Engineering Excellence
**Goal:** Automate the release cycle and ensure system stability.

- **CI/CD Pipeline:** Set up **GitHub Actions** to automate the build and deployment process:
    - **Continuous Integration (CI):** Run automated tests on every Pull Request.
    - **Continuous Deployment (CD):** Automatically deploy the Dockerized image to Render/AWS upon successful merge to `main`.
- **Automated Testing:**
    - **Unit Tests:** Test core logic like `quietHours.helper.js` and `generateApiKey.js` using **Jest**.
    - **Integration Tests:** Test API endpoints and RabbitMQ message flow using **Supertest**.
- **Docker Compose for Prod:** Refine the orchestration to include a health-check system for the RabbitMQ and Redis containers.



---

## 3. Documentation & Developer Experience
**Goal:** Make it easier for third-party developers to adopt NotifyHub.

- **Swagger/OpenAPI UI:** Integrate Swagger to provide interactive API documentation directly at `/api-docs`.
- **Demo Video:** Create a high-quality video walkthrough demonstrating:
    - Setting up a new project.
    - Integrating the API key into a third-party app.
    - Real-time notification delivery via Socket.IO.
- **Developer SDK:** Build a lieight NPM package (`notifyhub-node-sdk`) to simplify integration for Node.js developers.

---

## Long-Term Vision
- **Webhooks:** Allow third-party apps to receive status updates (delivered/failed) via webhook callbacks.
- **Advanced Analytics:** Add a "Delivery Heatmap" to show peak notification times.
- **Multi-Tenancy:** Enhanced support for large organizations managing multiple teams.

---
*If you have suggestions for NotifyHub, feel free to open an issue or submit a PR!*

## Contribution

Contributions are welcome. Please fork the repository and submit a pull request with clear description.
