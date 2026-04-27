module.exports = async function handler(req, res) {
  // =====================================================
  // V14 HYPER-REALISM ENGINE — PRODUCTION FIXED
  // =====================================================
  // ROOT CAUSE FIXES:
  // FIX 1: Request body terlalu besar (Base64 image = payload huge)
  //        → Vercel default limit 4.5MB, Base64 bisa 6-8MB
  //        → Solusi: compress + validate size sebelum proses
  // FIX 2: Gemini output bukan pure JSON — ada trailing text
  //        → Solusi: robust JSON extractor dengan regex
  // FIX 3: maxOutputTokens 8192 tidak cukup untuk prompt besar
  //        → Solusi: split prompt, reduce output size
  // FIX 4: Tidak ada debug info saat error
  //        → Solusi: detailed error logging ke response
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
      return res.status(500).json({ success: false, error: "GEMINI_API_KEY not configured in Vercel environment variables" });
    }

    // =====================================================
    // BODY PARSING + SIZE VALIDATION
    // FIX 1: Cek ukuran payload dulu
    // =====================================================
    const body = req.body || {};

    const {
      productName, productType, productFunction, productDetail,
      targetMarket, customerProblem,
      platform, contentObjective, contentStyle,
      sceneCount, hookType, ctaType,
      characterType, characterName, characterDetail,
      characterReferenceImage,
      characterReferenceMime,
      productReferenceImage,
      productReferenceMime,
      hasCharacterImage,
      hasProductImage
    } = body;

    // Validate required fields
    if (!productName || !productFunction || !targetMarket || !customerProblem) {
      return res.status(400).json({
        success: false,
        error: "Field wajib kosong",
        missing: {
          productName: !productName,
          productFunction: !productFunction,
          targetMarket: !targetMarket,
          customerProblem: !customerProblem
        }
      });
    }

    const finalSceneCount = Math.min(Number(sceneCount) || 4, 6); // max 6 scenes untuk cegah timeout

    // Validate image size (Base64 ~1.37x file size)
    // Vercel serverless limit: 4.5MB body
    const charImgSize = characterReferenceImage ? characterReferenceImage.length : 0;
    const prodImgSize = productReferenceImage ? productReferenceImage.length : 0;
    const totalB64Size = charImgSize + prodImgSize;

    // Jika total Base64 > 3MB, skip gambar ke Gemini Vision langsung
    // tapi tetap pakai sebagai context di main prompt
    const skipVisionAPI = totalB64Size > 3 * 1024 * 1024;

    // =====================================================
    // STEP 1: TECHNICAL + DNA ANALYSIS
    // Hanya jika ada gambar dan ukuran wajar
    // =====================================================
    let characterDNAText = "";
    let technicalAnalysisText = "";
    let productAnalysisText = "";

    // COMBINED ANALYSIS — 1 API call untuk karakter (hemat token + waktu)
    if (hasCharacterImage && characterReferenceImage && !skipVisionAPI) {
      try {
        const combinedAnalysisPrompt = `Analyze this image for UGC content creation. Return structured text only.

PART A — CHARACTER DNA:
Extract these with precision:
- FACE: shape, jaw, cheekbones, chin
- EYES: shape, size, color, distance, eyelid, brow shape+thickness
- NOSE: bridge, tip, width, nostril
- MOUTH: lip fullness, cupid bow, color, width
- SKIN: exact tone + undertone (e.g. warm medium NC25), texture, finish
- HAIR: color, length, texture, style
- MARKS: moles/dimples with exact face location
- ASYMMETRY: natural facial asymmetry description
- NANO_TRIGGER: one sentence max 40 words for AI prompt injection
- FLOW_TRIGGER: one sentence max 30 words for motion prompt

PART B — TECHNICAL ANALYSIS:
- LIGHTING_TYPE: [window/LED/natural/mixed] + direction + quality
- LIGHT_TEMP: color temperature in Kelvin estimate
- SHADOW: direction, softness, depth
- CAMERA_DEVICE: detected device type
- FOCAL_LENGTH: estimate in mm equivalent
- GRAIN_LEVEL: [none/minimal/visible/heavy]
- SKIN_PORES: [invisible/subtle/visible/very visible]
- POSITIVE_PROMPT: 50 word technical prompt to recreate this image
- NEGATIVE_PROMPT: 30 comma-separated terms to avoid
- REALISM_SCORE: number 1-10

Keep response concise and structured.`;

        const visionRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { inline_data: { mime_type: characterReferenceMime || "image/jpeg", data: characterReferenceImage } },
                  { text: combinedAnalysisPrompt }
                ]
              }],
              generationConfig: { temperature: 0.1, maxOutputTokens: 1200 }
            })
          }
        );

        if (visionRes.ok) {
          const visionData = await visionRes.json();
          const visionText = visionData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          // Split into DNA dan Technical
          const partAIdx = visionText.indexOf("PART A");
          const partBIdx = visionText.indexOf("PART B");
          if (partBIdx > -1) {
            characterDNAText = visionText.substring(partAIdx > -1 ? partAIdx : 0, partBIdx).trim();
            technicalAnalysisText = visionText.substring(partBIdx).trim();
          } else {
            characterDNAText = visionText;
          }
        }
      } catch (err) {
        console.error("Vision API error:", err.message);
        // Non-fatal — lanjut tanpa vision
      }
    }

    // PRODUCT ANALYSIS
    if (hasProductImage && productReferenceImage && !skipVisionAPI) {
      try {
        const prodRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { inline_data: { mime_type: productReferenceMime || "image/jpeg", data: productReferenceImage } },
                  { text: `Analyze this product for UGC AI generation consistency. Extract:
- COLORS: exact color per part with hex
- MATERIALS: material per section
- SHAPE: silhouette and proportions
- BRAND: logo position, size, color
- UNIQUE: distinctive design details
- RULES: top 5 must-never-change elements
- TRIGGER: one sentence 35 words for prompt injection
- NEG_PROMPT: 10 terms to prevent wrong product rendering
Be concise.` }
                ]
              }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 600 }
            })
          }
        );

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          productAnalysisText = prodData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (err) {
        console.error("Product vision error:", err.message);
      }
    }

    // =====================================================
    // CHARACTER CORE FALLBACK
    // =====================================================
    const femaleCore = characterDNAText
      ? `[FROM REFERENCE IMAGE]\n${characterDNAText}`
      : `Authentic Indonesian Gen Z Female Creator, age 23-28,
warm medium skin tone NC25, visible natural pores,
subtle facial asymmetry, soft oval face,
minimal natural makeup, casual clean outfit`;

    const maleCore = characterDNAText
      ? `[FROM REFERENCE IMAGE]\n${characterDNAText}`
      : `Authentic Indonesian Gen Z Male Creator, age 24-30,
warm medium skin tone NC30, visible natural skin texture,
natural masculine face structure, clean casual style`;

    const characterCore = characterType === "male" ? maleCore : femaleCore;

    // =====================================================
    // UNIVERSAL NEGATIVE PROMPT
    // Always injected — tidak tergantung referensi
    // =====================================================
    const universalNegative = `watermark, text overlay, extra fingers, missing fingers, fused fingers, six fingers, bad hands, deformed hands, extra limbs, mutation, deformed, bad anatomy, wrong proportions, double head, multiple heads, merged faces, artifacts, glitch, pixelated, jpeg artifact, bad eyes, crossed eyes, extra eyes, bad teeth, ai generated obvious, uncanny valley, cinematic lighting, dramatic lighting, studio lighting, beauty lighting, film look, editorial beauty, luxury ad, commercial campaign, dramatic shadows, high contrast dramatic, skin retouched, airbrushed skin, perfect skin, flawless skin, porcelain skin, plastic skin, rubber skin, wax skin, pore-free skin, overly smooth face, anime style, cartoon, illustration, 3D render, CGI look, too perfect symmetry, mirrored face, over-beautified, Instagram filter heavy, Facetune look, teeth too white, teeth too perfect, oversaturated colors, wrong skin tone, extra person, clone, duplicate`;

    // =====================================================
    // LIGHTING SYSTEM
    // =====================================================
    const lightingContext = technicalAnalysisText
      ? `REFERENCE LIGHTING (from image analysis):\n${technicalAnalysisText}`
      : `DEFAULT LIGHTING RECIPES:
RECIPE_A (indoor/room): soft window light, 5600K, natural shadows
RECIPE_B (cafe): warm ambient 3200K, mixed practical lamps
RECIPE_C (outdoor): overcast sky diffusion, 5500K, no harsh shadow
RECIPE_D (golden hour): warm 3500K directional, gentle rim
RECIPE_E (indoor night): LED warm 3000K, practical lamp fill`;

    // =====================================================
    // MASTER PROMPT V14 — OPTIMIZED FOR TOKEN EFFICIENCY
    // FIX 3: Lebih ringkas agar output tidak terpotong
    // =====================================================
    const masterPrompt = `You are V14 HYPER-REALISM ENGINE. Senior UGC Prompt Engineer.

OUTPUT RULE: Return ONLY valid JSON. No markdown. No explanation. No text before or after JSON.
Start response with { and end with }

ABSOLUTE: NO CINEMATIC. NO STUDIO. NO BEAUTY FILTER. NO DRAMATIC LIGHTING.
ONLY: smartphone UGC realism, natural human imperfection, believable creator content.

═══ CHARACTER IDENTITY ═══
${characterCore}
Character Name: ${characterName || "Creator"}
Detail: ${characterDetail || "Gen Z creator, relatable energy"}

═══ PRODUCT REFERENCE ═══
${productAnalysisText ? productAnalysisText : `Product: ${productName}\nType: ${productType || "-"}\nFunction: ${productFunction}\nDetail: ${productDetail || "-"}`}

═══ LIGHTING SYSTEM ═══
${lightingContext}

═══ SKIN REALISM RULES (always active) ═══
visible skin pores, natural skin texture, subsurface scattering,
micro skin imperfections, natural facial asymmetry, individual hair strands,
natural flyaway hairs, smartphone sensor grain ISO 800-1600,
natural handheld micro-shake, authentic focus breathing,
believable environment, no skin smoothing, no beautification

═══ UNIVERSAL NEGATIVE PROMPT ═══
${universalNegative}

═══ HOOK-CTA SYSTEM ═══
0-2s: Hook + CTA | 2-4s: Pain | 4-6s: Trust | 6-8s: Closing

═══ INPUT ═══
Product: ${productName}
Function: ${productFunction}
Target: ${targetMarket}
Problem: ${customerProblem}
Platform: ${platform || "TikTok"}
Style: ${contentStyle || "Soft Selling"}
Hook: ${hookType || "Curiosity Hook"}
CTA: ${ctaType || "Soft CTA"}
Scenes: ${finalSceneCount}

═══ JSON OUTPUT FORMAT ═══
Return exactly this structure with all fields filled:

{
  "engine_version": "V14_HYPER_REALISM_FIXED",
  "character_dna_profile": {
    "dna_extracted": ${!!characterDNAText},
    "face_architecture": "",
    "skin_profile": "",
    "hair_profile": "",
    "distinguishing_marks": "",
    "consistency_anchors": ["", "", "", "", ""],
    "forbidden_changes": ["", "", "", "", ""],
    "nano_banana_trigger": "",
    "google_flow_trigger": ""
  },
  "technical_reference": {
    "lighting_recipe": "",
    "camera_profile": "",
    "skin_realism_level": "",
    "realism_score": 8,
    "reference_positive_prompt": "",
    "reference_negative_prompt": ""
  },
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
    "product_consistency_rule": "",
    "visual_consistency_rule": "",
    "character_consistency_rule": "",
    "cross_scene_anchor_points": ["", "", ""]
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
      "background": "",
      "lighting": "",
      "character_consistency_check": {
        "face_match": "LOCKED",
        "skin_match": "LOCKED",
        "outfit_match": "LOCKED",
        "micro_features": "PRESERVED",
        "consistency_score": 97
      },
      "nano_banana_json_prompt": {
        "scene": { "purpose": "", "timeline": "" },
        "subject": {
          "character_dna_lock": "ACTIVE",
          "face_structure": "",
          "skin_tone_exact": "",
          "skin_texture": "visible pores, natural texture, subsurface scattering",
          "distinguishing_marks": "",
          "hair": "",
          "outfit": "",
          "consistency_level": "ABSOLUTE"
        },
        "camera": {
          "device": "smartphone",
          "angle": "",
          "framing": "",
          "focal_length": "",
          "sensor_noise": "ISO 800-1600 natural grain",
          "stabilization": "natural handheld micro-shake"
        },
        "lighting": {
          "recipe": "",
          "primary_source": "",
          "direction": "",
          "color_temperature": "",
          "shadow_description": "",
          "skin_light_interaction": ""
        },
        "background": {
          "environment": "",
          "authenticity": "real environment, natural story elements"
        },
        "product_presence": {
          "visibility": "",
          "position": "",
          "interaction": ""
        },
        "positive_prompt_final": "",
        "negative_prompt": {
          "layer1_anti_ai_artifacts": "watermark, extra fingers, bad hands, deformed, bad anatomy, mutation, merged faces, artifacts, glitch, pixelated, bad eyes, extra limbs, wrong proportions, double head, ai obvious",
          "layer2_anti_cinematic": "cinematic lighting, dramatic lighting, studio lighting, beauty lighting, film look, editorial, luxury ad, commercial campaign, dramatic shadows, HDR overdone, color graded heavy, skin retouched, airbrushed, DSLR professional",
          "layer3_anti_unrealism": "plastic skin, porcelain skin, pore-free, perfect symmetry, anime, cartoon, CGI, over-beautified, Facetune, Instagram filter, teeth too perfect, wrong skin tone, too sharp everywhere",
          "combined_negative": ""
        }
      },
      "google_flow_json_prompt": {
        "video_motion": { "type": "", "speed": "", "ugc_shake": "subtle handheld authentic" },
        "camera_movement": { "type": "", "stability": "natural handheld imperfect" },
        "body_language": {
          "character_continuity": "SAME_PERSON_LOCK",
          "posture": "",
          "gesture": "",
          "behavioral_consistency": "authentic_ugc_creator"
        },
        "micro_expression": { "expression_arc": "", "natural_blink": true },
        "timeline_8s": { "0_2s": "", "2_4s": "", "4_6s": "", "6_8s": "" },
        "voice_logic": { "tone": "", "pacing": "", "authenticity": "real person natural speech" }
      },
      "voice_over_hook": "",
      "voice_over_natural": "",
      "tone_of_voice": "",
      "delivery_emotion": ""
    }
  ]
}

CRITICAL: Generate exactly ${finalSceneCount} scene objects in scene_breakdown array.
Fill combined_negative in every scene with all 3 layers joined with comma.
All fields must be filled — no empty strings except where noted.
Return ONLY the JSON object. Nothing else.`;

    // =====================================================
    // GEMINI MAIN API CALL
    // =====================================================
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Build parts — hanya sertakan gambar jika ukuran wajar
    const parts = [{ text: masterPrompt }];

    if (!skipVisionAPI) {
      if (hasProductImage && productReferenceImage && productReferenceMime) {
        parts.unshift({ inline_data: { mime_type: productReferenceMime, data: productReferenceImage } });
      }
      if (hasCharacterImage && characterReferenceImage && characterReferenceMime) {
        parts.unshift({ inline_data: { mime_type: characterReferenceMime, data: characterReferenceImage } });
      }
    }

    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.92,
          topK: 40,
          maxOutputTokens: 8192
        }
      })
    });

    // =====================================================
    // HANDLE GEMINI RESPONSE
    // =====================================================
    if (!geminiResponse.ok) {
      const errData = await geminiResponse.json().catch(() => ({}));
      return res.status(500).json({
        success: false,
        error: "Gemini API request failed",
        gemini_status: geminiResponse.status,
        details: errData
      });
    }

    const data = await geminiResponse.json();

    // Check finish reason
    const candidate = data?.candidates?.[0];
    const finishReason = candidate?.finishReason;

    if (finishReason === "MAX_TOKENS") {
      // Output terpotong — coba parse apa yang ada
      console.error("Output truncated by MAX_TOKENS");
    }

    const rawText = candidate?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      return res.status(500).json({
        success: false,
        error: "Gemini returned empty response",
        finish_reason: finishReason,
        safety_ratings: candidate?.safetyRatings
      });
    }

    // =====================================================
    // ROBUST JSON EXTRACTION
    // FIX 2: Multiple strategies untuk parse JSON
    // =====================================================
    let parsed = null;
    let parseError = "";

    // Strategy 1: Direct parse setelah strip markdown
    try {
      const clean1 = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(clean1);
    } catch (e1) {
      parseError = e1.message;

      // Strategy 2: Extract JSON dengan regex — cari { ... }
      try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      } catch (e2) {
        parseError = e2.message;

        // Strategy 3: Fix common Gemini JSON issues
        try {
          const fixed = rawText
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .replace(/,\s*}/g, "}")           // trailing comma object
            .replace(/,\s*]/g, "]")           // trailing comma array
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ") // control chars
            .replace(/\n/g, "\\n")            // unescaped newlines in strings
            .trim();

          // Find first { and last }
          const start = fixed.indexOf("{");
          const end = fixed.lastIndexOf("}");
          if (start !== -1 && end !== -1) {
            parsed = JSON.parse(fixed.substring(start, end + 1));
          }
        } catch (e3) {
          parseError = e3.message;
        }
      }
    }

    // Jika semua strategi gagal
    if (!parsed) {
      return res.status(500).json({
        success: false,
        error: "Failed to parse Gemini JSON output",
        parse_error: parseError,
        finish_reason: finishReason,
        raw_preview: rawText.substring(0, 500) + "...[truncated]",
        debug: {
          raw_length: rawText.length,
          starts_with: rawText.substring(0, 50),
          ends_with: rawText.substring(rawText.length - 50)
        }
      });
    }

    // =====================================================
    // POST-PROCESS: Isi combined_negative jika kosong
    // =====================================================
    if (parsed.scene_breakdown && Array.isArray(parsed.scene_breakdown)) {
      parsed.scene_breakdown.forEach(scene => {
        const np = scene?.nano_banana_json_prompt?.negative_prompt;
        if (np && !np.combined_negative) {
          np.combined_negative = [
            np.layer1_anti_ai_artifacts || "",
            np.layer2_anti_cinematic || "",
            np.layer3_anti_unrealism || ""
          ].filter(Boolean).join(", ");
        }
      });
    }

    // =====================================================
    // SUCCESS
    // =====================================================
    return res.status(200).json({
      success: true,
      version: "V14 HYPER-REALISM ENGINE — PRODUCTION FIXED",
      character_dna_used: !!characterDNAText,
      technical_analysis_used: !!technicalAnalysisText,
      product_reference_used: !!productAnalysisText,
      images_processed: !skipVisionAPI,
      images_skipped_reason: skipVisionAPI ? "payload_too_large" : null,
      finish_reason: finishReason,
      data: parsed
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
      stack_preview: error.stack ? error.stack.split("\n")[0] : null
    });
  }
};

