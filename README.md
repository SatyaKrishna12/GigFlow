# GigFlow - Freelance Marketplace Platform

## Backend Developer Intern Assignment

---

## Overview

GigFlow is a full-stack MERN application for a freelance marketplace where clients post gigs and freelancers submit bids.

**Features:**
- User authentication with JWT
- Role-based access (Client/Freelancer)
- Create and browse gigs
- Submit and manage bids
- Real-time notifications
- Responsive React UI

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, JWT, bcrypt, Socket.io  
**Frontend:** React 19, Vite, Tailwind CSS, Axios  
**Database:** MongoDB (Mongoose)

---

## Quick Start

### 1. Backend Setup
```bash
cd Backend
npm install

# Create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/gigflow
# JWT_SECRET=your_secret_key
# CLIENT_URL=http://localhost:5173

npm start
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### 3. Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout

### Gigs
- `GET /api/gigs` - Get all gigs
- `POST /api/gigs` - Create gig (Protected)
- `GET /api/gigs/:id` - Get gig details
- `GET /api/gigs/my/all` - Get my gigs (Protected)
- `GET /api/gigs/:id/bids` - Get gig bids (Protected)

### Bids
- `GET /api/bids` - Get all bids (Protected)
- `POST /api/bids` - Submit bid (Protected)
- `GET /api/bids/my/all` - Get my bids (Protected)
- `PUT /api/bids/:id/hire` - Hire freelancer (Protected)

---

## Security Features

- Password hashing with bcrypt
- JWT authentication with HTTP-only cookies
- Protected routes with auth middleware
- Input validation with Mongoose
- CORS configuration

---

## Database Schema

**Users:** name, email, password (hashed)  
**Gigs:** title, description, budget, clientId, status, hiredFreelancerId  
**Bids:** gigId, freelancerId, amount, proposal, status

---

## Assignment Requirements

**Backend:**
- User registration & login with JWT
- Password hashing (bcrypt)
- Role-based access control
- CRUD APIs for Gigs & Bids
- Error handling & validation
- MongoDB database schema
- API documentation

**Frontend:**
- React.js application
- Registration & Login UI
- Protected dashboard
- CRUD operations UI
- Error/success messages

**Security:**
- Secure JWT handling
- Input sanitization
- Scalable structure

---

## Scalability

**Current:** Monolithic MERN app (1-10K users)  
**Future:** Load balancing, Redis caching, database replicas, microservices

---

## Testing

1. Register new user
2. Login
3. Create a gig (Dashboard)
4. Browse gigs
5. Submit a bid
6. Hire a freelancer
7. Receive real-time notification

---

## Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API endpoints reference
- **[PROJECT_README.md](./PROJECT_README.md)** - Detailed setup guide

---

**Thank you for reviewing my submission!**
