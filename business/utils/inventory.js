const axios = require("axios");

const INVENTORY_URL = "http://localhost:4000/inventory";

const cal = async (order) => {
  let res = await axios.post(`${INVENTORY_URL}/calculate`, order);
  return res.data;
};

module.exports = { cal };
