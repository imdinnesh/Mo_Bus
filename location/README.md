# 🛰️ Utility for Location Module

This module handles all **location-related services** for real-time bus tracking in your system. It provides infrastructure to **simulate**, **ingest**, **store**, and **broadcast** GPS location updates per bus.

---

## 📦 Features

| Component                     | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| ✅ Mock Node.js Server        | Simulates GPS coordinates per bus, pushing to Kafka                        |
| ✅ Ingest Server - Kafka Producer | Accepts GPS data over HTTP and pushes messages to Kafka                    |
| ✅ Worker - Kafka Consumer     | Consumes GPS messages from Kafka, stores data in Redis and broadcasts it   |
| ✅ Redis Layer                | Key-Value store for current location (`bus:<busId>`) + Pub/Sub channels     |
| ✅ WebSocket Layer           | Clients can subscribe to real-time location updates via WebSocket           |
| ✅ SSE Layer (Optional)      | Alternative to WebSocket using Server-Sent Events                           |

---

## 📌 Setup Instructions

### 🐳 Kafka Topic Setup

If you're using Docker, create the Kafka topic like so:

```bash
docker exec -it <kafka-container-id-or-name> \
  kafka-topics.sh --create \
  --topic gps-coordinates \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1
```
## 🚦 Data Flow Overview

Mock Server generates random GPS data for buses and sends it to Ingest Server.

Ingest Server accepts HTTP POST and forwards the data to Kafka.

Kafka Consumer Worker:

Parses GPS data.

Stores the current location in Redis under key bus:<busId>.

Publishes the update to Redis Pub/Sub channel bus:<busId>.

Client Layer (WS/SSE) subscribes to real-time updates for any busId.

## 🧠 Redis Storage Schema
Key Format: bus:<busId>

Value Example:

```json
{
  "routeId": "route-12",
  "latitude": 20.123,
  "longitude": 85.123,
  "timestamp": "2025-05-22T15:04:05Z"
}
```
Pub/Sub Channel: bus:<busId> (used by WebSocket and SSE servers)

## 🔌 Endpoints
### 📡 WebSocket Endpoint
Real-time updates via WebSocket:

```bash
ws://localhost:4000/location?busId=bus-101
```
Connect using Hoppscotch (WS tab), a browser frontend, or any WebSocket client.

Messages are pushed as plain JSON strings.

## 🔁 SSE Endpoint (Optional)
Real-time updates using Server-Sent Events:

```bash
http://localhost:4000/location-stream?busId=bus-101
```

Test using:

```bash
curl -N http://localhost:4000/location-stream?busId=bus-101
```
Each event looks like:

```json
data: {"busId":"bus-101","latitude":20.123,"longitude":85.123,"timestamp":"..."}
```

## TL;DR
This module handles the following  location related things:

The services it includes
- [x] Mock Node.js Server 
- [x] Ingest Server-Kafka Producer
- [x] Woker-Kafka Consumer
- [x] Redis Layer to Store the current location per Bus + Pub/Sub
- [x] Web Socket Layer
- [x] SSE Layer (Optional) 
