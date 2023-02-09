const ampq = require("amqplib/callback_api");

const inventoryChannel = async () => {
  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  const queue = await channel.assertQueue("", { exclusive: true });
  return { channel, queue };
};

module.exports = { inventoryChannel };
