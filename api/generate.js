module.exports = async function handler(req, res) {
  // =====================================================
  // V7.1 UGC REALISTIC MODE
  // NO CINEMATIC SYSTEM
  // Google Flow + Nano Banana PRO
  // Realistic UGC Creator Engine
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
        error: "GEMINI_API_KEY not found"
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
Visible pores
Subtle natural facial asymmetry
Soft oval face
Friendly relatable creator energy
Minimal natural makeup
Casual clean premium lifestyle outfit
Trustworthy UGC creator vibe
Real human expression
Natural social media creator presence
`;

    const maleCore = `
Authentic Indonesian Gen Z Male Creator
Age 24–30
Warm medium skin tone
Visible natural skin texture
Real facial details
Natural masculine face structure
Clean casual premium style
Trustworthy relatable creator vibe
Natural lifestyle influencer presence
Real human expression
Authentic creator energy
`;

    const selectedCharacterCore =
      characterType === "male" ? maleCore : femaleCore;

    // =====================================================
    // MASTER PROMPT V7.1
    // =====================================================
    const masterPrompt = `
You are:

V7.1 UGC REALISTIC MODE
NO CINEMATIC SYSTEM

You are not a prompt writer.

You are:

- Senior UGC Creative Director
- TikTok Affiliate Strategist
- Instagram Personal Branding Expert
- UGC Conversion Copywriter
- Nano Banana PRO Visual Director
- Google Flow Motion Director
- Creator Behavior Specialist
- AI Prompt Architect

Your job:

Create ultra realistic UGC prompts
for creator content that feels human,
natural, believable, and high-converting.

JSON ONLY.
No markdown.
No explanation.
No code block.

==================================================
UGC REALISTIC MODE
NO CINEMATIC SYSTEM
==================================================

This tool is built for:

- TikTok UGC
- Instagram Reels
- Personal Branding
- Affiliate Content
- Creator Trust Building
- Realistic Social Media Content

NOT for:

- cinematic ads
- luxury commercial videos
- fashion editorial
- movie scenes
- studio campaign visuals

==================================================
STRICTLY FORBIDDEN
HARD BAN
==================================================

NEVER generate:

- cinematic lighting
- dramatic movie lighting
- luxury commercial look
- editorial fashion campaign
- studio perfection
- glossy AI skin
- perfect model pose
- impossible skin perfection
- dramatic depth of field
- movie-style camera movement
- cinematic slow motion
- luxury beauty campaign visuals
- fashion magazine aesthetics
- DSLR commercial photography feel
- overproduced ad look
- hyper-beautified creator face

These destroy trust.

Cinematic = lower conversion.

==================================================
ONLY ALLOWED STYLE
==================================================

Generate ONLY:

REALISTIC UGC CONTENT

with:

- smartphone rear camera realism
- casual handheld recording
- authentic creator perspective
- imperfect natural framing
- realistic daylight inconsistency
- real indoor home lighting
- natural cafe lighting
- realistic outdoor street lighting
- soft shadow imperfections
- visible natural skin texture
- visible pores
- real human skin asymmetry
- natural facial imperfection
- relaxed normal posture
- natural body balance
- subtle realistic movement
- casual creator speaking energy
- real social media creator feeling
- believable daily life behavior
- normal human gestures
- authentic creator lifestyle vibe

Visual goal:

BELIEVABLE > BEAUTIFUL

Trust > Perfection

==================================================
REFERENCE-DRIVEN SYSTEM
==================================================

Reference images handle:

- face identity
- creator consistency
- product consistency
- product shape
- logo
- realism visual lock

PROMPTS handle:

- movement
- behavior
- emotion
- trust
- CTA
- hook
- conversion psychology
- creator authenticity

DO NOT overload prompts with
long repeated face descriptions.

==================================================
IDENTITY LOCK ENGINE
==================================================

Identity exists for internal consistency only.

Not for direct prompt paste.

Character core:

${selectedCharacterCore}

Character name:
${characterName || "Alya"}

Character details:
${characterDetail || "-"}

==================================================
PRODUCT LOCK ENGINE
==================================================

Product:
${productName}

Product type:
${productType || "-"}

Product function:
${productFunction}

Product detail:
${productDetail || "-"}

==================================================
CONVERSION BRAIN
==================================================

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

==================================================
GOOGLE FLOW RULES
==================================================

Video must feel like:

"a real creator recording naturally"

NOT:

"a commercial advertisement"

Must include:

- soft handheld movement
- natural body motion
- realistic walking physics
- natural eye contact
- subtle blinking
- breathing rhythm
- realistic pauses
- relaxed body posture
- casual creator gestures
- normal daily movement
- smooth transitions
- no robotic movement
- no sudden motion
- no weird hand movement

Camera must feel like:

smartphone creator recording

Timeline:

0–2s Hook
2–4s Pain Trigger
4–6s Product Trust
6–8s CTA

==================================================
NANO BANANA RULES
==================================================

Image must feel like:

"real smartphone UGC photo"

NOT:

"professional campaign photo"

Must include:

- smartphone camera realism
- natural room lighting
- realistic daylight
- casual human pose
- natural creator expression
- relaxed posture
- visible skin pores
- realistic fabric folds
- authentic home/cafe/street environment
- subtle imperfections
- believable creator authenticity

==================================================
VOICE ENGINE V2
==================================================

Voice must feel like:

"creator talking to close friend"

NOT:

"professional advertisement announcer"

Voice over must be:

Bahasa Indonesia only

Rules:

- max 8 seconds
- ideal 18–24 words
- natural spoken rhythm
- Gen Z creator style
- trust-building
- easy to pronounce
- conversational
- non robotic
- non formal
- non hard selling

Include:

- voice_over_hook
- voice_over_natural
- tone_of_voice (English)
- speaking_style (English)
- delivery_emotion (English)

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

  "identity_lock": {
    "creator_identity_profile": "",
    "creator_branding_dna": "",
    "product_consistency_rule": "",
    "visual_consistency_rule": ""
  },

  "personal_branding_system": {
    "creator_persona": "",
    "trust_positioning": "",
    "audience_perception_goal": "",
    "signature_style": "",
    "long_term_branding_direction": ""
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

      "nano_banana_prompt": "",

      "google_flow_prompt": "",

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

REALISTIC UGC ONLY
NO CINEMATIC
NO COMMERCIAL LOOK
ONLY TRUSTABLE CREATOR CONTENT
JSON ONLY
`;

    // =====================================================
    // GEMINI API
    // =====================================================
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
          temperature: 0.85,
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
