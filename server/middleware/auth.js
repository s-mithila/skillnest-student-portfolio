// server/middleware/auth.js
// Authentication middleware to protect routes requiring an active session

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required. Please log in.' });
}

module.exports = { requireAuth };
