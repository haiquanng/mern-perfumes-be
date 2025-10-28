import { Member } from '../models/Member.js';

export async function listCollectors(req, res) {
  const members = await Member.find().select('-password');
  res.json(members);
}


