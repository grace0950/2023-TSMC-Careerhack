const { retry } = require("./retry");
const STORAGE_URL = "http://localhost:6000/storage";

const store = async (record) => {
  try {
    const res = await retry("post", `${STORAGE_URL}/record`, record);
    return res.data;
  } catch (e) {
    throw e;
  }
};

const get = async (search) => {
  try {
    const res = await retry(
      "get",
      `${STORAGE_URL}/records?location=${search.location}&date=${search.date}`
    );
    return res.data;
  } catch (e) {
    throw e;
  }
};

module.exports = { store, get };
