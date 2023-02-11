const { poolQuery } = require("../utils/mysql");
// const fetch = require("node-fetch-commonjs");
const axios = require("axios");

// const { HttpError } = require("../utils/httpError");
// const { Search } = require("../dto/Search");
const { Report } = require("../dto/Report");

const delay = (ms) =>
  new Promise(
    (resolve) => setTimeout(resolve, ms),
    console.log("get delay: ", ms)
  );


const INVENTORY_URL = process.env.INVENTORY_URL || "http://localhost:8200";
const REQUEST_QUEUE_URL = process.env.REQUEST_QUEUE_URL || "http://localhost:7777";
const calculate = async (order) => {
  try {
    const res = await axios.post(INVENTORY_URL, order, {
      timeout: 500,
    });
    // console.log("to inventory: ", res.status)
    // console.log("to inventory: ", res.data)
    return res.data;
  } catch (e) {
    axios.post(`${REQUEST_QUEUE_URL}/queue/calc`, { postBody: order }, {
      timeout: 500,
    }).catch((e) => console.log("queue fault on calc: ", e.message));
    throw e;
  }
};

const storeRecord = async (record) => {
  const recordSQL = record.toSql();
  const sql = "INSERT INTO record SET ?";
  const values = [recordSQL];
  try {
    const rows = await poolQuery(sql, values);
    return rows;
  } catch (error) {
    axios.post(`${REQUEST_QUEUE_URL}/queue/record`, { postBody: record }, {
      timeout: 500,
    }).catch((e) => console.log("queue fault on store: ", e.message));
    throw error;
  }
};

const getRecord = async (search) => {
  delay(3000)
  const sql =
    "SELECT location, timestamp, signature, material, a, b, c, d \
    FROM record WHERE location = ? AND date = ?";
  const values = [search.location, search.date];
  try {
    const rows = await poolQuery(sql, values);
    return rows;
  } catch (error) {
    return [];
    // throw error;
  }

};

const getReport = async (search) => {
  delay(3000)
  const sql =
    "SELECT location, timestamp, signature, material, a, b, c, d \
  FROM record WHERE location = ? AND date = ?";
  const values = [search.location, search.date];
  try {
    const rows = await poolQuery(sql, values);
    if (rows.length === 0) return {};
    const report = new Report(rows);
    return report;
  } catch (error) {
    return {};
    // throw error;
  }
};

module.exports = { calculate, storeRecord, getRecord, getReport };
