const push = async (req, res, next) => {
  const { location, timestamp } = req.body;
  const date = timestamp.split("T")[0];
  const redisClient = req.redisClient;
  const count = await redisClient.get(`${location}-${date}`);
  if (!count || parseInt(count) <= 0) {
    await redisClient.set(`${location}-${date}`, 1);
    await redisClient.expire(`${location}-${date}`, 30);
  } else {
    await redisClient.incr(`${location}-${date}`);
  }
  next();
};

module.exports = { push };
