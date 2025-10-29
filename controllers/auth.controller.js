import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Member } from '../models/Member.js';
import { jwtConfig } from '../config/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const exists = await Member.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email taken' });
  const hash = await bcrypt.hash(password, 10);
  const user = await Member.create({ name, email, password: hash });
  return res.status(201).json({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
});

function signAndSetCookie(res, member) {
  const token = jwt.sign({ id: member._id, email: member.email, isAdmin: member.isAdmin }, process.env.JWT_SECRET, { expiresIn: jwtConfig.accessTokenTtlSec });
  res.cookie(jwtConfig.cookieName, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: jwtConfig.accessTokenTtlSec * 1000 });
  return token;
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Member.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Wrong email!' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Wrong password!' });
  signAndSetCookie(res, user);
  return res.json({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
});

export const me = asyncHandler(async (req, res) => {
  const user = await Member.findById(req.user.id).select('-password');
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, yob, gender } = req.body;
  const updated = await Member.findByIdAndUpdate(req.user.id, { name, yob, gender }, { new: true }).select('-password');
  res.json(updated);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await Member.findById(req.user.id);
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated' });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(jwtConfig.cookieName);
  res.json({ message: 'Logged out' });
});


