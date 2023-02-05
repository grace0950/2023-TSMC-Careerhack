const { cal } = require("../utils/inventory");
const { store, get } = require("../utils/storage");

const calculate = async (order) => {
  return await cal(order);
};

const storeRecord = async (record) => {
  return await store(record);
};

const getRecord = async (search) => {
  return await get(search);
};

module.exports = { calculate, storeRecord, getRecord };
