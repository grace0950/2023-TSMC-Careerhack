const { HttpError } = require("./httpError");
const axios = require("axios");

const INVENTORY_URL = "http://localhost:4000/inventory";

let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cal = async (order) => {
  const retries = 3;
  let error = new HttpError("", 404);
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await axios.post(`${INVENTORY_URL}/calculate`, order);
      if (res) {
        return res.data;
      }
    } catch (e) {
      error.status = e.response ? e.response.status : 500;
      error.message = "cannot fetch data";
      console.log("cannot fetch data");
    }
    if (i < retries) await delay(4 ** i * 1000);
  }
  throw error;
};

module.exports = { cal };
