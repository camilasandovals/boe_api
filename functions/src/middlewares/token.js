import jwt from 'jsonwebtoken';
import { secretKey } from '../../env.js';

export const generateTokenMiddleware = (req, res, next) => {
  if (req.user) {
    const tokenPayload = { id: req.user.id };
    req.token = jwt.sign(tokenPayload, secretKey)
  }
  next();
};

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      // If there's no token, proceed without setting req.user
      return next();
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        // Log the error but still allow the request to proceed
        console.error('Token verification error:', err);
      } else {
        // Set user information from the token
        req.user = user;
      }
      next();
    });
  } catch (error) {
    console.error('Error in authenticateToken:', error.message);
    next(); // Ensure request continues even if an error occurs
  }
};

