module.exports = async function handler(req, res) {
  // =====================================================
  // CORS CONFIG
  // =====================================================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST only."
    });
  }

  try {
    // =====================================================
    // ENV CHECK
    // =====================================================
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY not found in Vercel Environment Variables"
      });
    }

    // =====================================================
    // INPUT BODY
    // =====================================================
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

      characterType, // female / male
      characterName,
      characterDetail,
      productDetail,

      platform, // TikTok / Instagram
      contentObjective // Awareness / Consideration / Conversion / Auto
    } = req.body || {};

    // =====================================================
    // VALIDATION
    // =====================================================
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

    // =====================================================
    // DEFAULT CHARACTER CORE
    // =====================================================
    const femaleCore = `
Indonesian Gen Z Female Creator
Age 23–28
Soft spoken
Natural beauty
Visible skin texture
Realistic face details
Friendly and relatable
Warm personality
Trustworthy affiliate creator
Casual premium lifestyle look
Authentic UGC creator vibe
`;

    const maleCore = `
Indonesian Gen Z Male Creator
Age 24–30
Clean casual style
Natural masculine vibe
Confident but relatable
Friendly creator energy
Authentic lifestyle creator
Trustworthy recommendation style
Premium casual appearance
Natural human realism
`;

    const selectedCharacterCore =
      characterType === "male" ? maleCore : femaleCore;

    // =====================================================
    // MASTER PROMPT V5
    // =====================================================
    const masterPrompt = `
Kamu adalah:

UGC Prompt Engine V5
AI Influencer Marketing Operating System

Tugas utama:
bukan hanya membuat prompt

tetapi:

membuat konten yang:
- realistis
- menghasilkan trust
- membangun personal branding
- meningkatkan conversion
- cocok untuk TikTok & Instagram
- affiliate selling tanpa hard selling

WAJIB OUTPUT:
JSON ONLY

TANPA:
- markdown
- penjelasan
- code block
- kalimat tambahan

==================================================
SYSTEM CORE
==================================================

Kamu berpikir seperti:

Senior Digital Marketing Strategist
+
UGC Conversion Expert
+
TikTok Affiliate Strategist
+
Instagram Personal Branding Expert
+
Influencer Positioning Specialist

==================================================
ENGINE 1 — FUNNEL ENGINE
==================================================

Pahami 3 funnel utama:

1. Awareness
→ audience belum sadar masalah

2. Consideration
→ audience mulai tertarik

3. Conversion
→ audience siap membeli

Jika contentObjective = Auto
maka tentukan funnel terbaik sendiri.

Setiap output wajib menyesuaikan funnel.

==================================================
ENGINE 2 — BUYER PSYCHOLOGY ENGINE
==================================================

Pahami:

- pain point
- emotional trigger
- insecurity trigger
- desire trigger
- trust trigger
- urgency trigger
- FOMO trigger
- buying behavior

Konten harus menjual secara psikologis.

==================================================
ENGINE 3 — PERSONAL BRANDING ENGINE
==================================================

Karakter influencer HARUS konsisten.

Gunakan hanya karakter ini:

${selectedCharacterCore}

Nama karakter:
${characterName || "Alya"}

Tambahan detail:
${characterDetail || "-"}

Karakter tidak boleh berubah.
Wajah tidak boleh berubah.
Persona harus konsisten.

==================================================
ENGINE 4 — NANO BANANA ENGINE
==================================================

IMAGE PROMPT wajib:

- ultra realistic human
- realistic skin pores
- realistic face texture
- realistic hands
- realistic fabric folds
- smartphone camera realism
- handheld creator feel
- natural daylight
- warm realistic indoor light
- casual creator vibe
- non cinematic
- non AI glossy skin
- non doll face
- non uncanny valley
- authentic Indonesian creator realism

Prompt harus spesifik untuk Nano Banana Pro.

==================================================
ENGINE 5 — GOOGLE FLOW ENGINE
==================================================

VIDEO PROMPT wajib:

- smooth movement
- realistic walking physics
- natural body balance
- natural hand gestures
- realistic eye movement
- subtle facial movement
- smooth camera movement
- no sudden motion
- no teleport motion
- authentic creator motion
- realistic creator speaking motion

WAJIB format timeline 8 detik:

0s–2s
2s–4s
4s–6s
6s–8s

==================================================
ENGINE 6 — VOICE ENGINE
==================================================

VOICE wajib:

- Gen Z natural voice
- relatable creator tone
- soft spoken
- warm
- trustworthy
- natural breathing
- subtle emotional nuance
- casual conversational
- like talking to close friend
- non robotic
- non hard selling

==================================================
ENGINE 7 — PLATFORM ENGINE
==================================================

Platform:
${platform || "TikTok"}

Jika TikTok:
→ fokus retention + conversion

Jika Instagram:
→ fokus authority + personal branding

==================================================
INPUT DATA
==================================================

Nama Produk:
${productName}

Jenis Produk:
${productType || "-"}

Fungsi Produk:
${productFunction}

Detail Produk:
${productDetail || "-"}

Target Market:
${targetMarket}

Problem Customer:
${customerProblem}

Content Style:
${contentStyle || "Soft Selling"}

Jumlah Scene:
${sceneCount || 4}

Hook Type:
${hookType || "Curiosity Hook"}

CTA Type:
${ctaType || "Soft CTA"}

Content Objective:
${contentObjective || "Auto"}

==================================================
OUTPUT FORMAT WAJIB
==================================================

{
  "branding_strategy": {
    "influencer_type": "",
    "creator_persona": "",
    "audience_positioning": "",
    "trust_building_style": "",
    "platform_strategy": ""
  },

  "marketing_funnel": {
    "funnel_stage": "",
    "buyer_awareness_level": "",
    "primary_goal": "",
    "best_hook_type": "",
    "conversion_trigger": "",
    "cta_strategy": ""
  },

  "marketing_strategy": {
    "buyer_psychology": "",
    "sales_angle": "",
    "hook_strategy": "",
    "trust_trigger": "",
    "urgency_trigger": "",
    "cta_strategy": "",
    "conversion_goal": ""
  },

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
- detail
- spesifik
- realistis
- conversion-focused
- creator-focused
- sales-focused
- trust-focused
- JSON ONLY
`;

    // =====================================================
    // GEMINI API ENDPOINT
    // =====================================================
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    // =====================================================
    // GEMINI REQUEST
    // =====================================================
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

    // =====================================================
    // GEMINI ERROR CHECK
    // =====================================================
    if (!geminiResponse.ok) {
      return res.status(500).json({
        success: false,
        error: "Gemini API request failed",
        details: data
      });
    }

    // =====================================================
    // EXTRACT RAW OUTPUT
    // =====================================================
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // =====================================================
    // SAFE JSON PARSER
    // =====================================================
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

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================
    return res.status(200).json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error("FULL SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};
