# Utility for Location Module

This module handles the location related things

The services it includes
- [x] Mock Node.js Server 
- [ ] Ingest Server-Kafka Producer
- [ ] Woker-Kafka Consumer+ Redis Layer 
- [ ] Web Socket Layer 

```bash
docker exec -it <kafka-container-id-or-name> \
  kafka-topics.sh --create \
  --topic gps-coordinates \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1
```