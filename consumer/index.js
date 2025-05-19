const { Kafka } = require('kafkajs');

const topic = 'test';
const brokers = ['kafka:9092'];

// Create Kafka client
const kafka = new Kafka({
  clientId: 'consumer-app',
  brokers: brokers
});

// Create consumer
const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  try {
    // Connect to the broker
    await consumer.connect();
    
    // Subscribe to the topic
    await consumer.subscribe({ topic, fromBeginning: true });
    
    // Process messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('Received message:', {
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString(),
          headers: message.headers
        });
      },
    });
    
    console.log(`Consumer started and subscribed to topic "${topic}"`);
    
  } catch (error) {
    console.error('Error in consumer:', error);
    // Attempt to reconnect after a delay
    setTimeout(run, 5000);
  }
};

// Handle graceful shutdown
const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`Process.on ${type}`);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

// Start the consumer
run().catch(error => {
  console.error('Failed to start consumer:', error);
});
