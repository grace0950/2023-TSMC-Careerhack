const { poolQuery } = require("../utils/mysql");
const { Record } = require("../dto/Record");

const get = async (location, date, createTime) => {
  const sql =
    "SELECT * FROM record WHERE location = ? AND date = ? AND create_time <= ?";
  const values = [location, date, createTime];
  try {
    const rows = await poolQuery(sql, values);
    for (let i = 0; i < rows.length; i++) {
      delete rows[i].create_time;
      delete rows[i].date;
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

const create = async (record) => {
  const recordSQL = record.toSql();
  const sql = "INSERT INTO record SET ?";
  const values = [recordSQL];
  try {
    const rows = await poolQuery(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { get, create };
