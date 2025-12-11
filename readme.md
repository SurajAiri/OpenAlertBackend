# OpenAlert Backend

A robust Node.js backend service for managing real-time notifications and alerts with Firebase Cloud Messaging (FCM) integration.

## Overview

OpenAlert Backend is a RESTful API service built with Express.js that provides comprehensive user management, authentication, and push notification capabilities. The system leverages Firebase Admin SDK for reliable message delivery and MongoDB for data persistence.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication using `jsonwebtoken`
  - Secure password hashing with `bcryptjs`
  - Role-based access control
- **Firebase Cloud Messaging Integration**

  - Push notification delivery through Firebase Admin SDK
  - Device token management
  - Notification scheduling and tracking

- **RESTful API**

  - Express 5.x framework
  - Structured routing and middleware
  - Standardized response formatting

- **Data Validation**

  - Schema validation using `joi`
  - User input validation

- **Database Management**

  - MongoDB integration with `mongoose`
  - Structured data models for users, devices, and notifications

- **Health Monitoring**
  - Scheduled health checks using `node-cron`
  - Server uptime monitoring

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.0.1
- **Authentication**: JSON Web Tokens (JWT)
- **Push Notifications**: Firebase Admin SDK 13.6.0
- **Validation**: Joi 18.0.2
- **Environment Management**: dotenv 17.2.3
- **HTTP Client**: Axios 1.13.2
- **Task Scheduling**: node-cron 4.2.1

## Project Structure

```
.
├── src/
│   ├── auth/              # Authentication strategies
│   ├── config/            # Configuration files (Firebase, etc.)
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Custom middleware functions
│   ├── models/            # Database schemas
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic layer
│   ├── utils/             # Utility functions
│   └── validators/        # Input validation schemas
├── tests/                 # Test files
├── trials/                # Development/testing scripts
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
└── pnpm-lock.yaml        # Lock file for pnpm
```

## Prerequisites

- Node.js >= 20.19.0
- MongoDB instance
- Firebase project with Admin SDK credentials
- pnpm package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/SurajAiri/OpenAlertBackent.git
cd open_alert_backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables:
   Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/open_alert
JWT_SECRET=your_jwt_secret_here
# Add other required environment variables
```

4. Add Firebase service account credentials:
   Place your Firebase service account JSON file at:

```
src/config/firebase-service-token.json
```

## Usage

### Development Mode

```bash
pnpm dev
```

Runs the server with nodemon for auto-restart on file changes.

### Production Mode

```bash
pnpm start
```

Runs the server in production mode.

## API Documentation

The API follows RESTful conventions with the following base structure:

- **Base URL**: `/api/v1`
- **Authentication**: JWT tokens via `Authorization` header
- **Response Format**: Standardized JSON responses

### Main Endpoints

#### Authentication

- User registration and login
- Token generation and verification
- Google OAuth integration

#### Device Management

- Register device tokens for push notifications
- Update device information
- Remove device tokens

#### Notifications

- Send push notifications via FCM
- Notification history and tracking
- Bulk notification support

#### Webhooks

- Webhook endpoints for external integrations
- Event processing and routing

## Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Generate a service account key
3. Place the JSON file at `src/config/firebase-service-token.json`
4. Configure Firebase settings in `src/config/firebase_config.js`

### MongoDB Connection

The application connects to MongoDB using the URI specified in environment variables. Ensure MongoDB is running and accessible.

## Security

- Passwords are hashed using bcryptjs before storage
- JWT tokens for stateless authentication
- Middleware-based authorization checks
- Service account credentials excluded from version control
- Input validation on all endpoints using Joi schemas

## Development

The project uses:

- **Package Manager**: pnpm
- **Module System**: ES Modules (`"type": "module"`)
- **Development Server**: Nodemon for hot-reloading
- **Code Organization**: MVC pattern with service layer

## Health Monitoring

The service includes automated health checks scheduled via cron jobs to ensure continuous operation and availability monitoring.

## Testing

Place your test files in the `tests/` directory. The project structure supports unit and integration testing.

```bash
# Run tests (configure test script in package.json)
pnpm test
```

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## Support

For issues and questions, please open an issue in the GitHub repository.

---

**Note**: Ensure all sensitive credentials (Firebase tokens, MongoDB URIs, JWT secrets) are stored in environment variables and never committed to version control.
