const express = require("express");
const router = express.Router();
const storageController = require("../controller/storage");

router.get("/records", storageController.getRecords);
router.post("/record", storageController.createRecord);
// router.get("/report");

module.exports = router;
