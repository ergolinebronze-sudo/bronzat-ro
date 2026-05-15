import { useState, useMemo, useEffect } from "react";

// Mapare: "Nume in catalog" + size -> "NUME IN SMARTBILL"
const SB_MAP = {
  // Australian Gold
  "Accelerator Extreme|250 mL":             "AG ACCELERATOR EXTREME WITH BRONZERS 250ML ML",
  "Accelerator Extreme|15 mL":              "AG ACCELERATOR EXTREME WITH BRONZERS 15 ML",
  "Accelerator K|250 mL":                   "AG ACCELERATOR K 250 ML",
  "Accelerator K|15 mL":                    "AG ACCELERATOR K 15 ML",
  "Accelerator Lotion|250 mL":              "AG ACCELERATOR LOTION 250ML",
  "Accelerator Lotion|15 mL":              "AG ACCELERATOR LOTION 15 ML",
  "Accelerator Lot. Aniversare 40|250 mL":  "AG ACCELERATOR 40TH ANNIVERSARY 250 ML",
  "Accelerator Lot. Aniversare 40|15 mL":   "AG ACCELERATOR 40TH ANNIVERSARY 15 ML",
  "Accelerator Spray|250 mL":               "AG ACCELERATOR SPRAY 250 ML",
  "Adorably Bronze|250 mL":                 "AG ADORABLY BRONZE 250 ML",
  "Adorably Bronze|15 mL":                  "AG ADORABLY BRONZE 15 ML",
  "Bronze Accelerator|250 mL":              "AG BRONZE ACCELERATOR 250 ML",
  "Bronze Accelerator|15 mL":              "AG BRONZE ACCELERATOR 15ML",
  "Charmingly Bronze|250 mL":               "AG CHARMINGLY BRONZE 250 ML",
  "Charmingly Bronze|15 mL":                "AG CHARMINGLY BRONZE15 ML",
  "Cheeky Brown|250 mL":                    "AG CHEEKY BROWN 250 ML",
  "Cheeky Brown|15 mL":                     "AG CHEEKY BROWN 15ML",
  "Color Crush|250 mL":                     "AG COLOR CRUSH 250 ML",
  "Color Crush|15 mL":                      "AG COLOR CRUSH 15 ML",
  "Daringly Dark|250 mL":                   "AG DARINGLY DARK 250ML",
  "Daringly Dark|15 mL":                    "AG DARINGLY DARK 15 ML",
  "Dark Legs|250 mL":                       "AG DARK LEGS 250ML",
  "Dark Legs|15 mL":                        "AG DARK LEGS 15 ML",
  "Deviously Bronze|250 mL":               "AG DEVIOUSLY BRONZE 250 ML",
  "Deviously Bronze|15 mL":                "AG DEVIOUSLY BRONZE 15 ML",
  "Fearlessly Bronze|250 mL":              "AG FEARLESSLY 250 ML",
  "Fearlessly Bronze|15 mL":               "AG FEARLESSLY 15 ML",
  "Gelee Accelerator|250 mL":              "AG GELEE ACCELERATOR 250ML",
  "Gelee Accelerator|15 mL":               "AG GELEE ACCELERATOR 15ML",
  "Hardcore Bronze|15 mL":                 "AG HARDCORE BRONZE 15 ML",
  "Hot! Bronze|250 mL":                    "AG HOT BRONZE 250 ML",
  "Hot! Bronze|15 mL":                     "AG HOT BRONZE 15 ML",
  "Hot! Hybrid|250 mL":                    "AG HOT HYBRID 250 ML",
  "Hot! Hybrid|15 mL":                     "AG HOT  HYBRID 15 ML",
  "Hot! Intensifier|250 mL":               "AG HOT INTENSIFIER 250 ML",
  "Hot! Intensifier|15 mL":                "AG HOT INTENSIFIER 15 ML",
  "Magnetize|300 mL":                      "AG MAGNETIZE 300ML",
  "Magnetize|15 mL":                       "AG MAGNETIZE 15ML",
  "Mineral Haze|300 mL":                   "AG MINERAL HAZE 300 ML",
  "Mineral Haze|15 mL":                    "AG MINERAL HAZE 15 ML",
  "Party Animal|250 mL":                   "AG PARTY ANIMAL 250ML",
  "Party Animal|15 mL":                    "AG PARTY ANIMAL 15 ML",
  "Peptide Pro Hybrid Facial|90 mL":       "AG PEPTIDE PRO HYBRID FACIAL 90 ML",
  "Peptide Pro Hybrid Facial|3 mL":        "AG PEPTIDE PRO HYBRID  FACIAL 3 ML",
  "Pure Heat|250 mL":                      "AG PURE HEAT 250 ML",
  "Pure Heat|15 mL":                       "AG PURE HEAT 15 ML",
  "Sinfully Bronze|250 mL":                "AG SINFULLY BLACK 250 ML",
  "Sinfully Bronze|15 mL":                 "AG SINFULLY BRONZE 15 ML",
  "Wild Obsession|15 mL":                  "AG WILD OBSESSION  15 ML",
  "Solar Dust|237 mL":                     "AG SOLAR DUST 250 ML",
  "Accelerator Signature|250 mL":          "AG SIGNATURE ACCELERATOR 250 ML",
  "Accelerator Signature|15 mL":           "AG SIGNATURE ACCELERATOR 15  ML",
  // Devoted Creations
  "Black Velvet|360 ml":                   "DC BLACK VELVET 360 ML",
  "Black Velvet|15 ml":                    "DC BLACK VELVET 15 ML",
  "Beyond the Beach|360 ml":               "DC BEYOND THE BEACH 360 ML",
  "Beyond the Beach|15 ml":               "DC BEYOND THE BEACH 15 ML",
  "Filthy Rich|360 ml":                    "DC FILTHY RICH 360 ML",
  "Filthy Rich|15 ml":                     "DC FILTHY RICH 15 ML",
  "Neon Rose|360 ml":                      "DC NEON ROSE 360 ML",
  "Neon Rose|15 ml":                       "DC NEON ROSE 15 ML",
  "Bronze Confidential|360 ml":            "DC BRONZE CONFIDENTIAL 360 ML",
  "Bronze Confidential|15 ml":             "DC BRONZE CONFIDENTIAL 15 ML",
  "White 2 Bronze Coconut|251 ml":         "DC WHITE 2 BLACK COCONUT 251 ML",
  "White 2 Bronze Coconut|15 ml":          "DC WHITE 2 BLACK COCONUT 15 ML",
  "White 2 Bronze Coastal|251 ml":         "DC WHITE TO BRONZE COASTAL 251 ML",
  "White 2 Bronze Coastal|15 ml":          "DC WHITE TO BRONZE COASTAL 15 ML",
  "White 2 Bronze Extreme|15 ml":          "DC WHITE 2 BLACK EXTREME 15 ML",
  "White 2 Bronze Ink|15 ml":              "DC WHITE 2 BLACK INK 15 ML",
  "White 2 Bronze Pure Pomegranate|15 ml": "DC WHITE 2 BLACK PMEGRANATE 15ML",
  "White 2 Bronze Tingle|15 ml":           "DC WHITE 2 BLACK TINGLE 15 ML",
  "White 2 Bronze Butter|251 ml":          "DC WHITE 2 BRONZE BUTTER  251 ML",
  "White 2 Bronze Butter|15 ml":           "DC WHITE 2 BRONZE BUTTER 15 ML",
  "White 2 Bronze Watermelon Gelée|250 ml":"DC W2B WATERMELON GELEE 250 ML",
  "White 2 Bronze Watermelon Gelée|15 ml": "DC W2B WATERMELON GELEE 15 ML",
  "White 2 Bronze Wave|15 ml":             "DC W2B WAVE 15 ML",
  "All Black Everything|250 ml":           "DC ALL BLACK EVERYTHING 250 ML",
  "All Black Everything|15 ml":            "DC ALL BLACK EVERYTHING 15 ML",
  "Dare to be Dark|250 ml":                "DC DARE TO BE DARK 250 ML",
  "Dare to be Dark|15 ml":                 "DC DARE TO BE DARK 15 ML",
  "Crush On Color|250 ml":                 "DC CRUSH ON COLOR 250 ML",
  "Crush On Color|15 ml":                  "DC CRUSH ON COLOR 15 ML",
  "Crushing It|250 ml":                    "DC CRUSHING IT 251 ML",
  "Crushing It|15 ml":                     "DC CRUSHING IT 15 ML",
  "DC Accelerator|251 ml":                 "DC ACCELERATOR 251 ML",
  "DC Accelerator|15 ml":                  "DC ACCELERATOR 15 ML",
  "Fast Track 2 Black|15 ml":              "DC FAST TRACK 2 BLACK 15 ML",
  "Long Overdue|251 ml":                   "DC LONG OVERDUE 251 ML",
  "Long Overdue|15 ml":                    "DC LONG OVERDUE 15 ML",
  "Power Player|251 ml":                   "DC POWER PLAYER 251ML",
  "Power Player|15 ml":                    "DC POWER PLAYER 15 ML",
  "Tan Mode|251 ml":                       "DC TANMODE 251 ML",
  "Tan Mode|15 ml":                        "DC TANMODE 15 ML",
  "Vacay Vibes|251 ml":                    "DC VACAY VIBES 251 ML",
  "Vacay Vibes|15 ml":                     "DC VACAY VIBES 15 ML",
  "Game Over|251 ml":                      "DC GAME OVER 251 ML",
  "Game Over|15 ml":                       "DC GAME OVER 15 ML",
  "Ride or Tide|251 ml":                   "DC RIDE OR TIDE 251 ML",
  "Ride or Tide|15 ml":                    "DC RIDE OR TIDE 15 ML",
  "Cocoa & Shea|251 ml":                   "DC COCOA & SHEA 251 ML",
  "Going Off Tropic|251 ml":               "DC GOING OFF TROPIC 251 ML",
  "Going Off Tropic|15 ml":               "DC GOING OFF TROPIC 15 ML",
  "Glocation|251 ml":                      "DC GLOCATION 251 ML",
  "Pier Pressure|251 ml":                  "DC PIER PRESSURE 251 ML",
  "Pier Pressure|15 ml":                   "DC PIER PRESSURE 15 ML",
  "Reef Havoc|250 ml":                     "DC REEF HAVOC 251 ML",
  "Reef Havoc|15 ml":                      "DC REEF HAVOC 15 ML",
  "Saltwater Sundays|200 ml":              "DC SALTWATER SUNDAYS 540 ML",
  "Bourbon & Honey|200 ml":               "DC BOURBON & HONEY 540 ML",
  "Coral Colada|200 ml":                   "DC CORAL COLADA BOTTLE 540 ML",
  "Coconut Krem|200 ml":                   "DC COCONUT KREM 540 ML",
  "Cloud Kissed|200 ml":                   "DC CLOUD KISSED 540 ML",
  "Seaside Sunset|200 ml":                 "DC SEASIDE SUNSET 540 ML",
  "Enchanted Emerald|200 ml":              "DC ENCHANTED EMERALD 540 ML",
  "Salty Lime Slushie|200 ml":             "DC SALTY LIME SLUSHIE 540 ML",
  "Berries & Brandy|200 ml":              "DC BERRIES & BRANDY 540 ML",
  "Coco Creamsicle|200 ml":               "DC COCO CREMSICLE 540 ML",
  "Pacific Pearl Moisturizer|200 ml":      "DC PACIFIC PEARL 540 ML",
  "Nantucket Nectar|200 ml":              "DC NANTUCKET NECTAR 540 ML",
  "Collagenetics Restorative|200 ml":      "DC COLLAGENETICS RESTORATIVE MOISTURIZER 540 ML",
  // Inky Cosmetics
  "Travel Lover 100x|150 ml":             "INKY TRAVEL LOVER 150 ML",
  "Travel Lover 100x|15 ml":              "INKY TRAVEL LOVER 15 ML",
  "Fit Achiever 150x|150 ml":             "INKY FIT ACHIEVER 150 ML",
  "Fit Achiever 150x|15 ml":              "INKY FIT ACHIEVER 15 ML",
  "Joy Maker 200x|150 ml":                "INKY JOY MAKER 150 ML",
  "Joy Maker 200x|15 ml":                 "INKY JOY MAKER 15 ML",
  "Hot Freak 150x|150 ml":                "INKY HOT FREAK 150 ML",
  "Hot Freak 150x|15 ml":                 "INKY HOT FREAK 15 ML",
  "Rainbow Whisperer 100X|150 ml":        "INKY RAINBOW WHISPERER 150 ML",
  "Rainbow Whisperer 100X|15 ml":         "INKY RAINBOW WHISPERER 15 ML",
  "Dark Boss 250X|150 ml":                "INKY DARK BOSS 150 ML",
  "Dark Boss 250X|15 ml":                 "INKY DARK BOSS 15 ML",
  "Free Spirit 100X|150 ml":              "INKY FREE SPIRIT 150 ML",
  "Free Spirit 100X|15 ml":               "INKY FREE SPIRIT 15 ML",
  // Consumabile
  "Dezinfectant Tegee Sol|1L":            "DEZINFECTANT TEGEE SOL 1L",
  "Suport Cap Acryl|buc":                 "SUPORT ACRYL CAP",
  "Suport Cap Burete|buc":                "SUPORT BURETE CAP",
  "Aqua Fresh 6L|6L":                     "AQUA FRESH 6 L",
  "Aqua Cool 10L|10L":                    "AQUA COOL 10L",
  "Covoraș Cabină (diverse culori)|buc":  "COVOR CABINA 80X60 UV",
  "Aromă Megasun Sunrise|buc":            "AROMA MEGASUN SUNRISE",
  "Ochelari Super Sunnies|buc":           "OCHELARI UV",
  "Ochelari UV cu Șnur|buc":              "OCHELARI UV SNUR ROSU",
  "Ochelari Podz Designer Classic|buc":   "PODZ CLASSSIC DESIGNER EYEWEAR",
  "Ochelari Podz Classic|buc":            "PODZ CLASSIC EYEWEAR",
  "Ochelari Podz Fashion|buc":            "PODZ FASHION EYEWEAR",
};

// Helper: obtine stocul pentru un produs
function getStock(stockData, name, size) {
  if (!stockData) return null;
  const key = `${name}|${size}`;
  const sbName = SB_MAP[key];
  if (!sbName) return null;
  const val = stockData[sbName.toUpperCase()];
  return val !== undefined ? val : null;
}

// ─── AUSTRALIAN GOLD ───────────────────────────────────────────────
const BR = "https://bronzare.ro/wp-content/uploads/";
const AGN = "https://www.australiangold.net/";
const AG_LOGO = "https://www.australiangold.net/themes/australian-gold/assets/img/australiangold-logo.svg";

const AG_IMAGES = {
  "Accelerator Extreme":            { large: BR+"2017/03/AustralianGold-Accelerator-Extreme-w-bronzers-250ml.jpg", small: BR+"2017/03/AustralianGold-Accelerator-Extreme-w-bronzers-15ml.jpg" },
  "Accelerator Lotion":             { large: BR+"2015/04/Australian_Gold_Accelerator_250ml.png", small: "https://i.ibb.co/bjX8TTGv/shopping.webp" },
  "Accelerator Lot. Aniversare 40": { large: BR+"2015/04/Australian_Gold_Accelerator_250ml.png", small: BR+"2015/04/Australian_Gold_Accelerator_15ml.png" },
  "Accelerator K":                  { large: BR+"2020/12/AG-Accelerator-K-250ml.jpg", small: BR+"2020/12/AG-Accelerator-K-15ml.jpg" },
  "Accelerator Spray":              { large: AGN+"1098-medium_default/accelerator-spray-gel-con-bronzer.jpg" },
  "Adorably Bronze":                { large: BR+"2018/02/Adorably-Black-250ml.jpg", small: BR+"2018/02/Adorably-Black-15ml.jpg" },
  "Daringly Dark":                  { large: BR+"2020/12/AG-Daringly-Dark-250ml.jpg", small: BR+"2020/12/AG-Daringly-Dark-15ml.jpg" },
  "Deviously Bronze":               { large: AGN+"1301-medium_default/deviously-bronze.jpg" },
  "Solar Dust":               { large: "https://gomagcdn.ro/domains/australiangoldromania.ro/files/product/large/australian-gold-solar-dust-flacon-237ml-237393.webp" },
  "Accelerator Signature":    { large: "https://i.ibb.co/ycjyMvBK/australian-gold-signature-accelerator-flacon-250ml-399349.webp", small: "https://i.ibb.co/d4c6xmhR/shopping-1.webp" },
  "Hardcore Bronze":                { large: AGN+"1300-medium_default/hardcore-bronze.jpg" },
};

const AG_PRODUCTS = [
  { id:1,  name:"Accelerator Extreme",             size:"250 mL", type:"Bronzant DHA",           ron:85.98 },
  { id:2,  name:"Accelerator Extreme",             size:"15 mL",  type:"Bronzant DHA",           ron:13.34 },
  { id:3,  name:"Accelerator K",                   size:"250 mL", type:"Intensificator",         ron:78.74 },
  { id:4,  name:"Accelerator K",                   size:"15 mL",  type:"Intensificator",         ron:11.48 },
  { id:5,  name:"Accelerator Lotion",              size:"250 mL", type:"Intensificator",         ron:70.57 },
  { id:6,  name:"Accelerator Lotion",              size:"15 mL",  type:"Intensificator",         ron:11.79 },
  { id:7,  name:"Accelerator Lot. Aniversare 40",  size:"250 mL", type:"Intensificator",         ron:85.40 },
  { id:8,  name:"Accelerator Lot. Aniversare 40",  size:"15 mL",  type:"Intensificator",         ron:11.06 },
  { id:9,  name:"Accelerator Spray",               size:"250 mL", type:"Intensificator",         ron:67.23 },
  { id:10, name:"Adorably Bronze",                 size:"250 mL", type:"DHA / Bronzant natural", ron:117.01 },
  { id:11, name:"Adorably Bronze",                 size:"15 mL",  type:"DHA / Bronzant natural", ron:16.57 },
  { id:12, name:"Bold by G Gentlemen",             size:"250 mL", type:"Bronzant DHA",           ron:0 },
  { id:13, name:"Bold by G Gentlemen",             size:"15 mL",  type:"Bronzant DHA",           ron:0 },
  { id:14, name:"Bronze Accelerator",              size:"250 mL", type:"Bronzant natural",       ron:82.36 },
  { id:15, name:"Bronze Accelerator",              size:"15 mL",  type:"Bronzant natural",       ron:12.11 },
  { id:16, name:"Charmingly Bronze",               size:"250 mL", type:"Bronzant natural",       ron:0 },
  { id:17, name:"Charmingly Bronze",               size:"15 mL",  type:"Bronzant natural",       ron:17.88 },
  { id:18, name:"Cheeky Brown",                    size:"250 mL", type:"Bronzant natural",       ron:97.24 },
  { id:19, name:"Cheeky Brown",                    size:"15 mL",  type:"Bronzant natural",       ron:14.54 },
  { id:20, name:"Chiseled by G Gentlemen",         size:"250 mL", type:"Intensificator",         ron:0 },
  { id:21, name:"Chiseled by G Gentlemen",         size:"15 mL",  type:"Intensificator",         ron:0 },
  { id:22, name:"Color Crush",                     size:"250 mL", type:"Bronzant natural",       ron:103.90 },
  { id:23, name:"Color Crush",                     size:"15 mL",  type:"Bronzant natural",       ron:15.42 },
  { id:24, name:"Confident by G Gentlemen",        size:"250 mL", type:"Bronzant natural",       ron:0 },
  { id:25, name:"Confident by G Gentlemen",        size:"15 mL",  type:"Bronzant natural",       ron:0 },
  { id:26, name:"Daringly Dark",                   size:"250 mL", type:"Intensificator",         ron:94.48 },
  { id:27, name:"Daringly Dark",                   size:"15 mL",  type:"Intensificator",         ron:14.24 },
  { id:28, name:"Dark Legs",                       size:"250 mL", type:"Bronzant picioare",      ron:79.79 },
  { id:29, name:"Dark Legs",                       size:"15 mL",  type:"Bronzant picioare",      ron:11.56 },
  { id:30, name:"Deviously Bronze",                size:"250 mL", type:"Bronzant DHA",           ron:132.91 },
  { id:31, name:"Deviously Bronze",                size:"15 mL",  type:"Bronzant DHA",           ron:21.14 },
  { id:32, name:"Fearlessly Bronze",               size:"250 mL", type:"DHA / Bronzant natural", ron:113.25 },
  { id:33, name:"Fearlessly Bronze",               size:"15 mL",  type:"DHA / Bronzant natural", ron:16.26 },
  { id:34, name:"Feelin Beachy",                   size:"250 mL", type:"Bronzant DHA",           ron:0 },
  { id:35, name:"Feelin Beachy",                   size:"15 mL",  type:"Bronzant DHA",           ron:0 },
  { id:36, name:"Gelee Accelerator",               size:"250 mL", type:"Intensificator",         ron:72.47 },
  { id:37, name:"Gelee Accelerator",               size:"15 mL",  type:"Intensificator",         ron:12.13 },
  { id:38, name:"Hardcore Bronze",                 size:"250 mL", type:"Bronzant natural",       ron:0 },
  { id:39, name:"Hardcore Bronze",                 size:"15 mL",  type:"Bronzant natural",       ron:17.88 },
  { id:40, name:"Hot! Bronze",                     size:"250 mL", type:"Bronzant natural",       ron:234.14 },
  { id:41, name:"Hot! Bronze",                     size:"15 mL",  type:"Bronzant natural",       ron:19.64 },
  { id:42, name:"Hot! DHA Bronzer",                size:"250 mL", type:"Bronzant DHA",           ron:0 },
  { id:43, name:"Hot! DHA Bronzer",                size:"15 mL",  type:"Bronzant DHA",           ron:36.48 },
  { id:44, name:"Hot! Hybrid",                     size:"250 mL", type:"Intensificator hibrid",  ron:207.64 },
  { id:45, name:"Hot! Hybrid",                     size:"15 mL",  type:"Intensificator hibrid",  ron:32.35 },
  { id:46, name:"Hot! Intensifier",                size:"250 mL", type:"Intensificator",         ron:180.60 },
  { id:47, name:"Hot! Intensifier",                size:"15 mL",  type:"Intensificator",         ron:24.74 },
  { id:48, name:"Magnetize",                       size:"300 mL", type:"Hibrid + Bronzant DHA",  ron:320.64 },
  { id:49, name:"Magnetize",                       size:"15 mL",  type:"Hibrid + Bronzant DHA",  ron:48.93 },
  { id:50, name:"Mineral Haze",                    size:"300 mL", type:"Bronzant DHA",           ron:292.93 },
  { id:51, name:"Mineral Haze",                    size:"15 mL",  type:"Bronzant DHA",           ron:34.95 },
  { id:52, name:"Nothing But Bronze Charcoal",     size:"250 mL", type:"Bronzant DHA",           ron:0 },
  { id:53, name:"Nothing But Bronze Charcoal",     size:"15 mL",  type:"Bronzant DHA",           ron:0 },
  { id:54, name:"Nothing But Bronze Coconut",      size:"250 mL", type:"Bronzant natural",       ron:0 },
  { id:55, name:"Nothing But Bronze Coconut",      size:"15 mL",  type:"Bronzant natural",       ron:0 },
  { id:56, name:"Oasis Heat",                      size:"250 mL", type:"Bronzant Tingle",        ron:0 },
  { id:57, name:"Oasis Heat",                      size:"15 mL",  type:"Bronzant Tingle",        ron:0 },
  { id:58, name:"Ocean Views",                     size:"250 mL", type:"Intensificator",         ron:0 },
  { id:59, name:"Ocean Views",                     size:"15 mL",  type:"Intensificator",         ron:0 },
  { id:60, name:"Party Animal",                    size:"250 mL", type:"Intensificator",         ron:158.91 },
  { id:61, name:"Party Animal",                    size:"15 mL",  type:"Intensificator",         ron:20.45 },
  { id:62, name:"Peptide Pro",                     size:"250 mL", type:"Intensificator Hibrid",  ron:0 },
  { id:63, name:"Peptide Pro",                     size:"15 mL",  type:"Intensificator Hibrid",  ron:17.24 },
  { id:64, name:"Peptide Pro Hybrid Facial",       size:"90 mL",  type:"Intensificator fata",    ron:80.64 },
  { id:65, name:"Peptide Pro Hybrid Facial",       size:"3 mL",   type:"Intensificator fata",    ron:13.07 },
  { id:66, name:"Pure Heat",                       size:"250 mL", type:"Tingle Hot Citrus",      ron:112.43 },
  { id:67, name:"Pure Heat",                       size:"15 mL",  type:"Tingle Hot Citrus",      ron:18.12 },
  { id:68, name:"Rooftop Nights",                  size:"250 mL", type:"Bronzant Instant+DHA",   ron:0 },
  { id:69, name:"Rooftop Nights",                  size:"15 mL",  type:"Bronzant Instant+DHA",   ron:0 },
  { id:70, name:"Rugged by G Gentlemen",           size:"250 mL", type:"Bronzant DHA",           ron:0 },
  { id:71, name:"Rugged by G Gentlemen",           size:"15 mL",  type:"Bronzant DHA",           ron:0 },
  { id:72, name:"Sinfully Bronze",                 size:"250 mL", type:"Intensificator fata",    ron:0 },
  { id:73, name:"Sinfully Bronze",                 size:"15 mL",  type:"Intensificator fata",    ron:13.63 },
  { id:80, name:"Wild Obsession",                  size:"250 mL", type:"Bronzant Instant+DHA",   ron:0 },
  { id:81, name:"Wild Obsession",                  size:"15 mL",  type:"Bronzant Instant+DHA",   ron:23.78 },
  { id:82, name:"Solar Dust",                      size:"237 mL", type:"Bronzant DHA",           ron:63.86 },
  { id:83, name:"Accelerator Signature",            size:"250 mL", type:"Intensificator",         ron:86.16 },
  { id:84, name:"Accelerator Signature",            size:"15 mL",  type:"Intensificator",         ron:13.31 },
];

// ─── DEVOTED CREATIONS & INKY COSMETICS & CONSUMABILE ──────────────
const DC_PRODUCTS = [
  { id:680,  name:"Black Velvet",                                      brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2019/12/black-velvet.png",                       variations:[{size:"360 ml",ron:175.63},{size:"15 ml",ron:12.14}] },
  { id:683,  name:"Indigo Illusion",                                   brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2019/12/indigo-illusion.png",                     variations:[] },
  { id:691,  name:"#Tanlife",                                          brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2019/12/tanlife.png",                            variations:[{size:"15 ml",ron:9.77}] },
  { id:3358, name:"Beyond the Beach",                                  brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/08/beyond-the-beach-400x500-1.png",          variations:[{size:"360 ml",ron:178.39},{size:"15 ml",ron:13.44}] },
  { id:3363, name:"Filthy Rich",                                       brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/08/filthy-rich-400x500-1.png",               variations:[{size:"360 ml",ron:179.61},{size:"15 ml",ron:13.13}] },
  { id:3367, name:"Neon Rose",                                         brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/08/neon_rose_400x500.png",                   variations:[{size:"360 ml",ron:110.87},{size:"15 ml",ron:10.62}] },
  { id:3371, name:"Electric Aura",                                     brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/08/electric-aura-400x500-1.png",             variations:[{size:"15 ml",ron:10.67}] },
  { id:3376, name:"Bronze Confidential",                               brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/08/bronze-confidential-400x500-1.png",       variations:[{size:"360 ml",ron:183.38},{size:"15 ml",ron:12.82}] },
  { id:3494, name:"Sunshine Superstar",                                brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/sunshine-superstar-400x500-1.png",        variations:[] },
  { id:3496, name:"Sunset Strip",                                      brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/sunset-strip-400x500-1.png",              variations:[] },
  { id:3498, name:"Dark AF",                                           brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/dc-dark-af-400x500-1.png",                variations:[] },
  { id:3500, name:"Opalescent",                                        brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/opalescent-400x500-1.png",                variations:[] },
  { id:3504, name:"Devoted Herbal CBD Special Edition",                brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/dc-herbal-tanning-lotion-se-400x500-1.png", variations:[] },
  { id:3506, name:"Devoted Herbal CBD Tanning Lotion",                brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/dc-herbal-tanning-lotion-400x500-1.png",  variations:[] },
  { id:3508, name:"Turquoise Temptation",                              brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/turquoise_temptation_400x500.png",         variations:[] },
  { id:3510, name:"Fuel My Fire",                                      brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/fuel-my-fire.png",                        variations:[] },
  { id:3512, name:"Maliblue",                                          brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/maliblue.png",                            variations:[] },
  { id:3515, name:"Color Karma",                                       brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/dc_color_karma.png",                      variations:[] },
  { id:3518, name:"Somewhere on a Beach",                              brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/dc_somewhere_on_a_beach.png",             variations:[] },
  { id:3520, name:"Yes Way Rosé",                                      brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/dc_yes_way_rose.png",                     variations:[] },
  { id:3522, name:"Woke Up Like This",                                 brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/dc_woke_up_like_this.png",                variations:[] },
  { id:3524, name:"Blonde Obsession",                                  brand:"Devoted Creations", cat:"Devoted Creations Line",  image:"https://bronzat.ro/wp-content/uploads/2023/09/dc_blonde_obsession.png",                 variations:[] },

  { id:3381, name:"White 2 Bronze Coconut",                            brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2023/08/w2b-coconut-400x500-1.png",               variations:[{size:"251 ml",ron:101.03},{size:"15 ml",ron:9.75}] },
  { id:3387, name:"White 2 Bronze Coastal",                            brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2023/08/w2b-bronze-coastal-400x500-1.png",         variations:[{size:"251 ml",ron:101.03},{size:"15 ml",ron:9.75}] },
  { id:3391, name:"White 2 Bronze Extreme",                            brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2023/08/w2b-extreme-400x500-1.png",                variations:[{size:"251 ml",ron:101.03},{size:"15 ml",ron:9.75}] },
  { id:3395, name:"White 2 Bronze Ink",                                brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2023/08/w2b-ink-400x500-1.png",                    variations:[{size:"251 ml",ron:101.03},{size:"15 ml",ron:9.85}] },
  { id:3399, name:"White 2 Bronze Pure Pomegranate",                   brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2023/08/w2b-pomegranate-400x500-1.png",            variations:[{size:"251 ml",ron:101.03},{size:"15 ml",ron:9.75}] },
  { id:3403, name:"White 2 Bronze Summer",                             brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2023/08/w2b-summer-400x500-1.png",                 variations:[{size:"251 ml",ron:100.00},{size:"15 ml",ron:8.32}] },
  { id:3407, name:"White 2 Bronze Tingle",                             brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2023/08/w2b-tingle-400x500-1.png",                 variations:[{size:"15 ml",ron:9.85}] },
  { id:4337, name:"White 2 Bronze Butter",                             brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2024/06/white2bronze-Butter-devoted.png",           variations:[{size:"250 ml",ron:101.03},{size:"15 ml",ron:9.75}] },
  { id:4437, name:"White 2 Bronze Watermelon Gelée",                   brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2025/01/produs-bronzat-watermelon-gelee.png",       variations:[{size:"250 ml",ron:101.03},{size:"15 ml",ron:9.59}] },
  { id:5423, name:"White 2 Bronze Wave",                               brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2025/12/White-2-Bronze-Wave-plic.jpg",              variations:[{size:"15 ml",ron:9.75}] },
  { id:4475, name:"DC Sun Lotion with Shimmer",                        brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2025/03/sun-lotion-with-skimmer88561.webp",         variations:[{size:"250 ml",ron:69.33}] },
  { id:4120, name:"Kit White 2 Bronze Promo (4 flacoane + 16 plicuri)",brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2024/02/2024-White-2-Bronze-Promo-Kit.jpg",         variations:[{size:"Kit",ron:403.36}] },
  { id:4442, name:"Kit Promo 2025 White 2 Bronze",                     brand:"Devoted Creations", cat:"DC Soho Collection",      image:"https://bronzat.ro/wp-content/uploads/2025/01/kit-promo-2025-w2b.png",                   variations:[{size:"Kit",ron:605.88}] },

  { id:723,  name:"All Black Everything",                              brand:"Devoted Creations", cat:"Glamour Collection",      image:"https://bronzat.ro/wp-content/uploads/2019/12/all_black_everything.png",                 variations:[{size:"250 ml",ron:65.55},{size:"15 ml",ron:7.69}] },
  { id:960,  name:"Dare to be Dark",                                   brand:"Devoted Creations", cat:"Glamour Collection",      image:"https://bronzat.ro/wp-content/uploads/2022/03/dare-to-be-dark-400x500-1.png",             variations:[{size:"250 ml",ron:65.00},{size:"15 ml",ron:7.69}] },
  { id:3430, name:"Crush On Color",                                    brand:"Devoted Creations", cat:"Glamour Collection",      image:"https://bronzat.ro/wp-content/uploads/2023/09/crush-on-color-400x500-1.png",              variations:[{size:"250 ml",ron:65.55},{size:"15 ml",ron:7.82}] },
  { id:4410, name:"Kit Glamour Collection 2023",                       brand:"Devoted Creations", cat:"Glamour Collection",      image:"https://bronzat.ro/wp-content/uploads/2024/09/dc-glamour-collection-2023.png",            variations:[{size:"Kit",ron:182.77}] },

  { id:740,  name:"Crushing It",                                       brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2019/12/crushing_it_hr.png",                       variations:[{size:"250 ml",ron:40.71},{size:"15 ml",ron:6.20}] },
  { id:750,  name:"DC Accelerator",                                    brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2019/12/dc_accelerator_hr.png",                    variations:[{size:"250 ml",ron:50.00},{size:"15 ml",ron:7.00}] },
  { id:752,  name:"Fast Track 2 Black",                                brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2019/12/fast_track_2_black_high_res.png",           variations:[{size:"250 ml",ron:50.00},{size:"15 ml",ron:7.00}] },
  { id:753,  name:"Long Overdue",                                      brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2019/12/long_overdue.png",                         variations:[{size:"250 ml",ron:44.53},{size:"15 ml",ron:7.00}] },
  { id:755,  name:"Power Player",                                      brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2019/12/power_player_high_res.png",                variations:[{size:"250 ml",ron:48.36},{size:"15 ml",ron:7.00}] },
  { id:756,  name:"Tan Mode",                                          brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2019/12/tan_mode_high_res.png",                    variations:[{size:"250 ml",ron:50.00},{size:"15 ml",ron:6.88}] },
  { id:962,  name:"Vacay Vibes",                                       brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2022/03/vacay-vibes-400x500-1.png",                 variations:[{size:"250 ml",ron:54.20},{size:"15 ml",ron:7.00}] },
  { id:3447, name:"Game Over",                                         brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2023/09/game-over-1.png",                          variations:[{size:"250 ml",ron:48.32},{size:"15 ml",ron:6.88}] },
  { id:3451, name:"Ride or Tide",                                      brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2023/09/ride-or-tide-400x500-1.png",                variations:[{size:"250 ml",ron:54.20},{size:"15 ml",ron:7.00}] },
  { id:3459, name:"Cocoa & Shea",                                      brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2023/09/dc_coco_shea_400x500.png",                  variations:[{size:"250 ml",ron:27.12}] },
  { id:4122, name:"Going Off Tropic",                                  brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2024/02/going-off-tropic-400x500-1.png",            variations:[{size:"251 ml",ron:54.20},{size:"15 ml",ron:7.00}] },
  { id:4128, name:"Glocation",                                         brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2024/02/glocation-400x500-1.png",                   variations:[{size:"250 ml",ron:33.61}] },
  { id:4465, name:"Kit 2025 Intensity Collection",                     brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2025/02/2025-Intensity-Collection-Promo-Kit.jpg",   variations:[{size:"Kit",ron:428.57}] },
  { id:4471, name:"Pier Pressure",                                     brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2025/03/pier_pressure_twin.jpg",                   variations:[{size:"251 ml",ron:56.72},{size:"15 ml",ron:7.00}] },
  { id:5418, name:"Reef Havoc",                                        brand:"Devoted Creations", cat:"Intensity Line",          image:"https://bronzat.ro/wp-content/uploads/2025/12/crema-bronzare-reef-havoc.jpg",             variations:[{size:"250 ml",ron:0},{size:"15 ml",ron:7.00}] },

  { id:728,  name:"Peace, Love & Hemp",                                brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2019/12/Peace-Love-Hemp.png",                      variations:[] },
  { id:966,  name:"Love & Lemonade",                                   brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2022/03/fbc_love_and_lemonade.png",                 variations:[] },
  { id:968,  name:"Saltwater Sundays",                                 brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2022/03/fbc_saltwater_sundays.png",                 variations:[{size:"200 ml",ron:48.74}] },
  { id:970,  name:"Bourbon & Honey",                                   brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2022/03/fbc_bourbon_and_honey.png",                 variations:[{size:"200 ml",ron:48.74}] },
  { id:972,  name:"Coral Colada",                                      brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2022/03/fbc_coral_colada.png",                      variations:[{size:"200 ml",ron:48.74}] },
  { id:974,  name:"Sugar & Suede",                                     brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2022/03/fbc_sugar_suede.png",                       variations:[{size:"200 ml",ron:52.10}] },
  { id:976,  name:"Coconut Krem",                                      brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2022/03/coconut-krem-400x500-1.png",                variations:[{size:"200 ml",ron:52.10}] },
  { id:978,  name:"Sunkissed Sweet Tea",                               brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2022/03/sunkissed-sweet-tea-400x500-1.png",         variations:[{size:"200 ml",ron:62.81}] },
  { id:981,  name:"Butter Rum Bliss",                                  brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2022/03/butter-rum-bliss-400x500-1.png",             variations:[{size:"200 ml",ron:92.66}] },
  { id:3457, name:"Cloud Kissed",                                      brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2023/09/cloud-kissed-400x500-1.png",                variations:[{size:"200 ml",ron:52.10}] },
  { id:3461, name:"Frose Fantasy",                                     brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2023/09/frose-fantasy-400x500-1.png",               variations:[{size:"200 ml",ron:52.10}] },
  { id:3463, name:"Seaside Sunset",                                    brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2023/09/seaside-sunset.png",                        variations:[{size:"200 ml",ron:48.74}] },
  { id:3465, name:"Enchanted Emerald",                                 brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2023/09/enchanted-emerald-400x500-1.png",           variations:[{size:"200 ml",ron:52.10}] },
  { id:4346, name:"Salty Lime Slushie",                                brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2024/06/salty-lime-slushie-devoted.png",            variations:[{size:"200 ml",ron:63.00}] },
  { id:4348, name:"Berries & Brandy",                                  brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2024/06/berries-and-brandy-devoted.png",            variations:[{size:"200 ml",ron:52.10}] },
  { id:4432, name:"Coco Creamsicle",                                   brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2024/11/coco-creamsicle-produs.jpg",                variations:[{size:"200 ml",ron:63.00}] },
  { id:4467, name:"Kit 2025 Body Care Collection",                     brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2025/02/2025-Body-Care-Collection-Kit.jpg",         variations:[{size:"Kit",ron:333.73}] },
  { id:4483, name:"Coconut Krém After Sun Body Refresher",             brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2025/04/Coconut-Krem-Sun-Refresher-Sun-Refresher-Devoted-Creations.jpg", variations:[{size:"200 ml",ron:50.00}] },
  { id:4485, name:"Coco Creamsicle After Sun Refresher Spray",         brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2025/04/Devoted_Creations_Coco_Creamsicle_After_Sun_Refresher.jpg",     variations:[{size:"200 ml",ron:50.00}] },
  { id:4487, name:"Cloud Kissed After Sun Refresher Spray",            brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2025/04/Cloud-Kissed-After-Sun-Refresher-Spray.jpg",                     variations:[{size:"200 ml",ron:50.00}] },
  { id:5426, name:"Pacific Pearl Moisturizer",                         brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2025/12/Pacific-Pearl-Moisturizer-–-Velvety-Soft-Barrier-Boosting-Hydrator-1.jpg", variations:[{size:"200 ml",ron:59.50}] },
  { id:5429, name:"Nantucket Nectar",                                  brand:"Devoted Creations", cat:"Face and Body Care",      image:"https://bronzat.ro/wp-content/uploads/2025/12/crema-bronzare-nantucket-nectar-devoted-creations.jpg",           variations:[{size:"200 ml",ron:59.50}] },

  { id:3455, name:"Collagenetics Restorative",                         brand:"Devoted Creations", cat:"Collagenetics Line",      image:"https://bronzat.ro/wp-content/uploads/2023/09/collagenetics_restorative_moisturizer_400x500.png", variations:[{size:"200 ml",ron:100.00}] },

  { id:956,  name:"Travel Lover 100x",                                 brand:"Inky Cosmetics",    cat:"Inky Cosmetics",          image:"https://bronzat.ro/wp-content/uploads/2022/02/travel2.png",                             variations:[{size:"150 ml",ron:24.37},{size:"15 ml",ron:4.09}] },
  { id:958,  name:"Fit Achiever 150x",                                 brand:"Inky Cosmetics",    cat:"Inky Cosmetics",          image:"https://bronzat.ro/wp-content/uploads/2022/02/fit2.png",                               variations:[{size:"150 ml",ron:24.58},{size:"15 ml",ron:4.10}] },
  { id:1019, name:"Joy Maker 200x",                                    brand:"Inky Cosmetics",    cat:"Inky Cosmetics",          image:"https://bronzat.ro/wp-content/uploads/2022/03/joy1-dfs.png",                           variations:[{size:"150 ml",ron:32.50},{size:"15 ml",ron:5.50}] },
  { id:1021, name:"Hot Freak 150x",                                    brand:"Inky Cosmetics",    cat:"Inky Cosmetics",          image:"https://bronzat.ro/wp-content/uploads/2022/03/hot-freak.png",                          variations:[{size:"150 ml",ron:24.37},{size:"15 ml",ron:4.50}] },
  { id:1025, name:"Rainbow Whisperer 100X",                            brand:"Inky Cosmetics",    cat:"Inky Cosmetics",          image:"https://bronzat.ro/wp-content/uploads/2023/05/Rainbow-tubasaszetka-kleks.png",          variations:[{size:"150 ml",ron:32.50},{size:"15 ml",ron:5.50}] },
  { id:1028, name:"Dark Boss 250X",                                    brand:"Inky Cosmetics",    cat:"Inky Cosmetics",          image:"https://bronzat.ro/wp-content/uploads/2023/05/DarkBoss-tubasaszetka-kleks.png",         variations:[{size:"150 ml",ron:29.27},{size:"15 ml",ron:6.01}] },
  { id:1030, name:"Free Spirit 100X",                                  brand:"Inky Cosmetics",    cat:"Inky Cosmetics",          image:"https://bronzat.ro/wp-content/uploads/2023/05/free-spirit-tubasaszetka-kleks.png",      variations:[{size:"150 ml",ron:32.50},{size:"15 ml",ron:4.09}] },

  { id:777,  name:"Dezinfectant Tegee Sol",                            brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2019/12/dezinfectant-tegee-sol.jpg",               variations:[{size:"1L",ron:63.02}] },
  { id:781,  name:"Suport Cap Acryl",                                  brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2019/12/jk-licht_kopfpolster_acryl_72dpi.jpg",     variations:[{size:"buc",ron:73.95}] },
  { id:3585, name:"Suport Cap Burete",                                 brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2023/09/headrest_magenta_1_jpg.webp",               variations:[{size:"buc",ron:79.83}] },
  { id:3583, name:"Aqua Fresh 6L",                                     brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2023/09/aquafresh_jpg.webp",                       variations:[{size:"6L",ron:138.61}] },
  { id:803,  name:"Aqua Cool 10L",                                     brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://i.ibb.co/VW384mSn/produkt-obrazek-1949.png",                                    variations:[{size:"10L",ron:151.26}] },
  { id:791,  name:"Covoraș Cabină (diverse culori)",                   brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2019/12/jk-licht_fussmatte_gelb_72dpi.jpg",         variations:[{size:"buc",ron:130.25}] },
  { id:9001, name:"Aromă Megasun Sunrise",                             brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://i.ibb.co/rfQk2Pts/megasun-sunrise-cc0f69d2-1.jpg",                              variations:[{size:"buc",ron:175.63}] },
  { id:801,  name:"Ochelari Super Sunnies",                            brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2019/12/jk-licht_googles_magenta_72dpi.jpg",        variations:[{size:"buc",ron:13.87}] },
  { id:9002, name:"Ochelari UV cu Șnur",                               brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://i.ibb.co/gL5CNNqC/ochelari-de-protectie-profesionala-pentru-solar-uv-shield-siguranta-8122378.jpg", variations:[{size:"buc",ron:14.46}] },
  { id:806,  name:"Ochelari Podz Designer Classic",                    brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2019/12/podz_designer-classic-group.png",           variations:[{size:"buc",ron:13.87}] },
  { id:808,  name:"Ochelari Podz Classic",                             brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2019/12/podz_classic-podz.png",                    variations:[{size:"buc",ron:13.87}] },
  { id:810,  name:"Ochelari Podz Fashion",                             brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2019/12/podz_fashion-podz.png",                    variations:[{size:"buc",ron:13.87}] },
  { id:983,  name:"Ochelari Soft Podz",                                brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2022/03/promotional-soft-podz-text.png",            variations:[{size:"buc",ron:13.87}] },
  { id:992,  name:"Ochelari Flex Podz",                                brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2022/03/flex-podz-1.png",                          variations:[{size:"buc",ron:13.87}] },
  { id:994,  name:"Ochelari Redlight Soft Podz",                       brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2022/03/podz_redlight-soft-podz-opaque-1.png",     variations:[{size:"buc",ron:13.87}] },
  { id:997,  name:"Ochelari Redlight Snap Podz",                       brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2022/03/snap-podz.png",                            variations:[{size:"buc",ron:13.87}] },
  { id:999,  name:"Ochelari Fashion Podz",                             brand:"Consumabile",       cat:"Igienă și Accesorii",     image:"https://bronzat.ro/wp-content/uploads/2022/03/fashion-podz.png",                         variations:[{size:"buc",ron:13.87}] },
];

// ─── CATEGORII PRINCIPALE ──────────────────────────────────────────
const MAIN_CATS = [
  { key:"devoted",         label:"💜 Devoted Creations",   color:"#7c3aed" },
  { key:"australian-gold", label:"🌞 Australian Gold",     color:"#c8922a" },
  { key:"inky",            label:"🖋️ Inky Cosmetics",      color:"#0ea5e9" },
  { key:"consumabile",     label:"🧹 Consumabile",          color:"#16a34a" },
];

const AG_SUBCATS = ["Toate", ...Array.from(new Set(AG_PRODUCTS.map(p => p.type))).sort()];
const DC_SUBCATS = ["Toate", "Devoted Creations Line", "DC Soho Collection", "Glamour Collection", "Intensity Line", "Face and Body Care", "Collagenetics Line"];

const GOLD = "#c8922a";
const DARK = "#1a1208";

// ─── HELPERS ───────────────────────────────────────────────────────
function getAgImg(name, size) {
  const imgs = AG_IMAGES[name];
  if (!imgs) return null;
  const isSmall = size === "15 mL" || size === "3 mL";
  return isSmall ? (imgs.small || imgs.large) : imgs.large;
}

function ImgBox({ src, alt, fallback }) {
  const [err, setErr] = useState(false);
  const s = (!err && src) ? src : fallback;
  return (
    <div style={{ width:64, height:64, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src={s} alt={alt} style={{ width:"100%", height:"100%", objectFit:"contain", opacity: (!err && src) ? 1 : 0.3 }} onError={() => setErr(true)} />
    </div>
  );
}

export default function App() {
  const [mainCat, setMainCat]     = useState("devoted");
  const [subCat, setSubCat]       = useState("Toate");
  const [search, setSearch]       = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart]           = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [addedIds, setAddedIds]   = useState({});
  const [orderSent, setOrderSent] = useState(false);
  const [stockData, setStockData] = useState(null);

  // Trage stocul din SmartBill la incarcare
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(d => { if (d.stocks) setStockData(d.stocks); })
      .catch(() => {});
  }, []);

  // Subcategorii dinamice in functie de categoria principala
  const subcats = useMemo(() => {
    if (mainCat === "australian-gold") return AG_SUBCATS;
    if (mainCat === "devoted") return DC_SUBCATS;
    return ["Toate"];
  }, [mainCat]);

  // Schimba categoria principala si reseteaza subcategoria
  const switchMainCat = (key) => { setMainCat(key); setSubCat("Toate"); setSearch(""); };

  // Lista de produse filtrata
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (mainCat === "australian-gold") {
      return AG_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) &&
        (subCat === "Toate" || p.type === subCat)
      );
    }
    const brand = mainCat === "devoted" ? "Devoted Creations" : mainCat === "inky" ? "Inky Cosmetics" : "Consumabile";
    return DC_PRODUCTS.filter(p =>
      p.brand === brand &&
      p.name.toLowerCase().includes(q) &&
      (subCat === "Toate" || p.cat === subCat)
    );
  }, [mainCat, subCat, search]);

  const catColor = MAIN_CATS.find(c => c.key === mainCat)?.color || GOLD;

  // ── CART ──
  const addToCart = (product, varIdx) => {
    const key = product.id + (varIdx !== undefined ? "_" + varIdx : "");
    const qty = quantities[key] || 1;
    const isAg = mainCat === "australian-gold";
    const name = isAg ? product.name + " " + product.size : product.name;
    const size = isAg ? product.size : (product.variations[varIdx]?.size || "");
    const ron  = isAg ? product.ron  : (product.variations[varIdx]?.ron || 0);
    const img  = isAg ? (getAgImg(product.name, product.size) || AG_LOGO) : product.image;
    setCart(c => {
      const ex = c.find(i => i.key === key);
      return ex ? c.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i) : [...c, { key, name, size, ron, img, qty }];
    });
    setQuantities(q => ({ ...q, [key]: 0 }));
    setAddedIds(a => ({ ...a, [key]: true }));
    setTimeout(() => setAddedIds(a => ({ ...a, [key]: false })), 1500);
  };
  const removeFromCart = (key) => setCart(c => c.filter(i => i.key !== key));
  const updateCartQty = (key, val) => { const v = Math.max(0, parseInt(val)||0); if(v===0) removeFromCart(key); else setCart(c => c.map(i => i.key===key ? {...i,qty:v} : i)); };
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.ron*i.qty, 0);

  const setQty = (key, val) => setQuantities(q => ({ ...q, [key]: Math.max(0, parseInt(val)||0) }));

  const handleSend = () => {
    const lines = cart.map(i => `- ${i.name} ${i.size} x${i.qty} = ${(i.qty*i.ron).toFixed(2)} RON`).join("\n");
    const msg = `Buna ziua! Comanda:\n\n${lines}\n\nTotal: ${cartTotal.toFixed(2)} RON (fara TVA)`;
    window.open("https://wa.me/40721534321?text=" + encodeURIComponent(msg), "_blank");
    setOrderSent(true); setCartOpen(false); setCart([]);
    setTimeout(() => setOrderSent(false), 3500);
  };

  // ── CART SCREEN ──
  if (cartOpen) return (
    <div style={{ fontFamily:"system-ui,sans-serif", background:"#f8f7f4", minHeight:"100vh", maxWidth:480, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"#fff", padding:"14px 16px", borderBottom:"1px solid #eee", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={() => setCartOpen(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:DARK, padding:0 }}>←</button>
        <div style={{ fontSize:18, fontWeight:800, flex:1 }}>Coșul meu</div>
        {cartCount > 0 && <div style={{ fontSize:13, color:"#888" }}>{cartCount} produse</div>}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"8px 16px 120px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:"#bbb", fontSize:15 }}>Coșul este gol.</div>
        ) : cart.map(item => (
          <div key={item.key} style={{ background:"#fff", borderRadius:14, marginBottom:10, padding:14, boxShadow:"0 1px 4px rgba(0,0,0,0.07)", display:"flex", gap:12, alignItems:"center" }}>
            <ImgBox src={item.img} alt={item.name} fallback={AG_LOGO} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:14, lineHeight:1.3 }}>{item.name}</div>
              <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{item.size}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                <div style={{ display:"flex", border:"1.5px solid #e0d5c5", borderRadius:8, overflow:"hidden" }}>
                  <button onClick={() => updateCartQty(item.key, item.qty-1)} style={{ width:32, height:32, background:"#f9f4ec", border:"none", cursor:"pointer", fontSize:18, fontWeight:700, color:"#555" }}>-</button>
                  <input type="number" value={item.qty} onChange={e => updateCartQty(item.key, e.target.value)} style={{ width:40, textAlign:"center", fontSize:14, fontWeight:700, border:"none", outline:"none", background:"#fff", fontFamily:"inherit" }} />
                  <button onClick={() => updateCartQty(item.key, item.qty+1)} style={{ width:32, height:32, background:"#f9f4ec", border:"none", cursor:"pointer", fontSize:18, fontWeight:700, color:"#555" }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.key)} style={{ background:"none", border:"none", color:"#d94f2b", cursor:"pointer", fontSize:12, fontWeight:600 }}>Șterge</button>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontWeight:900, fontSize:17 }}>{(item.qty*item.ron).toFixed(2)} RON</div>
              <div style={{ fontSize:12, color:"#e53e3e", fontWeight:700, marginTop:2 }}>fără TVA</div>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:DARK, padding:"14px 16px 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13 }}>Total estimativ</div>
            <div style={{ color:"#f5c842", fontWeight:900, fontSize:20 }}>{cartTotal.toFixed(2)} RON</div>
          </div>
          <button onClick={handleSend} style={{ width:"100%", background:"#25D366", color:"#fff", border:"none", borderRadius:14, padding:16, fontSize:17, fontWeight:800, cursor:"pointer" }}>
            Trimite pe WhatsApp
          </button>
        </div>
      )}
    </div>
  );

  // ── MAIN SCREEN ──
  return (
    <div style={{ fontFamily:"system-ui,sans-serif", background:"#f8f7f4", minHeight:"100vh", maxWidth:480, margin:"0 auto" }}>

      {/* HEADER */}
      <div style={{ background:"#fff", padding:"12px 16px", borderBottom:"1px solid #f0ece4", position:"sticky", top:0, zIndex:50 }}>
        {showSearch ? (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută produs..."
              style={{ flex:1, border:"1.5px solid #e0d5c5", borderRadius:10, padding:"10px 14px", fontSize:15, outline:"none", fontFamily:"inherit" }} />
            <button onClick={() => { setShowSearch(false); setSearch(""); }} style={{ background:"none", border:"none", color:GOLD, fontWeight:700, fontSize:14, cursor:"pointer" }}>Anulează</button>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:22, fontWeight:900, lineHeight:1 }}>
                <span style={{ color:GOLD }}>bronzat</span><span style={{ color:DARK }}>.ro</span>
              </div>
              <div style={{ fontSize:9, color:"#aaa", letterSpacing:2, textTransform:"uppercase", marginTop:2 }}>Catalog produse 2026</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <button onClick={() => setShowSearch(true)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:DARK, padding:0 }}>🔍</button>
              <button onClick={() => setCartOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", padding:0, position:"relative" }}>
                <span style={{ fontSize:24 }}>🛒</span>
                {cartCount > 0 && (
                  <span style={{ position:"absolute", top:-4, right:-6, background:GOLD, color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{cartCount}</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CATEGORIES */}
      <div style={{ background:"#fff", padding:"10px 12px", borderBottom:"1px solid #eee", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {MAIN_CATS.map(c => (
          <button key={c.key} onClick={() => switchMainCat(c.key)}
            style={{ padding:"10px 8px", borderRadius:12, border:`2px solid ${mainCat === c.key ? c.color : "#e8e0d0"}`, cursor:"pointer", fontWeight:700, fontSize:13,
              background: mainCat === c.key ? c.color : "#faf8f5",
              color: mainCat === c.key ? "#fff" : "#555",
              textAlign:"center", transition:"all 0.15s" }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* SUBCATEGORIES */}
      {subcats.length > 1 && (
        <div style={{ background:"#fafafa", padding:"8px 12px", borderBottom:"1px solid #eee", display:"flex", gap:6, overflowX:"auto" }}>
          {subcats.map(s => (
            <button key={s} onClick={() => setSubCat(s)}
              style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:`1.5px solid ${subCat===s ? catColor : "#ddd"}`,
                background: subCat===s ? catColor : "#fff", color: subCat===s ? "#fff" : "#555",
                cursor:"pointer", fontSize:11, fontWeight:600 }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* INFO BAR */}
      <div style={{ background:"#fffbf0", padding:"8px 16px", borderBottom:"1px solid #f0e8d0", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:14 }}>💡</span>
        <div style={{ fontSize:11, color:"#7a5c1e" }}>
          {mainCat === "australian-gold"
            ? "Prețuri în RON, fără TVA · Australian Gold 2026"
            : "Prețuri în RON, fără TVA · Stoc bronzat.ro"}
        </div>
        <div style={{ marginLeft:"auto", fontSize:11, color:"#999" }}>{filtered.length} produse</div>
      </div>

      {/* PRODUCT LIST */}
      <div style={{ padding:"8px 12px 100px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:60, color:"#bbb", fontSize:15 }}>Niciun produs găsit.</div>
        )}

        {/* ── AUSTRALIAN GOLD ── */}
        {mainCat === "australian-gold" && filtered.map(p => {
          const key = String(p.id);
          const qty = quantities[key] || 0;
          const added = addedIds[key];
          const imgSrc = getAgImg(p.name, p.size) || AG_LOGO;
          const stoc = getStock(stockData, p.name, p.size);
          const epuizat = stoc !== null && stoc === 0;
          return (
            <div key={key} style={{ background:"#fff", borderRadius:14, marginBottom:10, padding:"14px", boxShadow:"0 1px 5px rgba(0,0,0,0.07)", display:"flex", alignItems:"center", gap:12 }}>
              <ImgBox src={imgSrc} alt={p.name} fallback={AG_LOGO} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, lineHeight:1.3 }}>{p.name}</div>
                <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{p.size}</div>
                <div style={{ fontSize:10, color:GOLD, fontWeight:600, marginTop:4 }}>{p.type}</div>
                {stoc !== null && (
                  <div style={{ fontSize:10, fontWeight:700, marginTop:3, color: stoc === 0 ? "#e53e3e" : "#16a34a" }}>
                    {stoc === 0 ? "⚠️ Stoc epuizat" : `✓ Stoc: ${stoc} buc`}
                  </div>
                )}
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:900, fontSize:17, color:DARK }}>{p.ron > 0 ? p.ron.toFixed(2) + " RON" : "—"}</div>
                  <div style={{ fontSize:12, color:"#e53e3e", fontWeight:700 }}>fără TVA</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ display:"flex", border:"1.5px solid #e0d5c5", borderRadius:8, overflow:"hidden" }}>
                    <button onClick={() => setQty(key, qty-1)} style={{ width:28, height:34, background:"#f9f4ec", border:"none", cursor:"pointer", fontSize:16, fontWeight:700, color:"#555" }}>-</button>
                    <input type="number" min="0" value={qty} onChange={e => setQty(key, e.target.value)} style={{ width:34, textAlign:"center", fontSize:13, fontWeight:700, border:"none", outline:"none", background:"#fff", fontFamily:"inherit", padding:0 }} />
                    <button onClick={() => setQty(key, qty+1)} style={{ width:28, height:34, background:"#f9f4ec", border:"none", cursor:"pointer", fontSize:16, fontWeight:700, color:"#555" }}>+</button>
                  </div>
                  <button onClick={() => addToCart(p, undefined)} disabled={epuizat}
                    style={{ height:34, padding:"0 10px", background: epuizat ? "#ddd" : added ? "#2e7d4f" : qty > 0 ? GOLD : "#e8e0d0", color: epuizat ? "#999" : qty > 0 || added ? "#fff" : "#bbb", border:"none", borderRadius:8, fontSize:11, fontWeight:700, cursor: epuizat || qty === 0 ? "default" : "pointer", whiteSpace:"nowrap", transition:"background 0.2s" }}>
                    {epuizat ? "Epuizat" : added ? "✓ OK!" : "🛒 Adaugă"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── DC / INKY / CONSUMABILE ── */}
        {mainCat !== "australian-gold" && filtered.map(p => {
          const hasVars = p.variations && p.variations.length > 0;
          return (
            <div key={p.id} style={{ background:"#fff", borderRadius:14, marginBottom:10, padding:"14px", boxShadow:"0 1px 5px rgba(0,0,0,0.07)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <ImgBox src={p.image} alt={p.name} fallback={AG_LOGO} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, lineHeight:1.3 }}>{p.name}</div>
                  <div style={{ fontSize:10, color:catColor, fontWeight:600, marginTop:3 }}>{p.cat}</div>
                </div>
              </div>

              {/* Variatii */}
              {hasVars ? (
                <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:6 }}>
                  {p.variations.map((v, vi) => {
                    const key = p.id + "_" + vi;
                    const qty = quantities[key] || 0;
                    const added = addedIds[key];
                    const stoc = getStock(stockData, p.name, v.size);
                    const epuizat = stoc !== null && stoc === 0;
                    return (
                      <div key={vi} style={{ display:"flex", alignItems:"center", gap:8, background:"#f9f7f4", borderRadius:10, padding:"8px 10px" }}>
                        <div style={{ flex:1 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:"#444" }}>{v.size}</span>
                          <span style={{ fontSize:13, fontWeight:900, color:DARK, marginLeft:10 }}>{v.ron > 0 ? v.ron.toFixed(2) + " RON" : "—"}</span>
                          {v.ron > 0 && <span style={{ fontSize:11, fontWeight:700, color:"#e53e3e", marginLeft:6 }}>fără TVA</span>}
                          {stoc !== null && (
                            <span style={{ fontSize:10, fontWeight:700, marginLeft:8, color: stoc === 0 ? "#e53e3e" : "#16a34a" }}>
                              {stoc === 0 ? "⚠️ Epuizat" : `✓ ${stoc} buc`}
                            </span>
                          )}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <div style={{ display:"flex", border:"1.5px solid #e0d5c5", borderRadius:8, overflow:"hidden" }}>
                            <button onClick={() => setQty(key, qty-1)} style={{ width:26, height:30, background:"#f0ece4", border:"none", cursor:"pointer", fontSize:15, fontWeight:700, color:"#555" }}>-</button>
                            <input type="number" min="0" value={qty} onChange={e => setQty(key, e.target.value)} style={{ width:30, textAlign:"center", fontSize:12, fontWeight:700, border:"none", outline:"none", background:"#fff", fontFamily:"inherit", padding:0 }} />
                            <button onClick={() => setQty(key, qty+1)} style={{ width:26, height:30, background:"#f0ece4", border:"none", cursor:"pointer", fontSize:15, fontWeight:700, color:"#555" }}>+</button>
                          </div>
                          <button onClick={() => addToCart(p, vi)} disabled={epuizat}
                            style={{ height:30, padding:"0 8px", background: epuizat ? "#ddd" : added ? "#2e7d4f" : qty > 0 ? catColor : "#e8e0d0", color: epuizat ? "#999" : qty > 0 || added ? "#fff" : "#bbb", border:"none", borderRadius:8, fontSize:11, fontWeight:700, cursor: epuizat || qty === 0 ? "default" : "pointer", whiteSpace:"nowrap" }}>
                            {epuizat ? "✗" : added ? "✓" : "🛒"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ marginTop:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:16, fontWeight:900, color:DARK }}>{p.variations?.ron > 0 ? p.variations[0]?.ron?.toFixed(2) + " RON" : "La cerere"}</span>
                  <button onClick={() => {
                    const key = String(p.id);
                    setCart(c => { const ex = c.find(i => i.key===key); return ex ? c.map(i => i.key===key ? {...i,qty:i.qty+1} : i) : [...c, {key, name:p.name, size:"", ron:0, img:p.image, qty:1}]; });
                    setAddedIds(a => ({ ...a, [String(p.id)]: true }));
                    setTimeout(() => setAddedIds(a => ({ ...a, [String(p.id)]: false })), 1500);
                  }}
                  style={{ height:32, padding:"0 12px", background: addedIds[String(p.id)] ? "#2e7d4f" : catColor, color:"#fff", border:"none", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer" }}>
                    {addedIds[String(p.id)] ? "✓ OK!" : "🛒 Adaugă"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BOTTOM BAR */}
      {cartCount > 0 && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, padding:"10px 12px 16px", pointerEvents:"none" }}>
          <button onClick={() => setCartOpen(true)} style={{ width:"100%", background:DARK, color:"#fff", border:"none", borderRadius:16, padding:"14px 20px", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:12, boxShadow:"0 4px 20px rgba(0,0,0,0.25)", pointerEvents:"all" }}>
            <span style={{ background:GOLD, borderRadius:"50%", width:28, height:28, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800 }}>{cartCount}</span>
            <span style={{ flex:1, textAlign:"left" }}>{cartCount} {cartCount===1?"produs":"produse"} în coș</span>
            <span style={{ color:"#f5c842", fontWeight:900, fontSize:16 }}>{cartTotal.toFixed(2)} RON</span>
            <span style={{ fontSize:18 }}>›</span>
          </button>
        </div>
      )}

      {/* ORDER SENT */}
      {orderSent && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#fff", borderRadius:20, padding:"40px 30px", textAlign:"center", width:"100%" }}>
            <div style={{ fontSize:56, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:20, fontWeight:800, marginBottom:8 }}>Comandă trimisă!</div>
            <div style={{ fontSize:14, color:"#666" }}>Echipa bronzat.ro te va contacta în scurt timp.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== PATCH: nu mai e necesar, App.jsx are deja tot codul =====
