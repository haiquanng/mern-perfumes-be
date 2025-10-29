import bcrypt from 'bcryptjs';
import { Member } from '../models/Member.js';

export const userService = {
  async createUser(userData) {
    const { name, email, password, yob, gender } = userData;
    
    const existingUser = await Member.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await Member.create({
      name,
      email,
      password: hashedPassword,
      yob,
      gender,
      isAdmin: false
    });

    return user;
  },

  async getUserById(id) {
    const user = await Member.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  // Update user
  async updateUser(id, updateData) {
    const user = await Member.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async deleteUser(id) {
    const user = await Member.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async getAllUsers() {
    return await Member.find().select('-password');
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

