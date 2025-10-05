// authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'aaaaaaaaaaaaaaaaaaaaaaaasssssssssssssssssssssss'; 
module.exports = (req, res, next) => {
  try {
    
    const token = req.headers.token || req.query.token || req.body.token;

    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    
    const decodedToken = jwt.verify(token, JWT_SECRET);

    
    req.auth = {
      userId: decodedToken.userId,
      isAdmin: decodedToken.isAdmin
    };

    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Requête non authentifiée' });
  }
};
