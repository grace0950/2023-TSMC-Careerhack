const { cal } = require("../utils/inventory");
const { poolQuery } = require("../utils/mysql");
const { HttpError } = require("../utils/httpError");

const { Search } = require("../dto/Search");
const { Report } = require("../dto/Report");

const delay = (ms) =>
  new Promise(
    (resolve) => setTimeout(resolve, ms),
    console.log("to storage: ", ms)
  );

const calculate = async (order) => {
  try {
    const res = await cal(order);
    return res;
  } catch (e) {
    throw e;
  }
};

const storeRecord = async (record) => {
  const retryDelay = [770, 1370, 1770, 2370, 3770];
  let error = new HttpError("", 404);
  const recordSQL = record.toSql();
  const sql = "INSERT INTO record SET ?";
  const values = [recordSQL];
  for (let i = 0; i <= retryDelay.length; i++) {
    try {
      const rows = await poolQuery(sql, values);
      return rows;
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

const getRecord = async (search) => {
  const sql =
    "SELECT location, timestamp, signature, material, a, b, c, d \
    FROM record WHERE location = ? AND date = ?";
  const values = [search.location, search.date];
  try {
    const rows = await poolQuery(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getReport = async (search) => {
  const sql =
    "SELECT location, timestamp, signature, material, a, b, c, d \
  FROM record WHERE location = ? AND date = ?";
  const values = [search.location, search.date];
  try {
    const rows = await poolQuery(sql, values);
    const report = new Report(rows);
    return report;
  } catch (error) {
    throw error;
  }
};

module.exports = { calculate, storeRecord, getRecord, getReport };
