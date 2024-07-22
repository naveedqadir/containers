### README.md

# Kafka Messaging with Docker

This repository contains a simple setup for Kafka messaging using Docker. It includes one producer and one consumer container that communicate via Kafka.

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

### Step 3: Verify the Setup

After running the above command, you should see logs from both the producer and consumer in your terminal. The producer sends messages to Kafka, and the consumer receives them.

## Configuration

The setup includes the following services:
- **Kafka Broker:** Handles message brokering.
- **Zookeeper:** Coordinates and manages Kafka brokers.
- **Producer:** Sends messages to the Kafka topic.
- **Consumer:** Consumes messages from the Kafka topic.

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
