const { cal } = require("../utils/inventory");
const { store, get } = require("../utils/storage");

const calculate = async (order) => {
  try {
    const res = await cal(order);
    return res;
  } catch (e) {
    throw e;
  }
};

const storeRecord = async (record) => {
  return await store(record);
};

const getRecord = async (search) => {
  return await get(search);
};

module.exports = { calculate, storeRecord, getRecord };
