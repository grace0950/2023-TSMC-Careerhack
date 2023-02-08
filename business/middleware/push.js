const push = (req, res, next) => {
  const { location, timestamp } = req.body;
  const date = timestamp.split("T")[0];
  req.orderId = `${location}-${timestamp}`;
  req.body.createTime = req.app.get("idx");
  req.app.set("idx", req.app.get("idx") + 1);
  // next();
  let queueMap = req.app.get("queueMap");
  if (!queueMap.has(location)) {
    queueMap.set(location, new Map());
  }
  if (!queueMap.get(location).has(date)) {
    queueMap.get(location).set(date, new Set());
  }
  queueMap.get(location).get(date).add(req.orderId);

  // console.log("POST: ", location, queueMap);

  next();
};

module.exports = { push };
