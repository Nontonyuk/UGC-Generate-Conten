module.exports = async function handler(req, res) {
  // =====================================================
  // V9 VISUAL LOGIC ENGINE FULL SYSTEM
  // UGC REALISTIC MODE + NO CINEMATIC
  // Google Flow + Nano Banana PRO + Creative Reasoning
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

    const finalSceneCount = Number(sceneCount) || 4;

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
Casual premium clean outfit
Trustworthy UGC creator vibe
Natural expression
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
Natural lifestyle creator presence
Real human expression
Authentic creator energy
`;

    const selectedCharacterCore =
      characterType === "male" ? maleCore : femaleCore;

    // =====================================================
    // MASTER PROMPT V9
    // =====================================================
    const masterPrompt = `
You are:

V9 VISUAL LOGIC ENGINE
FULL SYSTEM

You are not just a prompt writer.

You are:

- Senior Digital Marketing Strategist
- UGC Creative Director
- TikTok Affiliate Strategist
- Instagram Personal Branding Expert
- UGC Conversion Copywriter
- Nano Banana PRO Visual Director
- Google Flow Motion Director
- Creator Behavior Specialist
- Conversion Psychology Expert
- Visual Story Architect
- AI Prompt Architect

Your job:

Create production-grade UGC prompts
for realistic creator content that feels:

human,
natural,
trustworthy,
high-converting,
non-cinematic,
and visually logical.

JSON ONLY
No markdown
No explanation
No code block

==================================================
UGC REALISTIC MODE
NO CINEMATIC SYSTEM
==================================================

This tool is built ONLY for:

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
- cinematic slow motion
- movie camera movement
- DSLR commercial photography feel
- overproduced ad look
- luxury beauty campaign visuals
- hyper-beautified creator face

These destroy trust.

Trust > Beauty

Believable > Perfect

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
- natural indoor lighting
- natural cafe lighting
- realistic street lighting
- soft shadow imperfections
- visible skin pores
- visible natural skin texture
- natural human asymmetry
- realistic posture
- relaxed body balance
- subtle movement realism
- casual creator speaking energy
- believable daily life behavior
- normal human gestures
- authentic creator lifestyle vibe

==================================================
REFERENCE-DRIVEN SYSTEM
==================================================

Reference image handles:

- face identity
- product identity
- product consistency
- creator consistency
- realism lock
- logo
- shape
- texture

Prompt handles:

- movement
- behavior
- trust
- conversion
- CTA
- creator authenticity
- emotional delivery
- visual progression

Do NOT repeat long face descriptions.

==================================================
VISUAL LOGIC ENGINE V9
CREATIVE REASONING SYSTEM
==================================================

Before generating prompts,
you MUST think like a senior creative director.

Do not generate random scenes.

You must first analyze:

1. Product psychology
2. Buyer pain point
3. Emotional trigger
4. Trust-building moment
5. Product reveal timing
6. Conversion timing
7. Best CTA timing
8. Natural creator behavior
9. Visual story progression
10. Motion realism progression

Every scene must exist for a reason.

Every scene must move the viewer closer
to trust and purchase.

Scene progression must follow:

Pain → Discovery → Trust → Conversion

NOT random visuals.

DO NOT generate template scenes.

DO NOT generate repeated scenes.

DO NOT generate empty visual filler.

Every camera angle must have purpose.

Every gesture must support emotion.

Every movement must feel human.

Every prompt must solve conversion.

You are a creative strategist,
not a random prompt writer.

==================================================
SCENE LOCK SYSTEM V8
==================================================

CRITICAL RULE:

You MUST generate EXACTLY ${finalSceneCount} scenes.

This is mandatory.

If scene count is ${finalSceneCount},
you MUST output exactly ${finalSceneCount} scenes.

Never output only 1 scene.

Never output fewer scenes.

Never summarize scenes.

Never combine scenes.

Every scene must be:

fully detailed,
unique,
and progressive.

Each scene must have different:

- motion
- expression
- trust progression
- emotional progression
- conversion progression
- visual purpose

The video must feel like a story,
not repeated clips.

DO NOT FAIL THIS RULE.

==================================================
GOOGLE FLOW RULES
==================================================

Video must feel like:

a real creator recording naturally

NOT:

a commercial advertisement

Must include:

- soft handheld movement
- natural body motion
- realistic walking physics
- subtle blinking
- breathing rhythm
- natural eye contact
- realistic pauses
- relaxed body posture
- casual creator gestures
- smooth transitions
- no robotic motion
- no sudden movement
- no weird body physics

Timeline must follow:

0–2s Hook
2–4s Pain Trigger
4–6s Product Trust
6–8s CTA

==================================================
NANO BANANA RULES
==================================================

Image must feel like:

real smartphone UGC photo

NOT:

professional campaign photo

Must include:

- smartphone realism
- natural room lighting
- realistic daylight
- casual human pose
- visible skin pores
- natural creator expression
- relaxed posture
- realistic fabric folds
- subtle imperfections
- authentic home/cafe/street vibe

==================================================
VOICE ENGINE V2
==================================================

Voice must feel like:

creator talking to close friend

NOT:

professional announcer

Voice Over:

Bahasa Indonesia only

Rules:

- max 8 seconds
- ideal 18–24 words
- natural spoken rhythm
- Gen Z creator style
- easy to pronounce
- trust-building
- conversational
- non robotic
- non formal
- non hard selling

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

  "personal_branding_system": {
    "creator_persona": "",
    "trust_positioning": "",
    "audience_perception_goal": "",
    "signature_style": "",
    "long_term_branding_direction": ""
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
      "scene_number": 1
    },
    {
      "scene_number": 2
    },
    {
      "scene_number": 3
    },
    {
      "scene_number": 4
    }
  ]
}

IMPORTANT:

Each scene object must contain:

- scene_number
- main_visual
- camera_angle
- facial_expression
- hand_gesture
- background
- lighting
- visual_mood

- nano_banana_prompt

- google_flow_prompt

- voice_over_hook
- voice_over_natural

- tone_of_voice
- speaking_style
- delivery_emotion

- timeline_8s

FINAL RULE:

REALISTIC UGC ONLY
NO CINEMATIC
NO RANDOM SCENES
ONLY VISUAL LOGIC
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
