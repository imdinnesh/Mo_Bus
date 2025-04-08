# API for Mo Bus

## Folder Structure

**cmd/** Entrypoint.  cmd/server for main server, cmd/worker for worker, etc.

**config/**	Loads config/env vars into a typed struct.

**internal/**	All business logic, each module has its own folder.

**routes/**	Registers module-level routes into a central router.go.

**database/** GORM connection setup, migrations, seeds.

**crons/**	Cron tasks, like cleaning expired bookings or sending reminders.

**middlewares/**	Middleware for auth, logging, error handling.

**pkg/**	Shared utility code (e.g., hashing, JWT generation, validators).

