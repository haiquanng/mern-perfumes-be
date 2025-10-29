# AI Endpoints Guide - Gemini Integration

## 1. Get Similar Perfumes (AI Analysis)

Tìm nước hoa tương tự dựa trên AI phân tích

### Endpoint
```
GET /api/ai/similar/:perfumeId
```

### Query Parameters
- `forceRefresh` (optional): `true` | `false` - Force AI re-analysis instead of using cache

### Examples

**Using cache:**
```bash
curl http://localhost:4000/api/ai/similar/507f1f77bcf86cd799439011
```

**Force refresh:**
```bash
curl http://localhost:4000/api/ai/similar/507f1f77bcf86cd799439011?forceRefresh=true
```

### Response
```json
{
  "perfumes": [
    {
      "_id": "...",
      "perfumeName": "Chanel Bleu",
      "brand": {
        "_id": "...",
        "brandName": "Chanel"
      },
      "price": 3500000,
      "concentration": "EDP",
      "description": "..."
    }
  ],
  "source": "ai_analysis",
  "analyzedAt": "2025-10-30T..."
}
```

---

## 2. Get AI Summary

Tóm tắt AI về nước hoa từ reviews

### Endpoint
```
GET /api/ai/summary/:perfumeId
```

### Query Parameters
- `forceRefresh` (optional): `true` | `false` - Force AI re-generation instead of using cache

### Examples

**Using cache:**
```bash
curl http://localhost:4000/api/ai/summary/507f1f77bcf86cd799439011
```

**Force refresh:**
```bash
curl http://localhost:4000/api/ai/summary/507f1f77bcf86cd799439011?forceRefresh=true
```

### Response
```json
{
  "summary": "Dior Sauvage là một EDT nam tính với hương thơm tươi mát, phù hợp cho mọi dịp...",
  "source": "ai_generated",
  "generatedAt": "2025-10-30T...",
  "reviewsCount": 15
}
```

---

## 3. Chat with AI (Non-Streaming)

Chat với AI về nước hoa - Response trả về một lần

### Endpoint
```
POST /api/ai/chat
```

### Request Body
```json
{
  "query": "Gợi ý nước hoa nam tính cho mùa hè",
  "includeContext": true,
  "stream": false
}
```

### Parameters
- `query` (required): Câu hỏi của user (max 1000 chars)
- `includeContext` (optional): `true` | `false` - Include top 50 perfumes in context
- `stream` (optional): `false` - Non-streaming response

### Example

```bash
curl -X POST http://localhost:4000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Nước hoa nào phù hợp cho dân văn phòng?",
    "includeContext": true
  }'
```

### Response
```json
{
  "reply": "Đối với dân văn phòng, tôi gợi ý các dòng nước hoa...",
  "query": "Nước hoa nào phù hợp cho dân văn phòng?",
  "timestamp": "2025-10-30T..."
}
```

---

## 4. Chat with AI (Streaming)

Chat với AI về nước hoa - Response được stream theo từng chunk (real-time)

### Endpoint
```
POST /api/ai/chat
```

### Request Body
```json
{
  "query": "Gợi ý nước hoa nam tính cho mùa hè",
  "includeContext": false,
  "stream": true
}
```

### Parameters
- `query` (required): Câu hỏi của user (max 1000 chars)
- `includeContext` (optional): `true` | `false` - Include top 50 perfumes in context
- `stream` (required): `true` - Enable streaming

### Example với curl

```bash
curl -X POST http://localhost:4000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Gợi ý 3 nước hoa nam tính giá dưới 2 triệu",
    "includeContext": true,
    "stream": true
  }'
```

### Response (Server-Sent Events)

Stream format:
```
data: {"type":"connected","timestamp":"2025-10-30T..."}

data: {"type":"chunk","content":"Dưới"}

data: {"type":"chunk","content":" đây"}

data: {"type":"chunk","content":" là"}

data: {"type":"chunk","content":" 3"}

data: {"type":"done","timestamp":"2025-10-30T..."}
```

### Example với JavaScript (Frontend)

```javascript
// Streaming chat example
async function streamingChat(query, includeContext = false) {
  const response = await fetch('http://localhost:4000/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      includeContext: includeContext,
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));

        if (data.type === 'connected') {
          console.log('Connected to AI');
        } else if (data.type === 'chunk') {
          // Display chunk content in real-time
          process.stdout.write(data.content);
        } else if (data.type === 'done') {
          console.log('\nDone!');
        } else if (data.type === 'error') {
          console.error('Error:', data.message);
        }
      }
    }
  }
}

// Usage
streamingChat('Gợi ý nước hoa nam giá rẻ', true);
```

### Example với EventSource (Frontend - Simpler)

```javascript
// Note: EventSource chỉ support GET, không support POST
// Nên cần dùng fetch API như ví dụ trên
```

### Example với Python

```python
import requests
import json

def streaming_chat(query, include_context=False):
    url = "http://localhost:4000/api/ai/chat"
    payload = {
        "query": query,
        "includeContext": include_context,
        "stream": True
    }

    response = requests.post(url, json=payload, stream=True)

    for line in response.iter_lines():
        if line:
            line_str = line.decode('utf-8')
            if line_str.startswith('data: '):
                data = json.loads(line_str[6:])

                if data['type'] == 'connected':
                    print('Connected to AI')
                elif data['type'] == 'chunk':
                    print(data['content'], end='', flush=True)
                elif data['type'] == 'done':
                    print('\nDone!')
                elif data['type'] == 'error':
                    print(f"\nError: {data['message']}")

# Usage
streaming_chat('Gợi ý nước hoa unisex', True)
```

---

## Features

### 1. Smart Caching
- AI results được cache trong `GeminiCache` collection
- Giảm chi phí API calls
- Use `forceRefresh=true` để refresh cache

### 2. Context-Aware Chat
- Set `includeContext: true` để AI biết về top 50 perfumes trong hệ thống
- AI có thể recommend cụ thể các sản phẩm có sẵn

### 3. Streaming Support
- Real-time response streaming
- Better UX cho chat
- Sử dụng Server-Sent Events (SSE)

### 4. Error Handling
- Proper error responses
- Stream error handling
- Validation với Zod

---

## Response Types

### Cache Source
```json
{
  "source": "cache",
  "cachedAt": "2025-10-30T..."
}
```

### AI Analysis Source
```json
{
  "source": "ai_analysis",
  "analyzedAt": "2025-10-30T..."
}
```

### AI Generated Source
```json
{
  "source": "ai_generated",
  "generatedAt": "2025-10-30T..."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Query is required and must be a string"
}
```

### 404 Not Found
```json
{
  "message": "Perfume not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to process chat request",
  "error": "API error details..."
}
```

---

## Environment Variables

Make sure you have Gemini API key in `.env`:
```
GEMINI_API_KEY=AIzaSyCZ4BkGkFi7f7zgdIfSGS9Dff63ayXAjb8
```

---

## Models Used

All endpoints use: `gemini-1.5-flash`

Prompts are optimized for Vietnamese language responses.
