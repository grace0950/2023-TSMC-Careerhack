const axios = require("axios");
// const fetch = require("node-fetch-commonjs");
const { HttpError } = require("./httpError");

let delay = (ms) =>
  new Promise(
    (resolve) => setTimeout(resolve, ms),
    console.log("to inventory: ", ms)
  );

const retry = async (method, url, body) => {
  const retryDelay = [900, 2900, 5900, 8900];
  retryDelay.sort(() => Math.random() - 0.5);
  let error = new HttpError("", 404);
  for (let i = 0; i <= retryDelay.length; i++) {
    try {
      // console.log(url, JSON.stringify(body));
      const res = await axios.post(url, JSON.stringify(body));
      console.log(res);
      return res;
    } catch (e) {
      // console.log(e);
      error.status = e.response ? e.response.status : 409;
      error.message = e.message ? e.message : "cannot calculate data";
      //   console.log("cannot fetch data");
      if (i < retryDelay.length) {
        // random number between in retryDelay
        await delay(retryDelay[i]);
      }
    }
  }
  throw error;
};

module.exports = { retry };
