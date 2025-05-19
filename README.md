### README.md

# Kafka Messaging with Docker

This repository contains a simple setup for Kafka messaging using Docker. It includes one producer and one consumer container that communicate via Kafka using the KafkaJS library.

## Prerequisites

- Docker

## Setup and Usage

### Step 1: Clone the Repository

```bash
git clone https://github.com/naveedqadir/containers.git
cd containers
```

### Step 2: Build and Run the Containers

Use the following command to build and start the containers:

```bash
docker-compose up --build
```

### Step 3: Test the Setup

Once the containers are running, you can send a message to Kafka by using the producer's API:

```bash
curl http://localhost:3000/send
```

After running this command, you should see the message being received in the consumer's logs.

## Configuration

The setup includes the following services:
- **Kafka Broker:** Handles message brokering in KRaft mode (without Zookeeper).
- **Producer:** Sends messages to the Kafka topic using KafkaJS.
- **Consumer:** Consumes messages from the Kafka topic using KafkaJS.

## Stopping the Containers

To stop the containers, use:

```bash
docker-compose down
```

## Directory Structure

```
.
├── docker-compose.yml
├── producer
│   ├── Dockerfile
│   └── node js
└── consumer
    ├── Dockerfile
    └── node js
```
