const express = require("express");
const router = express.Router();

const inventoryController = require("../controller/inventory");

router.post("/calculate", inventoryController.calculate);

module.exports = router;
