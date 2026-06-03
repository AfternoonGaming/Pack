# API Documentation

## Base URL
```
http://your-backend-api.com/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register
**POST** `/auth/register`

Request body:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string"
  }
}
```

---

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string"
  }
}
```

---

## Server Endpoints

### Get User Servers
**GET** `/servers`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
[
  {
    "id": "uuid",
    "server_name": "string",
    "port": number,
    "status": "running|stopped|error",
    "ip_address": "string",
    "tunnel_token": "string",
    "created_at": "ISO8601 timestamp",
    "updated_at": "ISO8601 timestamp"
  }
]
```

---

### Create Server
**POST** `/servers`

Headers: `Authorization: Bearer <token>`

Request body:
```json
{
  "server_name": "string"
}
```

Response (201):
```json
{
  "message": "Server created successfully",
  "server": {
    "id": "uuid",
    "server_name": "string",
    "port": number,
    "status": "stopped"
  }
}
```

---

### Start Server
**POST** `/servers/:serverId/start`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "message": "Server started",
  "status": "running"
}
```

---

### Stop Server
**POST** `/servers/:serverId/stop`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "message": "Server stopped",
  "status": "stopped"
}
```

---

## User Endpoints

### Get Profile
**GET** `/users/profile`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "id": "user_id",
  "username": "string",
  "email": "string",
  "created_at": "ISO8601 timestamp"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```