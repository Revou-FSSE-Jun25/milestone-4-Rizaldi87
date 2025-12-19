[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/0UWyaad3)

# Backend API Documentation

## 📌 Overview

This project is a backend REST API built with **NestJS**, featuring:

- JWT Bearer Authentication
- Role-based authorization (ADMIN / USER)
- Account & User management
- Unit testing with Jest
- API documentation using **Postman Collection**

The API is designed with security best practices, ensuring user identity is derived from JWT tokens and not client input.

---

## 🔐 Authentication

The API uses **JWT Bearer Token Authentication**.

### How to authenticate

1. Login using the authentication endpoint
2. Copy the returned `access_token`
3. Use it in requests via HTTP header:

```
Authorization: Bearer <access_token>
```

All secured endpoints require a valid JWT token.

---

## 📂 Postman API Documentation

All API endpoints, request bodies, and responses are fully documented and can be tested via the Postman collection below:

🔗 **Postman**
https://documenter.getpostman.com/view/38143757/2sB3dWqRoN

The Postman collection includes:

- Authentication endpoints
- User endpoints
- Account endpoints
- JWT Bearer token configuration
- Example requests and responses

---

## Users API

### Get Current User Profile

```
GET /users/profile
```

**Auth:** Bearer Token (JWT)

Returns the currently authenticated user's data derived from the JWT payload.

---

### Update Current User Profile

```
PATCH /users/profile
```

**Auth:** Bearer Token (JWT)

Updates the authenticated user's profile information. The user ID is taken from the JWT and cannot be overridden by the client.

---

### Get All Users (ADMIN only)

```
GET /users
```

**Auth:** Bearer Token (JWT)
**Role Required:** ADMIN

Returns a list of all users. Access is restricted to users with the ADMIN role.

---

### Get User by ID

```
GET /users/:id
```

**Auth:** Bearer Token (JWT)
**Role Required:** ADMIN or USER

Returns detailed information about a specific user.

---

## Testing

This project uses **Jest** for unit testing.

### Covered test scenarios

- Authentication success and failure
- Unauthorized access attempts
- Role-based access control
- Core business logic validation

## Key Design Decisions

- JWT payload is the single source of truth for user identity
- Role-based guards prevent unauthorized access
- DTO validation ensures clean and predictable inputs
- Postman is used as the primary API documentation tool

---

## 🚀 Getting Started

```bash
npm install
npm run start:dev
```

Server will run at:

[this url](milestone-4-rizaldi87-production.up.railway.app)

---

## 📄 License

This project is provided for evaluation and learning purposes.
