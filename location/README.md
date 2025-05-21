# Utility for Location Module

This module handles the location related things

The services it includes
- [x] Mock Node.js Server 
- [x] Ingest Server-Kafka Producer
- [x] Woker-Kafka Consumer
- [x] Redis Layer to Store the current location per Bus + Pub/Sub
- [x] Web Socket Layer 

```bash
docker exec -it <kafka-container-id-or-name> \
  kafka-topics.sh --create \
  --topic gps-coordinates \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1
```

## ws endpoint
```
ws://localhost:4000/location?busId=bus-101
```
