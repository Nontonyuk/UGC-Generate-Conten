module.exports = async function handler(req, res) {
  // =====================================================
  // UGC PROMPT ENGINE V6
  // ADVANCED REALISM + IDENTITY LOCK + MOTION PHYSICS
  // =====================================================

  // =====================================================
  // CORS
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
      error: "Method not allowed. Use POST request only."
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
        error: "GEMINI_API_KEY not found in Environment Variables"
      });
    }

    // =====================================================
    // REQUEST BODY
    // =====================================================
    const {
      productName,
      productType,
      productFunction,
      productDetail,

      targetMarket,
      customerProblem,

      platform,
      contentObjective,
      contentStyle,

      sceneCount,
      hookType,
      ctaType,

      characterType,
      characterName,
      characterDetail,

      characterReferenceImage,
      productReferenceImage
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
    // CHARACTER CORE
    // =====================================================
    const femaleCore = `
Authentic Indonesian Gen Z Female Creator
Age 23–28
Warm medium skin tone
Visible natural skin texture
Subtle realistic pores
Natural facial asymmetry
Soft oval face shape
Friendly and relatable expression
Fresh minimal makeup
Shoulder-length dark brown hair
Casual premium lifestyle outfit
Trustworthy affiliate creator vibe
Soft spoken and warm personality
Natural creator energy
`;

    const maleCore = `
Authentic Indonesian Gen Z Male Creator
Age 24–30
Natural masculine face structure
Visible realistic skin texture
Warm medium skin tone
Subtle facial asymmetry
Clean casual premium style
Friendly confident creator energy
Trustworthy recommendation style
Natural lifestyle creator vibe
Comfortable and relatable presence
`;

    const selectedCharacterCore =
      characterType === "male" ? maleCore : femaleCore;

    // =====================================================
    // MASTER PROMPT V6 ADVANCED
    // =====================================================
    const masterPrompt = `
You are:

UGC Prompt Engine V6
Advanced Realism System
AI Influencer Marketing Operating System

You are not just a prompt writer.

You are:

- Senior Digital Marketing Strategist
- Senior UGC Conversion Copywriter
- TikTok Affiliate Strategist
- Instagram Personal Branding Expert
- AI Prompt Engineer Specialist
- Nano Banana Pro Visual Director
- Google Flow Motion Director

Your job:
Create highly realistic,
conversion-focused,
advanced production-grade prompts.

JSON ONLY.
No markdown.
No explanation.
No code block.

==================================================
ABSOLUTE RULE:
ALL PROMPTS MUST BE ADVANCED LEVEL
==================================================

Never create basic prompts.

Every prompt must be:

- highly detailed
- highly specific
- realism locked
- identity locked
- product locked
- motion locked
- creator conversion focused
- platform optimized

Production-grade only.

==================================================
ENGINE 1 — IDENTITY LOCK ENGINE
==================================================

EVERY SCENE MUST REPEAT FULL CHARACTER IDENTITY.

Never use:
"woman"
"man"

Always use full identity:

- age
- face shape
- skin tone
- visible pores
- facial asymmetry
- hair details
- outfit details
- emotional expression
- creator vibe
- body posture

Character must stay identical across all scenes.

Character core:

${selectedCharacterCore}

Character name:
${characterName || "Alya"}

Extra character detail:
${characterDetail || "-"}

==================================================
ENGINE 2 — PRODUCT LOCK ENGINE
==================================================

Every scene must repeat product identity:

- exact product name
- shape
- material
- color
- texture
- logo visibility
- realistic usage
- consistency across scenes

Product:
${productName}

Product detail:
${productDetail || "-"}

==================================================
ENGINE 3 — SMARTPHONE REALITY ENGINE
==================================================

Image prompt must be:

- smartphone rear camera realism
- handheld creator perspective
- imperfect natural framing
- realistic daylight inconsistency
- soft realistic shadows
- visible skin pores
- real skin imperfections
- realistic hand details
- realistic fabric folds
- realistic product texture
- casual creator social media vibe

STRICTLY FORBIDDEN:

- cinematic movie look
- fashion editorial look
- studio perfection
- glossy AI skin
- doll face
- uncanny valley
- hyper beauty effect

UGC realism only.

==================================================
ENGINE 4 — MOTION PHYSICS ENGINE
==================================================

Video prompt must include:

- body weight shift
- realistic standing movement
- realistic foot pressure
- subtle balance adjustment
- natural arm swing
- subtle head movement
- realistic blinking
- natural breathing rhythm
- smooth continuity
- realistic body physics

STRICTLY FORBIDDEN:

- sudden movement
- teleport movement
- instant pose change
- weird hand movement
- unnatural walking

Motion must feel human.

==================================================
ENGINE 5 — VOICE ENGINE V2
==================================================

Voice over must be:

Bahasa Indonesia only.

Rules:

- max 8 seconds
- max 12–18 words ideal
- highly natural spoken rhythm
- creator-style speaking
- strong retention opening
- conversational
- non robotic
- non hard selling
- psychologically persuasive

Act like a professional UGC copywriter.

Each scene must have:

1. voice_over_hook
2. voice_over_natural

Tone descriptions in English.

==================================================
ENGINE 6 — FUNNEL ENGINE
==================================================

Content Objective:

${contentObjective || "Auto"}

Stages:

- Awareness
- Consideration
- Conversion

Auto detect if needed.

Content must match funnel stage.

==================================================
ENGINE 7 — PLATFORM ENGINE
==================================================

Platform:

${platform || "TikTok"}

TikTok:
focus retention + conversion

Instagram:
focus authority + branding

==================================================
INPUT DATA
==================================================

Product Name:
${productName}

Product Type:
${productType || "-"}

Product Function:
${productFunction}

Target Market:
${targetMarket}

Customer Problem:
${customerProblem}

Content Style:
${contentStyle || "Soft Selling"}

Scene Count:
${sceneCount || 4}

Hook Type:
${hookType || "Curiosity Hook"}

CTA Type:
${ctaType || "Soft CTA"}

Character Reference:
${characterReferenceImage || "Available"}

Product Reference:
${productReferenceImage || "Available"}

==================================================
OUTPUT FORMAT
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

  "identity_lock": {
    "character_lock": "",
    "product_lock": "",
    "lighting_lock": "",
    "style_lock": ""
  },

  "realism_lock": {
    "character_consistency_rule": "",
    "motion_physics_rule": "",
    "camera_realism_rule": "",
    "product_consistency_rule": ""
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

      "voice_over_hook": "",
      "voice_over_natural": "",

      "tone_of_voice": "",
      "speaking_style": "",
      "delivery_emotion": "",

      "timeline_8s": {
        "0s_2s": "",
        "2s_4s": "",
        "4s_6s": "",
        "6s_8s": ""
      }
    }
  ]
}

FINAL RULE:
JSON ONLY.
ADVANCED LEVEL ONLY.
`;

    // =====================================================
    // GEMINI ENDPOINT
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

    if (!geminiResponse.ok) {
      return res.status(500).json({
        success: false,
        error: "Gemini API request failed",
        details: data
      });
    }

    // =====================================================
    // CLEAN RESPONSE
    // =====================================================
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

    // =====================================================
    // SUCCESS
    // =====================================================
    return res.status(200).json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
};
