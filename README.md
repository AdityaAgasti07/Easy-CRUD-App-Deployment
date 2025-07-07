# Easy-CRUD-App-Deployment

A complete **full-stack CRUD Student Registration System** built with:
- ⚛️ **React** (Frontend)
- ☕ **Spring Boot** (Backend)
- 🐬 **MySQL on AWS RDS** (Database)
- 🐳 **Docker + Docker Compose** (Deployment)

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Key Code Snippets](#key-code-snippets)
- [AWS RDS Setup Steps](#aws-rds-setup-steps)
- [Docker Deployment Steps](#docker-deployment-steps)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 📌 Project Overview

**Easy-CRUD-App-Deployment** is a simple web application that allows students to register through a web form.  
The backend securely stores the data in an **AWS RDS MySQL database**, while **Docker Compose** makes deploying the whole stack smooth and repeatable.

## Key Code Snippets

### Backend: UserController.java

This Java class handles API requests for registering and listing students.

```java
package com.student.registration.student_registration_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.student.registration.student_registration_backend.model.User;
import com.student.registration.student_registration_backend.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET all users
    @GetMapping
    public List getAllUsers() {
        return userRepository.findAll();
    }

    // POST new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
```

How it works:
- @RestController tells Spring Boot this is a REST API controller
- @GetMapping maps GET requests to fetch all users
- @PostMapping maps POST requests to register a new user

**Advanced Concepts:**

**Dependency Injection:** The `@Autowired` annotation implements IoC (Inversion of Control). Spring Boot automatically creates and injects the UserRepository instance at runtime. This follows the Dependency Inversion Principle - high-level modules don't depend on low-level modules.

**RESTful Architecture:** This follows REST principles:
- Resource-based URLs (/api/users)
- HTTP methods map to CRUD operations (GET=Read, POST=Create)
- Stateless communication
- Uniform interface

**Spring Boot Auto-Configuration:** Spring Boot automatically configures the web server, database connections, and dependency injection container based on classpath dependencies. No XML configuration needed.

### Frontend: userService.js

This file handles API calls from React to the backend using Axios.

```javascript
import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};
```

How it works:
- getUsers sends a GET request to fetch users
- createUser sends a POST request to add a new user

**Advanced Concepts:**

**Asynchronous Programming:** The `async/await` pattern handles non-blocking HTTP requests. JavaScript's event loop continues executing other code while waiting for API responses, preventing UI freezing.

**Promise-based HTTP Client:** Axios returns Promises, allowing better error handling and chaining compared to traditional XMLHttpRequest. It automatically handles JSON parsing and provides request/response interceptors.

**Separation of Concerns:** This service layer separates API logic from UI components, following the Single Responsibility Principle. Components only handle rendering, while services handle data fetching.

### Docker Compose: docker-compose.yml

This file defines how to run the backend and frontend services together.

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://${DB_ENDPOINT}:3306/${DB_NAME}
      - SPRING_DATASOURCE_USERNAME=${DB_USERNAME}
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
    depends_on:
      - frontend

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
```

Key Points:
- Defines two services: backend and frontend
- Passes DB connection info through environment variables
- Maps backend to port 8080 and frontend to 5173

**Advanced Concepts:**

**Container Orchestration:** Docker Compose manages multi-container applications as a single unit. It handles service discovery, networking, and dependency management automatically.

**Environment Variable Injection:** Using `${DB_ENDPOINT}` follows the 12-Factor App methodology - configuration should be separate from code. This enables different environments (dev, staging, prod) without code changes.

**Service Dependencies:** The `depends_on` directive ensures proper startup order. Backend waits for frontend to be ready before starting, preventing race conditions.

**Port Mapping:** Container ports (internal) are mapped to host ports (external). This provides isolation while allowing external access. Format: "host_port:container_port"

## AWS RDS Setup Steps

1. Login to AWS Console and open RDS
2. Click Create Database and choose MySQL
3. Set DB instance identifier, master username, and password
4. Make the instance publicly accessible if you want to connect from local
5. In Security Group, allow your IP on port 3306
6. Note down the endpoint, username, and password

## Created DB-Instance

![Screenshot 2025-07-07 034722](https://github.com/user-attachments/assets/cce12d28-3659-4823-991f-8e4e469bcc9b)


**Advanced Database Concepts:**

**RDS Multi-AZ Deployment:** AWS automatically replicates data to a standby instance in different Availability Zone for high availability. If primary fails, automatic failover occurs within 2 minutes.

**Connection Pooling:** Spring Boot uses HikariCP connection pool by default. It maintains a pool of database connections to avoid the overhead of creating/destroying connections for each request.

**ACID Properties:** MySQL ensures Atomicity (all-or-nothing transactions), Consistency (valid state), Isolation (concurrent transactions), and Durability (permanent storage).

**Database Security:** Security Groups act as virtual firewalls. Only allowing port 3306 from your IP follows the principle of least privilege access.

## Docker Deployment Steps

### Install Docker & Docker Compose:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

### Clone the Project:
```bash
git clone https://github.com//Easy-CRUD-App-Deployment.git
cd Easy-CRUD-App-Deployment
```

### Create .env file:
```env
DB_ENDPOINT=<RDS-ENDPOINT>
DB_NAME=<DB-NAME>
DB_USERNAME=<DB-USERNAME>
DB_PASSWORD=<DB-PASSWORD>
```

### Update backend config:
In backend/src/main/resources/application.properties:
```properties
spring.datasource.url=jdbc:mysql://${DB_ENDPOINT}:3306/${DB_NAME}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
```

### Run the containers:
```bash
docker-compose up --build
```

**Advanced Docker Concepts:**

**Image Layering:** Docker images are built in layers. Each Dockerfile instruction creates a new layer. Unchanged layers are cached, making rebuilds faster.

**Container Networking:** Docker creates a bridge network for containers. Services can communicate using service names as hostnames (e.g., backend can call frontend by name).

**Volume Mounting:** Persistent data should use volumes instead of container storage. Containers are ephemeral - data disappears when container stops.

**Build Context:** The `build: ./backend` sends the entire backend directory to Docker daemon. Use `.dockerignore` to exclude unnecessary files.

### Open your app: 
http://localhost:5173

![Screenshot 2025-07-07 034822](https://github.com/user-attachments/assets/d00478a5-bb27-4222-a3a5-1e66fd5694c7)


## Troubleshooting

DB connection not working?
- Ensure RDS is publicly accessible
- Verify your IP is allowed in the Security Group

Port already in use?
- Change ports in docker-compose.yml

Check Logs:
```bash
docker-compose logs
```

Permission denied?
- Run with sudo

## License

Released under the MIT License — free to use, share, and modify.

## Core Architecture Patterns

**MVC Pattern:** Spring Boot follows Model-View-Controller:
- Model: User entity and UserRepository
- View: React frontend components
- Controller: UserController handles requests

**Repository Pattern:** UserRepository abstracts data access logic. This decouples business logic from data persistence, making code more testable and maintainable.

**Microservices Architecture:** Frontend and backend are separate services communicating via HTTP APIs. Each service can be scaled, deployed, and maintained independently.

**Layered Architecture:** 
- Presentation Layer (React)
- API Layer (Spring Boot Controllers)
- Business Logic Layer (Services)
- Data Access Layer (Repositories)
- Database Layer (MySQL)

## Performance Optimization Concepts

**Database Indexing:** MySQL automatically creates indexes on primary keys. Consider adding indexes on frequently queried columns for better performance.

**Caching Strategies:** Implement Redis for session storage or HTTP caching headers to reduce database load.

**Connection Pooling:** HikariCP manages database connections efficiently, reusing connections instead of creating new ones.

**Load Balancing:** For production, use multiple container instances behind a load balancer (nginx, AWS ALB) to distribute traffic.
