const { cal } = require("../utils/inventory");
const { poolQuery } = require("../utils/mysql");
const fetch = require("node-fetch-commonjs");

const { HttpError } = require("../utils/httpError");
const { Search } = require("../dto/Search");
const { Report } = require("../dto/Report");

const delay = (ms) =>
  new Promise(
    (resolve) => setTimeout(resolve, ms),
    console.log("to storage: ", ms)
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
    console.log("to inventory: ", res.status)
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
  const retryDelay = [1100, 2900, 6100, 8900];
  let error = new HttpError("", 404);
  const sql =
    "SELECT location, timestamp, signature, material, a, b, c, d \
    FROM record WHERE location = ? AND date = ?";
  const values = [search.location, search.date];
  for (let i = 0; i <= retryDelay.length; i++) {
    try {
      const rows = await poolQuery(sql, values);
      return rows;
    } catch (error) {
      error.status = error.status ? error.status : 409;
      error.message = error.message ? error.message : "cannot store data";
      if (i < retryDelay.length) {
        // random number between in retryDelay
        await delay(retryDelay[i]);
      }
    }
  }
  throw error;
};

const getReport = async (search) => {
  const retryDelay = [1100, 2900, 6100, 8900];
  let error = new HttpError("", 404);
  const sql =
    "SELECT location, timestamp, signature, material, a, b, c, d \
  FROM record WHERE location = ? AND date = ?";
  const values = [search.location, search.date];
  for (let i = 0; i <= retryDelay.length; i++) {
    try {
      const rows = await poolQuery(sql, values);
      const report = new Report(rows);
      return report;
    } catch (error) {
      error.status = error.status ? error.status : 409;
      error.message = error.message ? error.message : "cannot store data";
      if (i < retryDelay.length) {
        // random number between in retryDelay
        await delay(retryDelay[Math.floor(Math.random() * retryDelay.length)]);
      }
    }
  }
  throw error;
};

module.exports = { calculate, storeRecord, getRecord, getReport };
