const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3306,
  user: "root",
  password: "cerana",
  database: "tsmc_storage",
  connectionLimit: 10,
  connectTimeout: 1000,
  acquireTimeout: 10000,
});

const poolQuery = async (sql, values) => {
  let conn;
  try {
    if (!values) values = [];
    conn = await pool.getConnection();
    sql = mysql.format(sql, values);
    const rows = await conn.query({ sql: sql, timeout: 3000 });
    return rows[0];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { poolQuery };
