// Vercel Backend Proxy for Blogger + Google AI Studio (Gemini API)
// File location:
// /api/generate.js

export default async function handler(req, res) {

  // CORS FIX
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      productName,
      productType,
      productFunction,
      targetMarket,
      customerProblem,
      contentStyle,
      sceneCount,
      hookType,
      ctaType,
      targetPlatform,
      contentLanguage
    } = req.body;

    // Basic validation
    if (!productName || !productFunction || !targetMarket) {
      return res.status(400).json({
        error: 'productName, productFunction, and targetMarket are required.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY in environment variables.'
      });
    }

    // ===== MASTER PROMPT SYSTEM =====
    const masterPrompt = `
Anda adalah pakar UGC TikTok Affiliate premium dengan spesialisasi:
- Viral retention tinggi
- Conversion tinggi
- Realistic UGC content
- Nano Banana Pro image prompting
- Google Flow video prompting
- Prompt chaining system

Tugas Anda:
Buatkan output JSON terstruktur dengan kualitas premium.

DATA USER:
- Nama Produk: ${productName}
- Jenis Produk: ${productType || '-'}
- Fungsi Produk: ${productFunction}
- Target Market: ${targetMarket}
- Problem Customer: ${customerProblem || '-'}
- Gaya Konten: ${contentStyle || '-'}
- Jumlah Scene: ${sceneCount || '5'}
- Tipe Hook: ${hookType || '-'}
- Tipe CTA: ${ctaType || '-'}
- Platform Target: ${targetPlatform || 'TikTok'}
- Bahasa Konten: ${contentLanguage || 'Indonesia'}

WAJIB:
Setiap scene HARUS memiliki:

1. image_prompt terpisah
2. video_prompt terpisah

JANGAN buat 1 prompt global.

HARUS per scene.

Image prompt:
- realistic human
- smartphone photo
- no AI look
- no split image
- no collage

Video prompt:
- smooth movement
- natural walking
- no robotic motion
- realistic lighting
- subtle handheld

3. Konten realistis seperti creator asli
4. Tidak terasa AI generated
5. Tidak terlalu salesy
6. Conversion tinggi
7. Hook kuat di 2 detik pertama
8. CTA natural
9. Konsistensi karakter & produk
10. Prompt gambar sangat detail
11. Prompt video natural movement
12. Output HARUS JSON valid

RETURN JSON FORMAT ONLY:

{
  "content_ideas": [
    {
      "title": "",
      "hook": "",
      "selling_angle": "",
      "viral_reason": ""
    }
  ],

  "ugc_script": {
    "hook_2_seconds": "",
    "full_script": "",
    "cta_closing": "",
    "supporting_caption": "",
    "voice_style": ""
  },

  "scene_breakdown": [
    {
      "scene_number": 1,
      "main_visual": "",
      "camera_angle": "",
      "facial_expression": "",
      "hand_gesture": "",
      "background": "",
      "supporting_props": "",
      "lighting": "",
      "visual_mood": "",
      "transition": ""
    }
  ],

  "scene_prompts": [
    {
      "scene_number": 1,

      "image_prompt": "",

      "video_prompt": ""
    }
  ],

  "identity_lock": {
    "character_lock": "",
    "product_lock": "",
    "lighting_lock": "",
    "style_lock": "",
    "voice_lock": ""
  }
}

Jangan tambahkan penjelasan lain.
JSON only.
`;

    // ===== GEMINI API CALL =====
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: masterPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4096
        }
      })
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(500).json({
        error: 'Gemini API request failed',
        details: data
      });
    }

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Remove markdown fences if Gemini returns them
    const cleanedText = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    } catch (jsonError) {
      return res.status(500).json({
        error: 'Failed to parse Gemini JSON output',
        raw_output: cleanedText
      });
    }

    return res.status(200).json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
