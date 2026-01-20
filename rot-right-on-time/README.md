# ROT  
### RIGHT ON TIME — Appointment Scheduling Platform (Backend)

---

## Project Overview

ROT (Right On Time) is a RESTful backend API for an appointment scheduling platform that allows users to book services from multiple service providers through a single application.

This backend is responsible for user and provider authentication, profile management, services, and appointment scheduling. It supports bookings created by users as well as appointment management performed by providers.

The API was built following REST principles and is designed to be consumed by a separate frontend application.

---

## Objectives

- Provide a secure backend for appointment scheduling
- Handle authentication and authorization using JWT
- Support two user roles: user and provider
- Manage provider profiles and services
- Allow users to create and manage appointments
- Allow providers to manage services and appointment status
- Apply modern backend development practices using Node.js and Express.js

---

## User Roles

### User
- Register and authenticate
- View own profile
- Update personal data
- Browse service providers
- Create appointments
- View and cancel own appointments

### Provider
- Register and authenticate
- View and update provider profile
- Create and manage services
- View all provider appointments
- Update appointment status

---

## Technologies Used

### Backend
- Node.js
- Express.js
- JWT (JSON Web Token)
- bcrypt

### Database
- MongoDB
- Mongoose

---

## System Architecture

The backend follows a client-server architecture:

- Exposes a RESTful API built with Express.js
- Uses MongoDB as a NoSQL database
- Authentication and authorization are handled using JWT
- Access to routes is restricted based on authenticated role (user or provider)

---

## Data Models

### User
- email  
- password  
- name  

### Provider
- email  
- password  
- name  
- isActive  
- services  
- availability  

#### Service
- name  
- price  
- durationMinutes  

### Appointment
- provider  
- user  
- service  
- date  
- startTime  
- endTime  
- notes  
- status  

---

## API Routes

**Base URL:**  
`http://localhost:5005/api`

Protected routes require the header:

```
Authorization: Bearer <TOKEN>
```

---

### Health Check

- GET `/api` — API health check

---

### Authentication

- POST `/api/auth/signup/user` — Register a new user
- POST `/api/auth/signup/provider` — Register a new provider
- POST `/api/auth/login` — Authenticate user or provider and return JWT

---

### Users

- GET `/api/users/me` — Get authenticated user profile
- PUT `/api/users/me` — Update authenticated user profile
- GET `/api/users/me/appointments` — List authenticated user appointments

---

### Providers

- GET `/api/providers` — List all providers (public)
- GET `/api/providers/me` — Get authenticated provider profile
- PUT `/api/providers/me` — Update authenticated provider profile
- POST `/api/providers/services` — Create a new service (provider only)

---

### Appointments

- POST `/api/appointments` — Create an appointment (user)
- GET `/api/appointments` — List appointments (user or provider)
- PATCH `/api/appointments/:id/status` — Update appointment status (provider)
- PATCH `/api/appointments/:id/cancel` — Cancel appointment (user)

---

## Authentication & Authorization

This API uses JWT-based authentication.

After login, the token must be sent in the Authorization header:

```
Authorization: Bearer <TOKEN>
```

Access to routes is controlled by middleware based on the authenticated role.

---

## Running the Project Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory

```env
PORT=5005
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

4. Start the development server

```bash
npm run dev
```

The API will be available at:

```
http://localhost:5005/api
```

---

## Academic Disclaimer

This project was developed for academic purposes only and is not intended for commercial use.
