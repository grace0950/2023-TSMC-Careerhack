const push = async (req, res, next) => {
  const { location, timestamp } = req.body;
  const date = timestamp.split("T")[0];
  req.orderId = `${location}-${timestamp}`;
  req.body.createTime = new Date();
  let queueMap = req.app.get("queueMap");
  if (!queueMap.has(location)) {
    queueMap.set(location, new Map());
  }
  if (!queueMap.get(location).has(date)) {
    queueMap.get(location).set(date, new Set());
  }
  queueMap.get(location).get(date).add(req.orderId);

  console.log(queueMap);

  next();
};

module.exports = { push };
