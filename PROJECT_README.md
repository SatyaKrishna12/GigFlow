# GigFlow - Mini Freelance Marketplace

A full-stack MERN application for a freelance marketplace where clients post gigs and freelancers submit bids. Features real-time notifications, secure authentication, and race condition protection for hiring.

---


##  Overview

GigFlow is a modern freelance marketplace platform that connects clients with skilled freelancers through a transparent bidding system. Clients can post gigs, freelancers can submit bids, and clients can hire the best fit for their projects. The platform includes real-time notifications, secure authentication, and robust data integrity measures.

---

##  Features

### Core Functionality
- **User Authentication** - Secure JWT-based authentication with HTTP-only cookies
- **Gig Management** - Create, view, and search gigs with real-time updates
- **Bidding System** - Freelancers can submit competitive bids on gigs
- **Hiring Process** - Clients can review and hire freelancers
- **Real-time Notifications** - Instant Socket.io notifications when hired
- **Dashboard** - Personalized dashboard showing your gigs and bids
- **Search Functionality** - Search gigs by title or description

### Security & Data Integrity
- **Password Hashing** - bcrypt encryption for secure password storage
- **Protected Routes** - JWT middleware protecting private endpoints
- **Race Condition Prevention** - MongoDB transactions preventing double-hiring
- **CORS Protection** - Configured CORS for secure cross-origin requests
- **Input Validation** - Comprehensive validation on all inputs

### User Experience
- **Responsive Design** - Beautiful Tailwind CSS UI that works on all devices
- **Toast Notifications** - User-friendly feedback for all actions
- **Loading States** - Visual feedback during async operations
- **Modern UI/UX** - Clean, professional landing page and interface
- **Auto-refresh** - Dashboard updates automatically after actions

---

##  Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time WebSocket communication
- **cookie-parser** - Cookie parsing middleware
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client
- **Socket.io-client** - WebSocket client
- **React Toastify** - Toast notifications
- **React Icons** - Icon library

---


##  Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the Backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/gigflow
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running locally or configure MongoDB Atlas URI.

5. **Start the server**
   ```bash
   npm start
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the Frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Application will run on `http://localhost:5173`

---

##  Frontend Pages



### 1. **Login** (`/login`)
- **Purpose**: User authentication
- **Access**: Public
- **Features**:
  - Email and password input
  - Form validation
  - Error handling with toast notifications
  - Automatic redirect to dashboard after login
  - Link to registration page

### 2. **Register** (`/register`)
- **Purpose**: New user registration
- **Access**: Public
- **Features**:
  - Name, email, and password inputs
  - Password confirmation
  - Client-side validation
  - Automatic redirect to login after registration
  - Link to login page

### 3. **Gigs** (`/gigs`)
- **Purpose**: Browse all available gigs
- **Access**: Public
- **Features**:
  - Display all open gigs
  - Search functionality (title/description)
  - Real-time search with debouncing
  - Gig cards showing title, budget, description
  - Click to view gig details
  - Empty state when no gigs found

### 4. **Gig Detail** (`/gigs/:id`)
- **Purpose**: View single gig details and submit bids
- **Access**: Public (viewing), Protected (bidding)
- **Features**:
  - Complete gig information
  - Owner details
  - Bid submission form (for logged-in freelancers)
  - Prevent bidding on own gigs
  - Prevent duplicate bids
  - View submitted bid status

### 5. **Create Gig** (`/create-gig`)
- **Purpose**: Post a new gig
- **Access**: Protected (logged-in users only)
- **Features**:
  - Title, description, and budget inputs
  - Form validation
  - Success/error notifications
  - Automatic redirect to gigs page after creation

### 6. **Dashboard** (`/dashboard`)
- **Purpose**: Manage user's gigs and bids
- **Access**: Protected (logged-in users only)
- **Features**:
  - **Your Gigs** section:
    - List all gigs posted by user
    - View bids received on each gig
    - Hire freelancers from bids
    - See gig status (open/assigned)
  - **Your Bids** section:
    - All bids submitted by user
    - Bid status (pending/hired/rejected)
    - Gig details for each bid
  - Real-time updates when hired
  - Toast notifications for actions

---

##  API Endpoints

### Authentication Endpoints

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/api/auth/register` | Public | Register new user | `{ name, email, password }` | `{ success, message }` |
| POST | `/api/auth/login` | Public | Login user | `{ email, password }` | `{ success, user, token (cookie) }` |
| POST | `/api/auth/logout` | Public | Logout user | - | `{ success, message }` |
| GET | `/api/auth/me` | Protected | Get current user | - | `{ success, user }` |

**Authentication Notes**:
- JWT token stored in HTTP-only cookie
- Token expires in 30 days
- Protected routes require valid token
- Password hashed with bcrypt (10 salt rounds)

---

### Gig Endpoints

| Method | Endpoint | Access | Description | Query/Body | Response |
|--------|----------|--------|-------------|------------|----------|
| GET | `/api/gigs` | Public | Get all open gigs | `?search=keyword` (optional) | `{ success, count, gigs[] }` |
| POST | `/api/gigs` | Protected | Create new gig | `{ title, description, budget }` | `{ success, message, gig }` |
| GET | `/api/gigs/:id` | Public | Get single gig | - | `{ success, gig }` |
| GET | `/api/gigs/my/all` | Protected | Get current user's gigs | - | `{ success, count, gigs[] }` |
| GET | `/api/gigs/:id/bids` | Protected | Get bids for a gig (owner only) | - | `{ success, count, bids[] }` |

**Gig Features**:
- Search supports title and description (case-insensitive regex)
- Gigs populated with owner information (name, email)
- Status: `open` or `assigned`
- Budget validation (must be positive number)

---

### Bid Endpoints

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/api/bids` | Protected | Submit a bid | `{ gigId, price, message }` | `{ success, message, bid }` |
| GET | `/api/bids/:gigId` | Protected | Get bids for gig (owner) | - | `{ success, count, bids[] }` |
| GET | `/api/bids/my/all` | Protected | Get current user's bids | - | `{ success, count, bids[] }` |
| PATCH | `/api/bids/:bidId/hire` | Protected | Hire freelancer (owner) | - | `{ success, message, bid, gig }` |

**Bid Features**:
- Prevents bidding on own gigs
- Prevents duplicate bids (compound unique index)
- Prevents bidding on closed gigs
- Price validation (must be positive)
- Status: `pending`, `hired`, or `rejected`

---

### Real-time Events (Socket.io)

| Event | Direction | Data | Trigger |
|-------|-----------|------|---------|
| `register` | Client → Server | `userId` | User connects (login) |
| `hired` | Server → Client | `{ message, gigTitle, gigId, bidId, timestamp }` | Client hires freelancer |
| `disconnect` | Client → Server | - | User disconnects (logout) |

---



##  Important Features

### 1. Real-time Notifications with Socket.io

**How it Works**:
1. User logs in → Frontend establishes Socket.io connection
2. Frontend emits `register` event with userId
3. Backend stores userId → socketId mapping
4. When a client hires a freelancer, backend emits `hired` event
5. Frontend receives event and displays toast notification
6. Dashboard auto-refreshes to show updated status

**Implementation**:
- **Backend**: `socket.js` manages connections and `emitToUser()` sends targeted events
- **Frontend**: `SocketContext.jsx` provides socket instance to components
- **Dashboard**: Listens for `hired` event and updates UI

**Benefits**:
- No page refresh needed
- Instant feedback
- Better user experience
- Scalable for more event types

---

### 2. Race Condition Prevention (Transactional Integrity)

**Problem**: Multiple admins hiring different freelancers simultaneously could result in double-hiring.

**Solution**: MongoDB transactions with atomic operations

**Benefits**:
- Only one freelancer can be hired per gig
- All database changes happen atomically (all or nothing)
- Rejected bids updated automatically
- Data consistency guaranteed

---

### 3. JWT Authentication with HTTP-only Cookies

**Features**:
- Secure token storage (not accessible via JavaScript)
- Automatic token refresh on requests
- 30-day expiration
- Production-ready with secure flag

**Flow**:
1. User logs in → Backend generates JWT
2. Token stored in HTTP-only cookie
3. Cookie sent automatically with each request
4. Middleware verifies token and attaches user to request
5. Protected routes check for valid user


---

### 4. Advanced Search Functionality

**Features**:
- Search by title or description
- Case-insensitive
- Real-time results
- Debounced input (500ms delay)


**Frontend** (Debounced Input):
- User types → Wait 500ms → Trigger search
- Prevents excessive API calls
- Smooth user experience

---

### 5. Comprehensive Validation

**Backend Validation**:
- Mongoose schema validation
- Custom validators in controllers
- Error handling with meaningful messages

**Frontend Validation**:
- Required field checks
- Email format validation
- Password length validation
- Budget/price positive number validation
- Prevent duplicate submissions


---




## Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/gigflow

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

---


##  Security Features

1. **Password Security**
   - Hashed with bcrypt (10 salt rounds)
   - Never sent in responses

2. **Authentication**
   - HTTP-only cookies (XSS protection)
   - JWT with expiration
   - Secure flag in production

3. **Authorization**
   - Protected routes middleware
   - Owner-only actions (hire, view bids)
   - Cannot bid on own gigs

4. **Data Validation**
   - Input sanitization
   - Type checking
   - Range validation (positive numbers)

5. **CORS**
   - Configured allowed origins
   - Credentials enabled

6. **Error Handling**
   - No sensitive data in error messages
   - Generic messages for security errors
   - Detailed logging server-side

---
