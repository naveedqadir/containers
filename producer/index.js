const express = require('express');
const { Kafka } = require('kafkajs');
const app = express();
const port = 3000;

// Create Kafka client
const kafka = new Kafka({
  clientId: 'producer-app',
  brokers: ['kafka:9092']
});

// Create producer
const producer = kafka.producer();
// Create admin client
const admin = kafka.admin();

const run = async () => {
  try {
    // Connect admin client
    await admin.connect();
    
    // Create topic if it doesn't exist
    const topicExists = await admin.listTopics().then(topics => topics.includes('test'));
    
    if (!topicExists) {
      await admin.createTopics({
        topics: [
          { 
            topic: 'test',
            numPartitions: 1,
            replicationFactor: 1
          }
        ]
      });
      console.log('Topic created successfully');
    } else {
      console.log('Topic already exists');
    }
    
    // Connect producer
    await producer.connect();
    console.log('Kafka Producer is connected and ready.');
    
  } catch (error) {
    console.error('Error setting up Kafka:', error);
  }
};

// Set up Express routes
app.get('/send', async (req, res) => {
  try {
    // Send message
    const result = await producer.send({
      topic: 'test',
      messages: [
        { value: 'Hello KafkaJS!' }
      ]
    });
    
    console.log('Message sent:', result);
    res.send('Message sent');
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});

// Handle graceful shutdown
const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`Process.on ${type}`);
      await producer.disconnect();
      await admin.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect();
      await admin.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

// Start Express server
app.listen(port, () => {
  console.log(`Producer server is running on port ${port}`);
});

// Initialize Kafka connections
run().catch(error => {
  console.error('Failed to start Kafka services:', error);
});