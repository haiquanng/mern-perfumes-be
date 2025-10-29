import { GoogleGenerativeAI } from '@google/generative-ai';
import { Perfume } from '../models/Perfume.js';

// Helper function to get GenAI instance with lazy-loaded API key
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
}

export const geminiService = {
  /**
   * Phân tích và tìm nước hoa tương tự dựa trên các đặc điểm
   * @param {Object} perfume - Nước hoa cần tìm similar
   * @returns {Promise<Array>} - Mảng IDs của nước hoa tương tự
   */
  async analyzeSimilarPerfumes(perfume) {
    try {
      const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Lấy tất cả perfumes để phân tích (trừ perfume hiện tại)
      const allPerfumes = await Perfume.find({ _id: { $ne: perfume._id } })
        .populate('brand', 'brandName')
        .lean();

      if (allPerfumes.length === 0) {
        return [];
      }

      // Tạo prompt để Gemini phân tích
      const prompt = `
Bạn là chuyên gia về nước hoa. Dựa trên thông tin nước hoa dưới đây, hãy phân tích và tìm 5 nước hoa tương tự nhất.

Nước hoa gốc:
- Tên: ${perfume.perfumeName}
- Thương hiệu: ${perfume.brand?.brandName}
- Nồng độ: ${perfume.concentration}
- Giới tính: ${perfume.targetAudience}
- Mô tả: ${perfume.description}
${perfume.ingredients ? `- Thành phần: ${perfume.ingredients}` : ''}

Danh sách nước hoa có sẵn:
${allPerfumes.map((p, idx) => `
${idx}. ID: ${p._id}
   Tên: ${p.perfumeName}
   Thương hiệu: ${p.brand?.brandName}
   Nồng độ: ${p.concentration}
   Giới tính: ${p.targetAudience}
   Mô tả: ${p.description}
   ${p.ingredients ? `Thành phần: ${p.ingredients}` : ''}
`).join('\n')}

Hãy phân tích dựa trên:
1. Nồng độ và độ lưu hương tương tự
2. Hương thơm chính (woody, floral, citrus, oriental, fresh, spicy...)
3. Thành phần chính tương đồng
4. Phong cách và cá tính (elegant, sporty, mysterious, romantic...)
5. Giới tính phù hợp

Trả về CHÍNH XÁC 5 ID của nước hoa tương tự nhất, mỗi ID trên một dòng, không có text gì khác.
Ví dụ format trả về:
507f1f77bcf86cd799439011
507f191e810c19729de860ea
507f1f77bcf86cd799439012
507f191e810c19729de860eb
507f1f77bcf86cd799439013
`;

      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();

      // Parse IDs từ response
      const similarIds = response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && /^[a-f0-9]{24}$/i.test(line)) // Validate ObjectId format
        .slice(0, 5);

      return similarIds;
    } catch (error) {
      console.error('Error analyzing similar perfumes:', error);
      throw new Error('Failed to analyze similar perfumes with AI');
    }
  },

  /**
   * Tạo tóm tắt AI từ các reviews của nước hoa
   * @param {Object} perfume - Nước hoa cần tạo summary
   * @param {Array} reviews - Mảng reviews (comments)
   * @returns {Promise<string>} - Summary text
   */
  async generateSummary(perfume, reviews) {
    try {
      const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

      if (!reviews || reviews.length === 0) {
        return `${perfume.perfumeName} là một ${perfume.concentration} ${perfume.targetAudience === 'male' ? 'nam' : perfume.targetAudience === 'female' ? 'nữ' : 'unisex'} từ thương hiệu ${perfume.brand?.brandName}. ${perfume.description}`;
      }

      const prompt = `
Bạn là chuyên gia về nước hoa. Hãy tạo một đoạn tóm tắt ngắn gọn (2-3 câu) về nước hoa dựa trên thông tin và reviews sau:

Thông tin nước hoa:
- Tên: ${perfume.perfumeName}
- Thương hiệu: ${perfume.brand?.brandName}
- Nồng độ: ${perfume.concentration}
- Giới tính: ${perfume.targetAudience}
- Mô tả: ${perfume.description}
- Đánh giá trung bình: ${perfume.averageRating}/5

Reviews từ người dùng (${reviews.length} reviews):
${reviews.map((r, idx) => `${idx + 1}. Rating: ${r.rating}/5 - ${r.comment}`).join('\n')}

Tóm tắt nên bao gồm:
1. Cảm nhận chung về hương thơm
2. Độ lưu hương và tỏa hương
3. Phù hợp với ai và dịp nào
4. Điểm nổi bật hoặc lưu ý đặc biệt

Trả về tóm tắt bằng tiếng Việt, ngắn gọn, súc tích.
`;

      const result = await model.generateContent(prompt);
      const summary = result.response.text().trim();

      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate AI summary');
    }
  },

  /**
   * Chat với Gemini về nước hoa
   * @param {string} query - Câu hỏi của user
   * @param {Object} context - Context về perfumes (optional)
   * @returns {Promise<string>} - Response từ AI
   */
  async chat(query, context = {}) {
    try {
      const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

      let prompt = `
Bạn là một chuyên gia tư vấn nước hoa chuyên nghiệp. Hãy trả lời câu hỏi sau của khách hàng một cách thân thiện, hữu ích và chuyên môn.

`;

      // Thêm context nếu có
      if (context.perfumes && context.perfumes.length > 0) {
        prompt += `\nCác nước hoa có sẵn trong hệ thống:\n`;
        prompt += context.perfumes.map((p, idx) => `
${idx + 1}. ${p.perfumeName} - ${p.brand?.brandName}
   Giá: ${p.price.toLocaleString('vi-VN')}₫
   Nồng độ: ${p.concentration}
   Giới tính: ${p.targetAudience}
   Đánh giá: ${p.averageRating}/5
   Mô tả: ${p.description}
`).join('\n');
      }

      prompt += `\nCâu hỏi của khách hàng: ${query}\n\nHãy trả lời bằng tiếng Việt, tự nhiên và chuyên nghiệp.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();

      return response;
    } catch (error) {
      console.error('Error in chat:', error);
      throw new Error('Failed to process chat request');
    }
  },

  /**
   * Chat với Gemini về nước hoa với streaming
   * @param {string} query - Câu hỏi của user
   * @param {Object} context - Context về perfumes (optional)
   * @returns {AsyncGenerator} - Stream response từ AI
   */
  async *chatStream(query, context = {}) {
    try {
      const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

      let prompt = `
Bạn là một chuyên gia tư vấn nước hoa chuyên nghiệp. Hãy trả lời câu hỏi sau của khách hàng một cách thân thiện, hữu ích và chuyên môn.

`;

      // Thêm context nếu có
      if (context.perfumes && context.perfumes.length > 0) {
        prompt += `\nCác nước hoa có sẵn trong hệ thống:\n`;
        prompt += context.perfumes.map((p, idx) => `
${idx + 1}. ${p.perfumeName} - ${p.brand?.brandName}
   Giá: ${p.price.toLocaleString('vi-VN')}₫
   Nồng độ: ${p.concentration}
   Giới tính: ${p.targetAudience}
   Đánh giá: ${p.averageRating}/5
   Mô tả: ${p.description}
`).join('\n');
      }

      prompt += `\nCâu hỏi của khách hàng: ${query}\n\nHãy trả lời bằng tiếng Việt, tự nhiên và chuyên nghiệp.`;

      const result = await model.generateContentStream(prompt);

      // Stream từng chunk của response
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error) {
      console.error('Error in chat stream:', error);
      throw new Error('Failed to process chat stream request');
    }
  }
};
