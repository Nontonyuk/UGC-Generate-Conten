export default async function handler(req, res) {
  // ========================================
  // CORS FIX
  // ========================================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST request only."
    });
  }

  try {
    // ========================================
    // ENV CHECK
    // ========================================
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY not found in Vercel Environment Variables"
      });
    }

    // ========================================
    // REQUEST BODY
    // ========================================
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
      characterName,
      characterDetail,
      productDetail
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================
    if (
      !productName ||
      !productFunction ||
      !targetMarket ||
      !customerProblem
    ) {
      return res.status(400).json({
        success: false,
        error:
          "productName, productFunction, targetMarket, customerProblem wajib diisi"
      });
    }

    // ========================================
    // MASTER PROMPT V3 PRO MAX
    // ========================================
    const masterPrompt = `
Kamu adalah UGC Prompt Engine V3 PRO MAX.

Tugasmu:
Buat output JSON ONLY tanpa penjelasan tambahan.

Output harus sangat advanced, realistis, natural, human-like, Gen Z style, dan profesional.

PRINSIP WAJIB:

- hasil gambar harus realistis seperti foto manusia asli
- tekstur kulit natural
- pencahayaan realistis seperti kamera HP
- bukan cinematic berlebihan
- bukan AI look
- natural candid
- ekspresi manusia nyata
- wajah konsisten
- karakter identity lock kuat
- usia Gen Z
- tone voice Gen Z alami
- voice over natural seperti creator asli
- video movement smooth
- transisi natural
- camera movement realistic
- tidak patah-patah
- tidak teleport movement
- tidak fake AI movement

DATA PRODUK:

Nama Produk: ${productName}
Jenis Produk: ${productType}
Fungsi Produk: ${productFunction}
Target Market: ${targetMarket}
Problem Customer: ${customerProblem}
Gaya Konten: ${contentStyle}
Jumlah Scene: ${sceneCount}
Tipe Hook: ${hookType}
Tipe CTA: ${ctaType}

IDENTITY LOCK:

Nama Karakter: ${characterName || "Alya"}
Detail Karakter: ${
      characterDetail ||
      "Wanita Indonesia 24-28 tahun, wajah natural, Gen Z, relatable, casual stylish"
    }

DETAIL PRODUK:

${productDetail || "produk premium, clean, aesthetic"}

FORMAT JSON WAJIB:

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
    "supporting_caption": ""
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
      "transition": "",

      "image_prompt": "",
      "video_prompt": ""
    }
  ],

  "nano_banana_prompt": "",

  "google_flow_prompt": "",

  "identity_lock_prompt": ""
}

WAJIB:
- setiap scene harus punya image_prompt
- setiap scene harus punya video_prompt
- prompt harus sangat detail
- prompt harus realistis
- prompt harus konsisten karakter
- prompt harus siap pakai untuk AI image + AI video
- JSON ONLY
`;

    // ========================================
    // GEMINI API CALL
    // ========================================
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
          maxOutputTokens: 8192
        }
      })
    });

    const data = await geminiResponse.json();

    // ========================================
    // GEMINI RESPONSE CHECK
    // ========================================
    if (!geminiResponse.ok) {
      return res.status(500).json({
        success: false,
        error: "Gemini API request failed",
        details: data
      });
    }

    // ========================================
    // CLEAN RAW TEXT
    // ========================================
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    } catch (jsonError) {
      return res.status(500).json({
        success: false,
        error: "Failed to parse Gemini JSON output",
        raw_output: cleanedText
      });
    }

    // ========================================
    // SUCCESS RESPONSE
    // ========================================
    return res.status(200).json({
      success: true,
      data: parsed
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
}- no split image
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
  console.error("GEMINI ERROR RESPONSE:", JSON.stringify(data, null, 2));

  return res.status(500).json({
    error: "Gemini API request failed",
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
  console.error("FULL ERROR:", error);
  console.error("ERROR MESSAGE:", error.message);
  console.error("ERROR STACK:", error.stack);

  return res.status(500).json({
    error: "Internal server error",
    message: error.message,
    stack: error.stack
  });
  }
