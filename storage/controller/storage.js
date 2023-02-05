const { Record } = require("../dto/Record");

const recordModel = require("../model/record");

const getRecords = async (req, res) => {
  location = req.query.location || "default";
  date = req.query.date || "2020-01-01";
  createTime = new Date();
  try {
    const rows = await recordModel.get(location, date, createTime);
    res.json(rows);
  } catch (error) {
    res.json(error);
  }
};

const createRecord = async (req, res) => {
  const record = new Record(req.body);
  try {
    const rows = await recordModel.create(record);
    res.json(rows);
  } catch (error) {
    res.json(error);
  }
};

module.exports = { getRecords, createRecord };
