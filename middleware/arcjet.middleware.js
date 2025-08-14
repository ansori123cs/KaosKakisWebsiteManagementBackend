import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
  try {
    const decission = await aj.protect(req, { requested: 1 });

    if (decission.isDenied()) {
      if (decission.reason.isRateLimit()) return res.status(429).json({ error: 'Rate Limit Exceeded' });
      if (decission.reason.isBot()) return res.status(403).json({ error: 'Bot Detected' });

      return res.status(403).json({ error: 'Access Denied' });
    }
    next();
  } catch (error) {
    console.log(`arcjet Middleware Error: ${error}`);
    next(error);
  }
};

export default arcjetMiddleware;
