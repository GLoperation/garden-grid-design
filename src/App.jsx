import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   MASSIVE PLANT DATABASE — 130+ plants with subspecies, heights
   ═══════════════════════════════════════════════════════════════ */
const PLANTS = [
  // ── TOMATOES ──
  { id:"tomato",name:"Tomato (Beefsteak)",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"70–85",depth:"¼″",season:"Warm",heightIn:72,zones:[3,11],sow:"transplant",companions:["Basil", "Carrot", "Parsley", "Marigold", "Onion", "Garlic", "Borage", "Lettuce"],avoid:["Cabbage", "Potato", "Fennel", "Corn", "Dill"],color:"#e53e3e",icon:"tomato",tip:"INDETERMINATE — grows continuously all season and needs pruning. Remove suckers (shoots between main stem and branches) for larger fruit. Stake or cage required. Bury 2/3 of stem when transplanting to develop stronger roots. Water at base to prevent blight. Start seeds indoors 6–8 weeks before last frost." },
  { id:"cherry_tomato",name:"Cherry Tomato",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"55–70",depth:"¼″",season:"Warm",heightIn:60,zones:[3,11],sow:"transplant",companions:["Basil", "Chives", "Marigold", "Parsley", "Carrot", "Borage"],avoid:["Potato", "Fennel", "Corn", "Cabbage"],color:"#fc8181",icon:"cherry_tomato",tip:"INDETERMINATE — prolific producers all season. Sun Gold (orange, super sweet) and Sweet 100 are top varieties. Great for containers with a cage. Can become invasive — prune regularly. Kids love picking these. Start indoors 6–8 weeks before last frost." },
  { id:"roma_tomato",name:"Roma Tomato",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"70–80",depth:"¼″",season:"Warm",heightIn:48,zones:[3,11],sow:"transplant",companions:["Basil", "Carrot", "Parsley", "Marigold", "Garlic"],avoid:["Potato", "Fennel", "Corn", "Cabbage"],color:"#e53e3e",icon:"tomato",tip:"DETERMINATE — fruits ripen all at once, great for canning/sauce. San Marzano is the gold standard paste tomato. Meaty with few seeds. Plants are bushier and shorter than indeterminate types, may not need staking. Start indoors 6–8 weeks before last frost." },
  { id:"grape_tomato",name:"Grape Tomato",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"60–70",depth:"¼″",season:"Warm",heightIn:60,zones:[3,11],sow:"transplant",companions:["Basil", "Marigold", "Carrot", "Parsley"],avoid:["Potato", "Fennel", "Corn"],color:"#fc8181",icon:"cherry_tomato",tip:"INDETERMINATE — oblong shape with thicker skin than cherry tomatoes, making them less prone to cracking and better for lunchboxes. Juliet variety is a top pick. Very productive — one plant can yield 10+ lbs." },
  { id:"heirloom_tomato",name:"Heirloom Tomato",cat:"Fruiting",spacingIn:30,sun:"Full",water:"Regular",days:"75–95",depth:"¼″",season:"Warm",heightIn:84,zones:[3,11],sow:"transplant",companions:["Basil", "Marigold", "Carrot", "Parsley", "Borage", "Garlic"],avoid:["Potato", "Fennel", "Cabbage", "Corn"],color:"#c53030",icon:"tomato",tip:"INDETERMINATE — open-pollinated varieties passed down generations. Brandywine (pink, incredible flavor), Cherokee Purple (smoky-sweet), Green Zebra (tangy). Need more space and care than hybrids. More susceptible to disease but unmatched flavor. Needs strong support — heavy fruits." },
  { id:"plum_tomato",name:"Plum Tomato",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"70–80",depth:"¼″",season:"Warm",heightIn:48,zones:[3,11],sow:"transplant",companions:["Basil", "Parsley", "Carrot", "Marigold"],avoid:["Potato", "Fennel", "Corn"],color:"#e53e3e",icon:"tomato",tip:"DETERMINATE — meaty with few seeds, bred specifically for sauce and drying. Harvest when uniformly colored. Great for dehydrating into sun-dried tomatoes. Compact plants work well in raised beds." },
  // ── PEPPERS ──
  { id:"bell_pepper",name:"Bell Pepper",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"60–90",depth:"¼″",season:"Warm",heightIn:30,zones:[3,11],sow:"transplant",companions:["Tomato", "Basil", "Carrot", "Onion", "Spinach", "Marigold"],avoid:["Fennel", "Broccoli", "Cabbage"],color:"#dd6b20",icon:"pepper",tip:"All bell peppers start green — leave on plant longer for red, yellow, or orange (sweeter and more nutritious). Green = 60 days, colored = 80–90 days. Likes warm soil — use black plastic mulch in cooler zones. Feed with low-nitrogen fertilizer to avoid all leaves, no fruit. Start indoors 8–10 weeks before last frost." },
  { id:"jalapeno",name:"Jalapeño Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"65–80",depth:"¼″",season:"Warm",heightIn:30,zones:[3,11],sow:"transplant",companions:["Tomato", "Basil", "Carrot", "Onion", "Marigold"],avoid:["Fennel", "Broccoli"],color:"#2f855a",icon:"hot_pepper",tip:"2,500–8,000 SHU (Scoville). Green = milder, red = hotter and slightly sweet. Corking (white lines on skin) indicates heat and maturity. WEAR GLOVES when handling — capsaicin oil burns skin and eyes. Stress plants slightly (less water near harvest) for more heat. Prolific producer — one plant yields 25–35 peppers." },
  { id:"habanero",name:"Habanero Pepper",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"90–120",depth:"¼″",season:"Warm",heightIn:36,zones:[4,11],sow:"transplant",companions:["Tomato", "Cilantro", "Basil", "Marigold", "Onion"],avoid:["Fennel", "Broccoli"],color:"#ed8936",icon:"hot_pepper",tip:"100,000–350,000 SHU — EXTREMELY HOT. ALWAYS WEAR GLOVES, avoid touching face. Fruity flavor behind the heat. Needs long warm season — start indoors 10–12 weeks early. Orange when ripe. Great dried or in hot sauce. Plants are beautiful ornamentals too." },
  { id:"serrano",name:"Serrano Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"70–85",depth:"¼″",season:"Warm",heightIn:30,zones:[3,11],sow:"transplant",companions:["Tomato", "Basil", "Onion", "Marigold"],avoid:["Fennel", "Broccoli"],color:"#276749",icon:"hot_pepper",tip:"10,000–25,000 SHU — hotter than jalapeño with thinner walls. WEAR GLOVES. Typically used fresh (not dried). Essential for salsa verde and pico de gallo. Very productive plants. Green or red when mature." },
  { id:"cayenne",name:"Cayenne Pepper",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"70–85",depth:"¼″",season:"Warm",heightIn:36,zones:[3,11],sow:"transplant",companions:["Tomato", "Basil", "Onion", "Marigold"],avoid:["Fennel"],color:"#c53030",icon:"hot_pepper",tip:"30,000–50,000 SHU. WEAR GLOVES. Best pepper for drying — string them up and air dry, then grind into powder. Long thin pods turn bright red. Excellent in container gardens. Deer and rabbit resistant — sprinkle powder around garden as pest deterrent." },
  { id:"poblano",name:"Poblano Pepper",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"65–80",depth:"¼″",season:"Warm",heightIn:30,zones:[3,11],sow:"transplant",companions:["Tomato", "Basil", "Onion", "Marigold"],avoid:["Fennel", "Broccoli"],color:"#276749",icon:"pepper",tip:"1,000–2,000 SHU — mild enough for most palates. When dried = ancho chile (essential for mole sauce). Thick walls make them perfect for stuffing (chile rellenos). Dark green when fresh, red-brown when fully ripe. Large plants need support." },
  { id:"banana_pepper",name:"Banana Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"60–75",depth:"¼″",season:"Warm",heightIn:24,zones:[3,11],sow:"transplant",companions:["Tomato", "Basil", "Onion", "Marigold"],avoid:["Fennel"],color:"#ecc94b",icon:"pepper",tip:"0–500 SHU — very mild sweet pepper. Gloves not needed. Perfect for pickling, sandwiches, and pizza. Yellow ripening to orange-red. Very productive — keep picking to encourage more fruit. Succession plant for continuous harvest." },
  { id:"thai_pepper",name:"Thai Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"70–90",depth:"¼″",season:"Warm",heightIn:18,zones:[4,11],sow:"transplant",companions:["Basil", "Tomato", "Marigold"],avoid:["Fennel"],color:"#c53030",icon:"hot_pepper",tip:"50,000–100,000 SHU — very hot. WEAR GLOVES. Compact ornamental plant covered in upright pointing peppers. Perfect for containers and small spaces. Essential for Thai, Vietnamese, and Southeast Asian cooking." },
  { id:"ghost_pepper",name:"Ghost Pepper",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Moderate",days:"120–150",depth:"¼″",season:"Warm",heightIn:42,zones:[5,11],sow:"transplant",companions:["Tomato", "Basil", "Marigold"],avoid:["Fennel"],color:"#9b2c2c",icon:"hot_pepper",tip:"1,000,000+ SHU — DANGEROUSLY HOT. WEAR GLOVES AND EYE PROTECTION. Do not touch face for hours after handling. Needs very long warm season — start indoors 12+ weeks early. Use sparingly. Popular for hot sauce making. Also called Bhut Jolokia." },
  { id:"shishito",name:"Shishito Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"60–75",depth:"¼″",season:"Warm",heightIn:24,zones:[3,11],sow:"transplant",companions:["Tomato", "Basil", "Onion", "Marigold"],avoid:[],color:"#48bb78",icon:"pepper",tip:"50–200 SHU — mostly mild BUT roughly 1 in 10 is surprisingly spicy (Russian roulette pepper). Gloves not needed. Best blistered in a hot pan with oil and sea salt. Japanese variety gaining huge popularity. Very productive and easy to grow." },
  // ── CUCURBITS ──
  { id:"eggplant",name:"Eggplant",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"65–80",depth:"¼″",season:"Warm",heightIn:36,zones:[4,11],sow:"transplant",companions:["Pepper", "Bean", "Marigold", "Spinach", "Thyme"],avoid:["Fennel"],color:"#6b46c1",icon:"eggplant",tip:"Harvest when skin is glossy and springs back when pressed — dull skin means overripe and bitter. Loves heat — use black mulch. Start indoors 8–10 weeks early. Flea beetles are #1 pest — use row cover early. Cut (don't pull) fruit from plant." },
  { id:"japanese_eggplant",name:"Japanese Eggplant",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Regular",days:"60–70",depth:"¼″",season:"Warm",heightIn:30,zones:[4,11],sow:"transplant",companions:["Pepper", "Bean", "Marigold", "Thyme"],avoid:["Fennel"],color:"#553c9a",icon:"eggplant",tip:"Long thin shape with fewer seeds and thinner skin — no need to salt before cooking. Ichiban and Millionaire are top varieties. Cooks faster than globe types. Less bitter. Excellent for stir-fry, grilling, and tempura." },
  { id:"cucumber",name:"Slicing Cucumber",cat:"Fruiting",spacingIn:36,sun:"Full",water:"Frequent",days:"50–70",depth:"1″",season:"Warm",heightIn:72,zones:[3,11],sow:"both",companions:["Bean", "Pea", "Radish", "Corn", "Sunflower", "Dill", "Marigold", "Nasturtium"],avoid:["Potato", "Sage"],color:"#48bb78",icon:"cucumber",tip:"CAN BE TRANSPLANTED or direct sown. Trellis vining types to save 75% ground space and grow straighter fruit. SUCCESSION PLANT every 2–3 weeks for continuous harvest through summer. Pick frequently — leaving overripe cukes signals plant to stop producing. Bitter fruit = inconsistent watering. Mulch heavily to retain moisture." },
  { id:"pickling_cuke",name:"Pickling Cucumber",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Frequent",days:"48–65",depth:"1″",season:"Warm",heightIn:48,zones:[3,11],sow:"both",companions:["Bean", "Dill", "Radish", "Corn", "Marigold"],avoid:["Potato", "Sage"],color:"#38a169",icon:"cucumber",tip:"CAN BE TRANSPLANTED or direct sown. SUCCESSION PLANT every 3 weeks. Harvest SMALL (2–4 inches) for best crunch and texture. National Pickling and Boston Pickling are classic varieties. Plant near dill for ready-made pickle garden. Process within 24 hours of picking for crispest pickles." },
  { id:"zucchini",name:"Zucchini",cat:"Fruiting",spacingIn:36,sun:"Full",water:"Regular",days:"45–65",depth:"1″",season:"Warm",heightIn:30,zones:[3,11],sow:"direct",companions:["Corn", "Bean", "Marigold", "Nasturtium", "Radish"],avoid:["Potato"],color:"#68d391",icon:"zucchini",tip:"Direct sow after last frost — doesn't transplant well. Harvest at 6–8 inches for best flavor and texture — check DAILY as they grow incredibly fast. One plant produces 6–10 lbs. Hand pollinate by transferring pollen from male flowers (thin stem) to female flowers (swollen base). Powdery mildew is common — space for airflow." },
  { id:"yellow_squash",name:"Yellow Squash",cat:"Fruiting",spacingIn:36,sun:"Full",water:"Regular",days:"45–65",depth:"1″",season:"Warm",heightIn:30,zones:[3,11],sow:"direct",companions:["Corn", "Bean", "Marigold", "Nasturtium"],avoid:["Potato"],color:"#ecc94b",icon:"zucchini",tip:"Direct sow — crookneck or straightneck varieties. Same growing tips as zucchini. Harvest young for tender skin. Squash vine borer is the #1 killer — wrap base of stem with aluminum foil or use row cover. SUCCESSION PLANT mid-summer for fall crop if borers destroy first planting." },
  { id:"butternut",name:"Butternut Squash",cat:"Fruiting",spacingIn:48,sun:"Full",water:"Regular",days:"80–110",depth:"1″",season:"Warm",heightIn:24,zones:[3,11],sow:"both",companions:["Corn", "Bean", "Marigold", "Nasturtium"],avoid:["Potato"],color:"#ed8936",icon:"squash",tip:"Can transplant or direct sow. Vines spread 10–15 feet — plan space or trellis on strong support. Cure after harvest: leave in sun 2 weeks for skin to harden, then stores 3–6 months in cool dry place. Harvest when stem is dry and corky. Waltham Butternut is the classic variety." },
  { id:"acorn_squash",name:"Acorn Squash",cat:"Fruiting",spacingIn:48,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:24,zones:[3,11],sow:"direct",companions:["Corn", "Bean", "Marigold"],avoid:["Potato"],color:"#276749",icon:"squash",tip:"Direct sow after soil reaches 60°F. Dark green ribbed skin turns slightly orange when ripe. Shorter storage than butternut (1–2 months). Cut in half, scoop seeds, roast cut-side down. Sweet flavor intensifies with storage." },
  { id:"spaghetti_squash",name:"Spaghetti Squash",cat:"Fruiting",spacingIn:48,sun:"Full",water:"Regular",days:"90–110",depth:"1″",season:"Warm",heightIn:24,zones:[3,11],sow:"direct",companions:["Corn", "Bean", "Marigold", "Nasturtium"],avoid:["Potato"],color:"#ecc94b",icon:"squash",tip:"Direct sow — long season crop. Stringy flesh separates into pasta-like strands when cooked. Harvest when skin turns deep yellow and resists puncture with fingernail. Stores 2–3 months. One of the best low-carb pasta substitutes from the garden." },
  { id:"delicata_squash",name:"Delicata Squash",cat:"Fruiting",spacingIn:36,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:18,zones:[3,11],sow:"direct",companions:["Corn", "Bean", "Marigold"],avoid:["Potato"],color:"#faf089",icon:"squash",tip:"Direct sow. Edible skin — no peeling required. Sweet, creamy flavor. Shorter vines than other winter squash. Shorter storage life (1–2 months). Slice into rings, deseed, and roast — one of the easiest squash to prepare." },
  { id:"pumpkin",name:"Pumpkin",cat:"Fruiting",spacingIn:60,sun:"Full",water:"Regular",days:"90–120",depth:"1″",season:"Warm",heightIn:24,zones:[3,11],sow:"direct",companions:["Corn", "Bean", "Marigold", "Nasturtium"],avoid:["Potato"],color:"#dd6b20",icon:"pumpkin",tip:"Direct sow — needs lots of space (vines spread 15–20 ft). BURY LEAF NODE JOINTS on vines — they'll root and feed larger fruit. Remove all but 2–3 fruits per vine for bigger pumpkins. Place cardboard under fruit to prevent rot. Harvest when skin is hard and stem begins to dry." },
  { id:"pie_pumpkin",name:"Pie Pumpkin",cat:"Fruiting",spacingIn:48,sun:"Full",water:"Regular",days:"85–100",depth:"1″",season:"Warm",heightIn:20,zones:[3,11],sow:"direct",companions:["Corn", "Bean", "Marigold"],avoid:["Potato"],color:"#ed8936",icon:"pumpkin",tip:"Direct sow. Sugar Pie variety — smaller (5–8 lbs), sweeter, and smoother flesh than carving pumpkins. Far superior for cooking. Same vine-burying trick applies. Roast, puree, and freeze for pie filling all year." },
  { id:"corn",name:"Sweet Corn",cat:"Fruiting",spacingIn:12,sun:"Full",water:"Regular",days:"60–100",depth:"1–2″",season:"Warm",heightIn:84,zones:[3,11],sow:"direct",companions:["Bean", "Squash", "Cucumber", "Pea", "Sunflower", "Marigold"],avoid:["Tomato"],color:"#ecc94b",icon:"corn",tip:"MUST direct sow — doesn't transplant. Plant in blocks of at least 4×4 (not rows) for proper wind pollination. SUCCESSION PLANT every 2 weeks for extended harvest. Silk turning brown = nearly ready. Pick and eat same day — sugars convert to starch within hours. Three Sisters method: plant with beans and squash." },
  { id:"popcorn",name:"Popcorn",cat:"Fruiting",spacingIn:12,sun:"Full",water:"Regular",days:"90–110",depth:"1–2″",season:"Warm",heightIn:84,zones:[3,11],sow:"direct",companions:["Bean", "Squash", "Sunflower"],avoid:["Tomato"],color:"#d69e2e",icon:"corn",tip:"MUST direct sow. Let ears dry completely on the stalk until husks are papery brown. Isolate from sweet corn by 250+ feet or stagger planting by 2+ weeks to prevent cross-pollination. After harvest, cure 4–6 weeks in dry place before popping." },
  { id:"okra",name:"Okra",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"50–65",depth:"1″",season:"Warm",heightIn:60,zones:[5,11],sow:"direct",companions:["Pepper", "Melon", "Bean", "Marigold", "Sunflower"],avoid:[],color:"#68d391",icon:"bean",tip:"Direct sow after soil is warm (65°F+). Soak seeds overnight before planting. Harvest pods at 3–4 inches — larger pods become tough and woody. WEAR GLOVES and long sleeves — tiny spines on plants irritate skin. Pick every 1–2 days. Clemson Spineless is the most popular variety." },
  { id:"tomatillo",name:"Tomatillo",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"60–80",depth:"¼″",season:"Warm",heightIn:48,zones:[4,11],sow:"transplant",companions:["Basil", "Parsley", "Marigold", "Carrot"],avoid:["Fennel"],color:"#48bb78",icon:"tomato",tip:"MUST plant 2+ for cross-pollination — single plants won't fruit. Start indoors 6–8 weeks early. Harvest when husk splits and fruit fills it completely. Essential for salsa verde. Extremely productive — 1 lb per plant. Self-seeds aggressively if fruit drops." },
  // ── LEAFY GREENS ──
  { id:"lettuce",name:"Butterhead Lettuce",cat:"Leafy",spacingIn:8,sun:"Partial",water:"Regular",days:"45–60",depth:"⅛″",season:"Cool",heightIn:8,zones:[2,11],sow:"both",companions:["Carrot", "Radish", "Strawberry", "Chive", "Onion", "Bean"],avoid:[],color:"#68d391",icon:"lettuce",tip:"Can transplant or direct sow. SUCCESSION PLANT every 2 weeks spring through fall for non-stop harvest. Bolts (goes to seed) in heat — plant in shade of taller crops in summer. Bibb and Boston are popular types. Harvest outer leaves or cut whole head." },
  { id:"romaine",name:"Romaine Lettuce",cat:"Leafy",spacingIn:8,sun:"Partial",water:"Regular",days:"55–70",depth:"⅛″",season:"Cool",heightIn:12,zones:[2,11],sow:"both",companions:["Carrot", "Radish", "Onion", "Chive", "Bean", "Strawberry"],avoid:[],color:"#48bb78",icon:"lettuce",tip:"Can transplant or direct sow. Cut-and-come-again: harvest outer leaves at 6 inches and inner heart continues growing. More heat tolerant than butterhead. Parris Island Cos is a classic. SUCCESSION PLANT every 2 weeks." },
  { id:"leaf_lettuce",name:"Leaf Lettuce",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"30–50",depth:"⅛″",season:"Cool",heightIn:8,zones:[2,11],sow:"direct",companions:["Carrot", "Radish", "Onion", "Strawberry"],avoid:[],color:"#9ae6b4",icon:"lettuce",tip:"Direct sow — fastest lettuce. Scatter seeds and thin. Red or green loose-leaf types. Cut leaves at 4–6 inches and regrows 2–3 times. Perfect for containers and windowsills. SUCCESSION PLANT every 10–14 days for constant salad supply." },
  { id:"iceberg",name:"Iceberg Lettuce",cat:"Leafy",spacingIn:12,sun:"Full",water:"Regular",days:"70–80",depth:"⅛″",season:"Cool",heightIn:8,zones:[3,9],sow:"transplant",companions:["Carrot", "Radish", "Onion"],avoid:[],color:"#c6f6d5",icon:"lettuce",tip:"Transplant — needs consistent cool temps (60–70°F). Hardest lettuce to grow in home gardens. Forms tight crispy heads. Most water content of any lettuce. Bolt-resistant varieties like Ithaca are best for home growers." },
  { id:"spinach",name:"Spinach",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"35–50",depth:"½″",season:"Cool",heightIn:8,zones:[2,11],sow:"direct",companions:["Strawberry", "Pea", "Bean", "Onion", "Radish"],avoid:[],color:"#2f855a",icon:"spinach",tip:"Direct sow — one of the first things to plant in spring, 4–6 weeks before last frost. Bolts FAST in heat (above 75°F). Plant again in fall for second crop. Savoy (crinkled) types are hardier; flat-leaf easier to wash. Harvest outer leaves first. SUCCESSION PLANT every 10 days in cool weather." },
  { id:"malabar_spinach",name:"Malabar Spinach",cat:"Leafy",spacingIn:12,sun:"Full",water:"Regular",days:"55–70",depth:"½″",season:"Warm",heightIn:120,zones:[7,11],sow:"transplant",companions:["Tomato", "Bean"],avoid:[],color:"#276749",icon:"spinach",tip:"Not true spinach — tropical vine that THRIVES in heat when regular spinach bolts. Needs trellis (grows 10+ feet). Thick succulent leaves with mild flavor. Red-stemmed variety is ornamental. Start indoors in cooler zones. Perennial in zones 10+." },
  { id:"kale",name:"Curly Kale",cat:"Leafy",spacingIn:18,sun:"Full",water:"Regular",days:"55–75",depth:"½″",season:"Cool",heightIn:24,zones:[2,11],sow:"both",companions:["Beet", "Celery", "Onion", "Dill", "Marigold"],avoid:["Strawberry"],color:"#276749",icon:"kale",tip:"Can transplant or direct sow. FROST MAKES IT SWEETER — starches convert to sugars. Harvest outer leaves first, leaving center to keep growing. One of the most nutritious vegetables. Survives winters down to zone 6 with mulch. Winterbor and Vates are top curly varieties." },
  { id:"lacinato_kale",name:"Lacinato Kale",cat:"Leafy",spacingIn:18,sun:"Full",water:"Regular",days:"55–75",depth:"½″",season:"Cool",heightIn:30,zones:[2,11],sow:"both",companions:["Beet", "Celery", "Onion", "Marigold"],avoid:["Strawberry"],color:"#22543d",icon:"kale",tip:"Also called Dinosaur Kale or Tuscan Kale. Flat blue-green pebbled leaves. More tender and less bitter than curly kale. Essential for Italian ribollita soup. Same frost-sweetening benefit. Strip leaves from tough center rib before cooking." },
  { id:"arugula",name:"Arugula",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"21–40",depth:"¼″",season:"Cool",heightIn:10,zones:[3,11],sow:"direct",companions:["Carrot", "Lettuce", "Bean", "Onion"],avoid:[],color:"#48bb78",icon:"arugula",tip:"Direct sow — one of the fastest crops (21 days to baby greens). Peppery flavor intensifies with heat and maturity — pick young for mild salads. SUCCESSION PLANT every 2 weeks. Bolts quickly in heat but flowers are edible. Self-seeds readily." },
  { id:"chard",name:"Swiss Chard (Rainbow)",cat:"Leafy",spacingIn:12,sun:"Full",water:"Regular",days:"50–60",depth:"½″",season:"Cool",heightIn:18,zones:[3,11],sow:"both",companions:["Bean", "Onion", "Lettuce", "Cabbage"],avoid:[],color:"#e53e3e",icon:"chard",tip:"Can transplant or direct sow. Rainbow chard has stunning red, yellow, orange, pink stems — beautiful AND edible. Cut outer stalks at base. Tolerates more heat than spinach. Both leaves (cook like spinach) and stems (cook like asparagus) are edible. Bright Lights variety is most colorful." },
  { id:"collards",name:"Collard Greens",cat:"Leafy",spacingIn:18,sun:"Full",water:"Regular",days:"55–75",depth:"½″",season:"Cool",heightIn:30,zones:[3,11],sow:"both",companions:["Onion", "Potato", "Marigold", "Dill"],avoid:["Strawberry"],color:"#276749",icon:"kale",tip:"Can transplant or direct sow. Southern staple. Frost-sweetened like kale. Incredibly cold hardy — survives to 10°F. Harvest lower leaves as plant grows upward. Strip tough center rib. Georgia Southern and Vates are classic varieties." },
  { id:"bok_choy",name:"Bok Choy",cat:"Leafy",spacingIn:8,sun:"Partial",water:"Regular",days:"30–50",depth:"¼″",season:"Cool",heightIn:12,zones:[3,11],sow:"both",companions:["Beet", "Onion", "Celery"],avoid:[],color:"#c6f6d5",icon:"cabbage",tip:"Can transplant or direct sow. Baby bok choy matures in just 30 days. Bolts in heat — grow in spring or fall. Cut whole head at base or harvest outer leaves. Essential for stir-fry. Shanghai and Joi Choi are reliable varieties." },
  { id:"endive",name:"Endive",cat:"Leafy",spacingIn:10,sun:"Partial",water:"Regular",days:"45–60",depth:"¼″",season:"Cool",heightIn:10,zones:[3,9],sow:"both",companions:["Carrot", "Lettuce", "Onion"],avoid:[],color:"#9ae6b4",icon:"lettuce",tip:"Can transplant or direct sow. Blanch for milder flavor: tie outer leaves over heart 2–3 weeks before harvest to block light. Slightly bitter — a gourmet green. Frisée (curly) and escarole (broad-leaf) are the two main types." },
  { id:"mustard_greens",name:"Mustard Greens",cat:"Leafy",spacingIn:6,sun:"Full",water:"Regular",days:"30–45",depth:"¼″",season:"Cool",heightIn:18,zones:[3,11],sow:"direct",companions:["Lettuce", "Onion", "Bean"],avoid:[],color:"#48bb78",icon:"arugula",tip:"Direct sow — very fast growing. Spicy kick that increases with maturity. Red Giant has beautiful purple-red leaves. SUCCESSION PLANT every 3 weeks. Great as microgreens too. Southern and Asian cooking staple. Bolts in heat." },
  { id:"watercress",name:"Watercress",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Frequent",days:"30–50",depth:"Surface",season:"Cool",heightIn:6,zones:[3,11],sow:"both",companions:["Mint", "Lettuce"],avoid:[],color:"#38a169",icon:"arugula",tip:"Loves wet soil or shallow standing water. Can grow in a container set in a tray of water. Peppery superfood. Harvest stems by cutting — regrows quickly. One of the oldest known leaf vegetables consumed by humans." },
  { id:"mizuna",name:"Mizuna",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"21–40",depth:"¼″",season:"Cool",heightIn:10,zones:[3,11],sow:"direct",companions:["Lettuce", "Onion", "Radish"],avoid:[],color:"#68d391",icon:"arugula",tip:"Direct sow. Japanese mustard green with mild peppery flavor — less sharp than arugula. Feathery serrated leaves. Very cold hardy. Great for salad mixes. Cut-and-come-again harvesting." },
  { id:"tatsoi",name:"Tatsoi",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"30–45",depth:"¼″",season:"Cool",heightIn:8,zones:[3,11],sow:"direct",companions:["Lettuce", "Onion", "Radish"],avoid:[],color:"#2f855a",icon:"spinach",tip:"Direct sow. Beautiful rosette shape with spoon-shaped dark green leaves. Extremely cold hardy — survives under snow. Mild flavor similar to bok choy. Also called spoon mustard. Great winter crop." },
  // ── BRASSICAS ──
  { id:"cabbage",name:"Green Cabbage",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"70–100",depth:"½″",season:"Cool",heightIn:18,zones:[2,11],sow:"transplant",companions:["Bean", "Celery", "Onion", "Dill", "Beet", "Lettuce", "Marigold"],avoid:["Strawberry", "Tomato"],color:"#9ae6b4",icon:"cabbage",tip:"Transplant — start indoors 6–8 weeks before last frost. Mulch heavily to keep roots cool. Consistent watering prevents heads from splitting. Heads are ready when firm when squeezed. Can store in root cellar for months. Early Jersey Wakefield is a fast variety." },
  { id:"red_cabbage",name:"Red Cabbage",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"70–100",depth:"½″",season:"Cool",heightIn:18,zones:[2,11],sow:"transplant",companions:["Bean", "Celery", "Onion", "Dill", "Marigold"],avoid:["Strawberry", "Tomato"],color:"#9b2c2c",icon:"cabbage",tip:"Transplant. Rich in anthocyanins (powerful antioxidants). Needs slightly more time than green cabbage. Acidic soil keeps color vibrant. Great for coleslaw, braising, and fermentation (beautiful purple sauerkraut)." },
  { id:"napa_cabbage",name:"Napa Cabbage",cat:"Brassica",spacingIn:12,sun:"Full",water:"Regular",days:"50–70",depth:"½″",season:"Cool",heightIn:16,zones:[3,11],sow:"both",companions:["Bean", "Onion", "Celery", "Marigold"],avoid:["Tomato"],color:"#c6f6d5",icon:"cabbage",tip:"Can transplant or direct sow. Chinese cabbage — elongated head. Essential for kimchi. Faster maturing than round cabbages. Fall planting often more successful (bolts in spring heat). Blues is a reliable variety." },
  { id:"broccoli",name:"Broccoli",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"60–80",depth:"½″",season:"Cool",heightIn:24,zones:[2,11],sow:"transplant",companions:["Onion", "Celery", "Beet", "Dill", "Lettuce", "Marigold"],avoid:["Strawberry", "Tomato"],color:"#38a169",icon:"broccoli",tip:"Transplant. Harvest main head BEFORE yellow flowers open — cut with 6 inches of stem. After main head harvest, side shoots continue producing for weeks. Waltham 29 produces most side shoots. Cover with row cover to prevent cabbage worms. Prefers 60–70°F." },
  { id:"broccolini",name:"Broccolini",cat:"Brassica",spacingIn:12,sun:"Full",water:"Regular",days:"50–65",depth:"½″",season:"Cool",heightIn:18,zones:[2,11],sow:"transplant",companions:["Onion", "Celery", "Dill", "Marigold"],avoid:["Tomato"],color:"#48bb78",icon:"broccoli",tip:"Transplant. Broccoli × gai lan hybrid. All tender stems, no thick stalk. Continuous side shoot production after initial harvest. Sweeter and more tender than broccoli. High-end restaurant favorite you can grow easily." },
  { id:"cauliflower",name:"Cauliflower",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"55–80",depth:"½″",season:"Cool",heightIn:18,zones:[2,11],sow:"transplant",companions:["Bean", "Celery", "Onion", "Dill", "Marigold"],avoid:["Strawberry", "Tomato"],color:"#fefcbf",icon:"cauliflower",tip:"Transplant — the most finicky brassica. Blanch white varieties by tying outer leaves over developing head when it reaches 2–3 inches to keep it white. Self-blanching varieties (Amazing) are easier. Temperature swings cause buttoning (premature tiny heads). Purple and orange varieties don't need blanching." },
  { id:"romanesco",name:"Romanesco",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"75–100",depth:"½″",season:"Cool",heightIn:18,zones:[3,10],sow:"transplant",companions:["Bean", "Celery", "Onion", "Marigold"],avoid:["Tomato"],color:"#9ae6b4",icon:"cauliflower",tip:"Transplant. Stunning fractal spiral pattern — nature's most mathematical vegetable. Nutty, slightly sweeter than cauliflower. Same growing requirements as cauliflower but slightly more forgiving. A real showstopper at farmers markets." },
  { id:"brussels",name:"Brussels Sprouts",cat:"Brassica",spacingIn:24,sun:"Full",water:"Regular",days:"90–120",depth:"½″",season:"Cool",heightIn:30,zones:[2,10],sow:"transplant",companions:["Onion", "Sage", "Dill", "Marigold"],avoid:["Strawberry"],color:"#68d391",icon:"brussels",tip:"Transplant — start indoors 4 months before first fall frost. FROST DRAMATICALLY IMPROVES FLAVOR. Harvest from bottom up as sprouts reach 1–2 inches. Snap off lower leaves as you go. Top the plant 3–4 weeks before final harvest to push energy into sprouts. Long Island Improved is classic." },
  { id:"kohlrabi",name:"Kohlrabi",cat:"Brassica",spacingIn:6,sun:"Full",water:"Regular",days:"45–60",depth:"¼″",season:"Cool",heightIn:12,zones:[3,11],sow:"both",companions:["Beet", "Onion", "Lettuce", "Marigold"],avoid:["Strawberry"],color:"#c6f6d5",icon:"turnip",tip:"Can transplant or direct sow. Harvest when tennis-ball sized (3 inches) — larger gets woody. The bulb grows above ground. Tastes like a mild, sweet broccoli stem. Excellent raw in slaws or roasted. Purple Vienna is beautiful and tasty. Very underrated vegetable." },
  // ── ROOT VEGETABLES ──
  { id:"carrot",name:"Carrot (Nantes)",cat:"Root",spacingIn:3,sun:"Full",water:"Moderate",days:"70–80",depth:"¼″",season:"Cool",heightIn:12,zones:[3,11],sow:"direct",companions:["Lettuce", "Onion", "Tomato", "Chive", "Leek", "Rosemary", "Sage", "Bean"],avoid:["Dill", "Parsnip"],color:"#ed8936",icon:"carrot",tip:"MUST direct sow — never transplant (causes forking). Loose, rock-free soil is critical for straight roots. Seeds are tiny and slow to germinate (14–21 days) — mark rows with radishes. Keep soil consistently moist until germination. Nantes = sweet, blunt-tipped, ideal for most gardens. SUCCESSION PLANT every 3 weeks." },
  { id:"danvers_carrot",name:"Carrot (Danvers)",cat:"Root",spacingIn:3,sun:"Full",water:"Moderate",days:"70–80",depth:"¼″",season:"Cool",heightIn:12,zones:[3,11],sow:"direct",companions:["Lettuce", "Onion", "Tomato", "Chive", "Leek"],avoid:["Dill", "Parsnip"],color:"#dd6b20",icon:"carrot",tip:"MUST direct sow. Danvers = sturdy, tapered shape that handles heavier/clay soil better than Nantes. Developed in Danvers, Massachusetts. Good storage carrot. Same slow germination — patience required." },
  { id:"baby_carrot",name:"Baby Carrot (Paris Market)",cat:"Root",spacingIn:2,sun:"Full",water:"Moderate",days:"50–65",depth:"¼″",season:"Cool",heightIn:8,zones:[3,11],sow:"direct",companions:["Lettuce", "Radish", "Onion", "Chive"],avoid:["Dill"],color:"#ed8936",icon:"carrot",tip:"MUST direct sow. Round/golf-ball shaped baby carrots — NOT just small regular carrots. Perfect for heavy clay soil and containers where long varieties fail. Quick maturing. Kids love the round shape." },
  { id:"beet",name:"Beet (Detroit Dark Red)",cat:"Root",spacingIn:4,sun:"Full",water:"Moderate",days:"50–70",depth:"½″",season:"Cool",heightIn:12,zones:[2,11],sow:"direct",companions:["Onion", "Lettuce", "Cabbage", "Garlic", "Marigold"],avoid:["Pole Bean"],color:"#9b2c2c",icon:"beet",tip:"Direct sow — each 'seed' is actually a cluster of 2–4 seeds, so thinning is essential. Soak seeds 24 hours before planting. Greens are edible and highly nutritious — harvest some leaves without pulling root. SUCCESSION PLANT every 3 weeks. Stains everything — wear gloves when handling." },
  { id:"golden_beet",name:"Golden Beet",cat:"Root",spacingIn:4,sun:"Full",water:"Moderate",days:"50–65",depth:"½″",season:"Cool",heightIn:12,zones:[2,11],sow:"direct",companions:["Onion", "Lettuce", "Garlic", "Marigold"],avoid:["Pole Bean"],color:"#ecc94b",icon:"beet",tip:"Direct sow. WON'T STAIN like red beets — no pink hands or cutting boards. Milder, sweeter flavor. Touchstone Gold is top variety. Same seed-cluster germination as red beets. Roast to bring out sweetness." },
  { id:"chioggia_beet",name:"Chioggia Beet",cat:"Root",spacingIn:4,sun:"Full",water:"Moderate",days:"50–65",depth:"½″",season:"Cool",heightIn:12,zones:[2,11],sow:"direct",companions:["Onion", "Lettuce", "Garlic"],avoid:["Pole Bean"],color:"#fc8181",icon:"beet",tip:"Direct sow. Italian heirloom with stunning candy-cane red and white striped interior. Stripes fade when cooked — eat raw in salads to preserve the beautiful pattern. Milder and sweeter than red beets." },
  { id:"radish",name:"Cherry Belle Radish",cat:"Root",spacingIn:2,sun:"Full",water:"Regular",days:"22–30",depth:"½″",season:"Cool",heightIn:6,zones:[2,11],sow:"direct",companions:["Carrot", "Lettuce", "Pea", "Bean", "Nasturtium"],avoid:[],color:"#fc8181",icon:"radish",tip:"MUST direct sow. Fastest vegetable — 22 days from seed to table! Perfect first crop for kids and new gardeners. SUCCESSION PLANT every 7–10 days for continuous harvest. Gets pithy and hot if left too long. Interplant with slow crops (carrots) as row markers. Spring and fall crop — bolts in summer heat." },
  { id:"daikon",name:"Daikon Radish",cat:"Root",spacingIn:6,sun:"Full",water:"Regular",days:"50–70",depth:"½″",season:"Cool",heightIn:18,zones:[2,11],sow:"direct",companions:["Lettuce", "Pea", "Carrot"],avoid:[],color:"#fefcbf",icon:"radish",tip:"MUST direct sow — large root doesn't transplant. Grows 12–18 inches long. Also called tillage radish — roots break through compacted soil. Plant in fall for best flavor. Essential for Asian cooking, kimchi, and pickling. Watermelon radish is a daikon relative with pink interior." },
  { id:"french_radish",name:"French Breakfast Radish",cat:"Root",spacingIn:2,sun:"Full",water:"Regular",days:"21–28",depth:"½″",season:"Cool",heightIn:6,zones:[2,11],sow:"direct",companions:["Carrot", "Lettuce", "Pea"],avoid:[],color:"#fc8181",icon:"radish",tip:"MUST direct sow. Elongated shape, red with white tip. Milder and crisper than Cherry Belle. Classic French variety — slice thin on buttered bread with sea salt. 21 days to harvest. SUCCESSION PLANT every 7–10 days." },
  { id:"watermelon_radish",name:"Watermelon Radish",cat:"Root",spacingIn:4,sun:"Full",water:"Regular",days:"50–65",depth:"½″",season:"Cool",heightIn:10,zones:[2,11],sow:"direct",companions:["Carrot", "Lettuce"],avoid:[],color:"#68d391",icon:"radish",tip:"MUST direct sow. Green outside, stunning hot pink interior — looks like a mini watermelon when sliced. Fall planting produces best color and flavor. Mild and slightly sweet. A daikon relative. Slice thin and display as gorgeous garnish." },
  { id:"turnip",name:"Turnip",cat:"Root",spacingIn:4,sun:"Full",water:"Regular",days:"45–65",depth:"½″",season:"Cool",heightIn:12,zones:[2,11],sow:"direct",companions:["Pea", "Onion", "Garlic", "Lettuce"],avoid:[],color:"#fefcbf",icon:"turnip",tip:"Direct sow. BOTH root and greens are edible — two crops in one. Young turnips (2–3 inches) are sweet and mild; larger get stronger. Hakurei (Japanese) variety is sweet enough to eat raw like an apple. SUCCESSION PLANT every 3 weeks spring and fall." },
  { id:"parsnip",name:"Parsnip",cat:"Root",spacingIn:4,sun:"Full",water:"Regular",days:"100–130",depth:"½″",season:"Cool",heightIn:18,zones:[2,11],sow:"direct",companions:["Pea", "Lettuce", "Radish", "Garlic", "Onion"],avoid:["Carrot"],color:"#fefcbf",icon:"carrot",tip:"MUST direct sow — use FRESH seed (viability drops dramatically after 1 year). Very slow germination (21–28 days). Long season crop — plant in spring, harvest in fall. FROST DRAMATICALLY SWEETENS flavor — leave some in ground and harvest in winter/early spring. Roast for incredible caramel sweetness." },
  { id:"rutabaga",name:"Rutabaga",cat:"Root",spacingIn:8,sun:"Full",water:"Regular",days:"80–100",depth:"½″",season:"Cool",heightIn:14,zones:[2,11],sow:"direct",companions:["Pea", "Onion", "Garlic"],avoid:[],color:"#d69e2e",icon:"turnip",tip:"Direct sow in late spring/early summer for fall harvest. Turnip × cabbage cross. Sweeter and denser than turnips. Excellent mashed or in stews. Stores for months in root cellar. Yellow flesh. American Purple Top is standard variety." },
  { id:"potato",name:"Russet Potato",cat:"Root",spacingIn:12,sun:"Full",water:"Regular",days:"80–120",depth:"4″",season:"Cool",heightIn:24,zones:[3,11],sow:"direct",companions:["Bean", "Corn", "Cabbage", "Marigold", "Horseradish"],avoid:["Tomato", "Squash", "Cucumber", "Sunflower"],color:"#d69e2e",icon:"potato",tip:"Plant seed potatoes (NOT grocery store potatoes — they're treated). Hill soil up stems as they grow — potatoes form along buried stem. Green skin = toxic solanine, always hill to prevent light exposure. Harvest new potatoes at flowering; full size 2 weeks after vines die. Cure 2 weeks before storage." },
  { id:"red_potato",name:"Red Potato",cat:"Root",spacingIn:12,sun:"Full",water:"Regular",days:"70–90",depth:"4″",season:"Cool",heightIn:24,zones:[3,11],sow:"direct",companions:["Bean", "Corn", "Cabbage", "Marigold"],avoid:["Tomato", "Squash"],color:"#e53e3e",icon:"potato",tip:"Plant seed potatoes. Waxy texture holds shape when cooked — perfect for roasting, salads, and boiling. Thinner skin doesn't need peeling. Red Norland is early (70 days). Same hilling technique as russets." },
  { id:"fingerling",name:"Fingerling Potato",cat:"Root",spacingIn:10,sun:"Full",water:"Regular",days:"80–100",depth:"4″",season:"Cool",heightIn:20,zones:[3,11],sow:"direct",companions:["Bean", "Marigold", "Cabbage"],avoid:["Tomato", "Squash"],color:"#d69e2e",icon:"potato",tip:"Plant seed potatoes. Small elongated gourmet variety — French Fingerling and Russian Banana are popular. Nutty, buttery flavor. Simply halve and roast with herbs. Higher value crop — fingerlings sell for 2–3x regular potatoes at markets." },
  { id:"sweet_potato",name:"Sweet Potato",cat:"Root",spacingIn:12,sun:"Full",water:"Moderate",days:"90–120",depth:"Slip",season:"Warm",heightIn:12,zones:[5,11],sow:"direct",companions:["Bean", "Thyme", "Marigold"],avoid:[],color:"#ed8936",icon:"sweet_potato",tip:"Plant slips (sprouts from a sweet potato), NOT seeds. Needs 4+ months of warm weather (soil above 65°F). Beauregard is most popular. Cure after harvest: 85°F and 85% humidity for 10 days to develop sweetness and heal skin for storage. Vines make excellent ground cover." },
  { id:"ginger",name:"Ginger",cat:"Root",spacingIn:8,sun:"Partial",water:"Regular",days:"240–300",depth:"1″",season:"Warm",heightIn:36,zones:[8,12],sow:"direct",companions:["Bean", "Lettuce"],avoid:[],color:"#d69e2e",icon:"potato",tip:"Plant pieces of fresh ginger root (from grocery store) with growth buds facing up. Tropical plant — grow in containers in zones below 8 and bring inside for winter. Takes 8–10 months! Harvest young ginger at 4 months for milder flavor. Rich, well-draining soil is essential." },
  { id:"turmeric",name:"Turmeric",cat:"Root",spacingIn:8,sun:"Partial",water:"Regular",days:"240–300",depth:"2″",season:"Warm",heightIn:36,zones:[8,12],sow:"direct",companions:["Ginger", "Bean"],avoid:[],color:"#ed8936",icon:"potato",tip:"Plant rhizome pieces like ginger. Brilliant orange root — STAINS EVERYTHING it touches, wear gloves. Tropical — container grow in cooler climates. Beautiful ornamental foliage. Fresh turmeric is dramatically more potent than dried powder. Harvest when leaves yellow." },
  { id:"horseradish",name:"Horseradish",cat:"Root",spacingIn:18,sun:"Full",water:"Regular",days:"140–160",depth:"2″",season:"Cool",heightIn:24,zones:[3,9],sow:"direct",companions:["Potato"],avoid:[],color:"#fefcbf",icon:"turnip",tip:"Plant root cuttings. WARNING: extremely aggressive spreader — ALWAYS use a container or isolated bed. Plant it and you'll have it forever. Harvest in fall, grate immediately (fumes are intense — do it outside). Mix with vinegar to stop the heat reaction. Perennial — harvest what you need, leave the rest." },
  { id:"sunchoke",name:"Sunchoke",cat:"Root",spacingIn:18,sun:"Full",water:"Moderate",days:"110–130",depth:"4″",season:"Cool",heightIn:96,zones:[3,9],sow:"direct",companions:["Corn", "Sunflower"],avoid:[],color:"#ecc94b",icon:"potato",tip:"Plant tubers. Also called Jerusalem artichoke. WARNING: EXTREMELY INVASIVE — any tiny tuber piece left in soil regrows. Use containers or dedicated area. Beautiful sunflower-like blooms. Nutty artichoke flavor. Causes gas in many people — start with small portions. Perennial." },
  // ── ALLIUMS ──
  { id:"yellow_onion",name:"Yellow Onion",cat:"Allium",spacingIn:4,sun:"Full",water:"Moderate",days:"90–120",depth:"1″",season:"Cool",heightIn:18,zones:[3,11],sow:"both",companions:["Carrot", "Lettuce", "Beet", "Tomato", "Pepper", "Strawberry", "Cabbage"],avoid:["Bean", "Pea", "Asparagus"],color:"#faf089",icon:"onion",tip:"Can transplant sets/seedlings or direct sow seed. CRITICAL: choose long-day (north of 35° latitude) or short-day (south) varieties — wrong type won't bulb. SUCCESSION PLANT sets every 2 weeks for green onion stage, or plant once for full bulb harvest. Stop watering when tops flop over. Cure 2–3 weeks in dry shade." },
  { id:"red_onion",name:"Red Onion",cat:"Allium",spacingIn:4,sun:"Full",water:"Moderate",days:"90–120",depth:"1″",season:"Cool",heightIn:18,zones:[3,11],sow:"both",companions:["Carrot", "Lettuce", "Tomato", "Beet", "Strawberry"],avoid:["Bean", "Pea"],color:"#9b2c2c",icon:"onion",tip:"Can transplant or direct sow. Milder and sweeter than yellow — best raw in salads, sandwiches, and salsas. Same long-day/short-day rule applies. Red Burgundy (short-day) and Mars (long-day) are reliable. Shorter storage life than yellow onions." },
  { id:"white_onion",name:"White Onion",cat:"Allium",spacingIn:4,sun:"Full",water:"Moderate",days:"90–120",depth:"1″",season:"Cool",heightIn:18,zones:[3,11],sow:"both",companions:["Carrot", "Lettuce", "Tomato", "Cabbage"],avoid:["Bean", "Pea"],color:"#fefcbf",icon:"onion",tip:"Can transplant or direct sow. Sharp, clean flavor. Essential for Mexican and Southwestern cuisine. Highest water content — doesn't store as long. Same day-length sensitivity as all onions." },
  { id:"green_onion",name:"Green Onion / Scallion",cat:"Allium",spacingIn:2,sun:"Full",water:"Moderate",days:"30–60",depth:"½″",season:"Cool",heightIn:12,zones:[3,11],sow:"direct",companions:["Carrot", "Lettuce", "Tomato", "Beet"],avoid:["Bean", "Pea"],color:"#48bb78",icon:"chives",tip:"Direct sow — easiest allium. SUCCESSION PLANT every 2–3 weeks year-round. Regrows from roots — cut above the base and they'll regrow 2–3 times. Can also regrow grocery store green onions in a glass of water. Evergreen Hardy White is a perennial variety." },
  { id:"garlic",name:"Hardneck Garlic",cat:"Allium",spacingIn:6,sun:"Full",water:"Moderate",days:"90–150",depth:"2″",season:"Cool",heightIn:24,zones:[3,8],sow:"direct",companions:["Tomato", "Pepper", "Lettuce", "Cabbage", "Potato", "Strawberry", "Beet"],avoid:["Bean", "Pea"],color:"#fefcbf",icon:"garlic",tip:"Plant individual cloves in FALL (Oct–Nov), pointy end up. Overwinters and harvests following July. Cut scapes (curly flower stalks) in spring — they're delicious sautéed and removing them directs energy to bulb. Harvest when bottom 3 leaves are brown. Cure 2 weeks hanging in dry shade. Stores 4–6 months." },
  { id:"softneck_garlic",name:"Softneck Garlic",cat:"Allium",spacingIn:6,sun:"Full",water:"Moderate",days:"90–150",depth:"2″",season:"Cool",heightIn:18,zones:[5,11],sow:"direct",companions:["Tomato", "Pepper", "Lettuce", "Cabbage"],avoid:["Bean", "Pea"],color:"#fefcbf",icon:"garlic",tip:"Plant cloves in fall. Better for mild winter areas (zones 5+). Stores LONGER than hardneck (6–9 months). Flexible stems can be braided for storage and decoration. Doesn't produce scapes. More cloves per bulb but smaller individual cloves. Silverskin variety stores longest." },
  { id:"elephant_garlic",name:"Elephant Garlic",cat:"Allium",spacingIn:8,sun:"Full",water:"Moderate",days:"90–150",depth:"3″",season:"Cool",heightIn:30,zones:[3,9],sow:"direct",companions:["Tomato", "Lettuce", "Cabbage"],avoid:["Bean", "Pea"],color:"#fefcbf",icon:"garlic",tip:"Plant cloves in fall. Actually a LEEK, not true garlic — very mild garlic flavor. Huge cloves easy to peel. Roast whole for a sweet, mellow spread. Less pungent raw. Beautiful tall flower stalks. Each bulb has only 4–6 giant cloves." },
  { id:"shallot",name:"Shallot",cat:"Allium",spacingIn:6,sun:"Full",water:"Moderate",days:"90–120",depth:"1″",season:"Cool",heightIn:14,zones:[3,10],sow:"direct",companions:["Carrot", "Beet", "Lettuce", "Tomato"],avoid:["Bean", "Pea"],color:"#d69e2e",icon:"onion",tip:"Plant sets in fall or early spring. Multiplies like garlic — plant one, harvest 5–8. Milder and more complex than onions. French cuisine staple for sauces and vinaigrettes. Stores very well. Ambition and Conservor are popular French varieties." },
  { id:"leek",name:"Leek",cat:"Allium",spacingIn:6,sun:"Full",water:"Regular",days:"80–120",depth:"½″",season:"Cool",heightIn:24,zones:[3,10],sow:"transplant",companions:["Carrot", "Celery", "Onion", "Lettuce"],avoid:["Bean", "Pea"],color:"#c6f6d5",icon:"leek",tip:"Transplant — start indoors 10–12 weeks before last frost. Blanch white stems by progressively hilling soil up the shaft as it grows (trench planting). Never let soil get into leaf joints. Leeks don't bulb — eat the entire white/light green shaft. Hardy enough to overwinter in many zones. King Richard is fast; Bandit is cold hardy." },
  // ── LEGUMES ──
  { id:"snap_pea",name:"Sugar Snap Pea",cat:"Legume",spacingIn:3,sun:"Full",water:"Moderate",days:"60–75",depth:"1″",season:"Cool",heightIn:60,zones:[3,11],sow:"direct",companions:["Carrot", "Radish", "Corn", "Turnip", "Bean"],avoid:["Onion", "Garlic"],color:"#68d391",icon:"pea",tip:"MUST direct sow — doesn't transplant well. Eat pod and all — no shelling needed. Sugar Ann (bush, 2ft) doesn't need trellis; Super Sugar Snap (vine, 5ft) does. Inoculate seeds with rhizobium bacteria for nitrogen fixation. Peas add nitrogen to soil — great rotation crop. Plant as soon as soil can be worked in spring." },
  { id:"snow_pea",name:"Snow Pea",cat:"Legume",spacingIn:3,sun:"Full",water:"Moderate",days:"55–65",depth:"1″",season:"Cool",heightIn:48,zones:[3,11],sow:"direct",companions:["Carrot", "Radish", "Corn", "Turnip"],avoid:["Onion", "Garlic"],color:"#48bb78",icon:"pea",tip:"MUST direct sow. Harvest when pods are flat before peas swell inside. Oregon Sugar Pod is bush type (no trellis). Essential for stir-fry. Same nitrogen-fixing benefit as all peas. Pick frequently to encourage continued production." },
  { id:"shell_pea",name:"Garden Pea (Shelling)",cat:"Legume",spacingIn:3,sun:"Full",water:"Moderate",days:"55–70",depth:"1″",season:"Cool",heightIn:36,zones:[3,11],sow:"direct",companions:["Carrot", "Corn", "Radish", "Turnip"],avoid:["Onion", "Garlic"],color:"#38a169",icon:"pea",tip:"MUST direct sow. Shell peas and discard pod. Pick when pods are plump and bright green — overripe peas are starchy. Eat IMMEDIATELY or freeze — sugars convert to starch within hours of picking (like corn). Little Marvel is compact bush variety." },
  { id:"bush_bean",name:"Green Bean (Bush)",cat:"Legume",spacingIn:4,sun:"Full",water:"Moderate",days:"50–60",depth:"1″",season:"Warm",heightIn:20,zones:[3,11],sow:"direct",companions:["Corn", "Squash", "Carrot", "Cucumber", "Eggplant", "Pea", "Potato", "Radish", "Strawberry", "Marigold"],avoid:["Onion", "Garlic", "Chive", "Leek"],color:"#38a169",icon:"bean",tip:"MUST direct sow after last frost — beans hate cold soil and transplanting. No support needed. SUCCESSION PLANT every 2–3 weeks for continuous harvest. Pick before you can see seed bumps through pod. Contender and Provider are reliable. Fixes nitrogen in soil." },
  { id:"pole_bean",name:"Pole Bean",cat:"Legume",spacingIn:6,sun:"Full",water:"Moderate",days:"55–65",depth:"1″",season:"Warm",heightIn:96,zones:[3,11],sow:"direct",companions:["Corn", "Squash", "Carrot", "Cucumber", "Radish", "Marigold"],avoid:["Onion", "Garlic", "Beet"],color:"#276749",icon:"bean",tip:"MUST direct sow. Needs 6–8 ft trellis, tepee, or pole. More productive than bush beans over the season but starts later. Kentucky Wonder is the classic. Blue Lake is excellent. Three Sisters planting: use corn stalks as living trellis with squash below." },
  { id:"lima_bean",name:"Lima Bean",cat:"Legume",spacingIn:6,sun:"Full",water:"Moderate",days:"65–80",depth:"1″",season:"Warm",heightIn:24,zones:[4,11],sow:"direct",companions:["Corn", "Squash", "Carrot", "Marigold"],avoid:["Onion", "Garlic"],color:"#9ae6b4",icon:"bean",tip:"MUST direct sow. Needs warm soil above 65°F to germinate — most common failure is planting too early. Also called butter beans. Fordhook 242 is bush type; King of the Garden is pole type. Shell when pods are plump and starting to dry." },
  { id:"edamame",name:"Edamame",cat:"Legume",spacingIn:6,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:24,zones:[3,9],sow:"direct",companions:["Corn", "Potato", "Squash"],avoid:["Onion", "Garlic"],color:"#48bb78",icon:"pea",tip:"MUST direct sow. Harvest when pods are plump and bright green — before they start yellowing. Boil or steam in salted water for 5 minutes. Midori Giant and Butterbeans are proven varieties. Needs longer season than regular beans — count backwards from first frost." },
  { id:"runner_bean",name:"Scarlet Runner Bean",cat:"Legume",spacingIn:8,sun:"Full",water:"Moderate",days:"60–70",depth:"1″",season:"Warm",heightIn:120,zones:[3,11],sow:"direct",companions:["Corn", "Squash", "Radish"],avoid:["Onion", "Garlic"],color:"#e53e3e",icon:"bean",tip:"MUST direct sow. Beautiful ornamental red flowers attract hummingbirds. Both young pods (eat like green beans) and mature dried beans are edible. Can grow 10+ feet. Perennial in zones 7+ (roots survive winter). Paint Lady has bicolor flowers." },
  // ── HERBS (selected key ones with enhanced tips) ──
  { id:"sweet_basil",name:"Sweet Basil",cat:"Herb",spacingIn:12,sun:"Full",water:"Regular",days:"50–75",depth:"¼″",season:"Warm",heightIn:24,zones:[4,11],sow:"both",companions:["Tomato", "Pepper", "Oregano", "Marigold"],avoid:["Sage", "Rue"],color:"#48bb78",icon:"basil",tip:"Can transplant or direct sow after frost. PINCH OFF FLOWER BUDS as they appear — flowering makes leaves bitter and signals plant to stop producing. Pinch above a leaf node to encourage bushy growth (don't just pick individual leaves). Harvest regularly — the more you cut, the more it grows. Genovese is the classic variety for pesto." },
  { id:"thai_basil",name:"Thai Basil",cat:"Herb",spacingIn:12,sun:"Full",water:"Regular",days:"55–75",depth:"¼″",season:"Warm",heightIn:18,zones:[4,11],sow:"both",companions:["Tomato", "Pepper", "Eggplant"],avoid:["Sage"],color:"#6b46c1",icon:"basil",tip:"Can transplant or direct sow. Anise/licorice flavor that holds up to heat (unlike sweet basil which turns bitter when cooked long). Essential for pho, Thai curries, and Vietnamese dishes. Purple stems and flowers are ornamental. More heat tolerant than sweet basil." },
  { id:"purple_basil",name:"Purple Basil",cat:"Herb",spacingIn:12,sun:"Full",water:"Regular",days:"50–75",depth:"¼″",season:"Warm",heightIn:20,zones:[4,11],sow:"both",companions:["Tomato"],avoid:["Sage"],color:"#6b46c1",icon:"basil",tip:"Can transplant or direct sow. Dark Opal and Purple Ruffles are popular varieties. Makes stunning purple pesto and infused vinegars. Slightly more clove-like flavor than green basil. Gorgeous ornamental in borders and containers." },
  { id:"lemon_basil",name:"Lemon Basil",cat:"Herb",spacingIn:10,sun:"Full",water:"Regular",days:"50–70",depth:"¼″",season:"Warm",heightIn:18,zones:[4,11],sow:"both",companions:["Tomato"],avoid:["Sage"],color:"#9ae6b4",icon:"basil",tip:"Can transplant or direct sow. Strong citrus aroma and flavor. Excellent with fish, chicken, and in Southeast Asian cooking. Mrs. Burns Lemon is most popular variety. Makes amazing lemon basil lemonade." },
  { id:"cilantro",name:"Cilantro / Coriander",cat:"Herb",spacingIn:6,sun:"Partial",water:"Moderate",days:"45–70",depth:"¼″",season:"Cool",heightIn:18,zones:[3,11],sow:"direct",companions:["Lettuce", "Tomato", "Bean", "Pea"],avoid:[],color:"#68d391",icon:"cilantro",tip:"Direct sow — bolts (goes to seed) VERY FAST in heat. SUCCESSION PLANT every 2 weeks from early spring. When it bolts, let it — seeds become coriander spice. Slow-bolt varieties: Caribe and Santo. Crush seeds slightly before planting for faster germination. Fall planting often most successful." },
  { id:"flat_parsley",name:"Flat-Leaf Parsley",cat:"Herb",spacingIn:8,sun:"Partial",water:"Regular",days:"70–90",depth:"¼″",season:"Cool",heightIn:18,zones:[3,11],sow:"both",companions:["Tomato", "Asparagus", "Corn", "Pepper"],avoid:[],color:"#2f855a",icon:"parsley",tip:"Can transplant or direct sow. More flavorful than curly. Soak seeds 24 hours — slow germination (14–21 days). Biennial — leaves first year, flowers and dies second year. Cut outer stems at base. Italian Giant has biggest leaves. Attracts swallowtail butterflies (host plant for caterpillars)." },
  { id:"curly_parsley",name:"Curly Parsley",cat:"Herb",spacingIn:8,sun:"Partial",water:"Regular",days:"70–90",depth:"¼″",season:"Cool",heightIn:14,zones:[3,11],sow:"both",companions:["Tomato", "Asparagus", "Corn"],avoid:[],color:"#38a169",icon:"parsley",tip:"Can transplant or direct sow. Classic garnish variety. Same slow germination as flat-leaf. Good for containers and borders. Doubles as ornamental. Forest Green is most popular variety." },
  { id:"spearmint",name:"Spearmint",cat:"Herb",spacingIn:18,sun:"Partial",water:"Regular",days:"60–90",depth:"¼″",season:"Cool",heightIn:24,zones:[3,11],sow:"transplant",companions:["Tomato","Cabbage"],avoid:[],color:"#38a169",icon:"mint",tip:"Transplant divisions. ALWAYS GROW IN CONTAINERS — mint is extremely invasive and will take over your entire garden if planted in ground. Spreads by underground runners. Sink a pot into the ground if you want it in a bed. Harvest frequently — cut stems above a leaf node." },
  { id:"peppermint",name:"Peppermint",cat:"Herb",spacingIn:18,sun:"Partial",water:"Regular",days:"60–90",depth:"¼″",season:"Cool",heightIn:24,zones:[3,11],sow:"transplant",companions:["Cabbage"],avoid:[],color:"#276749",icon:"mint",tip:"Transplant divisions. CONTAINER ONLY — even more aggressive than spearmint. Higher menthol content. Sterile hybrid — doesn't grow from seed, only divisions. Makes excellent tea. Deters mice and ants — place around entry points." },
  { id:"rosemary",name:"Rosemary",cat:"Herb",spacingIn:24,sun:"Full",water:"Low",days:"80–120",depth:"Surface",season:"Warm",heightIn:48,zones:[7,11],sow:"transplant",companions:["Bean","Carrot","Sage"],avoid:[],color:"#4a7c59",icon:"rosemary",tip:"Transplant — very difficult from seed (low germination, slow). Woody evergreen perennial in zones 7+. In colder zones, grow in a pot and bring indoors for winter. Drought tolerant once established — OVERWATERING IS THE #1 KILLER. Excellent near walkways where brushing releases fragrance. Tuscan Blue is upright; Prostratus trails." },
  { id:"thyme",name:"English Thyme",cat:"Herb",spacingIn:12,sun:"Full",water:"Low",days:"70–90",depth:"Surface",season:"Cool",heightIn:12,zones:[4,9],sow:"transplant",companions:["Cabbage","Strawberry"],avoid:[],color:"#7c9a6e",icon:"thyme",tip:"Transplant — tiny seeds are slow and unreliable. Creeping perennial ground cover. Excellent between stepping stones and along bed edges. Cut back by 1/3 in spring to prevent woodiness. Replace plants every 3–4 years. Drought tolerant." },
  { id:"lemon_thyme",name:"Lemon Thyme",cat:"Herb",spacingIn:12,sun:"Full",water:"Low",days:"70–90",depth:"Surface",season:"Cool",heightIn:10,zones:[4,9],sow:"transplant",companions:["Cabbage"],avoid:[],color:"#9ae6b4",icon:"thyme",tip:"Transplant. Citrus-scented thyme variety. Excellent with fish and poultry. Beautiful variegated leaves (green with gold edges). Same care as English thyme. Makes lovely tea." },
  { id:"oregano",name:"Greek Oregano",cat:"Herb",spacingIn:12,sun:"Full",water:"Low",days:"80–90",depth:"Surface",season:"Warm",heightIn:18,zones:[4,10],sow:"transplant",companions:["Pepper","Tomato"],avoid:[],color:"#5a8a4c",icon:"oregano",tip:"Transplant — ensure you're getting TRUE Greek oregano (Origanum vulgare hirtum), not ornamental oregano which has little flavor. Flavor is STRONGEST when dried. Cut just before flowering for peak oil content. Drought tolerant perennial." },
  { id:"dill",name:"Dill",cat:"Herb",spacingIn:12,sun:"Full",water:"Moderate",days:"40–60",depth:"¼″",season:"Cool",heightIn:36,zones:[3,11],sow:"direct",companions:["Lettuce", "Cucumber", "Onion", "Cabbage"],avoid:["Carrot", "Tomato"],color:"#9ae6b4",icon:"dill",tip:"MUST direct sow — taproot doesn't transplant. Bouquet variety is compact for leaves; Mammoth for seed heads (pickles). SUCCESSION PLANT every 3 weeks. Bolts fast in heat. Let some go to seed — attracts beneficial swallowtail butterflies and self-seeds for next year. Keep AWAY from carrots — cross-pollinates." },
  { id:"chives",name:"Chives",cat:"Herb",spacingIn:6,sun:"Full",water:"Moderate",days:"60–90",depth:"¼″",season:"Cool",heightIn:12,zones:[3,10],sow:"both",companions:["Carrot", "Tomato", "Lettuce", "Rose"],avoid:["Bean", "Pea"],color:"#9f7aea",icon:"chives",tip:"Can transplant or direct sow. Perennial — plant once, harvest for years. Purple globe flowers are edible and beautiful in salads. Cut back to 2 inches when they look ratty — regrows fresh. Divide clumps every 3–4 years. Deters aphids when planted near roses." },
  { id:"garlic_chives",name:"Garlic Chives",cat:"Herb",spacingIn:6,sun:"Full",water:"Moderate",days:"60–90",depth:"¼″",season:"Cool",heightIn:14,zones:[3,10],sow:"both",companions:["Carrot", "Tomato", "Rose"],avoid:["Bean", "Pea"],color:"#fefcbf",icon:"chives",tip:"Can transplant or direct sow. Flat leaves (not round like regular chives). White star-shaped flowers. Mild garlic flavor. Warning: self-seeds AGGRESSIVELY — deadhead flowers to prevent takeover. Also called Chinese chives. Essential in Asian dumplings and pancakes." },
  { id:"sage",name:"Garden Sage",cat:"Herb",spacingIn:24,sun:"Full",water:"Low",days:"75–100",depth:"¼″",season:"Cool",heightIn:24,zones:[4,10],sow:"transplant",companions:["Rosemary", "Cabbage", "Carrot", "Strawberry"],avoid:["Cucumber"],color:"#a0aec0",icon:"sage",tip:"Transplant. Woody evergreen perennial. Beautiful silvery-green velvety leaves. Prune hard in spring to prevent legginess. Don't cut into old wood — it may not regrow. Essential for poultry seasoning, stuffing, and brown butter sauce. Replace every 4–5 years as plants get woody." },
  { id:"lavender",name:"Lavender",cat:"Herb",spacingIn:18,sun:"Full",water:"Low",days:"90–200",depth:"Surface",season:"Warm",heightIn:24,zones:[5,9],sow:"transplant",companions:["Rosemary","Sage"],avoid:[],color:"#9f7aea",icon:"sage",tip:"Transplant. Edible flowers in baking, tea, and cocktails. Needs excellent drainage — raised beds or sandy soil. Munstead and Hidcote are hardiest (zone 5). Prune after flowering to 1/3 — never cut into bare wood. Deer resistant. Excellent pollinator plant. Harvest when 1/3 of flower spike is open." },
  { id:"lemongrass",name:"Lemongrass",cat:"Herb",spacingIn:24,sun:"Full",water:"Regular",days:"75–100",depth:"Surface",season:"Warm",heightIn:48,zones:[8,11],sow:"transplant",companions:["Tomato"],avoid:[],color:"#ecc94b",icon:"chives",tip:"Transplant — grow from grocery store stalks rooted in water. Tropical — container grow in zones below 8 and bring inside before frost. Harvest by cutting stalks at base when they're ½ inch thick. Use lower 3–4 inches for cooking. Citronella-scented — natural mosquito deterrent." },
  { id:"tarragon",name:"French Tarragon",cat:"Herb",spacingIn:18,sun:"Full",water:"Moderate",days:"60–90",depth:"Surface",season:"Warm",heightIn:24,zones:[4,9],sow:"transplant",companions:["Eggplant"],avoid:[],color:"#68d391",icon:"rosemary",tip:"MUST transplant — true French tarragon is sterile and CANNOT be grown from seed (if you see tarragon seeds, it's Russian tarragon which is flavorless). Buy plants only. Essential for béarnaise sauce, chicken, and French cooking. Anise flavor. Divide every 3 years." },
  { id:"fennel_h",name:"Herb Fennel",cat:"Herb",spacingIn:12,sun:"Full",water:"Regular",days:"60–90",depth:"¼″",season:"Cool",heightIn:48,zones:[4,10],sow:"direct",companions:["Sage", "Mint", "Nasturtium"],avoid:["Tomato", "Pepper", "Bean", "Brassica"],color:"#c6f6d5",icon:"dill",tip:"Direct sow. ALLELOPATHIC — releases chemicals that inhibit growth of nearby plants. Plant in isolated area or its own container. Fronds, seeds, and pollen all edible. Bronze fennel is ornamental variety. Attracts swallowtail butterflies. Different from bulb fennel (Florence)." },
  { id:"chamomile",name:"Chamomile",cat:"Herb",spacingIn:8,sun:"Full",water:"Moderate",days:"60–65",depth:"Surface",season:"Cool",heightIn:18,zones:[3,9],sow:"direct",companions:["Cabbage","Onion"],avoid:[],color:"#fefcbf",icon:"dill",tip:"Direct sow — tiny seeds need light to germinate (don't cover). German chamomile is annual; Roman is perennial ground cover. Harvest flowers when petals fold back from center. Dry for tea. 'Physician's plant' — planted near sick plants, it's said to help them recover." },
  { id:"stevia",name:"Stevia",cat:"Herb",spacingIn:12,sun:"Full",water:"Moderate",days:"40–60",depth:"Surface",season:"Warm",heightIn:18,zones:[8,11],sow:"transplant",companions:[],avoid:[],color:"#c6f6d5",icon:"basil",tip:"Transplant. Natural zero-calorie sweetener — 200–300x sweeter than sugar. Chew a fresh leaf to taste. Dry leaves and crumble into tea or powder in blender. Annual in most zones — bring container inside for winter. Harvest before flowering for sweetest leaves." },
  // ── SMALL FRUITS ──
  { id:"strawberry",name:"June-bearing Strawberry",cat:"Fruit",spacingIn:12,sun:"Full",water:"Regular",days:"60–90",depth:"Crown",season:"Cool",heightIn:8,zones:[3,10],sow:"transplant",companions:["Lettuce", "Spinach", "Thyme", "Onion", "Garlic", "Borage", "Bean", "Marigold"],avoid:["Cabbage", "Broccoli"],color:"#e53e3e",icon:"strawberry",tip:"Transplant crowns. One big concentrated harvest in June (4–6 weeks). REMOVE ALL RUNNERS for bigger berries, or let them root for more plants. Pinch off ALL flowers the first year — builds stronger root system for bigger harvests in year 2+. Mulch with straw to keep fruit clean. Replace bed every 3–4 years." },
  { id:"everbearing_strawberry",name:"Everbearing Strawberry",cat:"Fruit",spacingIn:12,sun:"Full",water:"Regular",days:"60–90",depth:"Crown",season:"Cool",heightIn:8,zones:[3,10],sow:"transplant",companions:["Lettuce", "Thyme", "Onion", "Borage", "Marigold"],avoid:["Cabbage"],color:"#fc8181",icon:"strawberry",tip:"Transplant crowns. Two main flushes — spring and fall — with scattered berries between. Smaller berries than June-bearing but longer season. Seascape and Albion are top varieties. Same first-year flower removal advice. Better for small gardens wanting extended harvest." },
  { id:"alpine_strawberry",name:"Alpine Strawberry",cat:"Fruit",spacingIn:8,sun:"Partial",water:"Regular",days:"60–90",depth:"Surface",season:"Cool",heightIn:8,zones:[3,10],sow:"both",companions:["Lettuce", "Thyme", "Borage"],avoid:[],color:"#fc8181",icon:"strawberry",tip:"Can start from seed (one of few strawberries that can). Tiny, intensely sweet and aromatic berries with wild strawberry flavor. NO RUNNERS — stays tidy. Perfect edging plant and ground cover. Produces all season. Yellow varieties exist (birds ignore them). Shade tolerant." },
  { id:"watermelon",name:"Watermelon",cat:"Fruit",spacingIn:60,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:18,zones:[4,11],sow:"both",companions:["Corn", "Radish", "Marigold", "Nasturtium"],avoid:["Potato"],color:"#48bb78",icon:"watermelon",tip:"Can transplant or direct sow (be gentle with roots). Needs LOTS of space and heat. Thump test: hollow sound = ripe. Also check the ground spot — turns from white to creamy yellow when ready. Sugar Baby is compact icebox type for small gardens. Black Diamond for classic large watermelon." },
  { id:"cantaloupe",name:"Cantaloupe",cat:"Fruit",spacingIn:36,sun:"Full",water:"Regular",days:"70–90",depth:"1″",season:"Warm",heightIn:18,zones:[4,11],sow:"both",companions:["Corn", "Radish", "Marigold"],avoid:["Potato"],color:"#ed8936",icon:"squash",tip:"Can transplant or direct sow. RIPE when stem 'slips' — separates easily from vine with gentle pressure. If you have to tug, it's not ready. Reduce watering in last 2 weeks for sweeter fruit. Hale's Best Jumbo is classic. Can be trellised with slings supporting fruit." },
  { id:"honeydew",name:"Honeydew Melon",cat:"Fruit",spacingIn:36,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:18,zones:[4,11],sow:"both",companions:["Corn", "Radish", "Marigold"],avoid:["Potato"],color:"#c6f6d5",icon:"squash",tip:"Can transplant or direct sow. Needs longer warm season than cantaloupe. Ripe when blossom end gives slightly when pressed and skin turns from green to creamy white. Does NOT slip from vine like cantaloupe — must be cut. Honey Orange variety has orange flesh." },
  { id:"ground_cherry",name:"Ground Cherry",cat:"Fruit",spacingIn:24,sun:"Full",water:"Moderate",days:"65–80",depth:"¼″",season:"Warm",heightIn:30,zones:[4,11],sow:"transplant",companions:["Basil", "Parsley", "Marigold"],avoid:[],color:"#ecc94b",icon:"tomato",tip:"Transplant — related to tomatillo. Sweet tropical-flavored berry wrapped in papery husk. Ripe when husk turns tan and fruit drops to ground — hence the name. Aunt Molly's is most popular variety. Makes excellent jam and pie filling. Self-seeds aggressively — you'll have volunteers for years." },
  // ── FRUIT TREES & BUSHES ──
  { id:"blueberry",name:"Blueberry Bush",cat:"Trees",spacingIn:48,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:72,zones:[3,8],sow:"transplant",companions:["Strawberry","Thyme"],avoid:[],color:"#4c51bf",icon:"blueberry",tip:"Transplant. REQUIRES acidic soil pH 4.5–5.5 — test and amend with sulfur or peat moss. Plant 2+ varieties for cross-pollination and larger berries. Mulch with pine needles (adds acidity). Net against birds when fruit colors. Prune oldest canes in winter. Blueray and Patriot for cold zones; Rabbiteye types for South." },
  { id:"raspberry",name:"Red Raspberry",cat:"Trees",spacingIn:24,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:60,zones:[3,9],sow:"transplant",companions:["Garlic"],avoid:["Potato"],color:"#d53f8c",icon:"raspberry",tip:"Transplant canes. Summer-bearing (one big crop) vs. everbearing (two crops — summer + fall). Trellis canes between wires. Prune summer-bearing: remove canes that fruited after harvest. Everbearing: can mow to ground in winter for one large fall crop. Spreads by runners — contain with barriers." },
  { id:"golden_raspberry",name:"Golden Raspberry",cat:"Trees",spacingIn:24,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:60,zones:[3,9],sow:"transplant",companions:["Garlic"],avoid:["Potato"],color:"#ecc94b",icon:"raspberry",tip:"Transplant canes. Sweeter and milder than red — less seedy. Anne and Fall Gold are popular. Same pruning as red everbearing types. Birds tend to ignore gold berries (they look for red). Premium fruit that sells for 2x red at markets." },
  { id:"blackberry",name:"Blackberry",cat:"Trees",spacingIn:36,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:72,zones:[5,10],sow:"transplant",companions:["Tansy"],avoid:["Raspberry"],color:"#2d3748",icon:"blueberry",tip:"Transplant. Thornless varieties (Triple Crown, Chester) save your hands and arms. Ripe when berries pull off easily and are dull (not shiny). Trellis on wires. Primocanes (first year) produce foliage; floricanes (second year) produce fruit. Prune spent floricanes after harvest." },
  { id:"gooseberry",name:"Gooseberry",cat:"Trees",spacingIn:48,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:48,zones:[3,8],sow:"transplant",companions:["Tansy"],avoid:[],color:"#68d391",icon:"blueberry",tip:"Transplant. Tart berries excellent for jam, pie, and fool (classic British dessert). One of few fruits that tolerates shade. Thorny — harvest with gloves and long sleeves. Pixwell is nearly thornless. Check local regulations — some areas restrict gooseberries as white pine blister rust host." },
  { id:"red_currant",name:"Red Currant",cat:"Trees",spacingIn:48,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:48,zones:[3,8],sow:"transplant",companions:["Garlic"],avoid:[],color:"#e53e3e",icon:"raspberry",tip:"Transplant. Beautiful translucent red clusters. High in pectin — makes gorgeous jewel-like jelly and bar-le-duc preserves. One of the easiest berry bushes. Shade tolerant. Prune oldest branches annually. Same restrictions as gooseberry in some areas." },
  { id:"black_currant",name:"Black Currant",cat:"Trees",spacingIn:48,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:60,zones:[3,8],sow:"transplant",companions:["Garlic"],avoid:[],color:"#2d3748",icon:"blueberry",tip:"Transplant. Extremely high vitamin C — 4x oranges. Deep, complex flavor. Makes incredible jam, syrup (cassis), and juice. Ben Sarek is compact. Consort is resistant to white pine blister rust. Rich in omega-6 fatty acids." },
  { id:"elderberry",name:"Elderberry",cat:"Trees",spacingIn:72,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,zones:[3,9],sow:"transplant",companions:[],avoid:[],color:"#2d3748",icon:"blueberry",tip:"Transplant. Berries MUST be cooked — raw berries, leaves, and stems contain cyanide compounds. Elderberry syrup is popular immune support remedy. Flowers make elderflower cordial and fritters. Plant 2+ varieties for pollination. Adams and York are reliable. Fast growing — 6+ feet first year." },
  { id:"honeyberry",name:"Honeyberry",cat:"Trees",spacingIn:48,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:60,zones:[2,7],sow:"transplant",companions:[],avoid:[],color:"#4c51bf",icon:"blueberry",tip:"Transplant. Earliest berry to ripen — weeks before strawberries. Extremely cold hardy (zone 2!). Blueberry-like flavor. Also called haskap. Need 2 different varieties for pollination. Tundra and Borealis are top picks. Still relatively unknown — great market opportunity." },
  { id:"fig",name:"Fig Tree",cat:"Trees",spacingIn:120,sun:"Full",water:"Moderate",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:180,zones:[7,11],sow:"transplant",companions:["Strawberry"],avoid:[],color:"#6b46c1",icon:"blueberry",tip:"Transplant. Chicago Hardy survives to zone 5 with winter protection (wrap in burlap and mulch heavily). Brown Turkey and Celeste for warmer zones. Container growing works well in cold climates — bring inside to dormant garage for winter. Two crops possible: breba (spring on old wood) and main (fall on new wood)." },
  { id:"dwarf_apple",name:"Dwarf Apple",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,zones:[3,8],sow:"transplant",companions:["Chives","Garlic"],avoid:["Walnut"],color:"#e53e3e",icon:"blueberry",tip:"Transplant grafted tree. Most apples need a DIFFERENT variety nearby for cross-pollination (not the same type). Honeycrisp, Gala, and Fuji are popular. Thin fruit to 6 inches apart for larger apples. Spray dormant oil in winter for pest control. Prune annually for open canopy shape." },
  { id:"dwarf_pear",name:"Dwarf Pear",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,zones:[4,8],sow:"transplant",companions:["Garlic"],avoid:["Walnut"],color:"#68d391",icon:"blueberry",tip:"Transplant grafted tree. Harvest BEFORE fully ripe — pears ripen from inside out and are mealy if tree-ripened. Pick when stem separates with a gentle lift. Ripen at room temp. Bartlett, Anjou, and Bosc are most popular. Fire blight is main disease — prune affected branches immediately." },
  { id:"dwarf_peach",name:"Dwarf Peach",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:120,zones:[5,9],sow:"transplant",companions:["Garlic"],avoid:["Walnut"],color:"#ed8936",icon:"blueberry",tip:"Transplant grafted tree. Self-pollinating — only need one tree. Full sun is CRITICAL — more sun = sweeter fruit. Thin fruit to 6–8 inches apart. Redhaven and Elberta are classics. Peach leaf curl is common — apply copper fungicide at leaf drop and bud swell." },
  { id:"dwarf_cherry",name:"Dwarf Cherry",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,zones:[4,8],sow:"transplant",companions:["Garlic"],avoid:["Walnut"],color:"#c53030",icon:"blueberry",tip:"Transplant grafted tree. Sweet cherries (Stella is self-fertile) vs tart/sour (Montmorency — self-fertile, zone 4, best for pies). Net against birds — they'll strip a tree in hours. Cherries don't ripen after picking. North Star is ultra-dwarf at 8 feet." },
  { id:"dwarf_plum",name:"Dwarf Plum",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,zones:[4,9],sow:"transplant",companions:["Garlic"],avoid:["Walnut"],color:"#6b46c1",icon:"blueberry",tip:"Transplant grafted tree. European plums (Stanley — self-fertile, prune type) vs Japanese (Santa Rosa — often self-fertile, eating fresh). European better for cold zones; Japanese for mild winters. Italian prune plum is classic for drying into prunes." },
  { id:"dwarf_citrus",name:"Dwarf Citrus (Meyer Lemon)",cat:"Trees",spacingIn:72,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:96,zones:[9,11],sow:"transplant",companions:[],avoid:[],color:"#ecc94b",icon:"blueberry",tip:"Transplant. Meyer lemon is a lemon-mandarin hybrid — sweeter and less acidic than store lemons. Container grow in zones below 9 — bring inside when temps drop below 50°F. Improved Dwarf Meyer is most popular. Fragrant flowers. Fruits year-round indoors with enough light." },
  { id:"dwarf_lime",name:"Dwarf Key Lime",cat:"Trees",spacingIn:72,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:72,zones:[9,11],sow:"transplant",companions:[],avoid:[],color:"#48bb78",icon:"blueberry",tip:"Transplant. True Key limes are smaller, seedier, and more aromatic than Persian limes. Essential for Key lime pie. Very compact — excellent container tree. Thorny. Bring inside below 50°F. Bears fruit year-round in ideal conditions." },
  { id:"grape",name:"Grape Vine",cat:"Trees",spacingIn:72,sun:"Full",water:"Moderate",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:120,zones:[4,10],sow:"transplant",companions:["Basil","Bean"],avoid:[],color:"#6b46c1",icon:"raspberry",tip:"Transplant. Needs strong trellis or arbor. Concord for juice/jelly (cold hardy); Thompson for raisins/eating; Muscadine for South. HEAVY annual pruning is essential — grape production is on new growth from last year's canes. Don't fertilize much — vines are vigorous." },
  { id:"kiwi",name:"Hardy Kiwi",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:180,zones:[4,8],sow:"transplant",companions:[],avoid:[],color:"#48bb78",icon:"blueberry",tip:"Transplant. Need both male AND female plant (1 male per 8 females). Smooth-skinned mini kiwis eaten whole — no peeling. Issai is rare self-fertile variety. Very vigorous vine — needs strong trellis. Takes 3–5 years to fruit. Anna is best female variety." },
  { id:"pomegranate",name:"Pomegranate",cat:"Trees",spacingIn:120,sun:"Full",water:"Moderate",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:120,zones:[7,10],sow:"transplant",companions:[],avoid:[],color:"#e53e3e",icon:"blueberry",tip:"Transplant. Wonderful variety is most popular. Drought tolerant once established. Self-pollinating. Fruit splits if watered inconsistently — keep even moisture. Harvest when skin deepens to dark red and makes metallic sound when tapped. Russian varieties (Salavatski) survive zone 6 with protection." },
  { id:"mulberry",name:"Dwarf Mulberry",cat:"Trees",spacingIn:120,sun:"Full",water:"Moderate",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:120,zones:[5,10],sow:"transplant",companions:[],avoid:[],color:"#2d3748",icon:"blueberry",tip:"Transplant. Extremely productive — one tree can produce 20+ lbs. WARNING: stains everything (hands, concrete, cars, clothes). Plant away from driveways and patios. Illinois Everbearing produces for 2+ months. Berries look like elongated blackberries. Sweet when fully black." },
  { id:"pawpaw",name:"Pawpaw",cat:"Trees",spacingIn:120,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:180,zones:[5,9],sow:"transplant",companions:[],avoid:[],color:"#68d391",icon:"blueberry",tip:"Transplant. North America's largest native fruit — tropical mango-banana-custard flavor. Shade tolerant when young (understory tree). Need 2 different seedling trees for cross-pollination. Fruit doesn't ship well (2–3 day shelf life) — this is why you never see them in stores. The ultimate homestead fruit." },
  // ── MISC/OTHER EDIBLES ──
  { id:"asparagus",name:"Asparagus",cat:"Other",spacingIn:18,sun:"Full",water:"Regular",days:"Perennial",depth:"6″",season:"Cool",heightIn:60,zones:[3,10],sow:"transplant",companions:["Tomato", "Parsley", "Basil", "Marigold"],avoid:["Onion", "Garlic", "Potato"],color:"#48bb78",icon:"chives",tip:"Transplant crowns. PATIENCE REQUIRED: do NOT harvest for the first 2 years — let ferns grow to build root energy. Starting year 3, harvest spears for 2 weeks; year 4+, harvest for 6–8 weeks. A well-maintained bed produces for 20+ years. Jersey Knight is all-male (more productive). Snap spears at soil level when 6–8 inches tall." },
  { id:"rhubarb",name:"Rhubarb",cat:"Other",spacingIn:36,sun:"Full",water:"Regular",days:"Perennial",depth:"Crown",season:"Cool",heightIn:36,zones:[3,8],sow:"transplant",companions:["Strawberry", "Garlic", "Onion"],avoid:[],color:"#e53e3e",icon:"chard",tip:"Transplant divisions. ONLY STALKS ARE EDIBLE — LEAVES ARE TOXIC (high oxalic acid). Don't harvest first year. Pull (don't cut) stalks when they're 12+ inches and the leaf has fully opened. Strawberry-rhubarb pie is the classic pairing. Victoria and Canada Red are popular varieties. Forces well in dark conditions for early spring harvest." },
  { id:"artichoke",name:"Globe Artichoke",cat:"Other",spacingIn:48,sun:"Full",water:"Regular",days:"Perennial",depth:"6″",season:"Cool",heightIn:60,zones:[7,11],sow:"transplant",companions:["Pea", "Tarragon", "Sunflower"],avoid:[],color:"#a0aec0",icon:"brussels",tip:"Transplant. Dramatic 4–5 ft silver-green architectural plant. In zones 7+, perennial; elsewhere treat as annual (Imperial Star variety produces first year). Harvest when buds are tight and firm — once scales open, it's past prime. Can also grow from root divisions. Earthy, nutty heart is the prize." },
  { id:"celery",name:"Celery",cat:"Other",spacingIn:8,sun:"Full",water:"Frequent",days:"80–120",depth:"Surface",season:"Cool",heightIn:18,zones:[3,10],sow:"transplant",companions:["Tomato", "Bean", "Onion", "Cabbage", "Leek"],avoid:[],color:"#c6f6d5",icon:"leek",tip:"Transplant — start indoors 10–12 weeks before last frost (tiny seeds, very slow). One of the hardest vegetables to grow well. Needs constant moisture, rich soil, and cool temps (60–70°F). Blanch stalks by wrapping with newspaper or hilling soil for milder flavor. Tango is a self-blanching variety." },
  { id:"celeriac",name:"Celeriac",cat:"Other",spacingIn:8,sun:"Full",water:"Regular",days:"100–120",depth:"Surface",season:"Cool",heightIn:14,zones:[3,10],sow:"transplant",companions:["Leek","Tomato"],avoid:[],color:"#d69e2e",icon:"turnip",tip:"Transplant — same long start as celery. Celery-flavored knobby root. Ugly but delicious. Excellent mashed, in soups, or raw in remoulade (classic French dish). Much easier to grow than celery stalks. Stores for months in root cellar. Brilliant variety is most popular." },
  { id:"fennel_bulb",name:"Florence Fennel (Bulb)",cat:"Other",spacingIn:10,sun:"Full",water:"Regular",days:"60–90",depth:"¼″",season:"Cool",heightIn:24,zones:[4,10],sow:"direct",companions:[],avoid:["Most plants"],color:"#c6f6d5",icon:"leek",tip:"Direct sow — bolts if transplanted. KEEP ISOLATED from other plants (allelopathic). Sweet anise-flavored bulb. Hill soil around bulb as it swells for blanching. Harvest when bulb is 3+ inches. Orion is bolt-resistant. Excellent raw in salads, roasted, or braised. Fronds are edible too." },
  { id:"sunflower",name:"Sunflower (Edible)",cat:"Other",spacingIn:24,sun:"Full",water:"Moderate",days:"70–100",depth:"1″",season:"Warm",heightIn:96,zones:[3,11],sow:"direct",companions:["Corn", "Squash", "Cucumber", "Bean"],avoid:["Potato"],color:"#ecc94b",icon:"dill",tip:"MUST direct sow. Mammoth Russian grows 10+ feet. Harvest seeds when back of head turns brown and seeds are plump. Cut head and hang upside down in paper bag to dry. Roast at 300°F for 30 min. Sunflower sprouts/microgreens are also edible and nutritious." },
  { id:"microgreens",name:"Microgreens Tray",cat:"Other",spacingIn:12,sun:"Partial",water:"Regular",days:"7–14",depth:"Surface",season:"Any",heightIn:3,zones:[1,13],sow:"direct",companions:[],avoid:[],color:"#48bb78",icon:"arugula",tip:"Direct sow densely on soil or mat. Harvest at 1–2 inches with scissors (7–14 days). Up to 40x more nutrients than mature plants. Sunflower, pea, and radish microgreens are best for beginners. No garden needed — grow on a windowsill year-round. Great income crop — sells for $25–50/lb at farmers markets." },
  // ── COMPANION / SUPPORT PLANTS ──
  { id:"marigold",name:"Marigold (French)",cat:"Companion",spacingIn:10,sun:"Full",water:"Moderate",days:"50–65",depth:"¼″",season:"Warm",heightIn:12,zones:[2,11],sow:"both",companions:["Tomato","Pepper","Eggplant","Bean","Squash","Cucumber"],avoid:[],color:"#ed8936",icon:"dill",tip:"THE #1 companion plant. French marigolds release thiopene from roots that repels nematodes, whiteflies, and aphids. Plant as a border around vegetable beds. Signet marigolds (Gem series) have edible citrusy petals for salads. Deadhead for continuous blooms. Let some go to seed — they self-sow reliably." },
  { id:"marigold_african",name:"Marigold (African/Tall)",cat:"Companion",spacingIn:18,sun:"Full",water:"Moderate",days:"60–75",depth:"¼″",season:"Warm",heightIn:30,zones:[2,11],sow:"both",companions:["Tomato","Squash","Cucumber"],avoid:[],color:"#dd6b20",icon:"dill",tip:"Larger pom-pom flowers on tall stems (2–3 feet). Same pest-repelling benefits as French marigolds but bigger visual impact. Crackerjack mix is classic. Excellent for cut flowers. Roots release a chemical that kills root-knot nematodes — plant where you had nematode problems." },
  { id:"nasturtium",name:"Nasturtium",cat:"Companion",spacingIn:12,sun:"Full",water:"Moderate",days:"35–50",depth:"½″",season:"Warm",heightIn:12,zones:[2,11],sow:"direct",companions:["Tomato","Cucumber","Squash","Bean","Cabbage"],avoid:[],color:"#ed8936",icon:"squash",tip:"TRAP CROP — attracts aphids and flea beetles AWAY from your vegetables. Plant near brassicas and cucurbits. Entire plant is edible — peppery flowers, leaves, and pickled seed pods (poor man's capers). Trailing types make great ground cover. Alaska series has variegated leaves. Direct sow after frost — doesn't transplant well." },
  { id:"borage",name:"Borage",cat:"Companion",spacingIn:18,sun:"Full",water:"Moderate",days:"50–60",depth:"½″",season:"Cool",heightIn:24,zones:[2,11],sow:"direct",companions:["Tomato","Strawberry","Squash"],avoid:[],color:"#4c51bf",icon:"dill",tip:"Top pollinator attractor with star-shaped blue flowers that bees absolutely love. Companion to tomatoes and strawberries — may improve their flavor. Edible flowers taste like cucumber — freeze in ice cubes for drinks. Self-seeds prolifically. Leaves are hairy and coarse. One of the best plants for attracting beneficial insects to your garden." },
  { id:"tansy",name:"Tansy",cat:"Companion",spacingIn:18,sun:"Full",water:"Low",days:"Perennial",depth:"Surface",season:"Cool",heightIn:36,zones:[3,9],sow:"both",companions:["Raspberry","Blackberry","Grape","Fruit Trees"],avoid:[],color:"#ecc94b",icon:"dill",tip:"Powerful insect repellent — deters Japanese beetles, squash bugs, ants, and flies. Plant near fruit trees, berries, and squash. WARNING: spreads aggressively by roots — contain it. Toxic if consumed in large quantities (do not eat). Yellow button flowers dry well. Cut back hard to prevent seeding." },
  { id:"yarrow",name:"Yarrow",cat:"Companion",spacingIn:18,sun:"Full",water:"Low",days:"Perennial",depth:"Surface",season:"Cool",heightIn:30,zones:[3,10],sow:"both",companions:["Most vegetables"],avoid:[],color:"#fefcbf",icon:"dill",tip:"Beneficial insect magnet — attracts ladybugs, lacewings, hoverflies, and parasitic wasps that eat garden pests. Drought tolerant perennial. Accumulates potassium, calcium, and magnesium — adds nutrients to compost. Plant at garden edges. Achillea millefolium is the species you want." },
  { id:"sweet_alyssum",name:"Sweet Alyssum",cat:"Companion",spacingIn:8,sun:"Full",water:"Moderate",days:"40–55",depth:"Surface",season:"Cool",heightIn:6,zones:[2,11],sow:"direct",companions:["Brassica","Lettuce","Potato"],avoid:[],color:"#fefcbf",icon:"lettuce",tip:"Low-growing ground cover that attracts hoverflies and parasitic wasps — natural aphid control. Plant as a living mulch under and between vegetable plants. Tiny fragrant white or purple flowers bloom non-stop. Self-seeds readily. One of the best ground-level beneficial insect habitats." },
  { id:"bee_balm",name:"Bee Balm",cat:"Companion",spacingIn:18,sun:"Full",water:"Regular",days:"Perennial",depth:"Surface",season:"Warm",heightIn:36,zones:[3,9],sow:"transplant",companions:["Tomato","Pepper","Squash"],avoid:[],color:"#e53e3e",icon:"dill",tip:"Irresistible to bees, butterflies, and hummingbirds. Dramatically improves pollination of nearby vegetables. Monarda didyma — also makes excellent tea (Oswego tea). Plant near squash and cucumbers that need pollinators. Powdery mildew resistant varieties: Jacob Cline, Raspberry Wine." },
  { id:"comfrey",name:"Comfrey",cat:"Companion",spacingIn:36,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root cutting",season:"Cool",heightIn:48,zones:[3,9],sow:"transplant",companions:["Fruit Trees","Berry Bushes"],avoid:[],color:"#48bb78",icon:"kale",tip:"The ultimate garden support plant. Deep taproot mines minerals from subsoil. Cut leaves 3–4 times per season and use as: mulch (nutrient-rich), compost activator, or liquid fertilizer (soak leaves in water 4–6 weeks). Bocking 14 variety is sterile (won't spread). Plant under fruit trees. Do not eat — for garden use only." },
  { id:"clover_crimson",name:"Crimson Clover",cat:"Companion",spacingIn:4,sun:"Full",water:"Moderate",days:"60–70",depth:"¼″",season:"Cool",heightIn:18,zones:[3,11],sow:"direct",companions:["All vegetables"],avoid:[],color:"#e53e3e",icon:"arugula",tip:"Nitrogen-fixing cover crop — takes nitrogen from air and stores it in root nodules for your next crop. Sow in fall after clearing summer beds. Beautiful crimson flower spikes in spring attract pollinators. Cut and turn into soil 2–3 weeks before spring planting. Also prevents erosion and suppresses weeds over winter." },
  { id:"white_clover",name:"White Clover (Living Mulch)",cat:"Companion",spacingIn:4,sun:"Full",water:"Moderate",days:"Perennial",depth:"Surface",season:"Cool",heightIn:6,zones:[3,10],sow:"direct",companions:["Fruit Trees","Brassica","Corn"],avoid:[],color:"#fefcbf",icon:"arugula",tip:"Low-growing nitrogen-fixing living mulch. Sow between garden rows or under fruit trees. Fixes 100+ lbs nitrogen per acre. Suppresses weeds, prevents erosion, stays green, and feeds the soil. Dutch white clover stays shortest. Mow occasionally if it gets too tall. Attracts beneficial insects." },
  { id:"daylily_edible",name:"Daylily (Edible)",cat:"Companion",spacingIn:18,sun:"Full",water:"Moderate",days:"Perennial",depth:"Crown",season:"Warm",heightIn:24,zones:[3,10],sow:"transplant",companions:["Most vegetables"],avoid:[],color:"#ed8936",icon:"dill",tip:"Every part is edible — flower buds (taste like green beans), open flowers (sweet, stuff with cheese), and tubers (nutty, like water chestnuts). Hemerocallis fulva (common orange daylily) is the edible species — NOT Asiatic lilies which are toxic. Plant as garden borders. Tough and drought tolerant once established." },
  { id:"lemon_balm",name:"Lemon Balm",cat:"Companion",spacingIn:18,sun:"Partial",water:"Regular",days:"60–70",depth:"Surface",season:"Cool",heightIn:24,zones:[3,9],sow:"both",companions:["Tomato","Squash","Brassica"],avoid:[],color:"#9ae6b4",icon:"mint",tip:"Attracts pollinators while repelling mosquitoes and squash bugs. Makes wonderful calming tea. Lemon scent when leaves are crushed. Mint family — WILL SPREAD aggressively, contain in pot or dedicated area. Harvest frequently to prevent flowering and self-seeding. Rub leaves on skin as natural mosquito repellent." },
];
/* ═══════════════════════════════════════════════════════════════
   BED PRESETS + custom + trellis
   ═══════════════════════════════════════════════════════════════ */
const BED_PRESETS = [
  { id:"rw_4x4",name:"4×4 Wood",cat:"Raised Wood",wIn:48,hIn:48,shape:"rect",matColor:"#a0714f",matBorder:"#7c5635" },
  { id:"rw_4x8",name:"4×8 Wood",cat:"Raised Wood",wIn:48,hIn:96,shape:"rect",matColor:"#a0714f",matBorder:"#7c5635" },
  { id:"rw_2x8",name:"2×8 Wood",cat:"Raised Wood",wIn:24,hIn:96,shape:"rect",matColor:"#a0714f",matBorder:"#7c5635" },
  { id:"rw_3x6",name:"3×6 Wood",cat:"Raised Wood",wIn:36,hIn:72,shape:"rect",matColor:"#a0714f",matBorder:"#7c5635" },
  { id:"rw_custom",name:"Custom Wood",cat:"Raised Wood",wIn:48,hIn:48,shape:"rect",matColor:"#a0714f",matBorder:"#7c5635",custom:true },
  { id:"rm_4x4",name:"4×4 Metal",cat:"Raised Metal",wIn:48,hIn:48,shape:"rect",matColor:"#a0aec0",matBorder:"#718096" },
  { id:"rm_4x8",name:"4×8 Metal",cat:"Raised Metal",wIn:48,hIn:96,shape:"rect",matColor:"#a0aec0",matBorder:"#718096" },
  { id:"rm_r3",name:"3ft Round",cat:"Raised Metal",wIn:36,hIn:36,shape:"circle",matColor:"#a0aec0",matBorder:"#718096" },
  { id:"rm_r4",name:"4ft Round",cat:"Raised Metal",wIn:48,hIn:48,shape:"circle",matColor:"#a0aec0",matBorder:"#718096" },
  { id:"rm_r6",name:"6ft Round",cat:"Raised Metal",wIn:72,hIn:72,shape:"circle",matColor:"#a0aec0",matBorder:"#718096" },
  { id:"rm_cust",name:"Custom Metal",cat:"Raised Metal",wIn:48,hIn:48,shape:"rect",matColor:"#a0aec0",matBorder:"#718096",custom:true },
  { id:"rm_cust_r",name:"Custom Round",cat:"Raised Metal",wIn:48,hIn:48,shape:"circle",matColor:"#a0aec0",matBorder:"#718096",custom:true },
  { id:"pot_5",name:"5-Gal Pot",cat:"Container",wIn:12,hIn:12,shape:"circle",matColor:"#8b6914",matBorder:"#6b4f10" },
  { id:"pot_10",name:"10-Gal Pot",cat:"Container",wIn:15,hIn:15,shape:"circle",matColor:"#8b6914",matBorder:"#6b4f10" },
  { id:"pot_15",name:"15-Gal Pot",cat:"Container",wIn:18,hIn:18,shape:"circle",matColor:"#8b6914",matBorder:"#6b4f10" },
  { id:"pot_20",name:"20-Gal Pot",cat:"Container",wIn:20,hIn:20,shape:"circle",matColor:"#8b6914",matBorder:"#6b4f10" },
  { id:"pot_cust",name:"Custom Pot",cat:"Container",wIn:14,hIn:14,shape:"circle",matColor:"#8b6914",matBorder:"#6b4f10",custom:true },
  { id:"gb_3",name:"3-Gal Bag",cat:"Grow Bag",wIn:10,hIn:10,shape:"circle",matColor:"#4a5568",matBorder:"#2d3748" },
  { id:"gb_5",name:"5-Gal Bag",cat:"Grow Bag",wIn:12,hIn:12,shape:"circle",matColor:"#4a5568",matBorder:"#2d3748" },
  { id:"gb_7",name:"7-Gal Bag",cat:"Grow Bag",wIn:14,hIn:14,shape:"circle",matColor:"#4a5568",matBorder:"#2d3748" },
  { id:"gb_10",name:"10-Gal Bag",cat:"Grow Bag",wIn:16,hIn:16,shape:"circle",matColor:"#4a5568",matBorder:"#2d3748" },
  { id:"gb_cust",name:"Custom Bag",cat:"Grow Bag",wIn:14,hIn:14,shape:"circle",matColor:"#4a5568",matBorder:"#2d3748",custom:true },
  { id:"ig_4x10",name:"4×10 Row",cat:"In-Ground",wIn:48,hIn:120,shape:"rect",matColor:"#7a5c1f",matBorder:"#5a4215" },
  { id:"ig_4x20",name:"4×20 Row",cat:"In-Ground",wIn:48,hIn:240,shape:"rect",matColor:"#7a5c1f",matBorder:"#5a4215" },
  { id:"ig_3x12",name:"3×12 Row",cat:"In-Ground",wIn:36,hIn:144,shape:"rect",matColor:"#7a5c1f",matBorder:"#5a4215" },
  { id:"ig_cust",name:"Custom Row",cat:"In-Ground",wIn:48,hIn:96,shape:"rect",matColor:"#7a5c1f",matBorder:"#5a4215",custom:true },
  { id:"kh_6",name:"6ft Keyhole",cat:"Keyhole",wIn:72,hIn:72,shape:"keyhole",matColor:"#a07855",matBorder:"#7c5635",custom:true },
  { id:"kh_8",name:"8ft Keyhole",cat:"Keyhole",wIn:96,hIn:96,shape:"keyhole",matColor:"#a07855",matBorder:"#7c5635",custom:true },
  // ── TRELLIS ──
  { id:"tr_2x6",name:"2×6ft Trellis",cat:"Trellis",wIn:24,hIn:72,shape:"rect",matColor:"transparent",matBorder:"#8B7355",trellis:true },
  { id:"tr_4x6",name:"4×6ft Trellis",cat:"Trellis",wIn:48,hIn:72,shape:"rect",matColor:"transparent",matBorder:"#8B7355",trellis:true },
  { id:"tr_4x8",name:"4×8ft Trellis",cat:"Trellis",wIn:48,hIn:96,shape:"rect",matColor:"transparent",matBorder:"#8B7355",trellis:true },
  { id:"tr_8x8",name:"8×8ft Trellis",cat:"Trellis",wIn:96,hIn:96,shape:"rect",matColor:"transparent",matBorder:"#8B7355",trellis:true },
  { id:"tr_cust",name:"Custom Trellis",cat:"Trellis",wIn:48,hIn:72,shape:"rect",matColor:"transparent",matBorder:"#8B7355",trellis:true,custom:true },
  { id:"tr_arch",name:"Trellis Arch (4ft)",cat:"Trellis",wIn:48,hIn:12,shape:"rect",matColor:"transparent",matBorder:"#8B7355",trellis:true },
];

/* ═══════════════════════════════════════════════════════════════
   SVG PLANT ICONS (compact)
   ═══════════════════════════════════════════════════════════════ */
const PlantSVG = ({ plant, size = 28 }) => {
  const s = size, h = s / 2;
  const icons = {
    tomato: <g><circle cx={h} cy={h+2} r={h*.55} fill="#e53e3e"/><path d={`M${h} ${h-4} Q${h-2} ${h-8} ${h-5} ${h-9} M${h} ${h-4} Q${h+2} ${h-8} ${h+5} ${h-9}`} stroke="#38a169" strokeWidth="1.5" fill="none"/><circle cx={h-2} cy={h+1} r={1.5} fill="#feb2b2" opacity=".6"/></g>,
    cherry_tomato: <g><circle cx={h-3} cy={h+2} r={h*.35} fill="#fc8181"/><circle cx={h+3} cy={h+3} r={h*.35} fill="#fc8181"/><circle cx={h} cy={h-1} r={h*.35} fill="#feb2b2"/><path d={`M${h} ${h-5} L${h} ${h-8}`} stroke="#38a169" strokeWidth="1.5"/></g>,
    pepper: <g><path d={`M${h-3} ${h-3} Q${h-5} ${h+5} ${h-2} ${h+8} Q${h} ${h+9} ${h+2} ${h+8} Q${h+5} ${h+5} ${h+3} ${h-3}Z`} fill={plant.color}/><rect x={h-1} y={h-7} width="2" height="5" rx="1" fill="#38a169"/></g>,
    hot_pepper: <g><path d={`M${h-1} ${h-3} Q${h-5} ${h+2} ${h-3} ${h+8} Q${h-1} ${h+10} ${h} ${h+8} Q${h+2} ${h+3} ${h+1} ${h-3}Z`} fill={plant.color}/><rect x={h-1} y={h-7} width="2" height="5" rx="1" fill="#276749"/></g>,
    eggplant: <g><ellipse cx={h} cy={h+2} rx={h*.4} ry={h*.6} fill={plant.color||"#6b46c1"}/><path d={`M${h-2} ${h-6} Q${h} ${h-4} ${h+2} ${h-6}`} fill="#38a169"/></g>,
    cucumber: <g><rect x={h-3} y={h-6} width="6" height="14" rx="3" fill="#48bb78"/><circle cx={h-1} cy={h-2} r=".7" fill="#276749"/><circle cx={h+1} cy={h+1} r=".7" fill="#276749"/></g>,
    zucchini: <g><rect x={h-3.5} y={h-6} width="7" height="14" rx="3.5" fill={plant.color||"#68d391"}/><path d={`M${h-2} ${h-6} Q${h} ${h-9} ${h+2} ${h-6}`} fill="#faf089"/></g>,
    squash: <g><ellipse cx={h} cy={h+1} rx={h*.5} ry={h*.55} fill={plant.color||"#ed8936"}/><line x1={h} y1={h-6} x2={h} y2={h-3} stroke="#38a169" strokeWidth="1.5"/></g>,
    pumpkin: <g><ellipse cx={h-3} cy={h+2} rx={h*.35} ry={h*.5} fill="#dd6b20"/><ellipse cx={h} cy={h+2} rx={h*.35} ry={h*.55} fill="#ed8936"/><ellipse cx={h+3} cy={h+2} rx={h*.35} ry={h*.5} fill="#dd6b20"/><rect x={h-1} y={h-7} width="2" height="5" rx="1" fill="#38a169"/></g>,
    corn: <g><rect x={h-2.5} y={h-4} width="5" height="10" rx="2.5" fill="#ecc94b"/><path d={`M${h-2} ${h-6} Q${h-6} ${h-3} ${h-6} ${h+2}`} stroke="#38a169" strokeWidth="1.5" fill="none"/><path d={`M${h+2} ${h-6} Q${h+6} ${h-3} ${h+6} ${h+2}`} stroke="#38a169" strokeWidth="1.5" fill="none"/></g>,
    lettuce: <g><circle cx={h} cy={h+1} r={h*.55} fill={plant.color||"#68d391"}/><circle cx={h} cy={h+1} r={h*.35} fill="#9ae6b4"/><circle cx={h} cy={h+1} r={h*.18} fill="#c6f6d5"/></g>,
    spinach: <g><ellipse cx={h-3} cy={h+2} rx="4" ry="5" fill="#2f855a"/><ellipse cx={h+3} cy={h+2} rx="4" ry="5" fill="#38a169"/><ellipse cx={h} cy={h-2} rx="3.5" ry="4" fill="#48bb78"/></g>,
    kale: <g><path d={`M${h} ${h+7} Q${h-8} ${h+2} ${h-5} ${h-5} Q${h-2} ${h-7} ${h} ${h-5} Q${h+2} ${h-7} ${h+5} ${h-5} Q${h+8} ${h+2} ${h} ${h+7}Z`} fill={plant.color||"#276749"}/></g>,
    arugula: <g><path d={`M${h} ${h+6} L${h-4} ${h-4} Q${h-2} ${h-2} ${h} ${h+6}`} fill="#48bb78"/><path d={`M${h} ${h+6} L${h+4} ${h-4} Q${h+2} ${h-2} ${h} ${h+6}`} fill="#68d391"/></g>,
    chard: <g><path d={`M${h} ${h+8} L${h-5} ${h-6} Q${h} ${h-3} ${h+5} ${h-6}Z`} fill="#2f855a"/><line x1={h} y1={h+8} x2={h} y2={h-4} stroke={plant.color||"#e53e3e"} strokeWidth="2"/></g>,
    cabbage: <g><circle cx={h} cy={h+1} r={h*.6} fill={plant.color||"#9ae6b4"}/><circle cx={h} cy={h+1} r={h*.4} fill="#68d391"/><circle cx={h} cy={h+1} r={h*.2} fill="#48bb78"/></g>,
    broccoli: <g><circle cx={h-3} cy={h-2} r="3" fill="#38a169"/><circle cx={h+3} cy={h-2} r="3" fill="#2f855a"/><circle cx={h} cy={h-4} r="3" fill="#48bb78"/><rect x={h-1} y={h+1} width="2" height="6" rx="1" fill="#276749"/></g>,
    cauliflower: <g><circle cx={h-3} cy={h-2} r="3" fill="#fefcbf"/><circle cx={h+3} cy={h-2} r="3" fill="#faf089"/><circle cx={h} cy={h-4} r="3" fill="#fefcbf"/><rect x={h-1} y={h+1} width="2" height="6" rx="1" fill="#38a169"/></g>,
    brussels: <g><rect x={h-1} y={h-7} width="2" height="16" rx="1" fill="#48bb78"/>{[-5,-2,1,4].map((y,i)=><circle key={i} cx={h+(i%2?3:-3)} cy={h+y} r="2.5" fill="#68d391"/>)}</g>,
    carrot: <g><path d={`M${h-3} ${h-3} L${h} ${h+8} L${h+3} ${h-3}Z`} fill={plant.color||"#ed8936"}/><path d={`M${h-3} ${h-5} Q${h-1} ${h-2} ${h} ${h-5} Q${h+1} ${h-2} ${h+3} ${h-5}`} fill="#38a169"/></g>,
    beet: <g><circle cx={h} cy={h+3} r={h*.5} fill={plant.color||"#9b2c2c"}/><path d={`M${h-1} ${h-2} L${h-3} ${h-7}`} stroke="#38a169" strokeWidth="1.5"/><path d={`M${h+1} ${h-2} L${h+3} ${h-7}`} stroke="#38a169" strokeWidth="1.5"/></g>,
    radish: <g><circle cx={h} cy={h+2} r={h*.4} fill={plant.color||"#fc8181"}/><path d={`M${h-2} ${h-3} L${h} ${h-6}`} stroke="#48bb78" strokeWidth="1.5"/><path d={`M${h+2} ${h-3} L${h} ${h-6}`} stroke="#48bb78" strokeWidth="1.5"/></g>,
    turnip: <g><circle cx={h} cy={h+2} r={h*.5} fill="#fefcbf"/><path d={`M${h} ${h-3} L${h-2} ${h-7} M${h} ${h-3} L${h+2} ${h-7}`} stroke="#48bb78" strokeWidth="1.5" fill="none"/></g>,
    potato: <g><ellipse cx={h} cy={h+1} rx={h*.55} ry={h*.45} fill={plant.color||"#d69e2e"}/>{[[h-3,h-1],[h+2,h+2]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1" fill="#b7791f"/>)}</g>,
    sweet_potato: <g><ellipse cx={h} cy={h+1} rx={h*.6} ry={h*.4} fill="#ed8936" transform={`rotate(-15 ${h} ${h+1})`}/><path d={`M${h+3} ${h-3} Q${h+6} ${h-6} ${h+4} ${h-7}`} stroke="#48bb78" strokeWidth="1" fill="none"/></g>,
    onion: <g><circle cx={h} cy={h+2} r={h*.5} fill={plant.color||"#faf089"}/><path d={`M${h} ${h-4} L${h-1} ${h-8} M${h} ${h-4} L${h+1} ${h-8}`} stroke="#48bb78" strokeWidth="1.5"/></g>,
    garlic: <g><circle cx={h} cy={h+2} r={h*.45} fill="#fefcbf"/><path d={`M${h-3} ${h+3} Q${h} ${h-2} ${h+3} ${h+3}`} fill="#e2e8f0" opacity=".5"/><path d={`M${h} ${h-3} L${h} ${h-7}`} stroke="#48bb78" strokeWidth="1.5"/></g>,
    leek: <g><rect x={h-2} y={h-3} width="4" height="12" rx="2" fill="#fefcbf"/><path d={`M${h-2} ${h-3} Q${h-6} ${h-8} ${h-4} ${h-10}`} stroke="#38a169" strokeWidth="2" fill="none"/><path d={`M${h+2} ${h-3} Q${h+6} ${h-8} ${h+4} ${h-10}`} stroke="#48bb78" strokeWidth="2" fill="none"/></g>,
    pea: <g><path d={`M${h-5} ${h} Q${h} ${h-4} ${h+5} ${h} Q${h} ${h+4} ${h-5} ${h}Z`} fill={plant.color||"#48bb78"}/>{[-2,0,2].map(i=><circle key={i} cx={h+i*2} cy={h} r="2" fill="#68d391"/>)}</g>,
    bean: <g><ellipse cx={h-1} cy={h+1} rx="3" ry="5" fill={plant.color||"#38a169"} transform={`rotate(-10 ${h} ${h})`}/><ellipse cx={h+2} cy={h+1} rx="3" ry="5" fill="#48bb78" transform={`rotate(10 ${h} ${h})`}/></g>,
    basil: <g><ellipse cx={h-3} cy={h-1} rx="4" ry="5" fill={plant.color||"#48bb78"}/><ellipse cx={h+3} cy={h-1} rx="4" ry="5" fill="#38a169"/><line x1={h} y1={h+4} x2={h} y2={h+8} stroke="#276749" strokeWidth="1.5"/></g>,
    cilantro: <g>{[[-3,-4],[3,-4],[0,-1],[-4,2],[4,2]].map(([x,y],i)=><circle key={i} cx={h+x} cy={h+y} r="2.5" fill={i%2?"#68d391":"#48bb78"}/>)}<line x1={h} y1={h+3} x2={h} y2={h+8} stroke="#276749" strokeWidth="1"/></g>,
    parsley: <g>{[[-3,-3],[3,-3],[0,-5],[-5,0],[5,0]].map(([x,y],i)=><path key={i} d={`M${h+x} ${h+y+2} Q${h+x-1} ${h+y-2} ${h+x+1} ${h+y-2}`} fill="#2f855a"/>)}<line x1={h} y1={h+3} x2={h} y2={h+8} stroke="#1a4731" strokeWidth="1.5"/></g>,
    mint: <g><ellipse cx={h-3} cy={h-2} rx="3.5" ry="4" fill="#38a169"/><ellipse cx={h+3} cy={h-2} rx="3.5" ry="4" fill="#48bb78"/><ellipse cx={h} cy={h+2} rx="3.5" ry="4" fill="#2f855a"/></g>,
    rosemary: <g><line x1={h} y1={h+8} x2={h} y2={h-6} stroke="#4a7c59" strokeWidth="1.5"/>{[-4,-2,0,2,4].map((y,i)=><g key={i}><ellipse cx={h-2.5} cy={h+y} rx="1.2" ry="2.5" fill="#4a7c59" transform={`rotate(30 ${h-2.5} ${h+y})`}/><ellipse cx={h+2.5} cy={h+y} rx="1.2" ry="2.5" fill="#5a8a4c" transform={`rotate(-30 ${h+2.5} ${h+y})`}/></g>)}</g>,
    thyme: <g><line x1={h} y1={h+7} x2={h} y2={h-5} stroke="#7c9a6e" strokeWidth="1"/>{[-4,-2,0,2,4].map((y,i)=><g key={i}><circle cx={h-2} cy={h+y} r="1.5" fill="#7c9a6e"/><circle cx={h+2} cy={h+y} r="1.5" fill="#8aad7c"/></g>)}</g>,
    oregano: <g><line x1={h} y1={h+7} x2={h} y2={h-4} stroke="#5a8a4c" strokeWidth="1.2"/>{[-3,-1,1,3].map((y,i)=><g key={i}><ellipse cx={h-2.5} cy={h+y} rx="2.5" ry="2" fill="#5a8a4c"/><ellipse cx={h+2.5} cy={h+y} rx="2.5" ry="2" fill="#6b9e5e"/></g>)}</g>,
    dill: <g><line x1={h} y1={h+8} x2={h} y2={h-2} stroke="#48bb78" strokeWidth="1"/>{[[-4,-5],[-2,-7],[0,-8],[2,-7],[4,-5]].map(([x,y],i)=><circle key={i} cx={h+x} cy={h+y} r="1.5" fill="#faf089"/>)}</g>,
    chives: <g>{[-3,-1,1,3].map((x,i)=><line key={i} x1={h+x} y1={h+7} x2={h+x+(i%2?1:-1)} y2={h-5} stroke="#48bb78" strokeWidth="1.5"/>)}<circle cx={h} cy={h-6} r="2.5" fill={plant.color||"#9f7aea"}/></g>,
    sage: <g><ellipse cx={h-3} cy={h} rx="3.5" ry="5" fill="#a0aec0"/><ellipse cx={h+3} cy={h} rx="3.5" ry="5" fill="#b0bec5"/></g>,
    strawberry: <g><path d={`M${h} ${h-4} Q${h-6} ${h-1} ${h-4} ${h+5} Q${h} ${h+8} ${h+4} ${h+5} Q${h+6} ${h-1} ${h} ${h-4}Z`} fill={plant.color||"#e53e3e"}/><path d={`M${h-2} ${h-5} Q${h} ${h-3} ${h+2} ${h-5}`} fill="#38a169"/></g>,
    blueberry: <g>{[[-3,-2],[0,-4],[3,-2],[-2,1],[2,1],[0,3]].map(([x,y],i)=><circle key={i} cx={h+x} cy={h+y} r="2.5" fill={plant.color||"#4c51bf"}/>)}</g>,
    raspberry: <g>{[[-2,-3],[2,-3],[0,-1],[-2,1],[2,1],[0,3]].map(([x,y],i)=><circle key={i} cx={h+x} cy={h+y} r="2.2" fill={plant.color||"#d53f8c"}/>)}<path d={`M${h} ${h-5} L${h} ${h-8}`} stroke="#38a169" strokeWidth="1.5"/></g>,
    watermelon: <g><circle cx={h} cy={h+1} r={h*.6} fill="#48bb78"/><path d={`M${h-h*.6} ${h+1} A${h*.6} ${h*.6} 0 0 1 ${h+h*.6} ${h+1}`} fill="#276749"/><circle cx={h} cy={h+1} r={h*.35} fill="#fc8181"/></g>,
  };
  return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>{icons[plant.icon]||<circle cx={h} cy={h} r={h*.6} fill={plant.color}/>}</svg>;
};

/* ═══════════════════════════════════════════════════════════════ */
const PX=4, GP=12, uid=()=>Math.random().toString(36).slice(2,10), toM=i=>(i*2.54).toFixed(1), snap=px=>Math.round(px/GP)*GP;
const toFtIn=(inches)=>{const ft=Math.floor(inches/12);const inn=inches%12;return ft>0?(inn>0?`${ft}' ${inn}"`:ft+"'"):inn+"\"";};
const USDA_ZONES=["1","2","3","4","5","6","7","8","9","10","11","12","13"];
const CATS=["All","Fruiting","Leafy","Brassica","Root","Allium","Legume","Herb","Fruit","Trees","Companion","Other"];
const BCATS=["Raised Wood","Raised Metal","Container","Grow Bag","In-Ground","Keyhole","Trellis"];

export default function App(){
  // Load saved state from localStorage
  const loadSaved=()=>{try{const s=localStorage.getItem("ggd_save");if(s){const d=JSON.parse(s);return d;}}catch{}return null;};
  const saved=useRef(loadSaved());

  const[projectName,setProjectName]=useState(saved.current?.projectName||"My Garden Plan");
  const[usdaZone,setUsdaZone]=useState(saved.current?.usdaZone||"");
  const[unit,setUnit]=useState(saved.current?.unit||"imperial");
  const[zoom,setZoom]=useState(saved.current?.zoom||.75);
  const[pan,setPan]=useState(saved.current?.pan||{x:40,y:40});
  const[canvasSize,setCanvasSize]=useState(saved.current?.canvasSize||{w:240,h:240});
  const[searchQ,setSearchQ]=useState("");
  const[plantCat,setPlantCat]=useState("All");
  const[bedCat,setBedCat]=useState("Raised Wood");
  const[sideTab,setSideTab]=useState("plants");
  const[activeTool,setActiveTool]=useState(null);
  const[plants,setPlants]=useState(saved.current?.plants||[]);
  const[beds,setBeds]=useState(saved.current?.beds||[]);
  const[selId,setSelId]=useState(null);
  const[drag,setDrag]=useState(null);
  const[dragS,setDragS]=useState(null);
  const[isPan,setIsPan]=useState(false);
  const[panS,setPanS]=useState(null);
  const[notes,setNotes]=useState(saved.current?.notes||"");
  const[chatOpen,setChatOpen]=useState(false);
  const[chatMode,setChatMode]=useState("ai");
  const[fbName,setFbName]=useState("");
  const[fbEmail,setFbEmail]=useState("");
  const[fbCat,setFbCat]=useState("General Question");
  const[fbMsg,setFbMsg]=useState("");
  const[fbSending,setFbSending]=useState(false);
  const[fbSent,setFbSent]=useState(false);
  const[msgs,setMsgs]=useState([{role:"assistant",content:"Hey! I'm Sprout 🌱 your garden assistant. Ask me about spacing, companions, soil, pests, or design!"}]);
  const[chatIn,setChatIn]=useState("");
  const[chatBusy,setChatBusy]=useState(false);
  const[pInfo,setPInfo]=useState(null);
  const[showCS,setShowCS]=useState(false);
  const[notesC,setNotesC]=useState(false);
  const[showTrash,setShowTrash]=useState(false);
  const[showLanding,setShowLanding]=useState(false);

  // Auto-save to localStorage (debounced)
  const saveTimer=useRef(null);
  useEffect(()=>{
    if(saveTimer.current)clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(()=>{
      try{localStorage.setItem("ggd_save",JSON.stringify({projectName,usdaZone,unit,zoom,pan,canvasSize,plants,beds,notes}));}catch{}
    },500);
  },[projectName,usdaZone,unit,zoom,pan,canvasSize,plants,beds,notes]);

  // 3. Reset garden
  const resetGarden=()=>{
    if(!window.confirm("Reset your entire garden? This clears all plants, beds, and notes. This cannot be undone."))return;
    setProjectName("My Garden Plan");setUsdaZone("");setUnit("imperial");setZoom(.75);setPan({x:40,y:40});
    setCanvasSize({w:240,h:240});setPlants([]);setBeds([]);setNotes("");setSelId(null);setActiveTool(null);
    try{localStorage.removeItem("ggd_save");}catch{}
  };
  const[trashH,setTrashH]=useState(false);
  const[resH,setResH]=useState(null);
  const wr=useRef(null),ce=useRef(null),cb=useRef(null),chatRef=useRef(null);
  useEffect(()=>{if(cb.current)cb.current.scrollTop=cb.current.scrollHeight;},[msgs]);
  const[clipboard,setClipboard]=useState(null);
  useEffect(()=>{const h=e=>{
    if(chatRef.current && chatRef.current.contains(e.target)) return;
    if(chatRef.current && chatRef.current.contains(document.activeElement)) return;
    const tag = e.target.tagName;
    if(tag==="INPUT"||tag==="TEXTAREA") return;
    if(document.activeElement?.tagName==="INPUT"||document.activeElement?.tagName==="TEXTAREA") return;
    if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopImmediatePropagation();return;}
    if((e.key==="Backspace"||e.key==="Delete")&&selId){e.preventDefault();setPlants(p=>p.filter(x=>x.id!==selId));setBeds(p=>p.filter(x=>x.id!==selId));setSelId(null);}
    if(e.key==="Escape"){setActiveTool(null);setSelId(null);}
    // Copy
    if((e.ctrlKey||e.metaKey)&&e.key==="c"&&selId){
      e.preventDefault();
      const pl=plants.find(x=>x.id===selId);
      if(pl){setClipboard({type:"plant",data:{pid:pl.pid}});return;}
      const bd=beds.find(x=>x.id===selId);
      if(bd){setClipboard({type:"bed",data:{bid:bd.bid,wIn:bd.wIn,hIn:bd.hIn,custom:bd.custom}});return;}
    }
    // Paste
    if((e.ctrlKey||e.metaKey)&&e.key==="v"&&clipboard){
      e.preventDefault();
      const cx=canvasSize.w*PX/2,cy=canvasSize.h*PX/2;
      if(clipboard.type==="plant"){setPlants(pr=>[...pr,{id:uid(),pid:clipboard.data.pid,x:snap(cx),y:snap(cy)}]);}
      if(clipboard.type==="bed"){setBeds(pr=>[...pr,{id:uid(),bid:clipboard.data.bid,x:snap(cx),y:snap(cy),wIn:clipboard.data.wIn,hIn:clipboard.data.hIn,custom:clipboard.data.custom||false}]);}
    }
  };window.addEventListener("keydown",h,true);return()=>window.removeEventListener("keydown",h,true);},[selId,clipboard,plants,beds,canvasSize]);

  const filtered=useMemo(()=>{let l=PLANTS;if(plantCat!=="All")l=l.filter(p=>p.cat===plantCat);if(searchQ){const q=searchQ.toLowerCase();l=l.filter(p=>p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q));}if(usdaZone){const z=parseInt(usdaZone);l=l.map(p=>{const inZone=p.zones&&z>=p.zones[0]&&z<=p.zones[1];return{...p,_inZone:inZone};});l.sort((a,b)=>(b._inZone?1:0)-(a._inZone?1:0));}return l;},[plantCat,searchQ,usdaZone]);
  const fBeds=useMemo(()=>BED_PRESETS.filter(b=>b.cat===bedCat),[bedCat]);

  const handleWheel=useCallback(e=>{if(cb.current?.contains(e.target))return;e.preventDefault();setZoom(z=>Math.min(4,Math.max(.15,z+(e.deltaY>0?-.06:.06))));},[]);
  useEffect(()=>{const el=wr.current;if(el)el.addEventListener("wheel",handleWheel,{passive:false});return()=>{if(el)el.removeEventListener("wheel",handleWheel);};},[handleWheel]);

  // Touch support
  const lastTouchRef=useRef(null);
  const pinchRef=useRef(null);
  const touchToMouse=(t)=>({clientX:t.clientX,clientY:t.clientY,target:t.target,stopPropagation:()=>{},preventDefault:()=>{}});
  const gp=e=>{const r=wr.current?.getBoundingClientRect();if(!r)return{x:0,y:0};const cx=e.clientX!==undefined?e.clientX:(e.touches?.[0]?.clientX||0);const cy=e.clientY!==undefined?e.clientY:(e.touches?.[0]?.clientY||0);return{x:(cx-r.left-pan.x)/zoom,y:(cy-r.top-pan.y)/zoom};};

  const getTouchDist=(t)=>{if(t.length<2)return 0;const dx=t[0].clientX-t[1].clientX,dy=t[0].clientY-t[1].clientY;return Math.sqrt(dx*dx+dy*dy);};

  // Canvas touch handlers
  const onTouchStart=useCallback(e=>{
    if(e.target.closest(".noc"))return;
    if(e.touches.length===2){e.preventDefault();pinchRef.current={dist:getTouchDist(e.touches),zoom:zoom};return;}
    if(e.touches.length!==1)return;
    const t=e.touches[0];
    lastTouchRef.current={x:t.clientX,y:t.clientY,time:Date.now()};
    const fake=touchToMouse(t);fake.target=e.target;
    if(activeTool){
      const p=gp(fake),sx=snap(p.x),sy=snap(p.y);
      if(activeTool.type==="plant")setPlants(pr=>[...pr,{id:uid(),pid:activeTool.data.id,x:sx,y:sy}]);
      else{const b=activeTool.data;setBeds(pr=>[...pr,{id:uid(),bid:b.id,x:sx,y:sy,wIn:b.wIn,hIn:b.hIn,custom:b.custom||false}]);}
      return;
    }
    setSelId(null);setIsPan(true);setPanS({x:t.clientX-pan.x,y:t.clientY-pan.y});
  },[activeTool,pan,zoom]);

  const onTouchMove=useCallback(e=>{
    if(e.target.closest(".noc"))return;
    if(e.touches.length===2&&pinchRef.current){
      e.preventDefault();
      const newDist=getTouchDist(e.touches);
      const scale=newDist/pinchRef.current.dist;
      setZoom(Math.min(4,Math.max(.15,pinchRef.current.zoom*scale)));
      return;
    }
    if(e.touches.length!==1)return;
    const t=e.touches[0];
    const fake=touchToMouse(t);
    if(isPan&&panS){e.preventDefault();setPan({x:t.clientX-panS.x,y:t.clientY-panS.y});return;}
    if(drag&&dragS){
      e.preventDefault();setShowTrash(true);
      const p=gp(fake),dx=p.x-dragS.x,dy=p.y-dragS.y;
      if(drag.t==="p")setPlants(pr=>pr.map(x=>x.id===drag.id?{...x,x:snap(drag.ox+dx),y:snap(drag.oy+dy)}:x));
      else setBeds(pr=>pr.map(x=>x.id===drag.id?{...x,x:snap(drag.ox+dx),y:snap(drag.oy+dy)}:x));
      const r=wr.current?.getBoundingClientRect();
      if(r){const rx=t.clientX-r.left,ry=t.clientY-r.top;setTrashH(rx<96&&ry>r.height-96);}
    }
  },[isPan,panS,drag,dragS,zoom]);

  const onTouchEnd=useCallback(()=>{
    pinchRef.current=null;lastTouchRef.current=null;
    if(resH){setResH(null);return;}
    if(drag&&trashH){if(drag.t==="p")setPlants(p=>p.filter(x=>x.id!==drag.id));else setBeds(p=>p.filter(x=>x.id!==drag.id));setSelId(null);}
    setIsPan(false);setPanS(null);setDrag(null);setDragS(null);setShowTrash(false);setTrashH(false);
  },[drag,trashH,resH]);

  // Plant touch drag
  const sdpTouch=(e,p)=>{e.stopPropagation();if(e.touches.length!==1)return;const t=e.touches[0];setSelId(p.id);setActiveTool(null);setDrag({t:"p",id:p.id,ox:p.x,oy:p.y});setDragS(gp(touchToMouse(t)));};
  // Bed touch drag
  const sdbTouch=(e,b)=>{e.stopPropagation();if(activeTool?.type==="plant")return;if(e.touches.length!==1)return;const t=e.touches[0];setSelId(b.id);setActiveTool(null);setDrag({t:"b",id:b.id,ox:b.x,oy:b.y});setDragS(gp(touchToMouse(t)));};

  // Prevent default touch on canvas to stop browser zoom/scroll
  useEffect(()=>{
    const el=wr.current;if(!el)return;
    const prevent=e=>{if(!e.target.closest(".noc"))e.preventDefault();};
    el.addEventListener("touchmove",prevent,{passive:false});
    return()=>el.removeEventListener("touchmove",prevent);
  },[]);

  // Mobile sidebar toggle
  const [sideOpen,setSideOpen]=useState(typeof window!=="undefined"&&window.innerWidth>600);

  const onDown=e=>{
    // Right-click or middle-click cancels placement
    if(e.button===1||e.button===2){e.preventDefault();setActiveTool(null);return;}
    if(chatRef.current&&chatRef.current.contains(e.target))return;if(e.target.closest(".noc"))return;if(activeTool){const p=gp(e),sx=snap(p.x),sy=snap(p.y);if(activeTool.type==="plant")setPlants(pr=>[...pr,{id:uid(),pid:activeTool.data.id,x:sx,y:sy}]);else{const b=activeTool.data;setBeds(pr=>[...pr,{id:uid(),bid:b.id,x:sx,y:sy,wIn:b.wIn,hIn:b.hIn,custom:b.custom||false}]);}return;}setSelId(null);setIsPan(true);setPanS({x:e.clientX-pan.x,y:e.clientY-pan.y});};
  const onContext=e=>{e.preventDefault();setActiveTool(null);};

  const onMove=e=>{if(resH){const p=gp(e),dx=Math.round((p.x-resH.sx)/PX),dy=Math.round((p.y-resH.sy)/PX);setBeds(pr=>pr.map(b=>{if(b.id!==resH.bid)return b;const bed=BED_PRESETS.find(bp=>bp.id===b.bid);const ic=bed&&(bed.shape==="circle"||bed.shape==="keyhole");let nw=resH.ow,nh=resH.oh;const c=resH.c;
    if(c==="se"){nw=resH.ow+dx;nh=ic?resH.ow+dx:resH.oh+dy;}
    else if(c==="sw"){nw=resH.ow-dx;nh=ic?resH.ow-dx:resH.oh+dy;}
    else if(c==="ne"){nw=resH.ow+dx;nh=ic?resH.ow+dx:resH.oh-dy;}
    else if(c==="nw"){nw=resH.ow-dx;nh=ic?resH.ow-dx:resH.oh-dy;}
    else if(c==="e"){nw=resH.ow+dx;nh=ic?resH.ow+dx:resH.oh;}
    else if(c==="w"){nw=resH.ow-dx;nh=ic?resH.ow-dx:resH.oh;}
    else if(c==="s"){nh=ic?resH.oh+dy:resH.oh+dy;nw=ic?resH.oh+dy:resH.ow;}
    else if(c==="n"){nh=ic?resH.oh-dy:resH.oh-dy;nw=ic?resH.oh-dy:resH.ow;}
    nw=Math.max(12,nw);nh=Math.max(12,nh);return{...b,wIn:nw,hIn:ic?nw:nh};}));return;}if(isPan&&panS){setPan({x:e.clientX-panS.x,y:e.clientY-panS.y});return;}if(drag&&dragS){setShowTrash(true);const p=gp(e),dx=p.x-dragS.x,dy=p.y-dragS.y;if(drag.t==="p")setPlants(pr=>pr.map(x=>x.id===drag.id?{...x,x:snap(drag.ox+dx),y:snap(drag.oy+dy)}:x));else setBeds(pr=>pr.map(x=>x.id===drag.id?{...x,x:snap(drag.ox+dx),y:snap(drag.oy+dy)}:x));const r=wr.current?.getBoundingClientRect();if(r){const rx=e.clientX-r.left,ry=e.clientY-r.top;setTrashH(rx<80&&ry>r.height-80);}}};

  const onUp=()=>{if(resH){setResH(null);return;}if(drag&&trashH){if(drag.t==="p")setPlants(p=>p.filter(x=>x.id!==drag.id));else setBeds(p=>p.filter(x=>x.id!==drag.id));setSelId(null);}setIsPan(false);setPanS(null);setDrag(null);setDragS(null);setShowTrash(false);setTrashH(false);};

  const sdp=(e,p)=>{e.stopPropagation();setSelId(p.id);setActiveTool(null);setDrag({t:"p",id:p.id,ox:p.x,oy:p.y});setDragS(gp(e));};
  const sdb=(e,b)=>{e.stopPropagation();setSelId(b.id);setActiveTool(null);setDrag({t:"b",id:b.id,ox:b.x,oy:b.y});setDragS(gp(e));};
  const stR=(e,b,c)=>{e.stopPropagation();const p=gp(e);setResH({bid:b.id,c,sx:p.x,sy:p.y,ow:b.wIn,oh:b.hIn});};

  const delSel=()=>{setPlants(p=>p.filter(x=>x.id!==selId));setBeds(p=>p.filter(x=>x.id!==selId));setSelId(null);};
  const fileRef=useRef(null);
  const [showDLMenu,setShowDLMenu]=useState(false);
  useEffect(()=>{if(!showDLMenu)return;const h=()=>setShowDLMenu(false);const t=setTimeout(()=>document.addEventListener("click",h),0);return()=>{clearTimeout(t);document.removeEventListener("click",h);};},[showDLMenu]);

  const saveProject=()=>{
    const data=JSON.stringify({version:1,projectName,canvasSize,unit,usdaZone,plants,beds,notes},null,2);
    const blob=new Blob([data],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${projectName.replace(/\s+/g,"_")}.ggd.json`;a.click();URL.revokeObjectURL(a.href);
    setShowDLMenu(false);
  };

  const exportPNG=async()=>{
    const canvas=document.createElement("canvas");
    const cW2=canvasSize.w*PX,cH2=canvasSize.h*PX;
    const scale=3;canvas.width=cW2*scale;canvas.height=cH2*scale;
    const ctx=canvas.getContext("2d");ctx.scale(scale,scale);
    // Background
    ctx.fillStyle="#7d9450";ctx.fillRect(0,0,cW2,cH2);
    ctx.strokeStyle="rgba(255,255,255,0.2)";ctx.lineWidth=0.4;
    for(let x=0;x<=cW2;x+=GP){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,cH2);ctx.stroke();}
    for(let y=0;y<=cH2;y+=GP){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(cW2,y);ctx.stroke();}
    // Beds
    beds.forEach(b=>{const bed=BED_PRESETS.find(bp=>bp.id===b.bid);if(!bed)return;const w2=(b.wIn||bed.wIn)*PX,h3=(b.hIn||bed.hIn)*PX;ctx.fillStyle="rgb(50,30,10)";ctx.strokeStyle=bed.matBorder;ctx.lineWidth=2;if(bed.shape==="circle"){ctx.beginPath();ctx.arc(b.x+w2/2,b.y+h3/2,w2/2,0,Math.PI*2);ctx.fill();ctx.stroke();}else{ctx.fillRect(b.x,b.y,w2,h3);ctx.strokeRect(b.x,b.y,w2,h3);}
      ctx.fillStyle="#fff";ctx.font="bold 7px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(bed.name,b.x+w2/2,b.y+h3/2);
    });
    // Spacing circles
    plants.forEach(pl=>{const p=PLANTS.find(x=>x.id===pl.pid);if(!p)return;const rel=plantRelations.get(pl.id);const r=(p.spacingIn/2)*PX;ctx.beginPath();ctx.arc(pl.x+14,pl.y+14,r,0,Math.PI*2);ctx.fillStyle=rel==="red"?"rgba(220,38,38,.15)":rel==="orange"?"rgba(237,137,54,.15)":rel==="companion"?"rgba(34,197,94,.2)":"rgba(255,255,255,.08)";ctx.fill();ctx.strokeStyle=rel==="red"?"#dc2626":rel==="orange"?"#ed8936":rel==="companion"?"#16a34a":"rgba(255,255,255,.3)";ctx.lineWidth=1;ctx.stroke();});
    // Render SVG icons as images
    const renderIcon=async(pl)=>{const p=PLANTS.find(x=>x.id===pl.pid);if(!p)return;
      const svgEl=document.querySelector(`[data-plant-id="${pl.id}"] svg`);
      if(svgEl){const svgStr=new XMLSerializer().serializeToString(svgEl);const blob=new Blob([svgStr],{type:"image/svg+xml;charset=utf-8"});const url=URL.createObjectURL(blob);const img=new Image();await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=url;});ctx.drawImage(img,pl.x,pl.y,28,28);URL.revokeObjectURL(url);}
      else{ctx.fillStyle=p.color||"#48bb78";ctx.beginPath();ctx.arc(pl.x+14,pl.y+14,10,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle="#fff";ctx.font="bold 7px sans-serif";ctx.textAlign="center";ctx.textBaseline="top";ctx.fillText(p.name.split("(")[0].trim().split(" ").slice(0,2).join(" "),pl.x+14,pl.y+30);
    };
    for(const pl of plants)await renderIcon(pl);
    const a=document.createElement("a");a.href=canvas.toDataURL("image/png");a.download=`${projectName.replace(/\s+/g,"_")}.png`;a.click();
    setShowDLMenu(false);
  };

  const loadProject=(e)=>{
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{try{
      const data=JSON.parse(ev.target.result);
      if(data.projectName)setProjectName(data.projectName);
      if(data.canvasSize)setCanvasSize(data.canvasSize);
      if(data.unit)setUnit(data.unit);
      if(data.usdaZone)setUsdaZone(data.usdaZone);
      if(data.plants)setPlants(data.plants);
      if(data.beds)setBeds(data.beds);
      if(data.notes)setNotes(data.notes);
    }catch{alert("Invalid project file.");}};
    reader.readAsText(file);
    e.target.value="";
  };

  const sendChat=async()=>{if(!chatIn.trim()||chatBusy)return;const m=chatIn.trim();setChatIn("");setMsgs(p=>[...p,{role:"user",content:m}]);setChatBusy(true);try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[...msgs.slice(-8),{role:"user",content:m}]})});const d=await r.json();if(d.error){setMsgs(p=>[...p,{role:"assistant",content:d.error}]);}else{setMsgs(p=>[...p,{role:"assistant",content:d.content?.map(c=>c.text||"").join("")||"Sorry, try again!"}]);}}catch{setMsgs(p=>[...p,{role:"assistant",content:"Connection issue. Please try again."}]);}setChatBusy(false);};

  const sendFeedback=async()=>{
    if(!fbMsg.trim()||fbSending)return;
    setFbSending(true);
    try{
      const r=await fetch("https://api.web3forms.com/submit",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          access_key:"57592aea-538d-4ac5-8ad2-d3f51f248631",
          subject:`GardenGridDesign — ${fbCat}`,
          from_name:fbName||"Anonymous User",
          email:fbEmail||"no-reply@gardengriddesign.com",
          category:fbCat,
          message:fbMsg,
          source:"GardenGridDesign App"
        })
      });
      const d=await r.json();
      if(d.success){setFbSent(true);setFbMsg("");setFbName("");setFbEmail("");setTimeout(()=>setFbSent(false),4000);}
      else{alert("Failed to send. Please try again.");}
    }catch{alert("Connection error. Please try again.");}
    setFbSending(false);
  };

  // Overlap & companion detection — green when companion circles touch, orange/red for bad overlaps
  const plantRelations=useMemo(()=>{
    const m=new Map();
    const isCompanion=(pa,pb)=>{
      const aComps=(pa.companions||[]).map(c=>c.toLowerCase());
      const bComps=(pb.companions||[]).map(c=>c.toLowerCase());
      const aName=pa.name.toLowerCase();
      const bName=pb.name.toLowerCase();
      const aMatch=aComps.some(c=>bName.includes(c));
      const bMatch=bComps.some(c=>aName.includes(c));
      return aMatch||bMatch;
    };
    plants.forEach((a,i)=>{plants.forEach((b,j)=>{if(j<=i)return;
      const pa=PLANTS.find(p=>p.id===a.pid),pb=PLANTS.find(p=>p.id===b.pid);
      if(!pa||!pb)return;
      const d=Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2);
      const r1=(pa.spacingIn/2)*PX,r2=(pb.spacingIn/2)*PX;
      const radiusSum=r1+r2;
      const minD=((pa.spacingIn+pb.spacingIn)/2)*PX;
      if(d<radiusSum){
        const comp=isCompanion(pa,pb);
        if(comp){
          [a.id,b.id].forEach(id=>{const cur=m.get(id);if(!cur||cur==="default")m.set(id,"companion");});
        }else{
          const pct=1-d/minD;
          const sev=pct>=.25?"red":"orange";
          [a.id,b.id].forEach(id=>{const cur=m.get(id);if(cur==="red")return;if(sev==="red"||cur!=="orange")m.set(id,sev);});
        }
      }
    });});
    return m;
  },[plants]);

  const cW=canvasSize.w*PX,cH=canvasSize.h*PX;
  const gridSVG=useMemo(()=>{const l=[];for(let x=0;x<=cW;x+=GP){const mj=x%(48)===0;l.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={cH} stroke={mj?"rgba(255,255,255,.35)":"rgba(255,255,255,.15)"} strokeWidth={mj?.7:.3}/>);}for(let y=0;y<=cH;y+=GP){const mj=y%(48)===0;l.push(<line key={`h${y}`} x1={0} y1={y} x2={cW} y2={y} stroke={mj?"rgba(255,255,255,.35)":"rgba(255,255,255,.15)"} strokeWidth={mj?.7:.3}/>);}return l;},[cW,cH]);

  const T={bg:"#f5f0eb",side:"#faf8f5",head:"#faf8f5",hBorder:"#e0d8cf",accent:"#6b8f5e",accentL:"#eef3eb",accentD:"#3d5a32",text:"#1a1a1a",textM:"#555",textL:"#999",border:"#e0d8cf",canBg:"#c5b898"};

  const RulerX=()=>{const step=48,labels=[];for(let x=0;x<=cW;x+=step){const i=x/PX;const label=unit==="metric"?`${(i*2.54/100).toFixed(1)}m`:`${i/12}'`;const sx=x*zoom+pan.x;labels.push(<div key={x} style={{position:"absolute",left:sx,top:2,fontSize:9,color:"#1a1a1a",fontWeight:600,transform:"translateX(-50%)",whiteSpace:"nowrap"}}>{label}</div>);}return <div style={{position:"absolute",top:0,left:0,right:0,height:20,background:"rgba(250,248,245,.95)",borderBottom:`1px solid ${T.hBorder}`,zIndex:20,pointerEvents:"none"}}>{labels}</div>;};

  const RulerY=()=>{const step=48,labels=[];for(let y=0;y<=cH;y+=step){const i=y/PX;const label=unit==="metric"?`${(i*2.54/100).toFixed(1)}m`:`${i/12}'`;const sy=y*zoom+pan.y;labels.push(<div key={y} style={{position:"absolute",top:sy,left:2,fontSize:9,color:"#1a1a1a",fontWeight:600,transform:"translateY(-50%)",whiteSpace:"nowrap"}}>{label}</div>);}return <div style={{position:"absolute",top:0,left:0,bottom:0,width:30,background:"rgba(250,248,245,.95)",borderRight:`1px solid ${T.hBorder}`,zIndex:20,pointerEvents:"none"}}>{labels}</div>;};

  const renderBed=b=>{const bed=BED_PRESETS.find(bp=>bp.id===b.bid);if(!bed)return null;const w=(b.wIn||bed.wIn)*PX,h2=(b.hIn||bed.hIn)*PX;const sel=selId===b.id;const isTrellis=bed.trellis;const dirtColor="rgb(50,30,10)";const st={position:"absolute",left:b.x,top:b.y,width:w,height:h2,border:`${sel?3:2}px ${bed.cat==="Grow Bag"?"dashed":isTrellis?"dotted":"solid"} ${sel?"#2b6cb0":bed.matBorder}`,backgroundColor:isTrellis?"rgba(139,115,85,.08)":dirtColor,cursor:drag?.id===b.id?"grabbing":"grab",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:600,userSelect:"none",zIndex:sel?5:1,boxShadow:sel?"0 0 0 2px rgba(43,108,176,.3)":"none",textShadow:"0 1px 2px rgba(0,0,0,.4)",touchAction:"none"};
  if(bed.shape==="circle")st.borderRadius="50%";else if(bed.shape==="keyhole"){st.borderRadius="50%";st.clipPath="polygon(0% 0%,100% 0%,100% 100%,55% 100%,55% 65%,45% 65%,45% 100%,0% 100%)";}else st.borderRadius="3px";
  if(isTrellis){st.backgroundImage="repeating-linear-gradient(0deg,transparent,transparent 10px,rgba(139,115,85,.15) 10px,rgba(139,115,85,.15) 11px),repeating-linear-gradient(90deg,transparent,transparent 10px,rgba(139,115,85,.15) 10px,rgba(139,115,85,.15) 11px)";}
  const dim=unit==="metric"?`${toM(b.wIn||bed.wIn)}×${toM(b.hIn||bed.hIn)}cm`:`${toFtIn(b.wIn||bed.wIn)} × ${toFtIn(b.hIn||bed.hIn)}`;
  const isCircleBed=bed.shape==="circle"||bed.shape==="keyhole";
  const allHandles=isCircleBed?["e","w","n","s"]:["nw","ne","sw","se","n","s","e","w"];
  const handles=b.custom&&sel?allHandles.map(c=>{
    const hs=10;
    let top="auto",bottom="auto",left="auto",right="auto",cur="pointer";
    if(c==="nw"){top=-hs/2;left=-hs/2;cur="nwse-resize";}
    else if(c==="ne"){top=-hs/2;right=-hs/2;cur="nesw-resize";}
    else if(c==="sw"){bottom=-hs/2;left=-hs/2;cur="nesw-resize";}
    else if(c==="se"){bottom=-hs/2;right=-hs/2;cur="nwse-resize";}
    else if(c==="n"){top=-hs/2;left="calc(50% - 5px)";cur="ns-resize";}
    else if(c==="s"){bottom=-hs/2;left="calc(50% - 5px)";cur="ns-resize";}
    else if(c==="e"){right=-hs/2;top="calc(50% - 5px)";cur="ew-resize";}
    else if(c==="w"){left=-hs/2;top="calc(50% - 5px)";cur="ew-resize";}
    return <div key={c} onMouseDown={e=>stR(e,b,c)} onTouchStart={e=>{e.stopPropagation();if(e.touches.length!==1)return;const t=e.touches[0];const p=gp(touchToMouse(t));setResH({bid:b.id,c,sx:p.x,sy:p.y,ow:b.wIn,oh:b.hIn});}} style={{position:"absolute",width:hs,height:hs,top,bottom,left,right,background:"#fff",border:"2px solid #2b6cb0",borderRadius:c.length===1?3:"50%",cursor:cur,zIndex:30,touchAction:"none"}}/>;})
  :null;
  return <div key={b.id} style={st} onMouseDown={e=>{if(activeTool?.type==="plant"){return;}sdb(e,b);}} onTouchStart={e=>sdbTouch(e,b)}><span style={{pointerEvents:"none",textAlign:"center",lineHeight:1.2}}>{bed.name}<br/>{dim}</span>{handles}</div>;};

  const InfoPanel=({plant:p,onClose})=>{
    const zoneMatch=usdaZone&&p.zones?parseInt(usdaZone)>=p.zones[0]&&parseInt(usdaZone)<=p.zones[1]:null;
    return (
    <div style={{position:"fixed",top:0,right:0,width:320,height:"100%",background:"#fff",boxShadow:"-4px 0 20px rgba(0,0,0,.1)",zIndex:1000,overflowY:"auto",borderLeft:"1px solid #ddd"}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h3 style={{margin:0,fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{p.name}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#999",padding:4}}>✕</button>
      </div>
      <div style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"center",padding:16,background:"#f5f0eb",borderRadius:10,marginBottom:12}}>
          <PlantSVG plant={p} size={64}/>
        </div>
        {usdaZone && (
          <div style={{marginBottom:12,padding:"6px 10px",borderRadius:6,background:zoneMatch?"#f0fff4":"#fff5f5",border:`1px solid ${zoneMatch?"#c6f6d5":"#fed7d7"}`,display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:16}}>{zoneMatch?"✅":"⚠️"}</span>
            <span style={{fontSize:11,fontWeight:600,color:zoneMatch?"#276749":"#c53030"}}>{zoneMatch?`Compatible with your Zone ${usdaZone}`:`Not ideal for Zone ${usdaZone} (best in Zones ${p.zones?.[0]}–${p.zones?.[1]})`}</span>
          </div>
        )}
        {[
          ["Category",p.cat],
          ["Spacing",unit==="metric"?`${toM(p.spacingIn)} cm`:toFtIn(p.spacingIn)],
          ["Height",unit==="metric"?`${toM(p.heightIn||0)} cm`:toFtIn(p.heightIn||0)],
          ["USDA Zones",p.zones?`Zone ${p.zones[0]} – ${p.zones[1]}`:"All zones"],
          ["Sow Method",p.sow==="transplant"?"🌱 Transplant":p.sow==="direct"?"🌰 Direct Sow":"🌱 Transplant or 🌰 Direct Sow"],
          ["Sun",p.sun],
          ["Water",p.water],
          ["Days to Harvest",p.days],
          ["Planting Depth",p.depth],
          ["Season",p.season],
        ].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f5f5f5",gap:8}}>
            <span style={{fontSize:12,color:"#888",flexShrink:0}}>{k}</span>
            <span style={{fontSize:12,fontWeight:600,color:"#1a1a1a",textAlign:"right"}}>{v}</span>
          </div>
        ))}
        {p.companions?.length>0 && (
          <div style={{marginTop:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b8f5e",marginBottom:3}}>✓ Good Companions</div>
            <div style={{fontSize:12,color:"#555"}}>{p.companions.join(", ")}</div>
          </div>
        )}
        {p.avoid?.length>0 && (
          <div style={{marginTop:8}}>
            <div style={{fontSize:11,fontWeight:700,color:"#e53e3e",marginBottom:3}}>✗ Avoid Near</div>
            <div style={{fontSize:12,color:"#555"}}>{p.avoid.join(", ")}</div>
          </div>
        )}
        {p.tip && (
          <div style={{marginTop:10,padding:10,background:"#eef3eb",borderRadius:8,border:"1px solid #d0e0ca"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#3d5a32",marginBottom:4}}>📌 Growing Guide</div>
            <div style={{fontSize:12,color:"#1a1a1a",lineHeight:1.5}}>{p.tip}</div>
          </div>
        )}
        {(() => {
          const AFF="gardengriddes-20";
          const name=p.name.split("(")[0].trim();
          const seedQ=encodeURIComponent(name+" seeds");
          const suppQ=encodeURIComponent(name+" plant");
          const fertQ=encodeURIComponent(name+" fertilizer");
          const linkStyle={display:"block",padding:"8px 10px",borderRadius:6,fontSize:11,fontWeight:600,color:"#1a1a1a",textDecoration:"none",background:"#faf8f5",border:"1px solid #e0d8cf",marginBottom:4,textAlign:"center"};
          return (
            <div style={{marginTop:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"#3d5a32",marginBottom:6}}>🛒 Shop on Amazon</div>
              <a href={`https://www.amazon.com/s?k=${seedQ}&tag=${AFF}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                🌰 {name} Seeds
              </a>
              {p.cat==="Trees" ? (
                <a href={`https://www.amazon.com/s?k=${encodeURIComponent(name+" live plant")}&tag=${AFF}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  🌱 Live {name} Plant
                </a>
              ) : (
                <a href={`https://www.amazon.com/s?k=${suppQ}&tag=${AFF}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  🌱 {name} Starter Plants
                </a>
              )}
              <a href={`https://www.amazon.com/s?k=${fertQ}&tag=${AFF}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                🧪 {name} Fertilizer
              </a>
              <a href={`https://www.amazon.com/s?k=${encodeURIComponent("garden soil compost")}&tag=${AFF}`} target="_blank" rel="noopener noreferrer" style={{...linkStyle,marginBottom:0}}>
                🪴 Soil & Compost
              </a>
              <div style={{fontSize:9,color:"#999",marginTop:6,textAlign:"center"}}>As an Amazon Associate we earn from qualifying purchases</div>
            </div>
          );
        })()}
      </div>
    </div>
  ); };

  const LandingPage=()=>(
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"#faf8f5",zIndex:2000,overflowY:"auto",fontFamily:"'DM Sans',system-ui,sans-serif",color:"#1a1a1a"}}>
      {/* Domain for sale banner */}
      <div style={{background:"#276749",color:"#fff",textAlign:"center",padding:"8px 16px",fontSize:12,fontWeight:700,letterSpacing:".5px"}}>
        🏷️ This Domain Is For Sale — <a href="mailto:contact@gardengriddesign.com" style={{color:"#9ae6b4",textDecoration:"underline"}}>Contact Us</a>
      </div>
      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 32px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="32" height="32" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="#6b8f5e"/><path d="M11 4 Q7 8 8 14 Q11 11 14 14 Q15 8 11 4Z" fill="#fff"/></svg>
          <span style={{fontSize:20,fontWeight:800,color:"#6b8f5e"}}>GardenGridDesign</span>
        </div>
        <button onClick={()=>setShowLanding(false)} style={{padding:"10px 24px",background:"#6b8f5e",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 2px 8px rgba(107,143,94,.3)"}}>Open Garden Planner →</button>
      </nav>
      {/* Hero */}
      <section style={{textAlign:"center",padding:"48px 24px 32px",maxWidth:800,margin:"0 auto"}}>
        <h1 style={{fontSize:"clamp(28px,5vw,48px)",fontWeight:800,lineHeight:1.2,marginBottom:16,color:"#1a1a1a"}}>Design Your Edible Garden <span style={{color:"#6b8f5e"}}>With Confidence</span></h1>
        <p style={{fontSize:"clamp(14px,2vw,18px)",color:"#555",lineHeight:1.6,maxWidth:600,margin:"0 auto 32px"}}>Free drag-and-drop garden planner with 140+ vegetables, fruits, herbs, and companion plants. Real spacing data, USDA zone filtering, companion planting detection, and an AI garden assistant — all in your browser.</p>
        <button onClick={()=>setShowLanding(false)} style={{padding:"14px 36px",background:"#6b8f5e",color:"#fff",border:"none",borderRadius:10,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(107,143,94,.3)",marginBottom:8}}>Start Planning — It's Free</button>
        <p style={{fontSize:11,color:"#999"}}>No signup required. Works on desktop, tablet, and mobile.</p>
      </section>
      {/* Features */}
      <section style={{padding:"32px 24px",maxWidth:1000,margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontSize:24,fontWeight:700,marginBottom:32,color:"#1a1a1a"}}>Everything You Need to Plan Your Garden</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
          {[
            ["🌱","140+ Edible Plants","Complete database of vegetables, fruits, herbs, and companion plants with real spacing, sun, water, height, sow method, and harvest data."],
            ["📐","True-to-Scale Design","6-inch snap grid with feet/inches or metric. Raised beds, metal beds, containers, grow bags, in-ground rows, keyhole beds, and trellises — all to scale."],
            ["🗺️","USDA Zone Filtering","Select your hardiness zone and instantly see which plants thrive in your area. Out-of-zone plants are clearly marked."],
            ["💚","Companion Planting","Spacing circles turn green when companion plants are near each other, orange and red when plants are too close. Real companion data for every plant."],
            ["🤖","AI Garden Assistant","Ask Sprout anything about spacing, soil, pests, watering, or garden design. Powered by AI, built right into the planner."],
            ["📱","Works Everywhere","Full touch support with pinch-to-zoom on mobile and tablet. Drag and drop plants and beds on any device."],
            ["💾","Save & Export","Auto-saves your progress. Download as a project file to share or reload later. Export as PNG for printing."],
            ["🌰","Sow & Grow Guides","Every plant includes detailed growing tips, whether to transplant or direct sow, planting depth, and in-depth specialty advice."],
          ].map(([icon,title,desc],i)=>(
            <article key={i} style={{padding:20,background:"#fff",borderRadius:12,border:"1px solid #e0d8cf",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:28,marginBottom:8}}>{icon}</div>
              <h3 style={{fontSize:15,fontWeight:700,marginBottom:6,color:"#1a1a1a"}}>{title}</h3>
              <p style={{fontSize:13,color:"#555",lineHeight:1.5}}>{desc}</p>
            </article>
          ))}
        </div>
      </section>
      {/* How to use */}
      <section style={{padding:"32px 24px 40px",maxWidth:800,margin:"0 auto"}}>
        <h2 style={{textAlign:"center",fontSize:24,fontWeight:700,marginBottom:24,color:"#1a1a1a"}}>How to Use GardenGridDesign</h2>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            ["1️⃣","Choose your beds","Click the Beds tab, pick a bed type (raised, container, grow bag, in-ground, or trellis), then click the canvas to place it. Use custom beds and drag the corner or edge handles to resize."],
            ["2️⃣","Add your plants","Click the Plants tab, search or browse by category, then click inside a bed to place. Spacing circles show you exactly how much room each plant needs."],
            ["3️⃣","Check companions","Green circles mean companion plants are helping each other. Orange or red means they're too close. Use the info panel to see full companion and avoid lists."],
            ["4️⃣","Set your zone","Select your USDA hardiness zone in the top bar. Plants incompatible with your zone are dimmed. The info panel shows zone-specific guidance."],
            ["5️⃣","Ask Sprout","Click the chat bubble to ask the AI assistant about planting schedules, pest control, soil prep, or any garden question."],
            ["6️⃣","Save and share","Your garden auto-saves in your browser. Download as a .json file to backup or share, or export as a PNG to print and hang in your shed."],
          ].map(([num,title,desc],i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:12,background:"#fff",borderRadius:8,border:"1px solid #e0d8cf"}}>
              <span style={{fontSize:20,flexShrink:0}}>{num}</span>
              <div><div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{title}</div><div style={{fontSize:13,color:"#555",lineHeight:1.5}}>{desc}</div></div>
            </div>
          ))}
        </div>
      </section>
      {/* CTA */}
      <section style={{textAlign:"center",padding:"40px 24px",background:"#eef3eb"}}>
        <h2 style={{fontSize:24,fontWeight:700,marginBottom:12}}>Ready to Grow?</h2>
        <p style={{fontSize:14,color:"#555",marginBottom:20}}>Start designing your garden in seconds — no account needed.</p>
        <button onClick={()=>setShowLanding(false)} style={{padding:"14px 36px",background:"#6b8f5e",color:"#fff",border:"none",borderRadius:10,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(107,143,94,.3)"}}>Launch Garden Planner</button>
      </section>
      {/* Footer */}
      <footer style={{padding:"24px",textAlign:"center",borderTop:"1px solid #e0d8cf",color:"#999",fontSize:12}}>
        <p>© {new Date().getFullYear()} GardenGridDesign. All rights reserved.</p>
        <p style={{marginTop:8}}>🏷️ <strong style={{color:"#276749"}}>This Domain Is For Sale</strong> — <a href="mailto:contact@gardengriddesign.com" style={{color:"#6b8f5e"}}>Contact Us</a></p>
      </footer>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100vw",fontFamily:"'DM Sans',system-ui,sans-serif",background:T.bg,color:T.text,overflow:"hidden",fontSize:13}} onMouseMove={onMove} onMouseUp={onUp} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
    {showLanding&&<LandingPage/>}
    {/* Domain for sale banner */}
    <div style={{background:"#276749",color:"#fff",textAlign:"center",padding:"4px 16px",fontSize:10,fontWeight:600,flexShrink:0,letterSpacing:".3px"}}>
      🏷️ This Domain Is For Sale — <a href="mailto:contact@gardengriddesign.com" style={{color:"#9ae6b4",textDecoration:"underline"}}>Contact Us</a>
    </div>
    {/* HEADER */}
    <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",height:46,borderBottom:`1px solid ${T.hBorder}`,background:T.head,flexShrink:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill={T.accent}/><path d="M11 4 Q7 8 8 14 Q11 11 14 14 Q15 8 11 4Z" fill="#fff"/></svg>
        <input value={projectName} onChange={e=>setProjectName(e.target.value)} style={{border:"none",fontSize:15,fontWeight:700,background:"transparent",color:T.text,width:200,outline:"none"}}/>
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowDLMenu(d=>!d)} title="Download project" style={{width:28,height:28,border:`1px solid ${T.border}`,borderRadius:4,background:showDLMenu?T.accentL:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M7 9L4 6M7 9l3-3M2 12h10" stroke={T.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {showDLMenu&&<div style={{position:"absolute",top:32,left:0,background:"#fff",border:`1px solid ${T.border}`,borderRadius:8,padding:4,boxShadow:"0 4px 16px rgba(0,0,0,.08)",zIndex:200,width:140}}>
            <button onClick={saveProject} style={{display:"block",width:"100%",padding:"6px 10px",border:"none",background:"transparent",cursor:"pointer",fontSize:11,fontWeight:600,textAlign:"left",color:T.text,borderRadius:4}} onMouseEnter={e=>e.target.style.background=T.accentL} onMouseLeave={e=>e.target.style.background="transparent"}>💾 Save as .json</button>
            <button onClick={exportPNG} style={{display:"block",width:"100%",padding:"6px 10px",border:"none",background:"transparent",cursor:"pointer",fontSize:11,fontWeight:600,textAlign:"left",color:T.text,borderRadius:4}} onMouseEnter={e=>e.target.style.background=T.accentL} onMouseLeave={e=>e.target.style.background="transparent"}>🖼 Export as .png</button>
          </div>}
        </div>
        <button onClick={()=>fileRef.current?.click()} title="Upload project" style={{width:28,height:28,border:`1px solid ${T.border}`,borderRadius:4,background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 9V1M7 1L4 4M7 1l3 3M2 12h10" stroke={T.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <input ref={fileRef} type="file" accept=".json,.ggd.json" onChange={loadProject} style={{display:"none"}}/>
        <button onClick={resetGarden} title="Reset garden" style={{width:28,height:28,border:"1px solid #fed7d7",borderRadius:4,background:"#fff5f5",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="#e53e3e" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <select value={usdaZone} onChange={e=>setUsdaZone(e.target.value)} style={{padding:"4px 6px",border:`1px solid ${T.border}`,borderRadius:5,fontSize:10,fontWeight:700,background:usdaZone?T.accentL:"#fff",color:T.text,cursor:"pointer",outline:"none"}}>
          <option value="">USDA Zone</option>
          {USDA_ZONES.map(z=><option key={z} value={z}>Zone {z}</option>)}
        </select>
        <div style={{display:"flex",background:"#ebe6df",borderRadius:5,overflow:"hidden",fontSize:10}}>
          <button onClick={()=>setUnit("imperial")} style={{padding:"4px 10px",border:"none",cursor:"pointer",fontWeight:700,background:unit==="imperial"?T.accent:"transparent",color:unit==="imperial"?"#fff":T.textM}}>ft/in</button>
          <button onClick={()=>setUnit("metric")} style={{padding:"4px 10px",border:"none",cursor:"pointer",fontWeight:700,background:unit==="metric"?T.accent:"transparent",color:unit==="metric"?"#fff":T.textM}}>cm/m</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:3,marginLeft:4}}>
          <button onClick={()=>setZoom(z=>Math.max(.15,z-.12))} style={{width:26,height:26,border:`1px solid ${T.border}`,borderRadius:4,background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",color:T.text}}>−</button>
          <span style={{fontSize:10,fontWeight:700,width:36,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(4,z+.12))} style={{width:26,height:26,border:`1px solid ${T.border}`,borderRadius:4,background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",color:T.text}}>+</button>
          <button onClick={()=>{setZoom(.75);setPan({x:40,y:40});}} style={{width:26,height:26,border:`1px solid ${T.border}`,borderRadius:4,background:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",color:T.text}} title="Reset">⟲</button>
        </div>
        <div style={{position:"relative"}}><button onClick={()=>setShowCS(s=>!s)} style={{padding:"4px 10px",border:`1px solid ${T.border}`,borderRadius:5,background:showCS?T.accentL:"#fff",cursor:"pointer",fontSize:10,fontWeight:700,color:T.textM}}>Canvas ▾</button>{showCS&&<div style={{position:"absolute",top:30,right:0,background:"#fff",border:`1px solid ${T.border}`,borderRadius:8,padding:12,boxShadow:"0 4px 16px rgba(0,0,0,.08)",zIndex:200,width:200}}><div style={{fontSize:11,fontWeight:700,marginBottom:6,color:T.text}}>Canvas Size</div><div style={{display:"flex",gap:8}}><label style={{fontSize:11,color:T.text}}>W:<input type="number" value={unit==="metric"?Math.round(canvasSize.w*2.54/100):canvasSize.w/12} onChange={e=>{const v=Number(e.target.value);setCanvasSize(s=>({...s,w:unit==="metric"?Math.round(v*100/2.54):v*12}));}} style={{width:48,border:`1px solid ${T.border}`,borderRadius:4,padding:"2px 4px",fontSize:12,color:T.text}} min={1}/></label><label style={{fontSize:11,color:T.text}}>H:<input type="number" value={unit==="metric"?Math.round(canvasSize.h*2.54/100):canvasSize.h/12} onChange={e=>{const v=Number(e.target.value);setCanvasSize(s=>({...s,h:unit==="metric"?Math.round(v*100/2.54):v*12}));}} style={{width:48,border:`1px solid ${T.border}`,borderRadius:4,padding:"2px 4px",fontSize:12,color:T.text}} min={1}/></label></div><div style={{display:"flex",gap:3,marginTop:8,flexWrap:"wrap"}}>{[{l:"10×10",w:120,h:120},{l:"20×20",w:240,h:240},{l:"30×40",w:360,h:480},{l:"50×50",w:600,h:600}].map(p=><button key={p.l} onClick={()=>setCanvasSize({w:p.w,h:p.h})} style={{padding:"2px 7px",border:`1px solid ${T.border}`,borderRadius:4,background:"#faf8f5",cursor:"pointer",fontSize:10,color:T.text}}>{p.l}ft</button>)}</div></div>}</div>
        <div style={{width:1,height:22,background:T.border,margin:"0 4px"}}/>
        <span onClick={()=>setShowLanding(true)} style={{fontSize:13,fontWeight:800,color:T.accent,letterSpacing:"-.3px",cursor:"pointer"}}>GardenGridDesign</span>

      </div>
    </header>

    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {/* SIDEBAR */}
      {/* Mobile open toggle */}
      {!sideOpen&&<button onClick={()=>setSideOpen(true)} style={{position:"absolute",top:52,left:4,zIndex:90,width:40,height:40,borderRadius:8,background:T.accent,color:"#fff",border:"none",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>☰</button>}
      <aside style={{width:sideOpen?(typeof window!=="undefined"&&window.innerWidth<768?Math.min(280,window.innerWidth*.75):255):0,minWidth:sideOpen?(typeof window!=="undefined"&&window.innerWidth<768?Math.min(280,window.innerWidth*.75):255):0,borderRight:sideOpen?`1px solid ${T.border}`:"none",display:"flex",flexDirection:"column",background:T.side,flexShrink:0,overflow:"hidden",transition:"width .2s,min-width .2s",position:"relative",zIndex:60}}>
        {sideOpen&&<button onClick={()=>setSideOpen(false)} style={{position:"absolute",top:6,right:6,zIndex:10,width:28,height:28,borderRadius:6,background:"rgba(0,0,0,.06)",border:"none",cursor:"pointer",fontSize:16,color:T.textM,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`}}>
          {[["🌱 Plants","plants"],["📐 Beds","beds"]].map(([l,k])=><button key={k} onClick={()=>setSideTab(k)} style={{flex:1,padding:"8px 0",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:sideTab===k?T.accentL:T.side,color:sideTab===k?T.accentD:T.textL,borderBottom:sideTab===k?`2px solid ${T.accent}`:"2px solid transparent"}}>{l}</button>)}
        </div>
        {sideTab==="plants"?<React.Fragment>
          <div style={{padding:"8px 10px",borderBottom:`1px solid ${T.border}`}}><div style={{position:"relative"}}><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search plants..." style={{width:"100%",padding:"8px 32px 8px 32px",border:`1px solid ${T.border}`,borderRadius:6,fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff",color:T.text}}/><span style={{position:"absolute",left:10,top:8,fontSize:14,color:"#bbb"}}>🔍</span>{searchQ&&<button onClick={()=>setSearchQ("")} style={{position:"absolute",right:8,top:6,background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#999",padding:0}}>✕</button>}</div></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:2,padding:"5px 8px",borderBottom:`1px solid ${T.border}`}}>{CATS.map(c=><button key={c} onClick={()=>setPlantCat(c)} style={{padding:"2px 7px",border:`1px solid ${plantCat===c?T.accent:T.border}`,borderRadius:8,fontSize:9,fontWeight:700,cursor:"pointer",background:plantCat===c?T.accentL:"#fff",color:plantCat===c?T.accentD:T.textL}}>{c}</button>)}</div>
          {activeTool?.type==="plant"&&<div style={{padding:"5px 8px",background:T.accentL,borderBottom:"1px solid #d0e0ca",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:T.accentD}}>📍 {activeTool.data.name}</span><button onClick={()=>setActiveTool(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#e53e3e"}}>✕</button></div>}
          <div style={{flex:1,overflowY:"auto",padding:"2px 0"}}>{filtered.map(plant=>{const outOfZone=usdaZone&&plant._inZone===false;return <div key={plant.id} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 8px",cursor:"pointer",background:activeTool?.data?.id===plant.id?T.accentL:"transparent",borderLeft:activeTool?.data?.id===plant.id?`3px solid ${T.accent}`:"3px solid transparent",opacity:outOfZone?.45:1}} onClick={()=>setActiveTool(activeTool?.data?.id===plant.id?null:{type:"plant",data:plant})}><PlantSVG plant={plant} size={24}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:T.text}}>{plant.name}{outOfZone&&<span style={{fontSize:8,color:"#e53e3e",marginLeft:4}}>✗ Zone</span>}</div><div style={{fontSize:9,color:T.textL}}>{plant.cat} · {unit==="metric"?toM(plant.spacingIn)+"cm":toFtIn(plant.spacingIn)} · {plant.sow==="transplant"?"🌱Trans.":plant.sow==="direct"?"🌰Direct":"🌱/🌰Both"}{plant.zones?` · Z${plant.zones[0]}–${plant.zones[1]}`:""}</div></div><button onClick={e=>{e.stopPropagation();setPInfo(plant);}} style={{width:20,height:20,border:`1px solid ${T.border}`,borderRadius:3,background:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.textM}}>i</button></div>})}{filtered.length===0&&<div style={{padding:20,textAlign:"center",color:T.textL,fontSize:12}}>No plants found</div>}</div>
        </React.Fragment>:<React.Fragment>
          <div style={{display:"flex",flexWrap:"wrap",gap:2,padding:"6px 8px",borderBottom:`1px solid ${T.border}`}}>{BCATS.map(c=><button key={c} onClick={()=>setBedCat(c)} style={{padding:"2px 7px",border:`1px solid ${bedCat===c?T.accent:T.border}`,borderRadius:8,fontSize:9,fontWeight:700,cursor:"pointer",background:bedCat===c?T.accentL:"#fff",color:bedCat===c?T.accentD:T.textL}}>{c}</button>)}</div>
          {activeTool?.type==="bed"&&<div style={{padding:"5px 8px",background:T.accentL,borderBottom:"1px solid #d0e0ca",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:T.accentD}}>📍 {activeTool.data.name}</span><button onClick={()=>setActiveTool(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#e53e3e"}}>✕</button></div>}
          <div style={{flex:1,overflowY:"auto",padding:"2px 0"}}>{fBeds.map(bed=>{const dim=unit==="metric"?`${toM(bed.wIn)}×${toM(bed.hIn)}cm`:`${toFtIn(bed.wIn)} × ${toFtIn(bed.hIn)}`;return <div key={bed.id} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",cursor:"pointer",background:activeTool?.data?.id===bed.id?T.accentL:"transparent",borderLeft:activeTool?.data?.id===bed.id?`3px solid ${T.accent}`:"3px solid transparent"}} onClick={()=>setActiveTool(activeTool?.data?.id===bed.id?null:{type:"bed",data:bed})}><div style={{width:26,height:26,border:`2px ${bed.cat==="Grow Bag"?"dashed":bed.trellis?"dotted":"solid"} ${bed.matBorder}`,background:bed.trellis?"rgba(139,115,85,.08)":bed.matColor+"25",borderRadius:bed.shape==="rect"?3:"50%",flexShrink:0}}/><div><div style={{fontSize:11,fontWeight:600,color:T.text}}>{bed.name}{bed.custom&&<span style={{fontSize:9,color:T.accent}}> ✎</span>}</div><div style={{fontSize:9,color:T.textL}}>{dim}</div></div></div>;})}</div>
        </React.Fragment>}
        <div style={{height:28,background:`linear-gradient(to top, ${T.accentL}, transparent)`,borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:T.textL}}>🌿 {plants.length} plants · {beds.length} beds</span></div>
      </aside>

      {/* CANVAS */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div ref={wr} style={{flex:1,overflow:"hidden",background:T.canBg,cursor:activeTool?"crosshair":isPan?"grabbing":"default",position:"relative",userSelect:"none",touchAction:"none"}} onMouseDown={onDown} onContextMenu={onContext} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <RulerX/><RulerY/>
          {selId&&<div style={{position:"absolute",top:24,left:"50%",transform:"translateX(-50%)",zIndex:50,display:"flex",gap:6,background:"#fff",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 12px",boxShadow:"0 2px 10px rgba(0,0,0,.06)",alignItems:"center"}}>
            <button onClick={()=>{const pl=plants.find(x=>x.id===selId);if(pl){setClipboard({type:"plant",data:{pid:pl.pid}});return;}const bd=beds.find(x=>x.id===selId);if(bd)setClipboard({type:"bed",data:{bid:bd.bid,wIn:bd.wIn,hIn:bd.hIn,custom:bd.custom}});}} style={{padding:"3px 8px",border:`1px solid ${T.border}`,borderRadius:4,background:"#fff",cursor:"pointer",fontSize:10,fontWeight:600,color:T.textM}}>📋 Copy</button>
            <span style={{fontSize:10,color:T.textM,fontWeight:600}}>Drag to 🗑 to delete</span>
          </div>}
          {clipboard&&!selId&&<div style={{position:"absolute",top:24,right:12,zIndex:50,background:"#fff",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 10px",boxShadow:"0 2px 10px rgba(0,0,0,.06)",display:"flex",gap:4,alignItems:"center"}}>
            <span style={{fontSize:10,color:T.accent,fontWeight:600}}>📋 {clipboard.type==="plant"?PLANTS.find(p=>p.id===clipboard.data.pid)?.name:"Bed"} copied</span>
            <button onClick={()=>{const cx=canvasSize.w*PX/2,cy=canvasSize.h*PX/2;if(clipboard.type==="plant")setPlants(pr=>[...pr,{id:uid(),pid:clipboard.data.pid,x:snap(cx),y:snap(cy)}]);if(clipboard.type==="bed")setBeds(pr=>[...pr,{id:uid(),bid:clipboard.data.bid,x:snap(cx),y:snap(cy),wIn:clipboard.data.wIn,hIn:clipboard.data.hIn,custom:clipboard.data.custom||false}]);}} style={{padding:"3px 8px",border:`1px solid ${T.accent}`,borderRadius:4,background:T.accentL,cursor:"pointer",fontSize:10,fontWeight:700,color:T.accentD}}>Paste</button>
            <button onClick={()=>setClipboard(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.textL}}>✕</button>
          </div>}
          {showTrash&&<div style={{position:"absolute",bottom:12,left:12,zIndex:50,width:96,height:96,borderRadius:16,background:trashH?"#fed7d7":"rgba(255,255,255,.9)",border:`2px dashed ${trashH?"#e53e3e":"#cbd5e0"}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",transition:"all .15s",transform:trashH?"scale(1.1)":"scale(1)"}}><span style={{fontSize:36}}>🗑</span><span style={{fontSize:10,color:trashH?"#e53e3e":"#999",fontWeight:700}}>Drop to delete</span></div>}
          <div style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:"0 0",width:cW,height:cH,position:"relative",background:"linear-gradient(135deg,#8a9e5a 0%,#7d9450 15%,#95a86a 30%,#6d843f 45%,#8a9e5a 60%,#7a8f4d 75%,#92a565 90%,#6d843f 100%)",boxShadow:"0 1px 8px rgba(0,0,0,.08)"}}>
            {/* Grid lines — behind everything */}
            <svg style={{position:"absolute",top:0,left:0,width:cW,height:cH,pointerEvents:"none",zIndex:0}}>{gridSVG}</svg>
            {/* Beds — pointer-events disabled when placing plants */}
            <div style={{position:"absolute",top:0,left:0,width:cW,height:cH,pointerEvents:activeTool?"none":"auto",zIndex:1}}>
              {beds.map(renderBed)}
            </div>
            {/* Spacing radius circles — on top of beds */}
            <svg style={{position:"absolute",top:0,left:0,width:cW,height:cH,pointerEvents:"none",zIndex:8}}>
              {plants.map(pl=>{const p=PLANTS.find(x=>x.id===pl.pid);if(!p)return null;const sel=selId===pl.id;const rel=plantRelations.get(pl.id);const r=(p.spacingIn/2)*PX;const col=rel==="red"?"rgba(220,38,38,.12)":rel==="orange"?"rgba(237,137,54,.12)":rel==="companion"?"rgba(34,197,94,.18)":sel?"rgba(66,153,225,.12)":"rgba(255,255,255,.08)";const sc=rel==="red"?"#dc2626":rel==="orange"?"#ed8936":rel==="companion"?"#16a34a":sel?"#4299e1":"rgba(255,255,255,.3)";return <circle key={pl.id} cx={pl.x+14} cy={pl.y+14} r={r} fill={col} stroke={sc} strokeWidth={sel||rel?1.5:.6} strokeDasharray={sel||rel?"none":"4 2"}/>;})}
            </svg>
            {/* Plant icons — on top of everything */}
            {plants.map(pl=>{const p=PLANTS.find(x=>x.id===pl.pid);if(!p)return null;const sel=selId===pl.id;return <div key={pl.id} data-plant-id={pl.id} style={{position:"absolute",left:pl.x,top:pl.y,width:28,height:28,cursor:drag?.id===pl.id?"grabbing":"grab",zIndex:sel?20:10,filter:sel?"drop-shadow(0 0 3px #4299e1)":"drop-shadow(0 1px 2px rgba(0,0,0,.3))",touchAction:"none"}} onMouseDown={e=>sdp(e,pl)} onTouchStart={e=>sdpTouch(e,pl)} title={p.name}><PlantSVG plant={p} size={28}/>{sel&&<div style={{position:"absolute",top:-16,left:-4,background:"#fff",border:"1px solid #ddd",borderRadius:3,padding:"1px 5px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",color:"#1a1a1a"}}>{p.name}</div>}</div>;})}
          </div>

          {/* CHAT */}
          <div ref={chatRef} className="noc" style={{position:"absolute",bottom:12,right:12,zIndex:80}}>
            {chatOpen&&<div style={{position:"absolute",bottom:52,right:0,width:300,height:380,background:"#fff",border:`1px solid ${T.border}`,borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,.1)",display:"flex",flexDirection:"column",overflow:"hidden"}} onWheel={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}>
              {/* Tab header */}
              <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
                <button onClick={()=>setChatMode("ai")} style={{flex:1,padding:"8px 0",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:chatMode==="ai"?T.accentL:"#fff",color:chatMode==="ai"?T.accentD:T.textL,borderBottom:chatMode==="ai"?`2px solid ${T.accent}`:"2px solid transparent"}}>🌱 Sprout</button>
                <button onClick={()=>setChatMode("feedback")} style={{flex:1,padding:"8px 0",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:chatMode==="feedback"?"#fff5f0":"#fff",color:chatMode==="feedback"?"#c53030":T.textL,borderBottom:chatMode==="feedback"?"2px solid #ed8936":"2px solid transparent"}}>📩 Feedback</button>
                <button onClick={e=>{e.stopPropagation();setChatOpen(false);}} style={{width:32,background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#999",flexShrink:0}}>✕</button>
              </div>

              {chatMode==="ai" ? (
                <React.Fragment>
                  <div ref={cb} style={{flex:1,overflowY:"auto",padding:8}} onWheel={e=>e.stopPropagation()}>
                    {msgs.map((m,i)=>(
                      <div key={i} style={{marginBottom:6,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                        <div style={{maxWidth:"85%",padding:"5px 9px",borderRadius:8,fontSize:11,lineHeight:1.4,background:m.role==="user"?T.accent:"#f5f0eb",color:m.role==="user"?"#fff":"#1a1a1a",border:m.role==="user"?"none":`1px solid ${T.border}`}}>{m.content}</div>
                      </div>
                    ))}
                    {chatBusy&&<div style={{fontSize:11,color:"#bbb",padding:4}}>Thinking...</div>}
                    <div ref={ce}/>
                  </div>
                  <div style={{padding:6,borderTop:`1px solid ${T.border}`,display:"flex",gap:4,flexShrink:0}}>
                    <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==="Enter"){e.preventDefault();sendChat();}}} onMouseDown={e=>e.stopPropagation()} placeholder="Ask about gardening..." style={{flex:1,padding:"5px 8px",border:`1px solid ${T.border}`,borderRadius:5,fontSize:11,outline:"none",color:T.text}}/>
                    <button onClick={e=>{e.stopPropagation();sendChat();}} onMouseDown={e=>e.stopPropagation()} disabled={chatBusy} style={{padding:"5px 10px",background:T.accent,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:700,opacity:chatBusy?.5:1}}>↑</button>
                  </div>
                </React.Fragment>
              ) : (
                <div style={{flex:1,overflowY:"auto",padding:12}} onWheel={e=>e.stopPropagation()}>
                  {fbSent ? (
                    <div style={{textAlign:"center",padding:"40px 16px"}}>
                      <div style={{fontSize:32,marginBottom:8}}>✅</div>
                      <div style={{fontSize:14,fontWeight:700,color:T.accentD,marginBottom:4}}>Message Sent!</div>
                      <div style={{fontSize:12,color:T.textM}}>Thank you for your feedback. We'll get back to you soon.</div>
                    </div>
                  ) : (
                    <React.Fragment>
                      <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:8}}>Send us a message</div>
                      <select value={fbCat} onChange={e=>setFbCat(e.target.value)} onMouseDown={e=>e.stopPropagation()} style={{width:"100%",padding:"6px 8px",border:`1px solid ${T.border}`,borderRadius:5,fontSize:11,marginBottom:6,outline:"none",color:T.text,background:"#fff"}}>
                        <option>General Question</option>
                        <option>Bug Report</option>
                        <option>Feature Request</option>
                        <option>Partnership Inquiry</option>
                        <option>Gardening Help</option>
                      </select>
                      <input value={fbName} onChange={e=>setFbName(e.target.value)} onMouseDown={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} placeholder="Name (optional)" style={{width:"100%",padding:"6px 8px",border:`1px solid ${T.border}`,borderRadius:5,fontSize:11,marginBottom:6,outline:"none",color:T.text,boxSizing:"border-box"}}/>
                      <input value={fbEmail} onChange={e=>setFbEmail(e.target.value)} onMouseDown={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} placeholder="Email (optional, for reply)" style={{width:"100%",padding:"6px 8px",border:`1px solid ${T.border}`,borderRadius:5,fontSize:11,marginBottom:6,outline:"none",color:T.text,boxSizing:"border-box"}}/>
                      <textarea value={fbMsg} onChange={e=>setFbMsg(e.target.value)} onMouseDown={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} placeholder="Your message..." style={{width:"100%",height:80,padding:"6px 8px",border:`1px solid ${T.border}`,borderRadius:5,fontSize:11,outline:"none",resize:"none",fontFamily:"inherit",color:T.text,boxSizing:"border-box"}}/>
                      <button onClick={sendFeedback} disabled={fbSending||!fbMsg.trim()} style={{width:"100%",padding:"8px",background:fbMsg.trim()?T.accent:"#ccc",color:"#fff",border:"none",borderRadius:5,cursor:fbMsg.trim()?"pointer":"default",fontSize:12,fontWeight:700,marginTop:6,opacity:fbSending?.6:1}}>
                        {fbSending?"Sending...":"Send Message"}
                      </button>
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>}
            <button onClick={e=>{e.stopPropagation();setChatOpen(o=>!o);}} onMouseDown={e=>e.stopPropagation()} style={{width:44,height:44,borderRadius:"50%",background:T.accent,color:"#fff",border:"none",cursor:"pointer",boxShadow:`0 2px 12px ${T.accent}50`,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{chatOpen?"✕":"💬"}</button>
          </div>
        </div>

        <div style={{borderTop:`1px solid ${T.border}`,background:"#fff",flexShrink:0}}>
          <div onClick={()=>setNotesC(c=>!c)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 16px",cursor:"pointer",userSelect:"none"}}><span style={{fontSize:11,fontWeight:700,color:T.textM}}>📝 Notes & Comments</span><span style={{fontSize:9,color:T.textL}}>{notesC?"▶":"▼"}</span></div>
          {!notesC&&<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add planting dates, reminders, layout notes..." style={{width:"100%",height:60,border:"none",borderTop:"1px solid #f0f0f0",padding:"6px 16px",fontSize:12,resize:"none",outline:"none",fontFamily:"inherit",color:T.text,boxSizing:"border-box",background:"#faf8f5"}}/>}
        </div>
      </div>
    </div>
    {pInfo&&<InfoPanel plant={pInfo} onClose={()=>setPInfo(null)}/>}
    <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}html,body{touch-action:manipulation;overscroll-behavior:none}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}button:hover{opacity:.88}button:active{transform:scale(.97)}input:focus{border-color:${T.accent}!important}@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
  </div>
  );
}
