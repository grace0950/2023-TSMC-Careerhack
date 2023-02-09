const { Record } = require("../dto/Record");
const { Order } = require("../dto/Order");

delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const calculate = async (req, res) => {
  try {
    const order = new Order(req.body);
    const record = new Record(order);
    // await delay(3000);
    res.status(200).json(record);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = { calculate };
