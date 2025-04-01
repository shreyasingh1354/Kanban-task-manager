const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }
  
  // Extract token from "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: Invalid token format' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired', expired: true });
    }
    
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authenticate;