module.exports = async function handler(req, res) {
  // =====================================================
  // V12 STRUCTURED PROMPT ENGINE
  // JSON-FIRST SYSTEM
  // NANO BANANA PRO + GOOGLE FLOW + UGC REALISTIC ONLY
  // NO CINEMATIC • HOOK CTA FIRST • STRUCTURED PROMPT
  // =====================================================
  // FIX: Image Reference sekarang dikirim sebagai Base64
  //      dan diproses oleh Gemini Vision API
  // =====================================================

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: "GEMINI_API_KEY not found" });
    }

    // =====================================================
    // BODY — TERMASUK BASE64 GAMBAR
    // =====================================================
    const {
      productName, productType, productFunction, productDetail,
      targetMarket, customerProblem,
      platform, contentObjective, contentStyle,
      sceneCount, hookType, ctaType,
      characterType, characterName, characterDetail,

      // ✅ FIX: Sekarang menerima Base64, bukan nama file
      characterReferenceImage,   // Base64 string
      characterReferenceMime,    // e.g. "image/jpeg"
      productReferenceImage,     // Base64 string
      productReferenceMime,      // e.g. "image/png"
      hasCharacterImage,
      hasProductImage
    } = req.body || {};

    if (!productName || !productFunction || !targetMarket || !customerProblem) {
      return res.status(400).json({
        success: false,
        error: "productName, productFunction, targetMarket, customerProblem wajib diisi"
      });
    }

    const finalSceneCount = Number(sceneCount) || 4;

    // =====================================================
    // STEP 1: ANALYZE REFERENCE IMAGES WITH GEMINI VISION
    // Jika ada gambar, ekstrak detail visual dulu
    // =====================================================
    let characterAnalysisResult = "";
    let productAnalysisResult = "";

    // ANALYZE CHARACTER IMAGE
    if (hasCharacterImage && characterReferenceImage && characterReferenceMime) {
      try {
        const charAnalysisPrompt = `You are a Visual Consistency Analyst for UGC content creation.

Analyze this character/talent reference image and extract ALL visual details needed for consistent AI image generation across multiple scenes.

Extract and structure these details:
1. PHYSICAL: skin tone (specific shade), face shape, eye shape/color, nose, lips, eyebrows
2. DISTINGUISHING FEATURES: moles, dimples, unique facial characteristics
3. STYLE: hair color/length/texture, outfit style, accessories
4. CREATOR ENERGY: authenticity level, vibe, relatable factor
5. CONSISTENCY ANCHORS: top 5 visual elements that MUST stay identical in every scene
6. UGC SUITABILITY: naturalness score, believability assessment

Format as structured text. Be specific and precise. This will be used to generate consistent UGC content.`;

        const charVisionResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  {
                    inline_data: {
                      mime_type: characterReferenceMime,
                      data: characterReferenceImage
                    }
                  },
                  { text: charAnalysisPrompt }
                ]
              }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
            })
          }
        );

        const charData = await charVisionResponse.json();
        characterAnalysisResult = charData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } catch (err) {
        console.error("Character image analysis failed:", err);
        characterAnalysisResult = "[Character image analysis failed - using default character core]";
      }
    }

    // ANALYZE PRODUCT IMAGE
    if (hasProductImage && productReferenceImage && productReferenceMime) {
      try {
        const prodAnalysisPrompt = `You are a Product Visual Consistency Analyst for UGC content creation.

Analyze this product reference image and extract ALL visual details needed for consistent AI image generation across multiple scenes.

Extract and structure these details:
1. COLOR PALETTE: exact colors for every part (provide hex codes if possible)
2. MATERIALS & TEXTURES: describe material of each section precisely
3. SHAPE & SILHOUETTE: overall form, proportions, dimensions description
4. BRAND ELEMENTS: logo position, size, color, typography
5. UNIQUE DESIGN DETAILS: patterns, seams, hardware, special features
6. CONSISTENCY RULES: top 5 visual elements that MUST never change across scenes
7. ANGLE NOTES: what's visible from this angle, what angles would show more

Format as structured text. Be specific and precise. This will be used to maintain product consistency in every UGC scene.`;

        const prodVisionResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  {
                    inline_data: {
                      mime_type: productReferenceMime,
                      data: productReferenceImage
                    }
                  },
                  { text: prodAnalysisPrompt }
                ]
              }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
            })
          }
        );

        const prodData = await prodVisionResponse.json();
        productAnalysisResult = prodData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } catch (err) {
        console.error("Product image analysis failed:", err);
        productAnalysisResult = "[Product image analysis failed - using product description only]";
      }
    }

    // =====================================================
    // CHARACTER CORE
    // =====================================================
    const femaleCore = `
Authentic Indonesian Gen Z Female Creator
Age 23–28
Warm medium skin tone
Visible natural skin texture
Visible pores
Subtle facial asymmetry
Soft oval face
Friendly relatable creator energy
Minimal natural makeup
Casual clean premium outfit
Natural imperfect expression
Authentic creator presence
`;

    const maleCore = `
Authentic Indonesian Gen Z Male Creator
Age 24–30
Warm medium skin tone
Visible natural skin texture
Natural masculine face structure
Clean premium casual style
Trustworthy relatable creator vibe
Natural creator energy
Authentic human expression
`;

    const selectedCharacterCore = characterType === "male" ? maleCore : femaleCore;

    // =====================================================
    // BUILD IMAGE REFERENCE CONTEXT BLOCK
    // Diinjeksikan ke dalam master prompt
    // =====================================================
    const imageReferenceContext = `
==================================================
VISUAL REFERENCE LOCK SYSTEM
==================================================

${characterAnalysisResult ? `
CHARACTER REFERENCE ANALYSIS (FROM UPLOADED IMAGE):
${characterAnalysisResult}

INSTRUCTION: Use above character analysis as ABSOLUTE identity lock.
Every scene must maintain 100% visual consistency with this character.
Do not deviate from any described physical or style attribute.
` : `
CHARACTER REFERENCE: No image uploaded.
Use Character Core below as identity guide.
`}

${productAnalysisResult ? `
PRODUCT REFERENCE ANALYSIS (FROM UPLOADED IMAGE):
${productAnalysisResult}

INSTRUCTION: Use above product analysis as ABSOLUTE product consistency lock.
Every scene must show product with exact same colors, materials, and design.
Never alter product appearance across scenes.
` : `
PRODUCT REFERENCE: No image uploaded.
Use product description from input as visual guide.
`}
`;

    // =====================================================
    // MASTER PROMPT V12 — DENGAN IMAGE REFERENCE INJECTION
    // =====================================================
    const masterPrompt = `
You are:

V12 STRUCTURED PROMPT ENGINE

You are not a normal prompt writer.

You are:

- Senior UGC Creative Director
- Conversion Strategist
- Nano Banana PRO Visual Director
- Google Flow Motion Director
- Creator Behavior Specialist
- Personal Branding Expert
- Visual Story Architect
- Prompt System Architect

Your job:

Create ultra-realistic
high-converting UGC prompts

for:

- TikTok
- Instagram Reels
- Affiliate Content
- Personal Branding
- Creator Trust Building

STRICT OUTPUT RULE:

JSON ONLY

NO markdown
NO explanation
NO code block
NO paragraph prompt format

==================================================
ABSOLUTE RULE
NO CINEMATIC EVER
==================================================

Never use:

- cinematic
- cinematic realism
- dramatic realism
- movie style
- film look
- editorial beauty
- studio perfection
- luxury ad
- commercial campaign
- beauty campaign
- dramatic lighting
- fashion campaign
- DSLR commercial look

FORBIDDEN.

This system creates ONLY:

RAW UGC REALISM

==================================================
ONLY ALLOWED STYLE
==================================================

Allowed:

- smartphone camera realism
- raw creator realism
- authentic social media realism
- imperfect human realism
- believable creator behavior
- visible skin pores
- natural skin texture
- subtle asymmetry
- imperfect framing
- natural daylight inconsistency
- casual creator authenticity
- real-life creator environment
- relatable creator presence

BELIEVABLE > BEAUTIFUL

==================================================
HOOK CTA FIRST SYSTEM
==================================================

Timeline must follow:

0–2s = Hook + CTA
2–4s = Pain Trigger
4–6s = Trust Proof
6–8s = Soft Closing

Hook + CTA must appear
in first 2 seconds.

Mandatory.

==================================================
SCENE LOCK SYSTEM
==================================================

Generate EXACTLY ${finalSceneCount} scenes.

Never output fewer scenes.

Never output only 1 scene.

Every scene must be:

- unique
- progressive
- fully detailed
- conversion-driven

==================================================
STRUCTURED PROMPT ENGINE
==================================================

Nano Banana prompt MUST be:

STRICT JSON STRUCTURE

Never use paragraph prompt.

Never use plain text.

Never use narrative prompt.

Use ONLY:

nano_banana_json_prompt

Google Flow prompt MUST also be:

STRUCTURED JSON

Use ONLY:

google_flow_json_prompt

This is mandatory.

==================================================
INPUT DATA
==================================================

Product:
${productName}

Product Type:
${productType || "-"}

Product Function:
${productFunction}

Product Detail:
${productDetail || "-"}

Target Market:
${targetMarket}

Customer Problem:
${customerProblem}

Platform:
${platform || "TikTok"}

Content Objective:
${contentObjective || "Auto"}

Content Style:
${contentStyle || "Soft Selling"}

Hook Type:
${hookType || "Curiosity Hook"}

CTA Type:
${ctaType || "Soft CTA"}

Character Core:
${selectedCharacterCore}

Character Name:
${characterName || "Alya"}

Character Detail:
${characterDetail || "-"}

${imageReferenceContext}

==================================================
OUTPUT FORMAT
==================================================

{
  "conversion_brain": {
    "funnel_stage": "",
    "conversion_goal": "",
    "trust_trigger": "",
    "best_hook": "",
    "emotional_trigger": "",
    "cta_strategy": ""
  },

  "visual_reasoning": {
    "product_psychology": "",
    "buyer_psychology": "",
    "trust_building_strategy": "",
    "product_reveal_logic": "",
    "conversion_path_logic": "",
    "scene_progression_reason": ""
  },

  "identity_lock": {
    "creator_identity_profile": "",
    "creator_branding_dna": "",
    "product_consistency_rule": "",
    "visual_consistency_rule": ""
  },

  "ugc_script": {
    "hook": "",
    "problem": "",
    "agitation": "",
    "solution": "",
    "trust": "",
    "cta": "",
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

      "nano_banana_json_prompt": {
        "scene": {},
        "subject": {},
        "emotion": {},
        "camera": {},
        "lighting": {},
        "background": {},
        "movement": {},
        "product_presence": {},
        "realism_rules": {},
        "style_rules": {}
      },

      "google_flow_json_prompt": {
        "video_motion": {},
        "camera_movement": {},
        "body_language": {},
        "micro_expression": {},
        "timeline_8s": {},
        "voice_logic": {}
      },

      "voice_over_hook": "",
      "voice_over_natural": "",
      "tone_of_voice": "",
      "speaking_style": "",
      "delivery_emotion": ""
    }
  ]
}

FINAL RULE:

Nano Banana = JSON only
Google Flow = JSON only
No cinematic
No paragraph prompts
Realistic UGC only
`;

    // =====================================================
    // GEMINI API — GENERATE PROMPT
    // =====================================================
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    // Build parts — jika ada gambar, sertakan juga sebagai visual context
    const parts = [{ text: masterPrompt }];

    // Opsional: sertakan gambar langsung ke prompt utama untuk konteks visual tambahan
    if (hasCharacterImage && characterReferenceImage && characterReferenceMime) {
      parts.unshift({
        inline_data: {
          mime_type: characterReferenceMime,
          data: characterReferenceImage
        }
      });
    }

    if (hasProductImage && productReferenceImage && productReferenceMime) {
      parts.unshift({
        inline_data: {
          mime_type: productReferenceMime,
          data: productReferenceImage
        }
      });
    }

    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
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
    // CLEAN OUTPUT
    // =====================================================
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
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
      version: "V12 STRUCTURED PROMPT ENGINE",
      image_reference_used: {
        character: !!characterAnalysisResult && !characterAnalysisResult.includes("failed"),
        product: !!productAnalysisResult && !productAnalysisResult.includes("failed")
      },
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
