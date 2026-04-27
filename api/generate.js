module.exports = async function handler(req, res) {
  // =====================================================
  // V14 HYPER-REALISM ENGINE
  // CHARACTER DNA LOCK + PHOTOREALISM SYSTEM
  // NANO BANANA PRO + GOOGLE FLOW
  // NO CINEMATIC • HUMAN REALISM • NEGATIVE PROMPT SYSTEM
  // =====================================================
  //
  // UPGRADE dari V13:
  // ✅ LIGHTING PHYSICS ENGINE — analisis & replikasi lighting referensi
  // ✅ CAMERA PHYSICS SYSTEM — focal length, sensor noise, DOF
  // ✅ SKIN REALISM LAYER — subsurface scattering, pore detail, texture map
  // ✅ ENVIRONMENT ELEMENT LOCK — setiap elemen scene dikunci
  // ✅ NEGATIVE PROMPT SYSTEM — ultra-detail, 3 layer blocking
  // ✅ HYPER-REALISM RULES — 12 aturan foto-realistis
  // ✅ REFERENCE IMAGE TECHNICAL ANALYSIS — baca teknis gambar referensi
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

    const {
      productName, productType, productFunction, productDetail,
      targetMarket, customerProblem,
      platform, contentObjective, contentStyle,
      sceneCount, hookType, ctaType,
      characterType, characterName, characterDetail,
      characterReferenceImage, characterReferenceMime,
      productReferenceImage, productReferenceMime,
      hasCharacterImage, hasProductImage
    } = req.body || {};

    if (!productName || !productFunction || !targetMarket || !customerProblem) {
      return res.status(400).json({
        success: false,
        error: "productName, productFunction, targetMarket, customerProblem wajib diisi"
      });
    }

    const finalSceneCount = Number(sceneCount) || 4;

    // =====================================================
    // STEP 1: TECHNICAL REFERENCE IMAGE ANALYSIS
    // Analisis TEKNIS gambar referensi — lighting, kamera, environment
    // INI ADALAH UPGRADE UTAMA V14
    // =====================================================
    let technicalAnalysis = "";

    if (hasCharacterImage && characterReferenceImage && characterReferenceMime) {
      try {
        const technicalPrompt = `You are a Senior Cinematographer, Lighting Director, and AI Prompt Engineer specializing in hyper-realistic human photography.

Analyze this reference image with EXTREME TECHNICAL PRECISION.
Your analysis will be used to generate AI images that are indistinguishable from real photographs.

═══════════════════════════════════════════════
SECTION 1: LIGHTING PHYSICS ANALYSIS
═══════════════════════════════════════════════

1.1 PRIMARY LIGHT SOURCE:
- Type: [window light / LED panel / natural outdoor / practical lamp / mixed]
- Direction: [exact clock position, e.g., "10 o'clock position, left side"]
- Distance: [close/medium/far from subject]
- Quality: [hard/soft/diffused] — describe edge transition
- Color temperature: [exact Kelvin estimate, e.g., "5500K daylight"]
- Intensity: [low/medium/high/very high]

1.2 SECONDARY LIGHT SOURCE (fill light):
- Type and origin
- Direction and intensity relative to primary
- Color temperature
- Shadow fill ratio

1.3 SHADOW ANALYSIS:
- Shadow direction: [exact]
- Shadow softness: [hard edge/soft edge/very soft/barely visible]
- Shadow depth: [dark/medium/light/transparent]
- Shadow color: [neutral/warm/cool tone]

1.4 HIGHLIGHT ANALYSIS:
- Highlight placement on face: [forehead/nose/cheekbone/chin]
- Highlight quality: [specular/diffused/blown out/controlled]
- Skin highlight color: [warm/neutral/cool]

1.5 AMBIENT LIGHT:
- Overall scene luminosity
- Ambient color cast: [warm/neutral/cool/mixed]
- Background vs subject exposure relationship

1.6 LIGHTING MOOD DESCRIPTOR:
- Write exact lighting description for AI prompt (max 30 words)
- Write exact lighting negative prompt (what to avoid)

═══════════════════════════════════════════════
SECTION 2: CAMERA & LENS PHYSICS
═══════════════════════════════════════════════

2.1 DEVICE DETECTION:
- Camera type: [smartphone / DSLR / mirrorless / action cam]
- Estimated device: [iPhone 15 Pro / Samsung S24 / etc.]
- Shooting mode: [normal / portrait / video frame / selfie]

2.2 FOCAL LENGTH ESTIMATE:
- Equivalent focal length: [e.g., "24mm wide angle equivalent"]
- Lens distortion type: [barrel/pincushion/none]
- Perspective distortion: [present/absent] + description

2.3 DEPTH OF FIELD:
- Focus point: [exact area in sharp focus]
- Foreground blur: [none/slight/heavy]
- Background blur (bokeh): [none/slight/medium/heavy]
- Bokeh quality: [circular/elongated/busy/smooth]

2.4 SENSOR CHARACTERISTICS:
- Noise/grain level: [none/minimal/visible/heavy]
- Noise type: [luminance/color/mixed]
- Dynamic range handling: [clipped highlights/retained/HDR processed]
- Color science: [warm/neutral/cool/oversaturated/muted]

2.5 MOTION & SHARPNESS:
- Subject sharpness: [tack sharp/slightly soft/motion blur]
- Motion blur presence: [none/hair movement/hand movement]
- Stabilization: [handheld natural shake/stabilized]

2.6 COMPRESSION & PROCESSING:
- Image processing style: [natural/HDR/beauty filter/raw]
- Skin smoothing: [none/subtle/heavy AI processing]
- Color grading: [ungraded/lightly graded/heavy filter]

2.7 CAMERA TECHNICAL PROMPT:
- Write exact camera/lens prompt for AI (max 25 words)
- Write exact camera negative prompt

═══════════════════════════════════════════════
SECTION 3: ENVIRONMENT & SCENE ELEMENTS
═══════════════════════════════════════════════

3.1 LOCATION TYPE:
- Primary environment: [indoor/outdoor/studio/transitional]
- Specific location: [bedroom/cafe/street/office/etc.]
- Time of day: [morning/midday/afternoon/evening/night]

3.2 BACKGROUND ELEMENTS:
- List ALL visible background elements with position
- Describe background depth and layers
- Background texture and color palette

3.3 FOREGROUND ELEMENTS:
- Any foreground objects or blur elements

3.4 ENVIRONMENT LIGHT INTERACTION:
- How environment affects subject lighting
- Bounce light sources
- Color contamination from environment

3.5 ATMOSPHERE:
- Overall scene mood
- Air clarity: [crisp/hazy/smoky/humid]
- Color palette of entire scene

═══════════════════════════════════════════════
SECTION 4: SKIN & HUMAN REALISM ANALYSIS
═══════════════════════════════════════════════

4.1 SKIN TEXTURE VISIBILITY:
- Pore visibility: [invisible/subtle/visible/highly visible]
- Skin texture type: [smooth/normal/textured/rough]
- Subsurface scattering: [visible/not visible] — light through skin

4.2 SKIN LIGHT INTERACTION:
- How light hits skin: [flat/contoured/dramatic]
- Translucency visible: [yes/no] — ears, nose tip
- Skin highlight type: [matte/satin/dewy/oily]

4.3 MAKEUP ANALYSIS:
- Foundation coverage: [no makeup/sheer/medium/full coverage]
- Specific makeup elements visible
- Makeup finish: [matte/dewy/natural/glam]

4.4 HAIR REALISM:
- Individual strand visibility: [yes/no]
- Hair movement: [static/slight/dynamic]
- Hair light interaction: [shine/matte/backlit]

═══════════════════════════════════════════════
SECTION 5: COMPLETE PROMPT GENERATION
═══════════════════════════════════════════════

5.1 POSITIVE PROMPT (for Nano Banana Pro):
Write a complete, detailed positive prompt that recreates this image's:
- Lighting setup exactly
- Camera characteristics exactly
- Skin realism level exactly
- Environment mood exactly
Format: comma-separated technical terms, max 80 words

5.2 NEGATIVE PROMPT (3 LAYERS):

LAYER 1 — ANTI-AI ARTIFACTS:
[List 20+ terms to prevent typical AI generation artifacts]

LAYER 2 — ANTI-CINEMATIC:
[List 15+ terms to prevent over-stylized/commercial look]

LAYER 3 — ANTI-UNREALISM:
[List 15+ terms to prevent plastic skin, perfect symmetry, unnatural features]

5.3 REALISM SCORE:
Rate this reference image: [1-10] for photorealism
Explain what makes it realistic or unrealistic

Output ALL sections with maximum technical detail.`;

        const techResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { inline_data: { mime_type: characterReferenceMime, data: characterReferenceImage } },
                  { text: technicalPrompt }
                ]
              }],
              generationConfig: { temperature: 0.15, maxOutputTokens: 2000 }
            })
          }
        );

        const techData = await techResponse.json();
        technicalAnalysis = techData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      } catch (err) {
        console.error("Technical analysis failed:", err);
        technicalAnalysis = "";
      }
    }

    // =====================================================
    // STEP 2: CHARACTER DNA EXTRACTION (dari V13, dipertahankan)
    // =====================================================
    let characterDNAText = "";

    if (hasCharacterImage && characterReferenceImage && characterReferenceMime) {
      try {
        const charDNAPrompt = `You are a Character DNA Extraction Specialist for AI image generation.

Extract ULTRA-PRECISE character identity from this image for 100% cross-scene consistency.

FACE ARCHITECTURE:
- FACE_SHAPE + proportions
- JAWLINE description
- CHEEKBONES position + prominence
- CHIN shape + size

EYES:
- Shape, size, color, distance
- Eyelid type, eyebrow shape + thickness + color

NOSE: Bridge height, tip shape, width, nostril shape

MOUTH: Lip fullness, cupid bow definition, natural color, width

SKIN:
- Exact tone + undertone (use shade system like NC/NW if possible)
- Texture, finish, visible characteristics

HAIR: Color, length, texture, thickness, current style

DISTINGUISHING MARKS:
- ALL moles, dimples, birthmarks with EXACT face location
- Natural facial asymmetry description

CONSISTENCY ANCHORS: Top 5 features that MUST stay identical every scene

FORBIDDEN CHANGES: Top 5 things that must NEVER change

NANO BANANA TRIGGER: One precise sentence (max 50 words) for prompt injection
GOOGLE FLOW TRIGGER: One precise motion description (max 40 words)

Be extremely precise. This locks character identity across all scenes.`;

        const charDNAResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { inline_data: { mime_type: characterReferenceMime, data: characterReferenceImage } },
                  { text: charDNAPrompt }
                ]
              }],
              generationConfig: { temperature: 0.1, maxOutputTokens: 1200 }
            })
          }
        );

        const charDNAData = await charDNAResponse.json();
        characterDNAText = charDNAData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      } catch (err) {
        console.error("Character DNA extraction failed:", err);
        characterDNAText = "";
      }
    }

    // =====================================================
    // STEP 3: PRODUCT VISUAL ANALYSIS
    // =====================================================
    let productAnalysisResult = "";

    if (hasProductImage && productReferenceImage && productReferenceMime) {
      try {
        const prodAnalysisPrompt = `You are a Product Visual Consistency Analyst for UGC content.

Analyze this product image and extract ALL visual details for AI consistency:

1. COLOR PALETTE: exact colors per part (hex codes)
2. MATERIALS & TEXTURES: material of each section precisely
3. SHAPE & SILHOUETTE: form, proportions, dimensions
4. BRAND ELEMENTS: logo position, size, color, typography
5. UNIQUE DESIGN DETAILS: patterns, seams, hardware, features
6. CONSISTENCY RULES: top 5 elements that MUST never change
7. PRODUCT TRIGGER PHRASE: one precise sentence (max 40 words) for prompt
8. PRODUCT NEGATIVE PROMPT: 10 terms to prevent wrong product rendering

Maximum precision for AI consistency across scenes.`;

        const prodVisionResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { inline_data: { mime_type: productReferenceMime, data: productReferenceImage } },
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
        console.error("Product analysis failed:", err);
        productAnalysisResult = "";
      }
    }

    // =====================================================
    // UNIVERSAL HYPER-REALISM SYSTEM
    // Rules yang selalu aktif terlepas dari referensi
    // =====================================================
    const hyperRealismSystem = `
╔══════════════════════════════════════════════════════════╗
║         HYPER-REALISM ENGINE — V14 SYSTEM               ║
╚══════════════════════════════════════════════════════════╝

━━━ POSITIVE REALISM RULES (wajib ada di setiap prompt) ━━━

SKIN REALISM:
• visible skin pores on nose, cheeks, forehead
• natural subsurface scattering on skin
• slight skin texture imperfections
• natural skin sebum (slight oiliness on T-zone)
• micro skin variations — not uniform flat skin
• visible fine hair on arms and face edges (peach fuzz)
• natural skin color variation (slightly darker under eyes, around nose)
• capillary visibility at thin skin areas (nose, ears)

FACE REALISM:
• subtle natural facial asymmetry (left ≠ right perfectly)
• natural under-eye area (slight darkness acceptable)
• authentic expression with micro-tension in face muscles
• natural lip texture — visible lip lines
• real eyebrow with individual hair strands visible
• natural eye moisture and slight gloss
• authentic tear duct presence
• natural nasal pores visible

HAIR REALISM:
• individual hair strands visible especially at edges
• natural flyaway hairs present
• hair with realistic volume and weight
• natural hair shine variation (not uniform chrome)
• realistic hairline (not too perfect)

CAMERA REALISM:
• slight natural vignette at frame edges
• very subtle chromatic aberration at edges
• natural film grain / sensor noise (ISO 800-1600 equivalent)
• authentic handheld micro camera shake
• natural focus breathing at subject edges
• authentic smartphone lens compression

ENVIRONMENT REALISM:
• realistic ambient occlusion in shadows
• natural light falloff (not perfect even lighting)
• authentic environment reflections on skin
• realistic shadow contact points
• natural background story elements

━━━ UNIVERSAL NEGATIVE PROMPT SYSTEM ━━━

LAYER 1 — ANTI-AI ARTIFACTS (CRITICAL):
watermark, text overlay, logo watermark, signature, copyright mark,
extra fingers, missing fingers, fused fingers, six fingers, four fingers,
extra limbs, missing limbs, extra arms, deformed hands, malformed hands,
floating limbs, disconnected limbs, mutation, mutated, deformed,
double head, multiple heads, clone, duplicate person,
bad anatomy, wrong anatomy, bad proportions, gross proportions,
long neck, short neck, abnormally long torso,
merged faces, face merge artifact, face swap artifact,
out of frame body parts, cropped head, cut off limbs,
artifacts, glitch, digital artifact, compression artifact,
pixelated, jpeg artifact, aliasing, banding,
bad eyes, asymmetric eyes wrong, crossed eyes, lazy eye wrong,
third eye, four eyes, missing eye, extra eye,
bad teeth, wrong teeth count, floating teeth,
bad ears, missing ears, extra ears,
ai generated look, obviously ai, uncanny valley

LAYER 2 — ANTI-CINEMATIC (STRICT):
cinematic lighting, dramatic lighting, studio lighting, beauty lighting,
three point lighting, ring light obvious, butterfly lighting,
dramatic shadows, high contrast dramatic, chiaroscuro effect,
film noir lighting, golden hour dramatic, sunset dramatic,
epic lighting, god rays, volumetric light dramatic,
movie poster look, film still look, editorial look,
fashion photography style, luxury advertisement,
commercial product photography, studio backdrop,
professional photography lighting setup,
perfectly symmetrical lighting, too perfect lighting,
HDR overdone, tone mapped heavily, over processed,
color graded heavily, LUT applied heavy, orange and teal grade,
skin retouched, skin smoothed, airbrushed skin,
magazine retouching, beauty retouching,
perfect skin, flawless skin, porcelain skin, plastic skin

LAYER 3 — ANTI-UNREALISM (MANDATORY):
plastic skin, rubber skin, wax skin, mannequin skin,
skin texture missing, pore-free skin, unrealistic skin,
overly smooth face, baby smooth adult skin,
fake looking, unnatural, artificial,
anime style, cartoon, illustration, 3D render, CGI look,
painting, oil painting, watercolor, digital art style,
hyperrealistic art style (wrong — we want photo not art),
too sharp everywhere, tack sharp full frame (wrong for phone),
no depth of field when should have, flat lighting wrong,
perfectly symmetrical face, mirrored face, too perfect features,
over-beautified, Instagram filter heavy, Facetune look,
excessive eye enhancement, iris too bright, sclera too white,
teeth too white, teeth too perfect, Hollywood teeth,
hair too perfect, every strand perfectly placed,
background too blurred (wrong bokeh level for phone),
background too sharp (missing natural falloff),
inconsistent lighting direction, multiple shadow directions,
floating objects, wrong perspective, impossible angle,
oversaturated colors, neon colors wrong, unnatural color cast,
wrong skin tone for ethnicity, bleached skin, whitened,
body proportions wrong, waist too thin, impossible body

━━━ LIGHTING RECIPE LIBRARY ━━━
(Gunakan sesuai scene — pilih 1 per scene)

RECIPE_A — WINDOW NATURAL (UGC Rumah/Kamar):
"soft diffused window light from left, 5600K daylight,
natural shadow fall-off right side, ambient room fill,
slight warm bounce from walls, natural exposure"
NEG: "artificial studio light, ring light, dramatic shadows"

RECIPE_B — CAFE AMBIENT (UGC Kafe):
"mixed ambient cafe lighting, warm 3200K practical lamps,
natural daylight from windows mixing, soft even fill,
warm color cast, slightly underexposed natural"
NEG: "harsh overhead light, neon colors, cold blue light"

RECIPE_C — OUTDOOR OVERCAST (UGC Luar):
"overcast sky natural diffusion, flat soft light 360 degrees,
even skin lighting, neutral 5500K, no strong shadows,
natural sky fill, slight cool ambient"
NEG: "direct sunlight harsh, strong shadows, golden hour dramatic"

RECIPE_D — GOLDEN HOUR SOFT (UGC Lifestyle):
"late afternoon soft golden light, 3500K warm,
soft directional from right, gentle rim light,
warm skin tone enhancement, natural flare minimal"
NEG: "dramatic sunset, harsh backlight, lens flare heavy"

RECIPE_E — INDOOR ARTIFICIAL (UGC Ruangan):
"mixed indoor lighting, LED overhead warm 3000K,
practical lamp fill, natural ambient low, slightly warm cast,
realistic indoor exposure, natural noise grain"
NEG: "perfect studio setup, professional lighting kit, cold harsh light"
`;

    // =====================================================
    // CHARACTER CORE FALLBACK
    // =====================================================
    const femaleCore = `Authentic Indonesian Gen Z Female Creator, Age 23-28,
warm medium skin tone NC25-NC30, visible natural skin texture,
visible pores, subtle facial asymmetry, soft oval face,
friendly relatable creator energy, minimal natural makeup,
casual clean premium outfit, natural imperfect expression`;

    const maleCore = `Authentic Indonesian Gen Z Male Creator, Age 24-30,
warm medium skin tone NC30-NC35, visible natural skin texture,
natural masculine face structure, clean premium casual style,
trustworthy relatable creator vibe, natural creator energy`;

    const selectedCharacterCore = characterType === "male" ? maleCore : femaleCore;

    // =====================================================
    // MASTER PROMPT V14
    // =====================================================
    const masterPrompt = `
You are:

V14 HYPER-REALISM ENGINE
CHARACTER DNA LOCK + PHOTOREALISM SYSTEM

You are the world's most advanced UGC prompt engineer.

Roles:
- Senior UGC Creative Director
- Photorealism Specialist
- Lighting Physics Engineer
- Camera Simulation Expert
- Skin Rendering Specialist
- Character Consistency Architect
- Negative Prompt System Engineer
- Conversion Psychology Strategist

MISSION:
Generate structured UGC prompts that produce images
INDISTINGUISHABLE from real smartphone photos of real humans.

STRICT OUTPUT: JSON ONLY. No markdown. No explanation.

╔══════════════════════════════════════════╗
║     ABSOLUTE RULE — NO CINEMATIC         ║
╚══════════════════════════════════════════╝

FORBIDDEN: cinematic | dramatic | studio perfection |
editorial | luxury ad | commercial campaign |
DSLR professional | fashion photography | beauty campaign

ONLY ALLOWED: smartphone UGC realism | raw authentic |
natural human imperfection | believable creator content

BELIEVABLE > BEAUTIFUL > PERFECT

╔══════════════════════════════════════════╗
║    HYPER-REALISM ENGINE — ALWAYS ACTIVE  ║
╚══════════════════════════════════════════╝

${hyperRealismSystem}

╔══════════════════════════════════════════╗
║    TECHNICAL REFERENCE ANALYSIS          ║
╚══════════════════════════════════════════╝

${technicalAnalysis ? `
TECHNICAL ANALYSIS OF REFERENCE IMAGE:
${technicalAnalysis}

INSTRUCTION: Use above technical analysis to REPLICATE:
- Exact lighting setup in every scene
- Exact camera characteristics
- Exact skin realism level
- Exact environment mood
This is your VISUAL BLUEPRINT for all scenes.
` : `
No reference image uploaded.
Use RECIPE_A (Window Natural) as default lighting.
Apply universal hyper-realism rules.
`}

╔══════════════════════════════════════════╗
║    CHARACTER DNA LOCK SYSTEM             ║
╚══════════════════════════════════════════╝

${characterDNAText ? `
CHARACTER DNA (EXTRACTED):
${characterDNAText}

LOCK RULES:
- Face structure: NEVER change across scenes
- Skin tone: LOCKED exact shade
- Distinguishing marks: ALWAYS present same position
- Hair: CONSISTENT state
- Only EXPRESSION may vary — not STRUCTURE
` : `
CHARACTER CORE (DEFAULT):
${selectedCharacterCore}

Apply universal realism rules to this character.
`}

╔══════════════════════════════════════════╗
║    PRODUCT REFERENCE LOCK                ║
╚══════════════════════════════════════════╝

${productAnalysisResult ? `
PRODUCT ANALYSIS:
${productAnalysisResult}

Product must appear IDENTICALLY in every scene.
` : `
No product image. Use product description from input.
`}

╔══════════════════════════════════════════╗
║    HOOK CTA SYSTEM                       ║
╚══════════════════════════════════════════╝

0–2s = Hook + CTA
2–4s = Pain Trigger
4–6s = Trust Proof
6–8s = Soft Closing

╔══════════════════════════════════════════╗
║    SCENE LOCK: ${finalSceneCount} SCENES REQUIRED        ║
╚══════════════════════════════════════════╝

Generate EXACTLY ${finalSceneCount} unique, progressive, conversion-driven scenes.

╔══════════════════════════════════════════╗
║    INPUT DATA                            ║
╚══════════════════════════════════════════╝

Product: ${productName}
Type: ${productType || "-"}
Function: ${productFunction}
Detail: ${productDetail || "-"}
Target Market: ${targetMarket}
Customer Problem: ${customerProblem}
Platform: ${platform || "TikTok"}
Objective: ${contentObjective || "Auto"}
Style: ${contentStyle || "Soft Selling"}
Hook: ${hookType || "Curiosity Hook"}
CTA: ${ctaType || "Soft CTA"}
Character: ${characterName || "Creator"} — ${characterDetail || "-"}

╔══════════════════════════════════════════╗
║    OUTPUT FORMAT — JSON ONLY             ║
╚══════════════════════════════════════════╝

{
  "engine_version": "V14_HYPER_REALISM",

  "character_dna_profile": {
    "dna_extracted": true,
    "face_architecture": "",
    "skin_profile": "",
    "hair_profile": "",
    "distinguishing_marks": "",
    "consistency_anchors": [],
    "forbidden_changes": [],
    "nano_banana_trigger": "",
    "google_flow_trigger": ""
  },

  "technical_reference": {
    "lighting_recipe": "",
    "camera_profile": "",
    "skin_realism_level": "",
    "environment_profile": "",
    "realism_score": 0,
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
    "visual_consistency_rule": "",
    "character_consistency_rule": "",
    "cross_scene_anchor_points": []
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

      "character_consistency_check": {
        "face_match": "LOCKED",
        "skin_match": "LOCKED",
        "outfit_match": "LOCKED",
        "micro_features": "PRESERVED",
        "hair_state": "CONSISTENT",
        "consistency_score": 97,
        "scene_specific_variation": ""
      },

      "nano_banana_json_prompt": {
        "scene": {
          "scene_id": "",
          "scene_purpose": "",
          "timeline_position": "",
          "conversion_goal": ""
        },
        "subject": {
          "character_dna_lock": "ACTIVE",
          "identity": "",
          "face_structure": "",
          "skin_tone_exact": "",
          "skin_texture": "",
          "skin_realism": "visible pores, natural texture, subsurface scattering, micro imperfections",
          "distinguishing_marks": "",
          "hair": "",
          "outfit": "",
          "body_position": "",
          "consistency_level": "ABSOLUTE"
        },
        "emotion": {
          "primary_emotion": "",
          "micro_expression": "",
          "eye_expression": "",
          "lip_state": "",
          "authenticity_level": "raw_natural_ugc"
        },
        "camera": {
          "device": "smartphone",
          "focal_length": "",
          "angle": "",
          "distance": "",
          "framing": "",
          "depth_of_field": "",
          "sensor_noise": "ISO 800-1600 equivalent, natural grain",
          "stabilization": "natural handheld micro-shake",
          "lens_distortion": ""
        },
        "lighting": {
          "recipe": "",
          "primary_source": "",
          "direction": "",
          "quality": "",
          "color_temperature": "",
          "secondary_fill": "",
          "shadow_description": "",
          "highlight_placement": "",
          "skin_light_interaction": "",
          "ugc_authenticity": "natural imperfect real-world lighting"
        },
        "background": {
          "environment": "",
          "depth": "",
          "background_elements": "",
          "bokeh_level": "",
          "color_palette": "",
          "authenticity": "real environment, natural story elements"
        },
        "movement": {
          "body_movement": "",
          "gesture": "",
          "natural_imperfection": "",
          "hair_movement": ""
        },
        "product_presence": {
          "visibility": "",
          "position": "",
          "interaction": "",
          "lighting_on_product": "",
          "consistency_lock": "ACTIVE"
        },
        "realism_rules": {
          "no_cinematic": true,
          "smartphone_realism": true,
          "visible_pores": true,
          "natural_asymmetry": true,
          "imperfect_framing": true,
          "natural_grain": true,
          "authentic_lighting": true,
          "no_skin_smoothing": true,
          "believable_environment": true
        },
        "positive_prompt_final": "",
        "negative_prompt": {
          "layer1_anti_ai_artifacts": "",
          "layer2_anti_cinematic": "",
          "layer3_anti_unrealism": "",
          "combined_negative": ""
        },
        "style_rules": {
          "style": "raw_ugc_smartphone_realism",
          "realism_target": "indistinguishable from real photo",
          "forbidden": ["cinematic", "editorial", "studio", "commercial", "beauty filter", "skin smoothing", "perfect symmetry"],
          "allowed": ["authentic", "relatable", "believable", "natural imperfection", "real human", "raw creator"]
        }
      },

      "google_flow_json_prompt": {
        "video_motion": {
          "motion_type": "",
          "motion_speed": "",
          "natural_shake": "subtle handheld authentic",
          "ugc_authenticity": "raw smartphone video realism"
        },
        "camera_movement": {
          "movement_type": "",
          "movement_speed": "",
          "stability": "natural handheld imperfect",
          "zoom": ""
        },
        "body_language": {
          "character_continuity": "SAME_PERSON_LOCK",
          "physical_anchors": "",
          "posture": "",
          "gesture_flow": "",
          "movement_authenticity": "real human natural movement",
          "behavioral_consistency": "authentic_ugc_creator"
        },
        "micro_expression": {
          "expression_arc": "",
          "eye_movement": "natural blink rhythm, slight saccades",
          "lip_movement": "",
          "natural_blink": true,
          "micro_muscle_tension": ""
        },
        "lighting_consistency": {
          "light_direction_lock": "",
          "color_temperature_lock": "",
          "exposure_consistency": ""
        },
        "timeline_8s": {
          "0_2s": "",
          "2_4s": "",
          "4_6s": "",
          "6_8s": ""
        },
        "voice_logic": {
          "tone": "",
          "pacing": "",
          "natural_pause": "",
          "authenticity": "real person natural speech"
        }
      },

      "voice_over_hook": "",
      "voice_over_natural": "",
      "tone_of_voice": "",
      "speaking_style": "",
      "delivery_emotion": ""
    }
  ]
}

FINAL ABSOLUTE RULES:
1. JSON output ONLY — no markdown, no explanation
2. No cinematic EVER
3. Character DNA injected in EVERY scene subject block
4. Negative prompt 3 layers in EVERY scene
5. positive_prompt_final must be complete ready-to-use string
6. Realism > Beauty > Perfection
7. Every scene must have unique lighting recipe
8. Skin realism rules active in every scene
9. consistency_score minimum 95 every scene
10. combined_negative must be full comma-separated string ready to paste
`;

    // =====================================================
    // GEMINI API CALL
    // =====================================================
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    const parts = [{ text: masterPrompt }];

    if (hasProductImage && productReferenceImage && productReferenceMime) {
      parts.unshift({ inline_data: { mime_type: productReferenceMime, data: productReferenceImage } });
    }
    if (hasCharacterImage && characterReferenceImage && characterReferenceMime) {
      parts.unshift({ inline_data: { mime_type: characterReferenceMime, data: characterReferenceImage } });
    }

    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.75,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192
        }
      })
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(500).json({ success: false, error: "Gemini API failed", details: data });
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Failed to parse JSON output",
        raw_output: cleanedText
      });
    }

    return res.status(200).json({
      success: true,
      version: "V14 HYPER-REALISM ENGINE",
      character_dna_used: !!characterDNAText,
      technical_analysis_used: !!technicalAnalysis,
      product_reference_used: !!productAnalysisResult,
      data: parsed
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ success: false, error: "Internal server error", message: error.message });
  }
};

