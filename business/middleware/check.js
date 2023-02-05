const check = async (req, res, next) => {
  const { location, date } = req.query;
  req.query.createTime = req.app.get("idx");
  req.app.set("idx", req.app.get("idx") + 1);
  console.log("create time: ", req.query.createTime);
  let queueMap = req.app.get("queueMap");
  if (
    !queueMap.has(location) ||
    !queueMap.get(location).has(date) ||
    queueMap.get(location).get(date).size === 0
  )
    next();
  else {
    const ee = req.app.get("eventEmitter");
    let waitingSet = queueMap.get(location).get(date);
    for (let orderId of waitingSet) {
      if (!queueMap.get(location).get(date).has(orderId)) continue;
      await wait(orderId, ee);
    }
    next();
  }
};

const wait = async (orderId, ee) => {
  return new Promise((resolve, reject) => {
    ee.on(`order-${orderId}-finish`, () => {
      resolve();
    });
  });
};

module.exports = { check };
