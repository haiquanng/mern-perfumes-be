import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/index.js';

export function requireAuth(req, res, next) {
  const token = req.cookies[jwtConfig.cookieName] || (req.headers.authorization?.split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function isAdmin(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  next();
}

export function isSelf(req, res, next) {
  const { id } = req.params;
  if (req.user?.id === id || req.user?.isAdmin) return next();
  return res.status(403).json({ message: 'Forbidden' });
}


