const { poolQuery } = require("../utils/mysql");
const fetch = require("node-fetch-commonjs");

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
    const res = await fetch(INVENTORY_URL, {
      method: "POST",
      body: JSON.stringify(order),
      headers: { "Content-Type": "application/json" },
    });
    // console.log("to inventory: ", res.status)
    return res.json();
  } catch (e) {
    fetch(`${REQUEST_QUEUE_URL}/queue/calc`, {
      method: "POST",
      body: JSON.stringify({ postBody: order }),
      headers: { "Content-Type": "application/json" },
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
    fetch(`${REQUEST_QUEUE_URL}/queue/record`, {
      method: "POST",
      body: JSON.stringify({ queryStr: sql, params: values }),
      headers: { "Content-Type": "application/json" },
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
