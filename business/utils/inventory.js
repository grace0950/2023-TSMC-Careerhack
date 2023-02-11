const axios = require("axios");
// const { retry } = require("./retry");
const { HttpError } = require("./httpError");
const INVENTORY_URL = process.env.INVENTORY_URL || "http://localhost:8200";
// const INVENTORY_URL = "http://localhost:4000/inventory";

// const cal = async (order) => {
//   try {
//     const res = await retry("post", `${INVENTORY_URL}`, order);
//     return res;
//   } catch (e) {
//     throw e;
//   }
// };
let delay = (ms) =>
  new Promise(
    (resolve) => setTimeout(resolve, ms),
    console.log("to inventory: ", ms)
  );

const cal = async (order) => {
  const retryDelay = [900, 2900, 5900, 8900];
  retryDelay.sort(() => Math.random() - 0.5);
  let error = new HttpError("", 404);
  for (let i = 0; i <= retryDelay.length; i++) {
    try {
      const res = await axios.post(`${INVENTORY_URL}`, order, {
        timeout: 2000,
      });
      return res.data;
    } catch (e) {
      error.status = e.response ? e.response.status : 409;
      error.message = e.message ? e.message : "cannot calculate data";
      if (i < retryDelay.length) {
        // random number between in retryDelay
        await delay(retryDelay[i]);
      }
    }
  }
  throw error;
};

module.exports = { cal };
