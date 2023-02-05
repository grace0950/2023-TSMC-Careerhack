const express = require("express");
const router = express.Router();
const { push } = require("../middleware/push");
const businessController = require("../controller/business");

router.post("/order", push, businessController.updateOrder);
router.get("/record", businessController.getRecord);
router.get("/report");

module.exports = router;
