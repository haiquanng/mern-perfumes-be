import { Perfume } from '../models/Perfume.js';
import { Brand } from '../models/Brand.js';

export const productService = {
  // Get all perfumes with filters
  async getPerfumes(filters = {}) {
    const { q, brand, concentration, targetAudience, page = 1, limit = 10 } = filters;
    
    const query = {};
    
    if (q) {
      query.perfumeName = { $regex: q, $options: 'i' };
    }
    if (brand) {
      query.brand = brand;
    }
    if (concentration) {
      query.concentration = concentration;
    }
    if (targetAudience) {
      query.targetAudience = targetAudience;
    }

    const skip = (page - 1) * limit;
    
    const perfumes = await Perfume.find(query)
      .populate('brand', 'brandName country')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Perfume.countDocuments(query);

    return {
      perfumes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // Get perfume by ID
  async getPerfumeById(id) {
    const perfume = await Perfume.findById(id).populate('brand', 'brandName country');
    if (!perfume) {
      throw new Error('Perfume not found');
    }
    return perfume;
  },

  // Create perfume
  async createPerfume(perfumeData) {
    const perfume = await Perfume.create(perfumeData);
    return await Perfume.findById(perfume._id).populate('brand', 'brandName country');
  },

  // Update perfume
  async updatePerfume(id, updateData) {
    const perfume = await Perfume.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('brand', 'brandName country');
    
    if (!perfume) {
      throw new Error('Perfume not found');
    }
    return perfume;
  },

  // Delete perfume
  async deletePerfume(id) {
    const perfume = await Perfume.findByIdAndDelete(id);
    if (!perfume) {
      throw new Error('Perfume not found');
    }
    return perfume;
  },

  // Get all brands
  async getBrands() {
    return await Brand.find().sort({ brandName: 1 });
  },

  // Create brand
  async createBrand(brandData) {
    return await Brand.create(brandData);
  },

  // Update brand
  async updateBrand(id, updateData) {
    const brand = await Brand.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  },

  // Delete brand
  async deleteBrand(id) {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  }
};

