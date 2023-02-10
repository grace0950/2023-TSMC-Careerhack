const check = async (req, res, next) => {
  const { location, date } = req.query;
  const redisClient = req.redisClient;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const count = await redisClient.get(`${location}-${date}`);
  const retryDelay = [300, 700, 1700, 2300, 3700, 4300];
  if (count) {
    for (let i = 0; i <= retryDelay.length; i++) {
      // random number between in retryDelay
      await delay(retryDelay[Math.floor(Math.random() * retryDelay.length)]);
      const newCount = await redisClient.get(`${location}-${date}`);
      if (!newCount || parseInt(newCount) <= 0) {
        next();
        return;
      }
    }
  }
  next();
};

module.exports = { check };
