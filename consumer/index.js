const kafka = require('kafka-node');
const { KafkaClient, Consumer, Admin } = kafka;

const topic = 'test';
const kafkaHost = 'kafka:9092';
const client = new KafkaClient({ kafkaHost });
const admin = new Admin(client);

const createConsumer = () => {
  const consumer = new Consumer(
    client,
    [{ topic, partition: 0 }],
    { autoCommit: true }
  );

  consumer.on('message', (message) => {
    console.log('Received message:', message);
  });

  consumer.on('error', (err) => {
    console.error('Consumer error:', err);
    if (err.message.includes('TopicsNotExistError')) {
      console.log('Retrying in 5 seconds...');
      setTimeout(createConsumer, 5000);  // Retry after 5 seconds
    }
  });

  return consumer;
};

const checkTopicExists = (callback) => {
  admin.listTopics((err, res) => {
    if (err) {
      console.error('Error listing topics:', err);
      callback(err);
    } else {
      const topics = Object.keys(res[1].metadata);
      if (topics.includes(topic)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  });
};

const initializeConsumer = () => {
  checkTopicExists((err, exists) => {
    if (err) {
      console.error('Error checking topic existence:', err);
      setTimeout(initializeConsumer, 5000);  // Retry after 5 seconds
    } else if (exists) {
      console.log(`Topic "${topic}" exists. Creating consumer.`);
      createConsumer();
    } else {
      console.log(`Topic "${topic}" does not exist. Retrying...`);
      setTimeout(initializeConsumer, 5000);  // Retry after 5 seconds
    }
  });
};

initializeConsumer();
