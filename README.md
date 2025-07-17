# Skillly

Skillly is a full-stack application designed to connect candidates and recruiters, manage job postings, applications, messaging, and more. The project is organized into a backend (Go) and a frontend (React Native), supporting a modern recruitment workflow with real-time chat, user authentication, and skill management.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Testing](#testing)
- [API Documentation](#api-documentation)

---

## Features

- User authentication (candidates & recruiters)
- Profile management for candidates and recruiters
- Job posting and application management
- Real-time chat between users
- Skill and certification management
- Company profiles and reviews
- Matching system for candidates and jobs
- RESTful API with Swagger documentation

---

## Project Structure

```text
skillly/
│
├── back/                # Backend (Go)
│   ├── chat/            # Real-time chat service
│   ├── pkg/             # Main backend logic (handlers, models, utils)
│   ├── test/            # Backend tests
│   ├── main.go          # Backend entry point
│   ├── go.mod           # Go modules
│   ├── docker-compose.yml
│   └── Dockerfile.*     # Docker configurations
│
├── front/               # Frontend (React/React Native)
│   ├── app/             # Main app pages and components
│   ├── components/      # Shared UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # API clients and utilities
│   ├── navigation/      # Navigation setup
│   ├── services/        # API service wrappers
│   ├── types/           # TypeScript types/interfaces
│   ├── assets/          # Images and fonts
│   └── global.css       # Global styles
│
├── README.md            # Project documentation
└── tmp/                 # Temporary files (ignored)
```

---

## Backend Setup

### Prerequisites

- Go (1.24+)
- Docker & Docker Compose (for local DB)
- MongoDB & PostgreSQL (used in tests and production)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<yourusername>/skillly.git
   cd skillly/back
   ```
2. **Install dependencies:**
   ```bash
   go mod download
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your configuration.
4. **Start databases (MongoDB & PostgreSQL):**
   ```bash
   docker compose up
   ```

---

## Frontend Setup

### Prerequisites

- Node.js (16+)
- npm or yarn
- Expo CLI (for React Native)

### Installation

1. **Navigate to the frontend:**
   ```bash
   cd ../front
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
   ```bash
   npx expo start
   ```

---

## Testing

### Backend

- Tests are located in `back/test/`.
- To run backend tests:
  ```bash
  cd back
  go test -v .\test
  ```

---

## API Documentation

- Swagger/OpenAPI documentation is available in `back/docs/`.
- To generate or update Swagger docs:
  ```bash
  cd back
  ./generate-swagger.sh
  ```
- Access the Swagger UI at `/swagger/index.html` endpoint when the backend is running.

---
