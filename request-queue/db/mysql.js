import { createPool } from "mysql2";

const pool = createPool({
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
  return new Promise((resolve, reject) => {
    pool.query(
      sql,
      values,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

export default { poolQuery };
