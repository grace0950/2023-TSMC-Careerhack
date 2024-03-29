const { Record } = require("../dto/Record");

const recordModel = require("../model/record");

const getRecords = async (req, res) => {
  location = req.query.location;
  date = req.query.date;
  try {
    const rows = await recordModel.get(location, date);
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
