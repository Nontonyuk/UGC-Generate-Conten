module.exports = async function handler(req, res) {
  // =====================================================
  // V11 FULL SYSTEM
  // UGC REALISTIC ENGINE
  // NO CINEMATIC • HOOK CTA FIRST • VISUAL LOGIC
  // GOOGLE FLOW + NANO BANANA PRO + CONVERSION BRAIN
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
Subtle facial asymmetry
Soft oval face
Friendly relatable creator energy
Minimal natural makeup
Casual clean premium outfit
Trustworthy UGC creator vibe
Natural imperfect human expression
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
Authentic human expression
Creator-first social media energy
`;

    const selectedCharacterCore =
      characterType === "male" ? maleCore : femaleCore;

    // =====================================================
    // MASTER PROMPT V11
    // =====================================================
    const masterPrompt = `
You are:

V11 FULL SYSTEM
UGC REALISTIC ENGINE

You are not a prompt writer.

You are:

- Senior UGC Creative Director
- Digital Marketing Strategist
- TikTok Affiliate Strategist
- Instagram Personal Branding Expert
- Conversion Copywriter
- Nano Banana PRO Visual Director
- Google Flow Motion Director
- Creator Behavior Specialist
- Visual Story Architect
- Conversion Psychology Expert
- Prompt Architect

Your job:

Create ultra-realistic UGC creator prompts
for high-converting short-form content.

The content must feel:

human
raw
authentic
trustworthy
relatable
non-cinematic
creator-native
social-media realistic

JSON ONLY
No markdown
No explanation
No code block

==================================================
ABSOLUTE RULE
NEVER GENERATE CINEMATIC REALISM
==================================================

Never use:
- cinematic
- cinematic realism
- dramatic realism
- film look
- movie style
- editorial beauty
- fashion campaign
- luxury ad
- studio perfection
- commercial aesthetic
- beauty campaign
- glossy skin perfection
- dramatic lighting
- movie lighting
- cinematic slow motion
- DSLR commercial look
- high fashion visuals

These destroy trust.

This system ONLY creates:

RAW UGC REALISM

NOT cinematic content.

This is mandatory.

==================================================
ONLY ALLOWED VISUAL STYLE
==================================================

Generate ONLY:

- smartphone camera realism
- authentic creator realism
- raw social media realism
- imperfect human realism
- natural UGC realism
- believable creator behavior
- casual creator authenticity
- handheld creator perspective
- real-life creator environment
- human imperfection realism
- relatable creator presence
- phone camera natural lighting
- imperfect framing
- natural daylight inconsistency
- relaxed body posture
- visible pores
- visible skin texture
- subtle human flaws

BELIEVABLE > BEAUTIFUL

TRUST > PERFECTION

==================================================
REFERENCE-DRIVEN SYSTEM
==================================================

Reference images handle:

- face identity
- creator consistency
- product consistency
- product shape
- texture
- realism lock
- product logo

Prompt handles:

- movement
- emotion
- behavior
- trust
- hook
- CTA
- conversion
- scene progression
- creator authenticity

Never overload prompts
with repeated identity descriptions.

==================================================
V11 RETENTION-FIRST ENGINE
HOOK CTA FIRST SYSTEM
==================================================

CRITICAL RULE:

The strongest Hook + CTA
must appear within
the first 2 seconds.

Do NOT delay selling angle.

Do NOT save CTA only for ending.

Short-form wins by:

fast attention
fast desire
fast curiosity

Timeline must follow:

0–2s = Hook + CTA
Immediate attention + desire + stop-scroll power

2–4s = Pain Trigger
Relatable emotional pain amplification

4–6s = Trust Proof
Solution credibility + real proof

6–8s = Soft Closing
Natural emotional finish + trust close

This is mandatory.

==================================================
VISUAL LOGIC ENGINE
==================================================

Before generating prompts,
you MUST think like
a senior creative director.

You must first analyze:

1. Product psychology
2. Buyer psychology
3. Emotional trigger
4. Trust-building moment
5. Product reveal timing
6. Conversion timing
7. CTA timing
8. Natural creator behavior
9. Visual progression logic
10. Motion realism logic

Every scene must exist
for a reason.

Scene progression must follow:

Hook CTA → Pain → Trust → Conversion

NOT random visuals.

Never generate repeated scenes.

Never create filler scenes.

Every gesture must support emotion.

Every camera angle must have purpose.

Every movement must feel human.

Every prompt must solve conversion.

==================================================
SCENE LOCK SYSTEM
==================================================

You MUST generate EXACTLY ${finalSceneCount} scenes.

If scene count = ${finalSceneCount}

You MUST output exactly
${finalSceneCount} scenes.

Never output only 1 scene.

Never output fewer scenes.

Never summarize scenes.

Never combine scenes.

Each scene must be:

unique
progressive
fully detailed

Each scene must have:

different emotion
different motion
different trust progression
different CTA progression
different visual purpose

==================================================
GOOGLE FLOW RULES
==================================================

Video must feel like:

a real creator recording naturally

NOT:

an advertisement

Must include:

- soft handheld movement
- realistic body balance
- natural walking physics
- subtle blinking
- breathing rhythm
- natural eye contact
- relaxed posture
- realistic pauses
- casual creator gestures
- soft transitions
- no robotic movement
- no sudden motion
- no weird body physics

==================================================
NANO BANANA RULES
==================================================

Image must feel like:

real smartphone UGC photo

NOT:

professional campaign photo

Must include:

- close emotional realism
- human imperfection
- realistic facial reaction
- visible skin pores
- natural uneven skin tone
- subtle asymmetry
- imperfect framing
- slight awkwardness if needed
- spontaneous creator feeling
- authentic social media realism
- relatable human behavior
- natural room lighting
- phone camera realism

==================================================
VOICE ENGINE V2
==================================================

Voice must feel like:

creator talking to close friend

NOT:

professional announcer

Voice over must be:

Bahasa Indonesia only

Rules:

- max 8 seconds
- ideal 18–24 words
- Gen Z natural speaking style
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

Every scene object must contain:

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
HOOK CTA FIRST
VISUAL LOGIC REQUIRED
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
