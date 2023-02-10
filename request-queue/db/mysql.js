import { createPool } from "mysql";

const pool = createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3307,
  user: "root",
  password: "cerana",
  database: "tsmc_storage",
  connectionLimit: 10,
});

const poolQuery = async (sql, values) => {
  let conn;
  try {
    if (!values) values = [];
    conn = await pool.getConnection();
    const rows = await conn.query(sql, values);
    return rows[0];
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

export default { poolQuery };