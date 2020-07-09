const amqpPlus = require("amqplib-plus");

class CustomConsumer extends amqpPlus.Consumer {
  constructor(conn, prepareFn) {
    super(conn, prepareFn);
  }
  processMessage(msg, channel) {
    // Your own messages process logic
    console.log("Message headers:", JSON.stringify(msg.properties.headers));
    console.log("Message body:", msg.content.toString());
    // Your own condition to decide whether to ack/nack/reject
    if (msg.content.toString().length > 10) {
      
      return channel.ack(msg);
    }
    channel.ack(msg);
  }
}
module.exports = CustomConsumer;