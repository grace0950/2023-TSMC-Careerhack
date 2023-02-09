const axios = require("axios");
const { HttpError } = require("./httpError");

let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retry = async (method, url, body) => {
  const retryDelay = [350, 750, 1750, 2350, 3750, 4350];
  let error = new HttpError("", 404);
  for (let i = 0; i <= retryDelay.length; i++) {
    try {
      const config = {
        method: method,
        url: url,
        data: body,
      };
      const res = await axios(config);
      return res;
    } catch (e) {
      error.status = e.response ? e.response.status : 409;
      error.message = e.message ? e.message : "cannot calculate data";
      //   console.log("cannot fetch data");
      if (i < retryDelay.length) {
        // random number between in retryDelay
        await delay(retryDelay[Math.floor(Math.random() * retryDelay.length)]);
      }
    }
  }
  throw error;
};

module.exports = { retry };
