const express = require("express");
const router = express.Router();
const { push } = require("../middleware/push");
const { check } = require("../middleware/check");
const businessController = require("../controller/business");

router.post("/order", push, businessController.updateOrder);
router.get("/record", check, businessController.getRecord);
router.get("/report", check, businessController.getReport);

module.exports = router;
