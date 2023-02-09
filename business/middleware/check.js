const check = async (req, res, next) => {
  const { location, date } = req.query;
  const redisClient = req.redisClient;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const count = await redisClient.get(`${location}-${date}`);
  const retryDelay = [1000, 2000, 4000];
  if (count) {
    for (let i = 0; i <= retryDelay.length; i++) {
      await delay(retryDelay[i]);
      const newCount = await redisClient.get(`${location}-${date}`);
      if (!newCount || newCount === "0") {
        next();
        return;
      }
    }
  }
  next();
};

module.exports = { check };
