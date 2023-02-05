const axios = require("axios");

const STORAGE_URL = "http://localhost:6000/storage";

const store = async (record) => {
  let res = await axios.post(`${STORAGE_URL}/record`, record);
  return res.data;
};

const get = async (search) => {
  let res = await axios.get(
    `${STORAGE_URL}/records?location=${search.location}&date=${search.date}&createTime=${search.createTime}`
  );
  return res.data;
};

module.exports = { store, get };
