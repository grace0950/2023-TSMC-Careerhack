const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/order", async (req, res) => {
  try {
    let location = req["body"]["location"]
    location = parseInt(location.replace("l", ""))
    const hash = location % 2;
    const url = `http://localhost:300${hash}/order`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req["body"]),
    });
    const data = await response.json();
    res.send(data);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/record", async(req, res) => {
  try {
    let location = req["query"]["location"]
    const date = req["query"]["date"]
    location = parseInt(location.replace("l", ""))
    const hash = location % 2;
    const url = `http://localhost:300${hash}/record?location=${req["query"]["location"]}&date=${date}`;
  
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    res.send(data);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/report", async(req, res) => {
  try {
    let location = req["query"]["location"]
    const date = req["query"]["date"]
    location = parseInt(location.replace("l", ""))
    const hash = location % 2;
    const url = `http://localhost:300${hash}/report?location=${req["query"]["location"]}&date=${date}`;
  
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    res.send(data);
  } catch (error) {
    res.status(404).send(error);
  }
});


module.exports = router;
