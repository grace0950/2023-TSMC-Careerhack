const { retry } = require("./retry");
const INVENTORY_URL =
  process.env.INVENTORY_URL || "http://inventory:4000/inventory";
// const INVENTORY_URL = "http://localhost:4000/inventory";

const cal = async (order) => {
  try {
    const res = await retry("post", `${INVENTORY_URL}`, order);
    return res;
  } catch (e) {
    throw e;
  }
};

// const cal = async (order) => {
//   const res = await axios.post(`${INVENTORY_URL}`, order);
//   return res.data;
// };

module.exports = { cal };
