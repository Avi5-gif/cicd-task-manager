const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { auth };
