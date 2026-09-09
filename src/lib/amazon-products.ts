// Links point to amazon.it (Amazon Italia) search results. The specific US
// ASINs for these brands are frequently not listed on the Italian marketplace,
// so a brand + product search reliably lands on relevant Italian listings.
export const amazonItSearch = (query: string) =>
  `https://www.amazon.it/s?k=${encodeURIComponent(query)}`;

export type AmazonProduct = { brand: string; shortDesc: string; shortDescIt: string; url: string };

export const AMAZON_PRODUCTS: Record<string, AmazonProduct> = {
  "omega-3":    { brand: "Nordic Naturals",    shortDesc: "Ultimate Omega · 1280mg EPA/DHA",             shortDescIt: "Ultimate Omega · 1280mg EPA/DHA",                  url: amazonItSearch("Nordic Naturals Ultimate Omega EPA DHA") },
  "vitamin-d3": { brand: "NatureWise",          shortDesc: "Vitamin D3 5000 IU · in olive oil",           shortDescIt: "Vitamina D3 5000 UI · in olio d'oliva",            url: amazonItSearch("NatureWise vitamina D3 5000 IU") },
  "vitamin-b12":{ brand: "Jarrow Formulas",     shortDesc: "Methylcobalamin 1000mcg · chewable",          shortDescIt: "Metilcobalamina 1000mcg · masticabile",           url: amazonItSearch("Jarrow Formulas metilcobalamina B12 1000 mcg") },
  "vitamin-c":  { brand: "NOW Foods",           shortDesc: "Vitamin C-1000 + Bioflavonoids · 250 caps",   shortDescIt: "Vitamina C-1000 + bioflavonoidi · 250 capsule",    url: amazonItSearch("NOW Foods vitamina C 1000 bioflavonoidi") },
  "creatine":   { brand: "Optimum Nutrition",   shortDesc: "Micronized Creatine Monohydrate · 600g",      shortDescIt: "Creatina monoidrato micronizzata · 600g",         url: amazonItSearch("Optimum Nutrition creatina monoidrato micronizzata") },
  "melatonin":  { brand: "Nature Made",         shortDesc: "Melatonin 5mg · drug-free sleep aid",         shortDescIt: "Melatonina 5mg · aiuto al sonno senza farmaci",    url: amazonItSearch("Nature Made melatonina 5 mg") },
  "iron":       { brand: "Garden of Life",      shortDesc: "Vitamin Code Healthy Blood · 60 caps",        shortDescIt: "Vitamin Code Healthy Blood · 60 capsule",          url: amazonItSearch("Garden of Life Vitamin Code ferro Healthy Blood") },
  "vitamin-k2": { brand: "Thorne",              shortDesc: "Vitamin K Complex K1 + K2 MK-4 & MK-7",      shortDescIt: "Vitamina K Complex K1 + K2 MK-4 e MK-7",           url: amazonItSearch("Thorne vitamina K2 complex MK-7 MK-4") },
  "l-theanine": { brand: "NOW Foods",           shortDesc: "L-Theanine 200mg + Inositol · 120 caps",      shortDescIt: "L-Teanina 200mg + inositolo · 120 capsule",        url: amazonItSearch("NOW Foods L-teanina 200 mg inositolo") },
  "coq10":      { brand: "Doctor's Best",       shortDesc: "CoQ10 100mg + BioPerine · 120 softgels",      shortDescIt: "CoQ10 100mg + BioPerine · 120 softgel",            url: amazonItSearch("Doctor's Best CoQ10 100 mg BioPerine") },
  "vitamin-a":  { brand: "NOW Foods",           shortDesc: "Vitamin A 10,000 IU · 100 softgels",          shortDescIt: "Vitamina A 10.000 UI · 100 softgel",              url: amazonItSearch("NOW Foods vitamina A 10000 IU") },
  "vitamin-e":  { brand: "NOW Foods",           shortDesc: "Vitamin E-400 IU Mixed Tocopherols · 100ct",  shortDescIt: "Vitamina E-400 UI tocoferoli misti · 100 pz",      url: amazonItSearch("NOW Foods vitamina E 400 IU tocoferoli misti") },
  "biotin":     { brand: "NOW Foods",           shortDesc: "Biotin 5000mcg · 120 veg capsules",           shortDescIt: "Biotina 5000mcg · 120 capsule vegetali",           url: amazonItSearch("NOW Foods biotina 5000 mcg") },
  "probiotics": { brand: "Garden of Life",      shortDesc: "Dr. Formulated Once Daily · 50B CFU",         shortDescIt: "Dr. Formulated una volta al giorno · 50 mld CFU",  url: amazonItSearch("Garden of Life Dr Formulated probiotici 50 miliardi") },
  "collagen":   { brand: "Sports Research",     shortDesc: "Collagen Peptides · Hydrolyzed Type 1 & 3",   shortDescIt: "Peptidi di collagene · idrolizzato Tipo 1 e 3",    url: amazonItSearch("Sports Research peptidi di collagene idrolizzato") },
  "turmeric":   { brand: "Doctor's Best",       shortDesc: "Curcumin C3 Complex + BioPerine · 1000mg",    shortDescIt: "Curcumina C3 Complex + BioPerine · 1000mg",        url: amazonItSearch("Doctor's Best curcumina C3 Complex BioPerine") },
  "nac":        { brand: "NOW Foods",           shortDesc: "NAC N-Acetyl Cysteine 1000mg · 120 tablets",  shortDescIt: "NAC N-acetil cisteina 1000mg · 120 compresse",     url: amazonItSearch("NOW Foods NAC N-acetil cisteina 1000 mg") },
  "spirulina":  { brand: "Nutrex Hawaii",       shortDesc: "Pure Hawaiian Spirulina · 500mg · 400 tablets", shortDescIt: "Spirulina hawaiana pura · 500mg · 400 compresse", url: amazonItSearch("Nutrex Hawaii spirulina hawaiana 500 mg") },
};
