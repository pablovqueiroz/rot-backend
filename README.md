## 🧩 Project Ecosystem

- 🌐 **Frontend** → https://github.com/pablovqueiroz/rot-frontend
- ⚙️ **Backend** → https://github.com/pablovqueiroz/rot-backend


<h1 align="center">ROT — RIGHT ON TIME  </h1>
<p align="center">
  <img src="assets/images/logo-rot.png" width="200" alt="Project Logo">
</p>
 
<p align="center">
  Appointment Scheduling Platform - Backend API
</p>

<p align="center" style="font-size: 20px;">
  🌍 <a href="https://right-on-time.netlify.app/">Live Demo</a>
</p>


## What is ROT?

ROT (Right On Time) is the backend system powering an appointment scheduling platform. It's like a digital marketplace where customers can browse service providers and book appointments, while service providers can manage their schedules and availability.

Think of it as the "engine" running behind a user-friendly scheduling application—handling all the logic for bookings, user accounts, and service management.

---

## Main Features

### For Customers
- Sign up and log in securely
- View and manage their profile
- Browse available service providers
- Book appointments at convenient times
- View, modify, or cancel their own appointments

### For Service Providers
- Register and manage their business profile
- Create and manage their services with pricing and duration
- View all customer appointments
- Update appointment status (confirm, complete, or cancel)
- Set availability and manage their schedule

### For the System
- Secure login system (users and providers have separate accounts)
- Image upload capability (using Cloudinary cloud storage)
- Real-time error handling and validation
- Developer-friendly API structure

---

## How It Works

The system uses a **client-server architecture**, meaning:
- The backend (this project) provides APIs that handle all business logic
- A separate frontend application (website/mobile app) connects to these APIs
- Data is stored in MongoDB, a modern database system
- Security is managed through JWT tokens (secure login tokens)

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js |
| **Web Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Security** | JWT (token-based), bcryptjs (password encryption) |
| **File Storage** | Cloudinary |
| **Development** | Nodemon (automatic restart), Morgan (request logging) |

---

## Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB database access
- Cloudinary account (for image uploads)

### Installation

```bash
# Install dependencies
npm install

# Start development server (auto-restart on changes)
npm run dev

# Start production server
npm start
```

The server runs on `http://localhost:5005` by default.

### Environment Setup
Create a `.env` file in the root directory with:
```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
ORIGIN=http://localhost:5173
PORT=5005
```

---

## Project Structure

```
├── models/              # Database structure definitions
│   ├── User.model.js
│   ├── Provider.model.js
│   └── Appointment.model.js
├── routes/              # API endpoints
│   ├── auth.routes.js
│   ├── users.routes.js
│   ├── providers.routes.js
│   ├── appointments.routes.js
│   └── upload.routes.js
├── middlewares/         # Request validation & security
│   ├── jwt.middleware.js
│   ├── role.middleware.js
│   └── upload.middleware.js
├── config/              # Configuration files
├── db/                  # Database connection
├── error-handling/      # Error management
├── tests/               # API testing documentation
└── app.js, server.js    # Application entry points
```

---

## API Overview

The backend provides endpoints organized by functionality:

| Endpoint Group | Purpose |
|---|---|
| `/api/auth` | User registration and login |
| `/api/users` | Customer profile management |
| `/api/providers` | Provider profile and service management |
| `/api/appointments` | Booking and appointment management |
| `/api/upload` | Image file uploads |

---

## User Types

### Customer (User)
- Can create an account
- Browse service providers and their offerings
- Book appointments
- Manage their appointment history

### Service Provider
- Can create a business account
- List services with prices and duration
- Accept or manage customer appointments
- View their booking calendar

---

## Security Features

- **Password Encryption**: All passwords are encrypted using bcryptjs
- **Secure Authentication**: JWT tokens ensure only authorized users access their data
- **Role-Based Access**: Customers and providers have different permissions
- **Request Validation**: All incoming data is validated
- **CORS Protection**: Prevents unauthorized cross-origin requests

---

## Development Notes

- The API follows REST principles (standard web API design)
- Uses MongoDB for flexible, scalable data storage
- Includes error handling and validation on all endpoints
- API testing documentation available in `tests/` folder
- Automatically logs all incoming requests for debugging

---

## What Makes This Project Special

✅ **Two-sided marketplace** - Serves both customers and service providers  
✅ **Secure authentication** - Industry-standard JWT security  
✅ **Cloud file storage** - Scalable image uploads via Cloudinary  
✅ **Clean code structure** - Easy to understand and maintain  
✅ **Production-ready** - Proper error handling and logging  

---

## Author

Created as a final project demonstrating full-stack backend development practices.

---

**Last Updated:** January 2026

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

## Academic Disclaimer

This project was developed for academic purposes only and is not intended for commercial use.


## 🧩 Project Ecosystem

- 🌐 **Frontend** → https://github.com/pablovqueiroz/rot-frontend
- ⚙️ **Backend** → https://github.com/pablovqueiroz/rot-backend
<p style="font-size: 20px;">
  🌍 <a href="https://right-on-time.netlify.app/">Live Demo</a>
</p>
