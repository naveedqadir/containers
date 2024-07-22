const express = require('express');
const kafka = require('kafka-node');
const app = express();
const port = 3000;

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (err) => {
  console.error('Producer error:', err);
});

app.get('/send', (req, res) => {
  const payloads = [{ topic: 'test', messages: 'Hello Kafka!' }];
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('Error sending message:', err);
      res.status(500).send('Error sending message');
    } else {
      console.log('Message sent:', data);
      res.send('Message sent');
    }
  });
});

app.listen(port, () => {
  console.log(`Producer server is running on port ${port}`);
});
