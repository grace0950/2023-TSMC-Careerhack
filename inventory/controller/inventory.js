const { Record } = require("../dto/Record");
const { Order } = require("../dto/Order");

delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const calculate = async (req, res) => {
  const order = new Order(req.body);
  const record = new Record(order);
  // await delay(3000);
  res.json(record);
};

module.exports = { calculate };
