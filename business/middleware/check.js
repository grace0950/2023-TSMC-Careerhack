const check = async (req, res, next) => {
  const { location, date } = req.query;
  req.query.createTime = req.app.get("idx");
  req.app.set("idx", req.app.get("idx") + 1);
  // next();
  let queueMap = req.app.get("queueMap");
  // console.log("GET: ", location, queueMap);
  if (
    !queueMap.has(location) ||
    !queueMap.get(location).has(date) ||
    queueMap.get(location).get(date).size === 0
  ) {
    queueMap.delete(location);
    next();
  } else {
    // console.log("waiting");
    const ee = req.app.get("eventEmitter");
    let waitingSet = queueMap.get(location).get(date);
    // console.log(waitingSet);
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
