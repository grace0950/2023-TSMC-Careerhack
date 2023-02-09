const businessModel = require("../model/business");
const { HttpError } = require("../utils/httpError");
const { Order } = require("../dto/Order");
const { Record } = require("../dto/Record");
const { Result } = require("../dto/Result");
const { Search } = require("../dto/Search");

const updateOrder = async (req, res) => {
  const order = new Order(req.body);
  const orderId = `${order.location}-${order.timestamp}`;
  try {
    const record = new Record(await businessModel.calculate(order));
    const result = new Result(await businessModel.storeRecord(record));
    let ee = req.app.get("eventEmitter");
    ee.emit(`order-${orderId}-finish`);
    req.app
      .get("queueMap")
      .get(order.location)
      .get(order.timestamp.split("T")[0])
      .delete(orderId);
    res.json(result.ok);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
};

const getRecord = async (req, res) => {
  const search = new Search(req.query);
  try {
    const rows = await businessModel.getRecord(search);
    console.log(rows[0].location, rows.length);
    res.json(rows);
  } catch (error) {
    res.json(error);
  }
};

module.exports = { updateOrder, getRecord };
