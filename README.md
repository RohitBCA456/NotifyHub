# 🔔 NotifyHub

A full-stack, real-time notification platform that delivers notifications to users via **email**, **SMS**, and **in-app alerts**. Built with a modern microservice-inspired architecture using a React frontend and a Node.js/Express backend, powered by RabbitMQ, Redis, Socket.IO, MongoDB, and Docker.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running with Docker](#running-with-docker)
  - [Running Locally](#running-locally)
- [API Reference](#api-reference)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## ✨ Features

- 📧 **Email Notifications** — Delivered via [Resend](https://resend.com/)
- 📱 **SMS Notifications** — Delivered via [Twilio](https://www.twilio.com/)
- ⚡ **Real-Time In-App Notifications** — Powered by Socket.IO
- 🐇 **Message Queue** — RabbitMQ handles asynchronous notification delivery
- 🗄️ **Caching** — Redis for session and data caching
- 🔐 **Authentication** — Clerk-based auth on the frontend, JWT + bcrypt on the backend
- 📊 **Analytics** — Notification delivery analytics dashboard
- 🛡️ **Rate Limiting** — Express Rate Limit (100 requests per 15 minutes)
- 🐳 **Dockerized** — Full Docker Compose setup for development
- 🌐 **CORS Secured** — Configurable allowed origins

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Primary database |
| RabbitMQ (amqplib) | Message queue for async notification dispatch |
| Redis | Caching layer |
| Socket.IO | Real-time WebSocket connections |
| Resend | Email delivery |
| Twilio | SMS delivery |
| JWT + bcrypt | Authentication & password hashing |
| Morgan | HTTP request logging |
| express-rate-limit | API rate limiting |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Redux Toolkit | Global state management |
| TanStack Query | Server state & data fetching |
| Clerk | User authentication |
| Socket.IO Client | Real-time notifications |
| Tailwind CSS v4 | Utility-first styling |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |

---

## 📁 Project Structure

```
NotifyHub/
├── docker-compose.yml
├── .dockerignore
│
├── Backend/
│   ├── app.js                  # Express app setup (middleware, routes, socket init)
│   ├── index.js                # Server entry point
│   ├── urlConfig.js            # URL configuration
│   ├── dockerfile
│   ├── package.json
│   ├── sampleData/             # Seed/sample data
│   └── src/
│       ├── config/
│       │   ├── db.js           # MongoDB connection
│       │   ├── rabbitmq.js     # RabbitMQ connection & queue setup
│       │   ├── redis.js        # Redis client
│       │   └── socket.js       # Socket.IO initialization
│       ├── controllers/        # Route handler logic
│       ├── middleware/         # Auth & other middleware
│       ├── models/             # Mongoose schemas
│       ├── routes/
│       │   ├── user.routes.js
│       │   ├── notification.routes.js
│       │   └── analytics.routes.js
│       ├── services/           # Business logic & third-party integrations
│       ├── workers/            # RabbitMQ consumer workers
│       ├── utils/              # Helper utilities
│       └── test/               # Unit tests
│
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── config.js               # Frontend configuration
    ├── tailwind.config.js
    ├── dockerfile
    ├── package.json
    └── src/
        ├── components/         # Reusable UI components
        ├── pages/              # Route-level page components
        └── ...
```

---

## 🏗️ Architecture Overview

```
User → React Frontend (Vite + Clerk)
         │
         ├── REST API calls ──────► Express Backend (Port 3000)
         │                              │
         └── WebSocket (Socket.IO) ◄────┤
                                        │
                              ┌─────────┼──────────┐
                              ▼         ▼           ▼
                           MongoDB   Redis      RabbitMQ
                                                    │
                                          ┌─────────┴────────┐
                                          ▼                   ▼
                                    Email Worker         SMS Worker
                                    (Resend)             (Twilio)
```

When a notification is triggered, the backend publishes a message to RabbitMQ. Consumer workers pick up the message and dispatch it through the appropriate channel (email, SMS, or in-app via Socket.IO).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [Redis](https://redis.io/) instance
- [RabbitMQ](https://www.rabbitmq.com/) instance
- Accounts for [Resend](https://resend.com/) and [Twilio](https://www.twilio.com/)
- A [Clerk](https://clerk.com/) application

---

### Environment Variables

Create a `.env` file inside the `Backend/` directory:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb://localhost:27017/notifyhub

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://localhost

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

Create a `.env` file inside the `Frontend/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:3000
```

---

### Running with Docker

The easiest way to get started is using Docker Compose, which spins up both the frontend and backend together.

```bash
# Clone the repository
git clone https://github.com/RohitBCA456/NotifyHub.git
cd NotifyHub

# Add your .env files to Backend/ and Frontend/

# Build and start all services
docker-compose up --build
```

| Service  | URL                   |
|----------|-----------------------|
| Backend  | http://localhost:3000 |
| Frontend | http://localhost:5173 |

---

### Running Locally

**Backend:**

```bash
cd Backend
npm install
npm run dev       # Development (nodemon)
# or
npm start         # Production
```

**Frontend:**

```bash
cd Frontend
npm install
npm run dev       # Vite dev server
```

---

## 📡 API Reference

All API routes are prefixed with `/api`.

### Users — `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login and receive JWT |
| GET | `/api/users/profile` | Get current user profile |
| PUT | `/api/users/profile` | Update user profile |

### Notifications — `/api/notifications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/send` | Send a notification |
| GET | `/api/notifications` | Get all notifications for a user |
| PUT | `/api/notifications/:id/read` | Mark notification as read |
| DELETE | `/api/notifications/:id` | Delete a notification |

### Analytics — `/api/analytics`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get notification delivery summary |
| GET | `/api/analytics/by-channel` | Get stats broken down by channel |

> **Note:** Most endpoints require a valid JWT token passed via a cookie or `Authorization` header.

---

## 📜 Scripts

### Backend

```bash
npm start       # Run with node
npm run dev     # Run with nodemon (hot-reload)
npm test        # Run unit tests with Node's built-in test runner
```

### Frontend

```bash
npm run dev     # Start Vite development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow conventional commit messages and ensure all tests pass before submitting a PR.

---

## 📄 License

This project is licensed under the **ISC License**.