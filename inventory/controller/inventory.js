const { Record } = require("../dto/Record");
const { Order } = require("../dto/Order");

const calculate = async (req, res) => {
  const order = new Order(req.body);
  const record = new Record(order);
  res.json(record);
};

module.exports = { calculate };
