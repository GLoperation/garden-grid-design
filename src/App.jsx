import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   MASSIVE PLANT DATABASE — 130+ plants with subspecies, heights
   ═══════════════════════════════════════════════════════════════ */
const PLANTS = [
  // ── TOMATOES ──
  { id:"tomato",name:"Tomato (Beefsteak)",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"70–85",depth:"¼″",season:"Warm",heightIn:72,companions:["Basil","Carrot","Parsley"],avoid:["Cabbage","Fennel"],color:"#e53e3e",icon:"tomato",tip:"Indeterminate. Prune suckers for larger fruit." },
  { id:"cherry_tomato",name:"Cherry Tomato",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"55–70",depth:"¼″",season:"Warm",heightIn:60,companions:["Basil","Chives"],avoid:["Fennel"],color:"#fc8181",icon:"cherry_tomato",tip:"Sun Gold and Sweet 100 are top varieties." },
  { id:"roma_tomato",name:"Roma Tomato",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"70–80",depth:"¼″",season:"Warm",heightIn:48,companions:["Basil","Carrot"],avoid:["Cabbage"],color:"#e53e3e",icon:"tomato",tip:"Determinate paste tomato. San Marzano type." },
  { id:"grape_tomato",name:"Grape Tomato",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"60–70",depth:"¼″",season:"Warm",heightIn:60,companions:["Basil"],avoid:["Fennel"],color:"#fc8181",icon:"cherry_tomato",tip:"Oblong shape. Less prone to cracking." },
  { id:"heirloom_tomato",name:"Heirloom Tomato",cat:"Fruiting",spacingIn:30,sun:"Full",water:"Regular",days:"75–95",depth:"¼″",season:"Warm",heightIn:84,companions:["Basil","Marigold"],avoid:["Cabbage"],color:"#c53030",icon:"tomato",tip:"Brandywine, Cherokee Purple, Green Zebra." },
  { id:"plum_tomato",name:"Plum Tomato",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"70–80",depth:"¼″",season:"Warm",heightIn:48,companions:["Basil","Parsley"],avoid:["Fennel"],color:"#e53e3e",icon:"tomato",tip:"Meaty with few seeds. Great for sauce." },
  // ── PEPPERS ──
  { id:"bell_pepper",name:"Bell Pepper",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"60–90",depth:"¼″",season:"Warm",heightIn:30,companions:["Tomato","Basil","Carrot"],avoid:["Fennel"],color:"#dd6b20",icon:"pepper",tip:"Pick green or wait for color change." },
  { id:"jalapeno",name:"Jalapeño Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"65–80",depth:"¼″",season:"Warm",heightIn:30,companions:["Tomato","Basil"],avoid:["Fennel"],color:"#2f855a",icon:"hot_pepper",tip:"2,500–8,000 SHU. Pick green or red." },
  { id:"habanero",name:"Habanero Pepper",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"90–120",depth:"¼″",season:"Warm",heightIn:36,companions:["Tomato","Cilantro"],avoid:["Fennel"],color:"#ed8936",icon:"hot_pepper",tip:"100,000–350,000 SHU. Very hot." },
  { id:"serrano",name:"Serrano Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"70–85",depth:"¼″",season:"Warm",heightIn:30,companions:["Tomato","Basil"],avoid:["Fennel"],color:"#276749",icon:"hot_pepper",tip:"10,000–25,000 SHU. Hotter than jalapeño." },
  { id:"cayenne",name:"Cayenne Pepper",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"70–85",depth:"¼″",season:"Warm",heightIn:36,companions:["Tomato","Basil"],avoid:["Fennel"],color:"#c53030",icon:"hot_pepper",tip:"30,000–50,000 SHU. Great for drying." },
  { id:"poblano",name:"Poblano Pepper",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"65–80",depth:"¼″",season:"Warm",heightIn:30,companions:["Tomato","Basil"],avoid:["Fennel"],color:"#276749",icon:"pepper",tip:"1,000–2,000 SHU. Dried = ancho chile." },
  { id:"banana_pepper",name:"Banana Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"60–75",depth:"¼″",season:"Warm",heightIn:24,companions:["Tomato"],avoid:["Fennel"],color:"#ecc94b",icon:"pepper",tip:"Mild sweet pepper. Great for pickling." },
  { id:"thai_pepper",name:"Thai Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"70–90",depth:"¼″",season:"Warm",heightIn:18,companions:["Basil"],avoid:["Fennel"],color:"#c53030",icon:"hot_pepper",tip:"50,000–100,000 SHU. Compact plant." },
  { id:"ghost_pepper",name:"Ghost Pepper",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Moderate",days:"120–150",depth:"¼″",season:"Warm",heightIn:42,companions:["Tomato"],avoid:["Fennel"],color:"#9b2c2c",icon:"hot_pepper",tip:"1,000,000+ SHU. Extremely hot." },
  { id:"shishito",name:"Shishito Pepper",cat:"Fruiting",spacingIn:14,sun:"Full",water:"Moderate",days:"60–75",depth:"¼″",season:"Warm",heightIn:24,companions:["Tomato","Basil"],avoid:[],color:"#48bb78",icon:"pepper",tip:"Mild. 1 in 10 is spicy surprise." },
  // ── CUCURBITS ──
  { id:"eggplant",name:"Eggplant",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"65–80",depth:"¼″",season:"Warm",heightIn:36,companions:["Pepper","Bean"],avoid:["Fennel"],color:"#6b46c1",icon:"eggplant",tip:"Harvest when skin is glossy." },
  { id:"japanese_eggplant",name:"Japanese Eggplant",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Regular",days:"60–70",depth:"¼″",season:"Warm",heightIn:30,companions:["Pepper","Bean"],avoid:["Fennel"],color:"#553c9a",icon:"eggplant",tip:"Long thin shape. Fewer seeds." },
  { id:"cucumber",name:"Slicing Cucumber",cat:"Fruiting",spacingIn:36,sun:"Full",water:"Frequent",days:"50–70",depth:"1″",season:"Warm",heightIn:72,companions:["Bean","Pea","Radish"],avoid:["Potato","Sage"],color:"#48bb78",icon:"cucumber",tip:"Trellis to save space." },
  { id:"pickling_cuke",name:"Pickling Cucumber",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Frequent",days:"48–65",depth:"1″",season:"Warm",heightIn:48,companions:["Bean","Dill"],avoid:["Potato"],color:"#38a169",icon:"cucumber",tip:"Harvest small for best pickles." },
  { id:"zucchini",name:"Zucchini",cat:"Fruiting",spacingIn:36,sun:"Full",water:"Regular",days:"45–65",depth:"1″",season:"Warm",heightIn:30,companions:["Corn","Bean"],avoid:["Potato"],color:"#68d391",icon:"zucchini",tip:"Harvest at 6–8 inches." },
  { id:"yellow_squash",name:"Yellow Squash",cat:"Fruiting",spacingIn:36,sun:"Full",water:"Regular",days:"45–65",depth:"1″",season:"Warm",heightIn:30,companions:["Corn","Bean"],avoid:["Potato"],color:"#ecc94b",icon:"zucchini",tip:"Crookneck or straightneck." },
  { id:"butternut",name:"Butternut Squash",cat:"Fruiting",spacingIn:48,sun:"Full",water:"Regular",days:"80–110",depth:"1″",season:"Warm",heightIn:24,companions:["Corn","Bean"],avoid:["Potato"],color:"#ed8936",icon:"squash",tip:"Cure 2 weeks in sun after harvest." },
  { id:"acorn_squash",name:"Acorn Squash",cat:"Fruiting",spacingIn:48,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:24,companions:["Corn","Bean"],avoid:["Potato"],color:"#276749",icon:"squash",tip:"Dark green skin. Orange flesh." },
  { id:"spaghetti_squash",name:"Spaghetti Squash",cat:"Fruiting",spacingIn:48,sun:"Full",water:"Regular",days:"90–110",depth:"1″",season:"Warm",heightIn:24,companions:["Corn","Bean"],avoid:["Potato"],color:"#ecc94b",icon:"squash",tip:"Stringy flesh replaces pasta." },
  { id:"delicata_squash",name:"Delicata Squash",cat:"Fruiting",spacingIn:36,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:18,companions:["Corn","Bean"],avoid:["Potato"],color:"#faf089",icon:"squash",tip:"Edible skin. Sweet flavor." },
  { id:"pumpkin",name:"Pumpkin",cat:"Fruiting",spacingIn:60,sun:"Full",water:"Regular",days:"90–120",depth:"1″",season:"Warm",heightIn:24,companions:["Corn","Bean"],avoid:["Potato"],color:"#dd6b20",icon:"pumpkin",tip:"Needs lots of space to vine." },
  { id:"pie_pumpkin",name:"Pie Pumpkin",cat:"Fruiting",spacingIn:48,sun:"Full",water:"Regular",days:"85–100",depth:"1″",season:"Warm",heightIn:20,companions:["Corn","Bean"],avoid:["Potato"],color:"#ed8936",icon:"pumpkin",tip:"Sugar Pie variety. Best for baking." },
  { id:"corn",name:"Sweet Corn",cat:"Fruiting",spacingIn:12,sun:"Full",water:"Regular",days:"60–100",depth:"1–2″",season:"Warm",heightIn:84,companions:["Bean","Squash"],avoid:["Tomato"],color:"#ecc94b",icon:"corn",tip:"Plant in 4×4 blocks for pollination." },
  { id:"popcorn",name:"Popcorn",cat:"Fruiting",spacingIn:12,sun:"Full",water:"Regular",days:"90–110",depth:"1–2″",season:"Warm",heightIn:84,companions:["Bean","Squash"],avoid:["Tomato"],color:"#d69e2e",icon:"corn",tip:"Let ears dry on stalk." },
  { id:"okra",name:"Okra",cat:"Fruiting",spacingIn:18,sun:"Full",water:"Moderate",days:"50–65",depth:"1″",season:"Warm",heightIn:60,companions:["Pepper","Melon"],avoid:[],color:"#68d391",icon:"bean",tip:"Harvest pods at 3–4 inches." },
  { id:"tomatillo",name:"Tomatillo",cat:"Fruiting",spacingIn:24,sun:"Full",water:"Regular",days:"60–80",depth:"¼″",season:"Warm",heightIn:48,companions:["Basil","Parsley"],avoid:["Fennel"],color:"#48bb78",icon:"tomato",tip:"Needs 2+ plants for cross-pollination." },
  // ── LEAFY GREENS ──
  { id:"lettuce",name:"Butterhead Lettuce",cat:"Leafy",spacingIn:8,sun:"Partial",water:"Regular",days:"45–60",depth:"⅛″",season:"Cool",heightIn:8,companions:["Carrot","Radish"],avoid:["Celery"],color:"#68d391",icon:"lettuce",tip:"Soft tender leaves. Bibb type." },
  { id:"romaine",name:"Romaine Lettuce",cat:"Leafy",spacingIn:8,sun:"Partial",water:"Regular",days:"55–70",depth:"⅛″",season:"Cool",heightIn:12,companions:["Carrot","Radish"],avoid:[],color:"#48bb78",icon:"lettuce",tip:"Upright heads. Cut-and-come-again." },
  { id:"leaf_lettuce",name:"Leaf Lettuce",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"30–50",depth:"⅛″",season:"Cool",heightIn:8,companions:["Carrot","Radish"],avoid:[],color:"#9ae6b4",icon:"lettuce",tip:"Red or green loose leaves. Fastest lettuce." },
  { id:"iceberg",name:"Iceberg Lettuce",cat:"Leafy",spacingIn:12,sun:"Full",water:"Regular",days:"70–80",depth:"⅛″",season:"Cool",heightIn:8,companions:["Carrot"],avoid:[],color:"#c6f6d5",icon:"lettuce",tip:"Needs consistent cool temps." },
  { id:"spinach",name:"Spinach",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"35–50",depth:"½″",season:"Cool",heightIn:8,companions:["Strawberry","Pea"],avoid:["Fennel"],color:"#2f855a",icon:"spinach",tip:"Bolts in heat; grow in cool months." },
  { id:"malabar_spinach",name:"Malabar Spinach",cat:"Leafy",spacingIn:12,sun:"Full",water:"Regular",days:"55–70",depth:"½″",season:"Warm",heightIn:120,companions:["Tomato"],avoid:[],color:"#276749",icon:"spinach",tip:"Heat-loving vine spinach. Tropical." },
  { id:"kale",name:"Curly Kale",cat:"Leafy",spacingIn:18,sun:"Full",water:"Regular",days:"55–75",depth:"½″",season:"Cool",heightIn:24,companions:["Beet","Celery"],avoid:["Strawberry"],color:"#276749",icon:"kale",tip:"Frost makes it sweeter." },
  { id:"lacinato_kale",name:"Lacinato Kale",cat:"Leafy",spacingIn:18,sun:"Full",water:"Regular",days:"55–75",depth:"½″",season:"Cool",heightIn:30,companions:["Beet","Celery"],avoid:["Strawberry"],color:"#22543d",icon:"kale",tip:"Dinosaur kale. Flat blue-green leaves." },
  { id:"arugula",name:"Arugula",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"21–40",depth:"¼″",season:"Cool",heightIn:10,companions:["Carrot","Lettuce"],avoid:[],color:"#48bb78",icon:"arugula",tip:"Peppery. Pick young for mild flavor." },
  { id:"chard",name:"Swiss Chard (Rainbow)",cat:"Leafy",spacingIn:12,sun:"Full",water:"Regular",days:"50–60",depth:"½″",season:"Cool",heightIn:18,companions:["Bean","Onion"],avoid:["Corn"],color:"#e53e3e",icon:"chard",tip:"Colorful stems. Cut outer leaves." },
  { id:"collards",name:"Collard Greens",cat:"Leafy",spacingIn:18,sun:"Full",water:"Regular",days:"55–75",depth:"½″",season:"Cool",heightIn:30,companions:["Onion","Potato"],avoid:["Strawberry"],color:"#276749",icon:"kale",tip:"Southern staple. Frost sweetened." },
  { id:"bok_choy",name:"Bok Choy",cat:"Leafy",spacingIn:8,sun:"Partial",water:"Regular",days:"30–50",depth:"¼″",season:"Cool",heightIn:12,companions:["Beet","Onion"],avoid:[],color:"#c6f6d5",icon:"cabbage",tip:"Baby bok choy matures in 30 days." },
  { id:"endive",name:"Endive",cat:"Leafy",spacingIn:10,sun:"Partial",water:"Regular",days:"45–60",depth:"¼″",season:"Cool",heightIn:10,companions:["Carrot","Lettuce"],avoid:[],color:"#9ae6b4",icon:"lettuce",tip:"Blanch by tying leaves for mild flavor." },
  { id:"mustard_greens",name:"Mustard Greens",cat:"Leafy",spacingIn:6,sun:"Full",water:"Regular",days:"30–45",depth:"¼″",season:"Cool",heightIn:18,companions:["Lettuce","Onion"],avoid:[],color:"#48bb78",icon:"arugula",tip:"Spicy kick. Red or green varieties." },
  { id:"watercress",name:"Watercress",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Frequent",days:"30–50",depth:"Surface",season:"Cool",heightIn:6,companions:["Mint"],avoid:[],color:"#38a169",icon:"arugula",tip:"Loves wet soil or shallow water." },
  { id:"mizuna",name:"Mizuna",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"21–40",depth:"¼″",season:"Cool",heightIn:10,companions:["Lettuce"],avoid:[],color:"#68d391",icon:"arugula",tip:"Japanese mustard green. Mild peppery." },
  { id:"tatsoi",name:"Tatsoi",cat:"Leafy",spacingIn:6,sun:"Partial",water:"Regular",days:"30–45",depth:"¼″",season:"Cool",heightIn:8,companions:["Lettuce"],avoid:[],color:"#2f855a",icon:"spinach",tip:"Rosette shape. Very cold hardy." },
  // ── BRASSICAS ──
  { id:"cabbage",name:"Green Cabbage",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"70–100",depth:"½″",season:"Cool",heightIn:18,companions:["Bean","Celery","Onion"],avoid:["Strawberry","Tomato"],color:"#9ae6b4",icon:"cabbage",tip:"Mulch to keep roots cool." },
  { id:"red_cabbage",name:"Red Cabbage",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"70–100",depth:"½″",season:"Cool",heightIn:18,companions:["Bean","Celery"],avoid:["Tomato"],color:"#9b2c2c",icon:"cabbage",tip:"Rich in anthocyanins." },
  { id:"napa_cabbage",name:"Napa Cabbage",cat:"Brassica",spacingIn:12,sun:"Full",water:"Regular",days:"50–70",depth:"½″",season:"Cool",heightIn:16,companions:["Bean","Onion"],avoid:["Tomato"],color:"#c6f6d5",icon:"cabbage",tip:"Chinese cabbage. Great for kimchi." },
  { id:"broccoli",name:"Broccoli",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"60–80",depth:"½″",season:"Cool",heightIn:24,companions:["Onion","Celery"],avoid:["Strawberry","Tomato"],color:"#38a169",icon:"broccoli",tip:"Harvest main head before flowers open." },
  { id:"broccolini",name:"Broccolini",cat:"Brassica",spacingIn:12,sun:"Full",water:"Regular",days:"50–65",depth:"½″",season:"Cool",heightIn:18,companions:["Onion","Celery"],avoid:["Tomato"],color:"#48bb78",icon:"broccoli",tip:"Broccoli-gai lan hybrid. Tender stems." },
  { id:"cauliflower",name:"Cauliflower",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"55–80",depth:"½″",season:"Cool",heightIn:18,companions:["Bean","Celery"],avoid:["Strawberry","Tomato"],color:"#fefcbf",icon:"cauliflower",tip:"Blanch by tying leaves over head." },
  { id:"romanesco",name:"Romanesco",cat:"Brassica",spacingIn:18,sun:"Full",water:"Regular",days:"75–100",depth:"½″",season:"Cool",heightIn:18,companions:["Bean","Celery"],avoid:["Tomato"],color:"#9ae6b4",icon:"cauliflower",tip:"Fractal pattern heads. Nutty flavor." },
  { id:"brussels",name:"Brussels Sprouts",cat:"Brassica",spacingIn:24,sun:"Full",water:"Regular",days:"90–120",depth:"½″",season:"Cool",heightIn:30,companions:["Onion","Sage"],avoid:["Strawberry"],color:"#68d391",icon:"brussels",tip:"Frost improves flavor significantly." },
  { id:"kohlrabi",name:"Kohlrabi",cat:"Brassica",spacingIn:6,sun:"Full",water:"Regular",days:"45–60",depth:"¼″",season:"Cool",heightIn:12,companions:["Beet","Onion"],avoid:["Strawberry"],color:"#c6f6d5",icon:"turnip",tip:"Harvest when tennis-ball sized." },
  // ── ROOT VEGETABLES ──
  { id:"carrot",name:"Carrot (Nantes)",cat:"Root",spacingIn:3,sun:"Full",water:"Moderate",days:"70–80",depth:"¼″",season:"Cool",heightIn:12,companions:["Lettuce","Onion","Tomato"],avoid:["Dill"],color:"#ed8936",icon:"carrot",tip:"Nantes = sweet, blunt-tipped." },
  { id:"danvers_carrot",name:"Carrot (Danvers)",cat:"Root",spacingIn:3,sun:"Full",water:"Moderate",days:"70–80",depth:"¼″",season:"Cool",heightIn:12,companions:["Lettuce","Onion"],avoid:["Dill"],color:"#dd6b20",icon:"carrot",tip:"Danvers = sturdy, handles heavy soil." },
  { id:"baby_carrot",name:"Baby Carrot (Paris)",cat:"Root",spacingIn:2,sun:"Full",water:"Moderate",days:"50–65",depth:"¼″",season:"Cool",heightIn:8,companions:["Lettuce","Radish"],avoid:["Dill"],color:"#ed8936",icon:"carrot",tip:"Round baby carrots. Great for containers." },
  { id:"beet",name:"Beet (Detroit Dark)",cat:"Root",spacingIn:4,sun:"Full",water:"Moderate",days:"50–70",depth:"½″",season:"Cool",heightIn:12,companions:["Onion","Lettuce"],avoid:["Pole Bean"],color:"#9b2c2c",icon:"beet",tip:"Classic red beet. Greens edible too." },
  { id:"golden_beet",name:"Golden Beet",cat:"Root",spacingIn:4,sun:"Full",water:"Moderate",days:"50–65",depth:"½″",season:"Cool",heightIn:12,companions:["Onion","Lettuce"],avoid:["Pole Bean"],color:"#ecc94b",icon:"beet",tip:"Won't stain. Milder and sweeter." },
  { id:"chioggia_beet",name:"Chioggia Beet",cat:"Root",spacingIn:4,sun:"Full",water:"Moderate",days:"50–65",depth:"½″",season:"Cool",heightIn:12,companions:["Onion"],avoid:["Pole Bean"],color:"#fc8181",icon:"beet",tip:"Candy-cane striped interior." },
  { id:"radish",name:"Cherry Belle Radish",cat:"Root",spacingIn:2,sun:"Full",water:"Regular",days:"22–30",depth:"½″",season:"Cool",heightIn:6,companions:["Carrot","Lettuce","Pea"],avoid:[],color:"#fc8181",icon:"radish",tip:"Fastest veggie. 3 week harvest." },
  { id:"daikon",name:"Daikon Radish",cat:"Root",spacingIn:6,sun:"Full",water:"Regular",days:"50–70",depth:"½″",season:"Cool",heightIn:18,companions:["Lettuce","Pea"],avoid:[],color:"#fefcbf",icon:"radish",tip:"Large white radish. Breaks compacted soil." },
  { id:"french_radish",name:"French Breakfast Radish",cat:"Root",spacingIn:2,sun:"Full",water:"Regular",days:"21–28",depth:"½″",season:"Cool",heightIn:6,companions:["Carrot","Lettuce"],avoid:[],color:"#fc8181",icon:"radish",tip:"Elongated. Mild flavor." },
  { id:"watermelon_radish",name:"Watermelon Radish",cat:"Root",spacingIn:4,sun:"Full",water:"Regular",days:"50–65",depth:"½″",season:"Cool",heightIn:10,companions:["Carrot"],avoid:[],color:"#68d391",icon:"radish",tip:"Green outside, pink inside. Beautiful." },
  { id:"turnip",name:"Turnip",cat:"Root",spacingIn:4,sun:"Full",water:"Regular",days:"45–65",depth:"½″",season:"Cool",heightIn:12,companions:["Pea","Onion"],avoid:[],color:"#fefcbf",icon:"turnip",tip:"Root and greens both edible." },
  { id:"parsnip",name:"Parsnip",cat:"Root",spacingIn:4,sun:"Full",water:"Regular",days:"100–130",depth:"½″",season:"Cool",heightIn:18,companions:["Pea","Lettuce"],avoid:["Carrot"],color:"#fefcbf",icon:"carrot",tip:"Sweetens after frost. Long season crop." },
  { id:"rutabaga",name:"Rutabaga",cat:"Root",spacingIn:8,sun:"Full",water:"Regular",days:"80–100",depth:"½″",season:"Cool",heightIn:14,companions:["Pea","Onion"],avoid:[],color:"#d69e2e",icon:"turnip",tip:"Cabbage-turnip cross. Stores well." },
  { id:"potato",name:"Russet Potato",cat:"Root",spacingIn:12,sun:"Full",water:"Regular",days:"80–120",depth:"4″",season:"Cool",heightIn:24,companions:["Bean","Corn","Cabbage"],avoid:["Tomato","Squash"],color:"#d69e2e",icon:"potato",tip:"Hill soil as stems grow." },
  { id:"red_potato",name:"Red Potato",cat:"Root",spacingIn:12,sun:"Full",water:"Regular",days:"70–90",depth:"4″",season:"Cool",heightIn:24,companions:["Bean","Corn"],avoid:["Tomato"],color:"#e53e3e",icon:"potato",tip:"Waxy texture. Great for roasting." },
  { id:"fingerling",name:"Fingerling Potato",cat:"Root",spacingIn:10,sun:"Full",water:"Regular",days:"80–100",depth:"4″",season:"Cool",heightIn:20,companions:["Bean"],avoid:["Tomato"],color:"#d69e2e",icon:"potato",tip:"Small elongated gourmet variety." },
  { id:"sweet_potato",name:"Sweet Potato",cat:"Root",spacingIn:12,sun:"Full",water:"Moderate",days:"90–120",depth:"Slip",season:"Warm",heightIn:12,companions:["Bean","Thyme"],avoid:[],color:"#ed8936",icon:"sweet_potato",tip:"Needs 4+ months of warm weather." },
  { id:"ginger",name:"Ginger",cat:"Root",spacingIn:8,sun:"Partial",water:"Regular",days:"240–300",depth:"1″",season:"Warm",heightIn:36,companions:["Bean"],avoid:[],color:"#d69e2e",icon:"potato",tip:"Container grow in cool climates." },
  { id:"turmeric",name:"Turmeric",cat:"Root",spacingIn:8,sun:"Partial",water:"Regular",days:"240–300",depth:"2″",season:"Warm",heightIn:36,companions:["Ginger"],avoid:[],color:"#ed8936",icon:"potato",tip:"Brilliant orange root. Tropical." },
  { id:"horseradish",name:"Horseradish",cat:"Root",spacingIn:18,sun:"Full",water:"Regular",days:"140–160",depth:"2″",season:"Cool",heightIn:24,companions:["Potato"],avoid:[],color:"#fefcbf",icon:"turnip",tip:"Very aggressive — contain it." },
  { id:"sunchoke",name:"Sunchoke",cat:"Root",spacingIn:18,sun:"Full",water:"Moderate",days:"110–130",depth:"4″",season:"Cool",heightIn:96,companions:["Corn"],avoid:[],color:"#ecc94b",icon:"potato",tip:"Perennial tuber. Spreads quickly." },
  // ── ALLIUMS ──
  { id:"yellow_onion",name:"Yellow Onion",cat:"Allium",spacingIn:4,sun:"Full",water:"Moderate",days:"90–120",depth:"1″",season:"Cool",heightIn:18,companions:["Carrot","Lettuce","Beet"],avoid:["Bean","Pea"],color:"#faf089",icon:"onion",tip:"Most common cooking onion." },
  { id:"red_onion",name:"Red Onion",cat:"Allium",spacingIn:4,sun:"Full",water:"Moderate",days:"90–120",depth:"1″",season:"Cool",heightIn:18,companions:["Carrot","Lettuce"],avoid:["Bean"],color:"#9b2c2c",icon:"onion",tip:"Milder. Best raw in salads." },
  { id:"white_onion",name:"White Onion",cat:"Allium",spacingIn:4,sun:"Full",water:"Moderate",days:"90–120",depth:"1″",season:"Cool",heightIn:18,companions:["Carrot","Lettuce"],avoid:["Bean"],color:"#fefcbf",icon:"onion",tip:"Sharp flavor. Mexican cuisine staple." },
  { id:"green_onion",name:"Green Onion / Scallion",cat:"Allium",spacingIn:2,sun:"Full",water:"Moderate",days:"30–60",depth:"½″",season:"Cool",heightIn:12,companions:["Carrot"],avoid:["Bean"],color:"#48bb78",icon:"chives",tip:"Regrows from roots in water." },
  { id:"garlic",name:"Hardneck Garlic",cat:"Allium",spacingIn:6,sun:"Full",water:"Moderate",days:"90–150",depth:"2″",season:"Cool",heightIn:24,companions:["Tomato","Pepper","Lettuce"],avoid:["Bean","Pea"],color:"#fefcbf",icon:"garlic",tip:"Plant Oct. Harvest July. Edible scapes." },
  { id:"softneck_garlic",name:"Softneck Garlic",cat:"Allium",spacingIn:6,sun:"Full",water:"Moderate",days:"90–150",depth:"2″",season:"Cool",heightIn:18,companions:["Tomato","Pepper"],avoid:["Bean","Pea"],color:"#fefcbf",icon:"garlic",tip:"Stores longer. Braidable stems." },
  { id:"elephant_garlic",name:"Elephant Garlic",cat:"Allium",spacingIn:8,sun:"Full",water:"Moderate",days:"90–150",depth:"3″",season:"Cool",heightIn:30,companions:["Tomato"],avoid:["Bean"],color:"#fefcbf",icon:"garlic",tip:"Actually a leek. Very mild garlic flavor." },
  { id:"shallot",name:"Shallot",cat:"Allium",spacingIn:6,sun:"Full",water:"Moderate",days:"90–120",depth:"1″",season:"Cool",heightIn:14,companions:["Carrot","Beet"],avoid:["Bean"],color:"#d69e2e",icon:"onion",tip:"Gourmet favorite. Milder than onion." },
  { id:"leek",name:"Leek",cat:"Allium",spacingIn:6,sun:"Full",water:"Regular",days:"80–120",depth:"½″",season:"Cool",heightIn:24,companions:["Carrot","Celery"],avoid:["Bean"],color:"#c6f6d5",icon:"leek",tip:"Hill soil up stem for white blanching." },
  // ── LEGUMES ──
  { id:"snap_pea",name:"Sugar Snap Pea",cat:"Legume",spacingIn:3,sun:"Full",water:"Moderate",days:"60–75",depth:"1″",season:"Cool",heightIn:60,companions:["Carrot","Radish"],avoid:["Onion"],color:"#68d391",icon:"pea",tip:"Eat pod and all. Needs trellis." },
  { id:"snow_pea",name:"Snow Pea",cat:"Legume",spacingIn:3,sun:"Full",water:"Moderate",days:"55–65",depth:"1″",season:"Cool",heightIn:48,companions:["Carrot","Radish"],avoid:["Onion"],color:"#48bb78",icon:"pea",tip:"Flat edible pods. Stir-fry staple." },
  { id:"shell_pea",name:"Garden Pea (Shell)",cat:"Legume",spacingIn:3,sun:"Full",water:"Moderate",days:"55–70",depth:"1″",season:"Cool",heightIn:36,companions:["Carrot","Corn"],avoid:["Onion","Garlic"],color:"#38a169",icon:"pea",tip:"Shell and eat fresh or frozen." },
  { id:"bush_bean",name:"Bush Bean",cat:"Legume",spacingIn:4,sun:"Full",water:"Moderate",days:"50–60",depth:"1″",season:"Warm",heightIn:20,companions:["Corn","Squash","Carrot"],avoid:["Onion","Garlic"],color:"#38a169",icon:"bean",tip:"No support needed. Compact." },
  { id:"pole_bean",name:"Pole Bean",cat:"Legume",spacingIn:6,sun:"Full",water:"Moderate",days:"55–65",depth:"1″",season:"Warm",heightIn:96,companions:["Corn","Squash"],avoid:["Onion"],color:"#276749",icon:"bean",tip:"Needs 6–8ft trellis or pole." },
  { id:"lima_bean",name:"Lima Bean",cat:"Legume",spacingIn:6,sun:"Full",water:"Moderate",days:"65–80",depth:"1″",season:"Warm",heightIn:24,companions:["Corn","Squash"],avoid:["Onion"],color:"#9ae6b4",icon:"bean",tip:"Needs warm soil above 65°F." },
  { id:"edamame",name:"Edamame",cat:"Legume",spacingIn:6,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:24,companions:["Corn","Potato"],avoid:["Onion"],color:"#48bb78",icon:"pea",tip:"Harvest when pods plump but green." },
  { id:"runner_bean",name:"Scarlet Runner Bean",cat:"Legume",spacingIn:8,sun:"Full",water:"Moderate",days:"60–70",depth:"1″",season:"Warm",heightIn:120,companions:["Corn"],avoid:["Onion"],color:"#e53e3e",icon:"bean",tip:"Ornamental flowers. Edible pods and beans." },
  // ── HERBS ──
  { id:"sweet_basil",name:"Sweet Basil",cat:"Herb",spacingIn:12,sun:"Full",water:"Regular",days:"50–75",depth:"¼″",season:"Warm",heightIn:24,companions:["Tomato","Pepper"],avoid:["Sage"],color:"#48bb78",icon:"basil",tip:"Genovese type. Pinch flowers." },
  { id:"thai_basil",name:"Thai Basil",cat:"Herb",spacingIn:12,sun:"Full",water:"Regular",days:"55–75",depth:"¼″",season:"Warm",heightIn:18,companions:["Tomato","Pepper"],avoid:["Sage"],color:"#6b46c1",icon:"basil",tip:"Anise flavor. Holds up to heat." },
  { id:"purple_basil",name:"Purple Basil",cat:"Herb",spacingIn:12,sun:"Full",water:"Regular",days:"50–75",depth:"¼″",season:"Warm",heightIn:20,companions:["Tomato"],avoid:["Sage"],color:"#6b46c1",icon:"basil",tip:"Ornamental and edible." },
  { id:"lemon_basil",name:"Lemon Basil",cat:"Herb",spacingIn:10,sun:"Full",water:"Regular",days:"50–70",depth:"¼″",season:"Warm",heightIn:18,companions:["Tomato"],avoid:["Sage"],color:"#9ae6b4",icon:"basil",tip:"Citrus flavor. Great for fish dishes." },
  { id:"cilantro",name:"Cilantro / Coriander",cat:"Herb",spacingIn:6,sun:"Partial",water:"Moderate",days:"45–70",depth:"¼″",season:"Cool",heightIn:18,companions:["Lettuce","Tomato"],avoid:[],color:"#68d391",icon:"cilantro",tip:"Bolts fast in heat. Seeds = coriander." },
  { id:"flat_parsley",name:"Flat-Leaf Parsley",cat:"Herb",spacingIn:8,sun:"Partial",water:"Regular",days:"70–90",depth:"¼″",season:"Cool",heightIn:18,companions:["Tomato","Asparagus"],avoid:[],color:"#2f855a",icon:"parsley",tip:"More flavorful than curly. Biennial." },
  { id:"curly_parsley",name:"Curly Parsley",cat:"Herb",spacingIn:8,sun:"Partial",water:"Regular",days:"70–90",depth:"¼″",season:"Cool",heightIn:14,companions:["Tomato","Asparagus"],avoid:[],color:"#38a169",icon:"parsley",tip:"Classic garnish. Hardy." },
  { id:"spearmint",name:"Spearmint",cat:"Herb",spacingIn:18,sun:"Partial",water:"Regular",days:"60–90",depth:"¼″",season:"Cool",heightIn:24,companions:["Tomato","Cabbage"],avoid:[],color:"#38a169",icon:"mint",tip:"ALWAYS container-grow. Very invasive." },
  { id:"peppermint",name:"Peppermint",cat:"Herb",spacingIn:18,sun:"Partial",water:"Regular",days:"60–90",depth:"¼″",season:"Cool",heightIn:24,companions:["Cabbage"],avoid:[],color:"#276749",icon:"mint",tip:"Stronger menthol than spearmint." },
  { id:"rosemary",name:"Rosemary",cat:"Herb",spacingIn:24,sun:"Full",water:"Low",days:"80–120",depth:"Surface",season:"Warm",heightIn:48,companions:["Bean","Carrot","Sage"],avoid:[],color:"#4a7c59",icon:"rosemary",tip:"Drought tolerant. Perennial zone 7+." },
  { id:"thyme",name:"English Thyme",cat:"Herb",spacingIn:12,sun:"Full",water:"Low",days:"70–90",depth:"Surface",season:"Cool",heightIn:12,companions:["Cabbage","Strawberry"],avoid:[],color:"#7c9a6e",icon:"thyme",tip:"Creeping perennial. Ground cover." },
  { id:"lemon_thyme",name:"Lemon Thyme",cat:"Herb",spacingIn:12,sun:"Full",water:"Low",days:"70–90",depth:"Surface",season:"Cool",heightIn:10,companions:["Cabbage"],avoid:[],color:"#9ae6b4",icon:"thyme",tip:"Citrus scent. Great with fish." },
  { id:"oregano",name:"Greek Oregano",cat:"Herb",spacingIn:12,sun:"Full",water:"Low",days:"80–90",depth:"Surface",season:"Warm",heightIn:18,companions:["Pepper","Tomato"],avoid:[],color:"#5a8a4c",icon:"oregano",tip:"Dry for strongest flavor." },
  { id:"dill",name:"Dill",cat:"Herb",spacingIn:12,sun:"Full",water:"Moderate",days:"40–60",depth:"¼″",season:"Cool",heightIn:36,companions:["Lettuce","Cucumber"],avoid:["Carrot"],color:"#9ae6b4",icon:"dill",tip:"Attracts beneficial insects." },
  { id:"chives",name:"Chives",cat:"Herb",spacingIn:6,sun:"Full",water:"Moderate",days:"60–90",depth:"¼″",season:"Cool",heightIn:12,companions:["Carrot","Tomato"],avoid:["Bean"],color:"#9f7aea",icon:"chives",tip:"Purple flowers are edible." },
  { id:"garlic_chives",name:"Garlic Chives",cat:"Herb",spacingIn:6,sun:"Full",water:"Moderate",days:"60–90",depth:"¼″",season:"Cool",heightIn:14,companions:["Carrot","Tomato"],avoid:["Bean"],color:"#fefcbf",icon:"chives",tip:"Flat leaves. White flowers." },
  { id:"sage",name:"Garden Sage",cat:"Herb",spacingIn:24,sun:"Full",water:"Low",days:"75–100",depth:"¼″",season:"Cool",heightIn:24,companions:["Rosemary","Cabbage"],avoid:["Basil"],color:"#a0aec0",icon:"sage",tip:"Woody perennial. Prune spring." },
  { id:"lavender",name:"Lavender",cat:"Herb",spacingIn:18,sun:"Full",water:"Low",days:"90–200",depth:"Surface",season:"Warm",heightIn:24,companions:["Rosemary","Sage"],avoid:[],color:"#9f7aea",icon:"sage",tip:"Edible flowers. Pollinator magnet." },
  { id:"lemongrass",name:"Lemongrass",cat:"Herb",spacingIn:24,sun:"Full",water:"Regular",days:"75–100",depth:"Surface",season:"Warm",heightIn:48,companions:["Tomato"],avoid:[],color:"#ecc94b",icon:"chives",tip:"Tropical. Bring inside in winter." },
  { id:"tarragon",name:"French Tarragon",cat:"Herb",spacingIn:18,sun:"Full",water:"Moderate",days:"60–90",depth:"Surface",season:"Warm",heightIn:24,companions:["Eggplant"],avoid:[],color:"#68d391",icon:"rosemary",tip:"Must propagate by division, not seed." },
  { id:"fennel_h",name:"Herb Fennel",cat:"Herb",spacingIn:12,sun:"Full",water:"Regular",days:"60–90",depth:"¼″",season:"Cool",heightIn:48,companions:[],avoid:["Most plants"],color:"#c6f6d5",icon:"dill",tip:"Allelopathic — keep isolated." },
  { id:"chamomile",name:"Chamomile",cat:"Herb",spacingIn:8,sun:"Full",water:"Moderate",days:"60–65",depth:"Surface",season:"Cool",heightIn:18,companions:["Cabbage","Onion"],avoid:[],color:"#fefcbf",icon:"dill",tip:"Tea from flowers. Self-seeding." },
  { id:"stevia",name:"Stevia",cat:"Herb",spacingIn:12,sun:"Full",water:"Moderate",days:"40–60",depth:"Surface",season:"Warm",heightIn:18,companions:[],avoid:[],color:"#c6f6d5",icon:"basil",tip:"Natural sweetener. 200x sugar." },
  // ── SMALL FRUITS ──
  { id:"strawberry",name:"June-bearing Strawberry",cat:"Fruit",spacingIn:12,sun:"Full",water:"Regular",days:"60–90",depth:"Crown",season:"Cool",heightIn:8,companions:["Lettuce","Spinach","Thyme"],avoid:["Cabbage"],color:"#e53e3e",icon:"strawberry",tip:"One big harvest in June." },
  { id:"everbearing_strawberry",name:"Everbearing Strawberry",cat:"Fruit",spacingIn:12,sun:"Full",water:"Regular",days:"60–90",depth:"Crown",season:"Cool",heightIn:8,companions:["Lettuce","Thyme"],avoid:["Cabbage"],color:"#fc8181",icon:"strawberry",tip:"Produces spring through fall." },
  { id:"alpine_strawberry",name:"Alpine Strawberry",cat:"Fruit",spacingIn:8,sun:"Partial",water:"Regular",days:"60–90",depth:"Surface",season:"Cool",heightIn:8,companions:["Lettuce","Thyme"],avoid:[],color:"#fc8181",icon:"strawberry",tip:"Tiny intense berries. No runners." },
  { id:"watermelon",name:"Watermelon",cat:"Fruit",spacingIn:60,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:18,companions:["Corn","Radish"],avoid:["Potato"],color:"#48bb78",icon:"watermelon",tip:"Hollow thump = ripe." },
  { id:"cantaloupe",name:"Cantaloupe",cat:"Fruit",spacingIn:36,sun:"Full",water:"Regular",days:"70–90",depth:"1″",season:"Warm",heightIn:18,companions:["Corn"],avoid:["Potato"],color:"#ed8936",icon:"squash",tip:"Ripe when stem slips off easily." },
  { id:"honeydew",name:"Honeydew Melon",cat:"Fruit",spacingIn:36,sun:"Full",water:"Regular",days:"80–100",depth:"1″",season:"Warm",heightIn:18,companions:["Corn"],avoid:["Potato"],color:"#c6f6d5",icon:"squash",tip:"Needs long warm season." },
  { id:"ground_cherry",name:"Ground Cherry",cat:"Fruit",spacingIn:24,sun:"Full",water:"Moderate",days:"65–80",depth:"¼″",season:"Warm",heightIn:30,companions:["Basil"],avoid:[],color:"#ecc94b",icon:"tomato",tip:"Sweet husk-covered berry." },
  // ── FRUIT TREES & BUSHES ──
  { id:"blueberry",name:"Blueberry Bush",cat:"Trees",spacingIn:48,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:72,companions:["Strawberry","Thyme"],avoid:[],color:"#4c51bf",icon:"blueberry",tip:"Acidic soil pH 4.5–5.5 required." },
  { id:"raspberry",name:"Red Raspberry",cat:"Trees",spacingIn:24,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:60,companions:["Garlic"],avoid:["Potato"],color:"#d53f8c",icon:"raspberry",tip:"Trellis canes. Summer or everbearing." },
  { id:"golden_raspberry",name:"Golden Raspberry",cat:"Trees",spacingIn:24,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:60,companions:["Garlic"],avoid:["Potato"],color:"#ecc94b",icon:"raspberry",tip:"Sweeter and milder than red." },
  { id:"blackberry",name:"Blackberry",cat:"Trees",spacingIn:36,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:72,companions:["Tansy"],avoid:["Raspberry"],color:"#2d3748",icon:"blueberry",tip:"Thornless varieties available." },
  { id:"gooseberry",name:"Gooseberry",cat:"Trees",spacingIn:48,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:48,companions:["Tansy"],avoid:[],color:"#68d391",icon:"blueberry",tip:"Tart berries. Great for jam/pie." },
  { id:"red_currant",name:"Red Currant",cat:"Trees",spacingIn:48,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:48,companions:["Garlic"],avoid:[],color:"#e53e3e",icon:"raspberry",tip:"Translucent red clusters." },
  { id:"black_currant",name:"Black Currant",cat:"Trees",spacingIn:48,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:60,companions:["Garlic"],avoid:[],color:"#2d3748",icon:"blueberry",tip:"Very high vitamin C. Deep flavor." },
  { id:"elderberry",name:"Elderberry",cat:"Trees",spacingIn:72,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,companions:[],avoid:[],color:"#2d3748",icon:"blueberry",tip:"Berries must be cooked. Medicinal." },
  { id:"honeyberry",name:"Honeyberry",cat:"Trees",spacingIn:48,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:60,companions:[],avoid:[],color:"#4c51bf",icon:"blueberry",tip:"Earliest berry. Zone 2–7." },
  { id:"fig",name:"Fig Tree",cat:"Trees",spacingIn:120,sun:"Full",water:"Moderate",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:180,companions:["Strawberry"],avoid:[],color:"#6b46c1",icon:"blueberry",tip:"Zone 7+. Brown Turkey hardy." },
  { id:"dwarf_apple",name:"Dwarf Apple",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,companions:["Chives","Garlic"],avoid:["Walnut"],color:"#e53e3e",icon:"blueberry",tip:"Needs pollinator. 8–10ft mature." },
  { id:"dwarf_pear",name:"Dwarf Pear",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,companions:["Garlic"],avoid:["Walnut"],color:"#68d391",icon:"blueberry",tip:"Bartlett, Anjou popular." },
  { id:"dwarf_peach",name:"Dwarf Peach",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:120,companions:["Garlic"],avoid:["Walnut"],color:"#ed8936",icon:"blueberry",tip:"Self-pollinating. Full sun critical." },
  { id:"dwarf_cherry",name:"Dwarf Cherry",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,companions:["Garlic"],avoid:["Walnut"],color:"#c53030",icon:"blueberry",tip:"Sweet or tart. Stella is self-fertile." },
  { id:"dwarf_plum",name:"Dwarf Plum",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:120,companions:["Garlic"],avoid:["Walnut"],color:"#6b46c1",icon:"blueberry",tip:"Japanese vs European varieties." },
  { id:"dwarf_citrus",name:"Dwarf Citrus (Meyer Lemon)",cat:"Trees",spacingIn:72,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:96,companions:[],avoid:[],color:"#ecc94b",icon:"blueberry",tip:"Container-friendly. Bring inside winter." },
  { id:"dwarf_lime",name:"Dwarf Key Lime",cat:"Trees",spacingIn:72,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:72,companions:[],avoid:[],color:"#48bb78",icon:"blueberry",tip:"Compact. Great for pots." },
  { id:"grape",name:"Grape Vine",cat:"Trees",spacingIn:72,sun:"Full",water:"Moderate",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:120,companions:["Basil","Bean"],avoid:[],color:"#6b46c1",icon:"raspberry",tip:"Needs strong trellis/arbor." },
  { id:"kiwi",name:"Hardy Kiwi",cat:"Trees",spacingIn:96,sun:"Full",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:180,companions:[],avoid:[],color:"#48bb78",icon:"blueberry",tip:"Male + female needed. Zone 4–8." },
  { id:"pomegranate",name:"Pomegranate",cat:"Trees",spacingIn:120,sun:"Full",water:"Moderate",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:120,companions:[],avoid:[],color:"#e53e3e",icon:"blueberry",tip:"Drought tolerant. Zone 7–10." },
  { id:"mulberry",name:"Dwarf Mulberry",cat:"Trees",spacingIn:120,sun:"Full",water:"Moderate",days:"Perennial",depth:"Root ball",season:"Warm",heightIn:120,companions:[],avoid:[],color:"#2d3748",icon:"blueberry",tip:"Everbearing variety. Stains everything." },
  { id:"pawpaw",name:"Pawpaw",cat:"Trees",spacingIn:120,sun:"Partial",water:"Regular",days:"Perennial",depth:"Root ball",season:"Cool",heightIn:180,companions:[],avoid:[],color:"#68d391",icon:"blueberry",tip:"Native US fruit. Tropical flavor." },
  // ── OTHER EDIBLES ──
  { id:"asparagus",name:"Asparagus",cat:"Other",spacingIn:18,sun:"Full",water:"Regular",days:"Perennial",depth:"6″",season:"Cool",heightIn:60,companions:["Tomato","Parsley"],avoid:["Garlic","Onion"],color:"#48bb78",icon:"chives",tip:"Don't harvest first 2 years. Lasts 20+." },
  { id:"rhubarb",name:"Rhubarb",cat:"Other",spacingIn:36,sun:"Full",water:"Regular",days:"Perennial",depth:"Crown",season:"Cool",heightIn:36,companions:["Strawberry"],avoid:[],color:"#e53e3e",icon:"chard",tip:"Only stalks edible. Leaves toxic." },
  { id:"artichoke",name:"Globe Artichoke",cat:"Other",spacingIn:48,sun:"Full",water:"Regular",days:"Perennial",depth:"6″",season:"Cool",heightIn:60,companions:["Pea","Tarragon"],avoid:[],color:"#a0aec0",icon:"brussels",tip:"Dramatic architectural plant." },
  { id:"celery",name:"Celery",cat:"Other",spacingIn:8,sun:"Full",water:"Frequent",days:"80–120",depth:"Surface",season:"Cool",heightIn:18,companions:["Tomato","Bean"],avoid:[],color:"#c6f6d5",icon:"leek",tip:"Heavy feeder. Needs constant moisture." },
  { id:"celeriac",name:"Celeriac",cat:"Other",spacingIn:8,sun:"Full",water:"Regular",days:"100–120",depth:"Surface",season:"Cool",heightIn:14,companions:["Leek","Tomato"],avoid:[],color:"#d69e2e",icon:"turnip",tip:"Celery-flavored root. Stores well." },
  { id:"fennel_bulb",name:"Florence Fennel (Bulb)",cat:"Other",spacingIn:10,sun:"Full",water:"Regular",days:"60–90",depth:"¼″",season:"Cool",heightIn:24,companions:[],avoid:["Most plants"],color:"#c6f6d5",icon:"leek",tip:"Anise-flavored bulb. Keep isolated." },
  { id:"sunflower",name:"Sunflower (Edible)",cat:"Other",spacingIn:24,sun:"Full",water:"Moderate",days:"70–100",depth:"1″",season:"Warm",heightIn:96,companions:["Corn","Squash"],avoid:["Potato"],color:"#ecc94b",icon:"dill",tip:"Harvest when head droops and browns." },
  { id:"microgreens",name:"Microgreens Tray",cat:"Other",spacingIn:12,sun:"Partial",water:"Regular",days:"7–14",depth:"Surface",season:"Any",heightIn:3,companions:[],avoid:[],color:"#48bb78",icon:"arugula",tip:"Harvest 1–2 inches. Any seed works." },
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
const PX=4, GP=24, uid=()=>Math.random().toString(36).slice(2,10), toM=i=>(i*2.54).toFixed(1), snap=px=>Math.round(px/GP)*GP;
const CATS=["All","Fruiting","Leafy","Brassica","Root","Allium","Legume","Herb","Fruit","Trees","Other"];
const BCATS=["Raised Wood","Raised Metal","Container","Grow Bag","In-Ground","Keyhole","Trellis"];

export default function App(){
  const[projectName,setProjectName]=useState("My Garden Plan");
  const[unit,setUnit]=useState("imperial");
  const[zoom,setZoom]=useState(.75);
  const[pan,setPan]=useState({x:40,y:40});
  const[canvasSize,setCanvasSize]=useState({w:240,h:240});
  const[searchQ,setSearchQ]=useState("");
  const[plantCat,setPlantCat]=useState("All");
  const[bedCat,setBedCat]=useState("Raised Wood");
  const[sideTab,setSideTab]=useState("plants");
  const[activeTool,setActiveTool]=useState(null);
  const[plants,setPlants]=useState([]);
  const[beds,setBeds]=useState([]);
  const[selId,setSelId]=useState(null);
  const[drag,setDrag]=useState(null);
  const[dragS,setDragS]=useState(null);
  const[isPan,setIsPan]=useState(false);
  const[panS,setPanS]=useState(null);
  const[notes,setNotes]=useState("");
  const[chatOpen,setChatOpen]=useState(false);
  const[msgs,setMsgs]=useState([{role:"assistant",content:"Hi! I'm your garden assistant. Ask about spacing, companions, soil, pests, or design!"}]);
  const[chatIn,setChatIn]=useState("");
  const[chatBusy,setChatBusy]=useState(false);
  const[pInfo,setPInfo]=useState(null);
  const[showCS,setShowCS]=useState(false);
  const[notesC,setNotesC]=useState(false);
  const[showTrash,setShowTrash]=useState(false);
  const[trashH,setTrashH]=useState(false);
  const[resH,setResH]=useState(null);
  const wr=useRef(null),ce=useRef(null),cb=useRef(null),chatRef=useRef(null);
  useEffect(()=>{if(cb.current)cb.current.scrollTop=cb.current.scrollHeight;},[msgs]);
  useEffect(()=>{const h=e=>{
    if(chatRef.current && chatRef.current.contains(e.target)) return;
    if(chatRef.current && chatRef.current.contains(document.activeElement)) return;
    const tag = e.target.tagName;
    if(tag==="INPUT"||tag==="TEXTAREA") return;
    if(document.activeElement?.tagName==="INPUT"||document.activeElement?.tagName==="TEXTAREA") return;
    if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopImmediatePropagation();return;}
    if((e.key==="Backspace"||e.key==="Delete")&&selId){e.preventDefault();setPlants(p=>p.filter(x=>x.id!==selId));setBeds(p=>p.filter(x=>x.id!==selId));setSelId(null);}
    if(e.key==="Escape"){setActiveTool(null);setSelId(null);}
  };window.addEventListener("keydown",h,true);return()=>window.removeEventListener("keydown",h,true);},[selId]);

  const filtered=useMemo(()=>{let l=PLANTS;if(plantCat!=="All")l=l.filter(p=>p.cat===plantCat);if(searchQ){const q=searchQ.toLowerCase();l=l.filter(p=>p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q));}return l;},[plantCat,searchQ]);
  const fBeds=useMemo(()=>BED_PRESETS.filter(b=>b.cat===bedCat),[bedCat]);

  const handleWheel=useCallback(e=>{if(cb.current?.contains(e.target))return;e.preventDefault();setZoom(z=>Math.min(4,Math.max(.15,z+(e.deltaY>0?-.06:.06))));},[]);
  useEffect(()=>{const el=wr.current;if(el)el.addEventListener("wheel",handleWheel,{passive:false});return()=>{if(el)el.removeEventListener("wheel",handleWheel);};},[handleWheel]);

  const gp=e=>{const r=wr.current?.getBoundingClientRect();if(!r)return{x:0,y:0};return{x:(e.clientX-r.left-pan.x)/zoom,y:(e.clientY-r.top-pan.y)/zoom};};

  const onDown=e=>{if(chatRef.current&&chatRef.current.contains(e.target))return;if(e.target.closest(".noc"))return;if(activeTool){const p=gp(e),sx=snap(p.x),sy=snap(p.y);if(activeTool.type==="plant")setPlants(pr=>[...pr,{id:uid(),pid:activeTool.data.id,x:sx,y:sy}]);else{const b=activeTool.data;setBeds(pr=>[...pr,{id:uid(),bid:b.id,x:sx,y:sy,wIn:b.wIn,hIn:b.hIn,custom:b.custom||false}]);}return;}setSelId(null);setIsPan(true);setPanS({x:e.clientX-pan.x,y:e.clientY-pan.y});};

  const onMove=e=>{if(resH){const p=gp(e),dx=Math.round((p.x-resH.sx)/PX),dy=Math.round((p.y-resH.sy)/PX);setBeds(pr=>pr.map(b=>{if(b.id!==resH.bid)return b;const bed=BED_PRESETS.find(bp=>bp.id===b.bid);const ic=bed&&(bed.shape==="circle"||bed.shape==="keyhole");let nw=resH.ow,nh=resH.oh;if(resH.c==="se"){nw=resH.ow+dx;nh=ic?resH.ow+dx:resH.oh+dy;}else if(resH.c==="sw"){nw=resH.ow-dx;nh=ic?resH.ow-dx:resH.oh+dy;}else if(resH.c==="ne"){nw=resH.ow+dx;nh=ic?resH.ow+dx:resH.oh-dy;}else{nw=resH.ow-dx;nh=ic?resH.ow-dx:resH.oh-dy;}nw=Math.max(12,nw);nh=Math.max(12,nh);return{...b,wIn:nw,hIn:ic?nw:nh};}));return;}if(isPan&&panS){setPan({x:e.clientX-panS.x,y:e.clientY-panS.y});return;}if(drag&&dragS){setShowTrash(true);const p=gp(e),dx=p.x-dragS.x,dy=p.y-dragS.y;if(drag.t==="p")setPlants(pr=>pr.map(x=>x.id===drag.id?{...x,x:snap(drag.ox+dx),y:snap(drag.oy+dy)}:x));else setBeds(pr=>pr.map(x=>x.id===drag.id?{...x,x:snap(drag.ox+dx),y:snap(drag.oy+dy)}:x));const r=wr.current?.getBoundingClientRect();if(r){const rx=e.clientX-r.left,ry=e.clientY-r.top;setTrashH(rx<80&&ry>r.height-80);}}};

  const onUp=()=>{if(resH){setResH(null);return;}if(drag&&trashH){if(drag.t==="p")setPlants(p=>p.filter(x=>x.id!==drag.id));else setBeds(p=>p.filter(x=>x.id!==drag.id));setSelId(null);}setIsPan(false);setPanS(null);setDrag(null);setDragS(null);setShowTrash(false);setTrashH(false);};

  const sdp=(e,p)=>{e.stopPropagation();setSelId(p.id);setActiveTool(null);setDrag({t:"p",id:p.id,ox:p.x,oy:p.y});setDragS(gp(e));};
  const sdb=(e,b)=>{e.stopPropagation();setSelId(b.id);setActiveTool(null);setDrag({t:"b",id:b.id,ox:b.x,oy:b.y});setDragS(gp(e));};
  const stR=(e,b,c)=>{e.stopPropagation();const p=gp(e);setResH({bid:b.id,c,sx:p.x,sy:p.y,ow:b.wIn,oh:b.hIn});};

  const delSel=()=>{setPlants(p=>p.filter(x=>x.id!==selId));setBeds(p=>p.filter(x=>x.id!==selId));setSelId(null);};
  const fileRef=useRef(null);
  const [showDLMenu,setShowDLMenu]=useState(false);
  useEffect(()=>{if(!showDLMenu)return;const h=()=>setShowDLMenu(false);const t=setTimeout(()=>document.addEventListener("click",h),0);return()=>{clearTimeout(t);document.removeEventListener("click",h);};},[showDLMenu]);

  const saveProject=()=>{
    const data=JSON.stringify({version:1,projectName,canvasSize,unit,plants,beds,notes},null,2);
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
      if(data.plants)setPlants(data.plants);
      if(data.beds)setBeds(data.beds);
      if(data.notes)setNotes(data.notes);
    }catch{alert("Invalid project file.");}};
    reader.readAsText(file);
    e.target.value="";
  };

  const sendChat=async()=>{if(!chatIn.trim()||chatBusy)return;const m=chatIn.trim();setChatIn("");setMsgs(p=>[...p,{role:"user",content:m}]);setChatBusy(true);try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[...msgs.slice(-8),{role:"user",content:m}]})});const d=await r.json();if(d.error){setMsgs(p=>[...p,{role:"assistant",content:d.error}]);}else{setMsgs(p=>[...p,{role:"assistant",content:d.content?.map(c=>c.text||"").join("")||"Sorry, try again!"}]);}}catch{setMsgs(p=>[...p,{role:"assistant",content:"Connection issue. Please try again."}]);}setChatBusy(false);};

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

  const renderBed=b=>{const bed=BED_PRESETS.find(bp=>bp.id===b.bid);if(!bed)return null;const w=(b.wIn||bed.wIn)*PX,h2=(b.hIn||bed.hIn)*PX;const sel=selId===b.id;const isTrellis=bed.trellis;const dirtColor="rgb(50,30,10)";const st={position:"absolute",left:b.x,top:b.y,width:w,height:h2,border:`${sel?3:2}px ${bed.cat==="Grow Bag"?"dashed":isTrellis?"dotted":"solid"} ${sel?"#2b6cb0":bed.matBorder}`,backgroundColor:isTrellis?"rgba(139,115,85,.08)":dirtColor,cursor:drag?.id===b.id?"grabbing":"grab",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:600,userSelect:"none",zIndex:sel?5:1,boxShadow:sel?"0 0 0 2px rgba(43,108,176,.3)":"none",textShadow:"0 1px 2px rgba(0,0,0,.4)"};
  if(bed.shape==="circle")st.borderRadius="50%";else if(bed.shape==="keyhole"){st.borderRadius="50%";st.clipPath="polygon(0% 0%,100% 0%,100% 100%,55% 100%,55% 65%,45% 65%,45% 100%,0% 100%)";}else st.borderRadius="3px";
  if(isTrellis){st.backgroundImage="repeating-linear-gradient(0deg,transparent,transparent 10px,rgba(139,115,85,.15) 10px,rgba(139,115,85,.15) 11px),repeating-linear-gradient(90deg,transparent,transparent 10px,rgba(139,115,85,.15) 10px,rgba(139,115,85,.15) 11px)";}
  const dim=unit==="metric"?`${toM(b.wIn||bed.wIn)}×${toM(b.hIn||bed.hIn)}cm`:`${b.wIn||bed.wIn}″×${b.hIn||bed.hIn}″`;
  const handles=b.custom&&sel?["nw","ne","sw","se"].map(c=>{const isT=c[0]==="n",isL=c[1]==="w";return <div key={c} onMouseDown={e=>stR(e,b,c)} style={{position:"absolute",width:10,height:10,top:isT?-5:"auto",bottom:isT?"auto":-5,left:isL?-5:"auto",right:isL?"auto":-5,background:"#fff",border:"2px solid #2b6cb0",borderRadius:"50%",cursor:c==="nw"||c==="se"?"nwse-resize":"nesw-resize",zIndex:30}}/>;})
  :null;
  return <div key={b.id} style={st} onMouseDown={e=>{if(activeTool?.type==="plant"){return;}sdb(e,b);}}><span style={{pointerEvents:"none",textAlign:"center",lineHeight:1.2}}>{bed.name}<br/>{dim}</span>{handles}</div>;};

  const InfoPanel=({plant:p,onClose})=>{ return (
    <div style={{position:"fixed",top:0,right:0,width:310,height:"100%",background:"#fff",boxShadow:"-4px 0 20px rgba(0,0,0,.1)",zIndex:1000,overflowY:"auto",borderLeft:"1px solid #ddd"}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h3 style={{margin:0,fontSize:15,fontWeight:700,color:"#1a1a1a"}}>{p.name}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#999",padding:4}}>✕</button>
      </div>
      <div style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"center",padding:16,background:"#f5f0eb",borderRadius:10,marginBottom:16}}>
          <PlantSVG plant={p} size={64}/>
        </div>
        {[["Category",p.cat],["Spacing",unit==="metric"?`${toM(p.spacingIn)} cm`:`${p.spacingIn} inches`],["Height",unit==="metric"?`${toM(p.heightIn||0)} cm`:`${p.heightIn||"?"} inches`],["Sun",p.sun],["Water",p.water],["Days to Harvest",p.days],["Planting Depth",p.depth],["Season",p.season]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f5f5f5"}}>
            <span style={{fontSize:12,color:"#888"}}>{k}</span>
            <span style={{fontSize:12,fontWeight:600,color:"#1a1a1a"}}>{v}</span>
          </div>
        ))}
        {p.companions?.length>0 && (
          <div style={{marginTop:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#6b8f5e",marginBottom:3}}>Good Companions</div>
            <div style={{fontSize:12,color:"#555"}}>{p.companions.join(", ")}</div>
          </div>
        )}
        {p.avoid?.length>0 && (
          <div style={{marginTop:8}}>
            <div style={{fontSize:11,fontWeight:700,color:"#e53e3e",marginBottom:3}}>Avoid Near</div>
            <div style={{fontSize:12,color:"#555"}}>{p.avoid.join(", ")}</div>
          </div>
        )}
        {p.tip && (
          <div style={{marginTop:10,padding:8,background:"#eef3eb",borderRadius:6,border:"1px solid #d0e0ca"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#3d5a32"}}>Tip</div>
            <div style={{fontSize:12,color:"#1a1a1a",marginTop:2}}>{p.tip}</div>
          </div>
        )}
      </div>
    </div>
  ); };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100vw",fontFamily:"'DM Sans',system-ui,sans-serif",background:T.bg,color:T.text,overflow:"hidden",fontSize:13}} onMouseMove={onMove} onMouseUp={onUp}>
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
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
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
        <span style={{fontSize:13,fontWeight:800,color:T.accent,letterSpacing:"-.3px"}}>GardenGridDesign</span>

      </div>
    </header>

    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {/* SIDEBAR */}
      <aside style={{width:255,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",background:T.side,flexShrink:0}}>
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`}}>
          {[["🌱 Plants","plants"],["📐 Beds","beds"]].map(([l,k])=><button key={k} onClick={()=>setSideTab(k)} style={{flex:1,padding:"8px 0",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:sideTab===k?T.accentL:T.side,color:sideTab===k?T.accentD:T.textL,borderBottom:sideTab===k?`2px solid ${T.accent}`:"2px solid transparent"}}>{l}</button>)}
        </div>
        {sideTab==="plants"?<React.Fragment>
          <div style={{padding:"8px 10px",borderBottom:`1px solid ${T.border}`}}><div style={{position:"relative"}}><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search plants..." style={{width:"100%",padding:"8px 32px 8px 32px",border:`1px solid ${T.border}`,borderRadius:6,fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff",color:T.text}}/><span style={{position:"absolute",left:10,top:8,fontSize:14,color:"#bbb"}}>🔍</span>{searchQ&&<button onClick={()=>setSearchQ("")} style={{position:"absolute",right:8,top:6,background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#999",padding:0}}>✕</button>}</div></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:2,padding:"5px 8px",borderBottom:`1px solid ${T.border}`}}>{CATS.map(c=><button key={c} onClick={()=>setPlantCat(c)} style={{padding:"2px 7px",border:`1px solid ${plantCat===c?T.accent:T.border}`,borderRadius:8,fontSize:9,fontWeight:700,cursor:"pointer",background:plantCat===c?T.accentL:"#fff",color:plantCat===c?T.accentD:T.textL}}>{c}</button>)}</div>
          {activeTool?.type==="plant"&&<div style={{padding:"5px 8px",background:T.accentL,borderBottom:"1px solid #d0e0ca",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:T.accentD}}>📍 {activeTool.data.name}</span><button onClick={()=>setActiveTool(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#e53e3e"}}>✕</button></div>}
          <div style={{flex:1,overflowY:"auto",padding:"2px 0"}}>{filtered.map(plant=><div key={plant.id} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 8px",cursor:"pointer",background:activeTool?.data?.id===plant.id?T.accentL:"transparent",borderLeft:activeTool?.data?.id===plant.id?`3px solid ${T.accent}`:"3px solid transparent"}} onClick={()=>setActiveTool(activeTool?.data?.id===plant.id?null:{type:"plant",data:plant})}><PlantSVG plant={plant} size={24}/><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:T.text}}>{plant.name}</div><div style={{fontSize:9,color:T.textL}}>{plant.cat} · {unit==="metric"?toM(plant.spacingIn)+"cm":plant.spacingIn+"″"} · {plant.heightIn?unit==="metric"?toM(plant.heightIn)+"cm":plant.heightIn+"″h":""}</div></div><button onClick={e=>{e.stopPropagation();setPInfo(plant);}} style={{width:20,height:20,border:`1px solid ${T.border}`,borderRadius:3,background:"#fff",cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.textM}}>i</button></div>)}{filtered.length===0&&<div style={{padding:20,textAlign:"center",color:T.textL,fontSize:12}}>No plants found</div>}</div>
        </React.Fragment>:<React.Fragment>
          <div style={{display:"flex",flexWrap:"wrap",gap:2,padding:"6px 8px",borderBottom:`1px solid ${T.border}`}}>{BCATS.map(c=><button key={c} onClick={()=>setBedCat(c)} style={{padding:"2px 7px",border:`1px solid ${bedCat===c?T.accent:T.border}`,borderRadius:8,fontSize:9,fontWeight:700,cursor:"pointer",background:bedCat===c?T.accentL:"#fff",color:bedCat===c?T.accentD:T.textL}}>{c}</button>)}</div>
          {activeTool?.type==="bed"&&<div style={{padding:"5px 8px",background:T.accentL,borderBottom:"1px solid #d0e0ca",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:T.accentD}}>📍 {activeTool.data.name}</span><button onClick={()=>setActiveTool(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#e53e3e"}}>✕</button></div>}
          <div style={{flex:1,overflowY:"auto",padding:"2px 0"}}>{fBeds.map(bed=>{const dim=unit==="metric"?`${toM(bed.wIn)}×${toM(bed.hIn)}cm`:`${bed.wIn}″×${bed.hIn}″`;return <div key={bed.id} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 8px",cursor:"pointer",background:activeTool?.data?.id===bed.id?T.accentL:"transparent",borderLeft:activeTool?.data?.id===bed.id?`3px solid ${T.accent}`:"3px solid transparent"}} onClick={()=>setActiveTool(activeTool?.data?.id===bed.id?null:{type:"bed",data:bed})}><div style={{width:26,height:26,border:`2px ${bed.cat==="Grow Bag"?"dashed":bed.trellis?"dotted":"solid"} ${bed.matBorder}`,background:bed.trellis?"rgba(139,115,85,.08)":bed.matColor+"25",borderRadius:bed.shape==="rect"?3:"50%",flexShrink:0}}/><div><div style={{fontSize:11,fontWeight:600,color:T.text}}>{bed.name}{bed.custom&&<span style={{fontSize:9,color:T.accent}}> ✎</span>}</div><div style={{fontSize:9,color:T.textL}}>{dim}</div></div></div>;})}</div>
        </React.Fragment>}
        <div style={{height:28,background:`linear-gradient(to top, ${T.accentL}, transparent)`,borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,color:T.textL}}>🌿 {plants.length} plants · {beds.length} beds</span></div>
      </aside>

      {/* CANVAS */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div ref={wr} style={{flex:1,overflow:"hidden",background:T.canBg,cursor:activeTool?"crosshair":isPan?"grabbing":"default",position:"relative",userSelect:"none"}} onMouseDown={onDown}>
          <RulerX/><RulerY/>
          {selId&&<div style={{position:"absolute",top:24,left:"50%",transform:"translateX(-50%)",zIndex:50,display:"flex",gap:4,background:"#fff",border:`1px solid ${T.border}`,borderRadius:8,padding:"4px 12px",boxShadow:"0 2px 10px rgba(0,0,0,.06)",alignItems:"center"}}><span style={{fontSize:10,color:T.textM,fontWeight:600}}>Press Backspace to delete or drag to 🗑</span></div>}
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
            {plants.map(pl=>{const p=PLANTS.find(x=>x.id===pl.pid);if(!p)return null;const sel=selId===pl.id;return <div key={pl.id} data-plant-id={pl.id} style={{position:"absolute",left:pl.x,top:pl.y,width:28,height:28,cursor:drag?.id===pl.id?"grabbing":"grab",zIndex:sel?20:10,filter:sel?"drop-shadow(0 0 3px #4299e1)":"drop-shadow(0 1px 2px rgba(0,0,0,.3))"}} onMouseDown={e=>sdp(e,pl)} title={p.name}><PlantSVG plant={p} size={28}/>{sel&&<div style={{position:"absolute",top:-16,left:-4,background:"#fff",border:"1px solid #ddd",borderRadius:3,padding:"1px 5px",fontSize:8,fontWeight:700,whiteSpace:"nowrap",color:"#1a1a1a"}}>{p.name}</div>}</div>;})}
          </div>

          {/* CHAT */}
          <div ref={chatRef} className="noc" style={{position:"absolute",bottom:12,right:12,zIndex:80}}>
            {chatOpen&&<div style={{position:"absolute",bottom:52,right:0,width:290,height:340,background:"#fff",border:`1px solid ${T.border}`,borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,.1)",display:"flex",flexDirection:"column",overflow:"hidden"}} onWheel={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}>
              <div style={{padding:"7px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:T.accentL,flexShrink:0}}><span style={{fontWeight:700,fontSize:11,color:T.accentD}}>🌱 Garden Assistant</span><button onClick={e=>{e.stopPropagation();setChatOpen(false);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#999"}}>✕</button></div>
              <div ref={cb} style={{flex:1,overflowY:"auto",padding:8}} onWheel={e=>e.stopPropagation()}>{msgs.map((m,i)=><div key={i} style={{marginBottom:6,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"85%",padding:"5px 9px",borderRadius:8,fontSize:11,lineHeight:1.4,background:m.role==="user"?T.accent:"#f5f0eb",color:m.role==="user"?"#fff":"#1a1a1a",border:m.role==="user"?"none":`1px solid ${T.border}`}}>{m.content}</div></div>)}{chatBusy&&<div style={{fontSize:11,color:"#bbb",padding:4}}>Thinking...</div>}<div ref={ce}/></div>
              <div style={{padding:6,borderTop:`1px solid ${T.border}`,display:"flex",gap:4,flexShrink:0}}><input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==="Enter"){e.preventDefault();sendChat();}}} onMouseDown={e=>e.stopPropagation()} placeholder="Ask about gardening..." style={{flex:1,padding:"5px 8px",border:`1px solid ${T.border}`,borderRadius:5,fontSize:11,outline:"none",color:T.text}}/><button onClick={e=>{e.stopPropagation();sendChat();}} onMouseDown={e=>e.stopPropagation()} disabled={chatBusy} style={{padding:"5px 10px",background:T.accent,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:700,opacity:chatBusy?.5:1}}>↑</button></div>
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
    <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}button:hover{opacity:.88}button:active{transform:scale(.97)}input:focus{border-color:${T.accent}!important}@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
  </div>
  );
}
