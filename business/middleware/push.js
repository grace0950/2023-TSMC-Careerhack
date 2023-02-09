const push = async (req, res, next) => {
  const { location, timestamp } = req.body;
  const date = timestamp.split("T")[0];
  const redisClient = req.redisClient;

  if (!(await redisClient.get(`${location}-${date}`))) {
    await redisClient.set(`${location}-${date}`, 1);
    await redisClient.expire(`${location}-${date}`, 20);
  } else {
    await redisClient.incr(`${location}-${date}`);
  }
  next();
};

module.exports = { push };
