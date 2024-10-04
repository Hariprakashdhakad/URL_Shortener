const rateLimit = {};

const RATE_LIMIT = 100; // requests per hour
const TIME_WINDOW = 3600000; // 1 hour

module.exports = (req, res, next) => {
  const key = req.ip;
  const currentTime = Date.now();

  if (!rateLimit[key]) {
    rateLimit[key] = { count: 1, firstRequest: currentTime };
  } else {
    rateLimit[key].count++;

    if (currentTime - rateLimit[key].firstRequest > TIME_WINDOW) {
      rateLimit[key] = { count: 1, firstRequest: currentTime }; // Reset for new hour
    }
  }

  if (rateLimit[key].count > RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
};
