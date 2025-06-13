# 🚌 Public Transportation Bus System Mo Bus

A scalable and modular public transportation bus tracking system that enables real-time vehicle tracking, route management, and efficient commuter planning.

---

## 🚀 Project Overview

This project simulates a **Public Bus Transportation System**, designed to help both administrators and passengers manage and monitor bus operations efficiently. It includes:

- Real-time location tracking of buses  
- Route and stop management  
- Trip planning for commuters  
- WebSocket/SSE-based live updates  
- Admin panel for bus/route management  

---

## 🧱 Architecture

```Client (Next.js)
⬇️
API Gateway (Express/Go)
⬇️
Backend Services (Go)
├── Bus Service (Kafka + Redis for tracking)
├── Auth Service (JWT + OTP)
└── Route Management
⬇️
Database (PostgreSQL)
⬇️
Redis (Pub/Sub for real-time)
```


---

## 🧩 Modules

| Module          | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| **Location**      | Handles real-time GPS coordinates of buses via Kafka and Redis              |
| **Auth**          | Secure login/signup, OTP, JWT-based access with device verification         |
| **Routes**        | Admin can add/edit/delete routes and stops                                  |
| **Trip Planner**  | Users can choose source/destination stops and get matching trips           |
| **WebSocket/SSE** | Real-time updates for current bus positions                                 |

---

## 🛠 Tech Stack

### Backend

- **Go** (Gin, GORM)  
- **PostgreSQL** (Primary DB)  
- **Redis** (Pub/Sub, Session Management)  
- **Kafka** (Real-time stream of GPS data)  

### Frontend

- **Next.js (React)**  
- **Zustand** for state management  
- **Axios / React Query** for API calls  

### DevOps

- **Docker** (Containerization)  
- **Render** (Deployment options)  
- **Postman** (API Testing)  

---

## ✅ Features

- Real-time Bus Location Tracking  
- Role-based Authentication (Admin, Driver, Commuter)  
- Add/Edit Routes, Stops & Trips  
- Searchable Trip Planner  
- Live ETA and Bus Arrival Predictions  
- Secure with OTP-based device auth and JWT sessions  

---


