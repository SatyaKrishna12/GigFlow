# API Documentation

**Base URL:** `http://localhost:5000/api`

---

## Authentication

### Register
```
POST /api/auth/register
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "test123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Login
```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "test123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

Token automatically set in HTTP-only cookie

---

### Get Current User (Protected)
```
GET /api/auth/me
```

**Headers:** Cookie with JWT token

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### Logout
```
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Gigs

### Get All Gigs
```
GET /api/gigs?search=keyword
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "gigs": [
    {
      "_id": "...",
      "title": "Build Website",
      "description": "...",
      "budget": 5000,
      "status": "open",
      "clientId": { ... }
    }
  ]
}
```

---

### Create Gig (Protected)
```
POST /api/gigs
```

**Request:**
```json
{
  "title": "Build E-commerce Site",
  "description": "Need full-stack developer",
  "budget": 5000
}
```

**Response (201):**
```json
{
  "success": true,
  "gig": { ... }
}
```

---

### Get Gig Details
```
GET /api/gigs/:id
```

**Response (200):**
```json
{
  "success": true,
  "gig": { ... }
}
```

---

### Get My Gigs (Protected)
```
GET /api/gigs/my/all
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "gigs": [ ... ]
}
```

---

### Get Gig Bids (Protected, Owner Only)
```
GET /api/gigs/:id/bids
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "bids": [
    {
      "_id": "...",
      "freelancerId": { "name": "Jane" },
      "amount": 4500,
      "proposal": "...",
      "status": "pending"
    }
  ]
}
```

---

## Bids

### Get All Bids (Protected)
```
GET /api/bids
```

**Response (200):**
```json
{
  "success": true,
  "bids": [ ... ]
}
```

---

### Submit Bid (Protected)
```
POST /api/bids
```

**Request:**
```json
{
  "gigId": "...",
  "amount": 4500,
  "proposal": "I have 5 years experience..."
}
```

**Response (201):**
```json
{
  "success": true,
  "bid": { ... }
}
```

---

### Get My Bids (Protected)
```
GET /api/bids/my/all
```

**Response (200):**
```json
{
  "success": true,
  "bids": [ ... ]
}
```

---

### Hire Freelancer (Protected, Owner Only)
```
PUT /api/bids/:id/hire
```

**Response (200):**
```json
{
  "success": true,
  "message": "Freelancer hired successfully",
  "bid": { ... },
  "gig": { ... }
}
```

Sends real-time WebSocket notification to freelancer

---

## WebSocket Events

### Connect
```javascript
socket.emit('join', userId);
```

### Notification
```javascript
socket.on('notification', (data) => {
  // { message: "You have been hired...", gig: {...} }
});
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, token required"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "You do not have permission"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

---

## Authentication

All protected routes require JWT token in HTTP-only cookie.

**Token Expiration:** 24 hours

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"john@test.com","password":"test123"}'
```

### Create Gig
```bash
curl -X POST http://localhost:5000/api/gigs \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Build App","description":"Need dev","budget":5000}'
```
