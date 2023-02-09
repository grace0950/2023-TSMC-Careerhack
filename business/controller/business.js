const businessModel = require("../model/business");
const { HttpError } = require("../utils/httpError");
const { Order } = require("../dto/Order");
const { Record } = require("../dto/Record");
const { Result } = require("../dto/Result");
const { Search } = require("../dto/Search");

const updateOrder = async (req, res) => {
  const order = new Order(req.body);
  const redisClient = req.redisClient;
  try {
    const record = new Record(await businessModel.calculate(order));
    const result = new Result(await businessModel.storeRecord(record));
    if (result.ok) {
      const date = record.timestamp.split("T")[0];
      const key = `${record.location}-${date}`;
      await redisClient.decr(key);
    }
    res.json(result.ok);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
};

const getRecord = async (req, res) => {
  const search = new Search(req.query);
  try {
    const rows = await businessModel.getRecord(search);
    res.json(rows);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateOrder, getRecord };
