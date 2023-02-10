const businessModel = require("../model/business");
const { HttpError } = require("../utils/httpError");
const { Order } = require("../dto/Order");
const { Record } = require("../dto/Record");
const { Result } = require("../dto/Result");
const { Search } = require("../dto/Search");

const updateOrder = async (req, res) => {
  const order = new Order(req.body);
  // const redisClient = req.redisClient;
  try {
    const record = new Record(await businessModel.calculate(order));
    const result = new Result(await businessModel.storeRecord(record));
    res.json(result.ok);
    return;
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json(error);
  }
  // finally {
  //   const date = order.timestamp.split("T")[0];
  //   const key = `${order.location}-${date}`;
  //   const count = await redisClient.get(key);

  //   if (count && parseInt(count) > 0) {
  //     await redisClient.decr(key);
  //   }
  // }
};

const getRecord = async (req, res) => {
  const search = new Search(req.query);
  try {
    const rows = await businessModel.getRecord(search);
    res.json(rows);
    return;
  } catch (error) {
    res.status(error.status || 500).json(error);
    // console.log(error);
  }
};

const getReport = async (req, res) => {
  const search = new Search(req.query);
  try {
    const rows = await businessModel.getReport(search);
    res.json(rows);
    return;
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json(error);
    // console.log(error);
  }
};

module.exports = { updateOrder, getRecord, getReport };
