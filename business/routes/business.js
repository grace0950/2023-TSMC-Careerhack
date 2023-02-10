const express = require("express");
const router = express.Router();
const { push } = require("../middleware/push");
const { check } = require("../middleware/check");
const businessController = require("../controller/business");

router.post("/order", push, businessController.updateOrder);
router.get("/record", check, businessController.getRecord);
router.get("/report", check, businessController.getReport);

router.get("/clear", async (req, res) => {
    // mysql clear
    const { poolQuery } = require("../utils/mysql");
    await poolQuery("TRUNCATE TABLE record");
  
    res.send("clear");
  });

module.exports = router;
