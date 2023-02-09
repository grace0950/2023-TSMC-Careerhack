const express = require("express");
const app = express();
const port = 8100
const cookieParser = require("cookie-parser");
const bp = require("body-parser");
const router = require("./routes/load-balancer");

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Load balancer listening at http://localhost:${port}`)
})
