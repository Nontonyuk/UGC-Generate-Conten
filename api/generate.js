module.exports = async function handler(req, res) {
  // =========================================
  // CORS
  // =========================================
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
    // =========================================
    // ENV CHECK
    // =========================================
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY not found in Vercel Environment Variables"
      });
    }

    // =========================================
    // REQUEST BODY
    // =========================================
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
    } = req.body || {};

    // =========================================
    // VALIDATION
    // =========================================
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

    // =========================================
    // MASTER PROMPT — V4 CORE ENGINE
    // =========================================
    const masterPrompt = `
Kamu adalah:

UGC Prompt Engine V4 CORE

Tugasmu:
Buat output JSON ONLY.
Tanpa penjelasan tambahan.
Tanpa markdown.
Tanpa code block.

==================================================
V4 CORE ENGINE RULES
==================================================

Tujuan utama:
menghasilkan prompt UGC realistis untuk TikTok Affiliate
dengan hasil:
- manusia realistis
- non AI look
- karakter konsisten
- produk konsisten
- video natural
- voice over natural
- creator feel authentic
- Gen Z relatable

==================================================
ENGINE 1 — IDENTITY LOCK
==================================================

WAJIB mengunci:

- wajah karakter
- usia karakter
- facial asymmetry
- skin texture
- body type
- hair style
- outfit consistency
- natural makeup
- Indonesian creator look
- product shape consistency
- product logo visibility
- product detail consistency
- lighting consistency
- creator vibe consistency

==================================================
ENGINE 2 — NANO BANANA CORE
==================================================

Untuk IMAGE PROMPT wajib:

- ultra realistic human
- realistic skin pores
- natural skin texture
- realistic hands
- realistic shadows
- realistic fabric folds
- realistic shoe texture
- smartphone camera realism
- handheld creator feel
- natural daylight
- warm realistic indoor light
- casual social media look
- candid creator vibe
- authentic Indonesian Gen Z creator
- non cinematic
- non studio shoot
- non fashion editorial
- no glossy AI skin
- no doll face
- no uncanny valley

Prompt harus spesifik untuk Nano Banana Pro.

==================================================
ENGINE 3 — GOOGLE FLOW CORE
==================================================

Untuk VIDEO PROMPT wajib:

- smooth movement
- realistic walking physics
- realistic body balance
- realistic hand gestures
- realistic eye movement
- subtle facial movement
- smooth camera movement
- no sudden movement
- no teleport motion
- no weird AI movement
- handheld creator video realism
- natural creator motion
- social media authentic feel

Wajib format timeline 8 detik:

0s–2s
2s–4s
4s–6s
6s–8s

==================================================
ENGINE 4 — VOICE ENGINE CORE
==================================================

Untuk VOICE wajib:

- Gen Z female voice
- natural Indonesian creator tone
- warm
- relatable
- soft spoken
- casual conversational
- natural breathing
- subtle emotional nuance
- authentic creator speaking style
- non robotic
- non hard selling
- like talking to close friend

==================================================
INPUT DATA
==================================================

Nama Produk:
${productName}

Jenis Produk:
${productType || "-"}

Fungsi Produk:
${productFunction}

Target Market:
${targetMarket}

Problem Customer:
${customerProblem}

Gaya Konten:
${contentStyle || "Soft Selling"}

Jumlah Scene:
${sceneCount || 4}

Tipe Hook:
${hookType || "Curiosity Hook"}

Tipe CTA:
${ctaType || "Soft CTA"}

==================================================
IDENTITY LOCK DATA
==================================================

Nama Karakter:
${characterName || "Alya"}

Detail Karakter:
${
  characterDetail ||
  "Wanita Indonesia usia 24-28 tahun, Gen Z creator, natural face, realistic skin texture, relatable, casual stylish outfit"
}

Detail Produk:
${
  productDetail ||
  "Produk premium, clean aesthetic, realistic usage, visible logo, consistent appearance"
}

==================================================
OUTPUT FORMAT JSON WAJIB
==================================================

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

  "identity_lock": {
    "character_lock": "",
    "product_lock": "",
    "lighting_lock": "",
    "style_lock": ""
  },

  "scene_breakdown": [
    {
      "scene_number": 1,

      "main_visual": "",

      "camera_angle": "",

      "facial_expression": "",

      "hand_gesture": "",

      "background": "",

      "lighting": "",

      "visual_mood": "",

      "nano_banana_image_prompt": "",

      "google_flow_video_prompt": "",

      "voice_over": "",

      "tone_of_voice": "",

      "speaking_style": "",

      "timeline_8s": {
        "0s_2s": "",
        "2s_4s": "",
        "4s_6s": "",
        "6s_8s": ""
      }
    }
  ]
}

==================================================
FINAL RULES
==================================================

WAJIB:
- JSON ONLY
- jangan beri penjelasan
- jangan markdown
- jangan code block
- setiap scene wajib lengkap
- prompt harus detail
- prompt harus spesifik
- prompt harus realistis
- prompt harus production-ready
`;

    // =========================================
    // GEMINI ENDPOINT
    // =========================================
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    // =========================================
    // GEMINI REQUEST
    // =========================================
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
          maxOutputTokens: 4096
        }
      })
    });

    const data = await geminiResponse.json();

    // =========================================
    // GEMINI RESPONSE CHECK
    // =========================================
    if (!geminiResponse.ok) {
      return res.status(500).json({
        success: false,
        error: "Gemini API request failed",
        details: data
      });
    }

    // =========================================
    // EXTRACT RAW TEXT
    // =========================================
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // =========================================
    // SAFE JSON PARSER
    // =========================================
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

    // =========================================
    // SUCCESS RESPONSE
    // =========================================
    return res.status(200).json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};
