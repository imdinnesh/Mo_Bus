# 🚌 Mo Bus API

A scalable and modular backend API for the **Mo Bus** transport system, built with **Go**, **Gin**, and **GORM**. This project follows a clean, production-ready, module-based architecture ideal for large-scale applications.

---

## 📁 Folder Structure

```
.
├── cmd/               # Application entrypoints
│   ├── server/        # HTTP server main
│   └── worker/        # Worker for background jobs (e.g. cron)
│
├── config/            # Loads environment variables into typed config structs
│
├── internal/          # Business logic (modularized)
│   └── user/          # Example module
│       ├── dto.go         # Request/response payloads
│       ├── model.go       # GORM schema definitions
│       ├── handler.go     # HTTP handlers
│       ├── service.go     # Business logic layer
│       ├── repository.go  # DB access layer
│       └── routes.go      # Route definitions
│
├── routes/            # Registers all module routes in router.go
│
├── database/          # GORM setup, migrations, and seeds
│
├── crons/             # Scheduled tasks (e.g. cleanups, reminders)
│
├── middlewares/       # Middleware like auth, logging, error handling
│
├── pkg/               # Shared utilities
│   ├── jwt/           # JWT generation/validation
│   ├── hash/          # Hashing utilities
│   └── validator/     # Custom validation helpers
```

---

## 🧱 Architecture Overview

This project uses a **module-first structure** for organizing logic. Each feature/module lives in its own folder and includes:

- **DTOs**: Data transfer objects for requests/responses.
- **Models**: GORM-based DB schema.
- **Handlers**: Gin-compatible HTTP handlers.
- **Services**: Business logic, testable and decoupled.
- **Repositories**: Database interactions.
- **Routes**: Local route setup per module.

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/mo-bus-api.git
cd mo-bus-api
```

### 2. Setup Environment

Create a `.env` file based on the `.env.example`.

### 3. Run the Server

```bash
go run cmd/server/main.go
```

### 4. Run Worker Jobs (e.g. Crons)

```bash
go run cmd/worker/main.go
```

---

## 🚀 Features

- 🔌 **Modular Design** for clean separation of concerns  
- 🔒 **JWT Authentication** ready  
- ⏰ **Cron Jobs** supported out of the box  
- 🧪 **Testable Business Logic** in service layers  
- ⚡ **GORM ORM** for relational DB integration  
- 📥 **Config Loader** with type-safe `.env` support  
- 🧰 **Utility Toolkit** via `pkg/`

---

## 🧪 Running Tests

```bash
go test ./...
```

---

## 🤝 Contributing

1. Fork the repo  
2. Create a new branch (`feature/my-feature`)  
3. Commit your changes  
4. Push and open a PR

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
