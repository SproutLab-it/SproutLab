import type { Locale } from "./i18n";

// Italian overrides for supplement display strings (name + dosage). English
// stays canonical in supplements.json; this overlay is merged in when the
// visitor locale is "it". Longer prose (description, evidence summary,
// caution notes, pairing reasons) is still English-only for now.
type SupplementText = { name: string; dosage: string };

export const SUPPLEMENT_IT: Record<string, SupplementText> = {
  "omega-3": { name: "Omega-3 (EPA/DHA)", dosage: "1000-2000mg di EPA/DHA combinati al giorno" },
  "vitamin-d3": { name: "Vitamina D3", dosage: "1000-2000 UI al giorno (dosi più alte richiedono esami)" },
  "vitamin-b12": { name: "Vitamina B12", dosage: "500-1000mcg al giorno (metilcobalamina preferibile)" },
  "vitamin-c": { name: "Vitamina C", dosage: "500-1000mg al giorno" },
  "zinc": { name: "Zinco", dosage: "15-30mg al giorno" },
  "creatine": { name: "Creatina Monoidrato", dosage: "3-5g al giorno" },
  "melatonin": { name: "Melatonina", dosage: "0,5-3mg, 30-60 minuti prima di dormire" },
  "iron": { name: "Ferro", dosage: "18-27mg al giorno (solo se carente)" },
  "ashwagandha": { name: "Ashwagandha", dosage: "300-600mg al giorno (estratto di radice standardizzato)" },
  "vitamin-k2": { name: "Vitamina K2 (MK-7)", dosage: "100-200mcg al giorno" },
  "l-theanine": { name: "L-Teanina", dosage: "100-200mg al giorno" },
  "rhodiola": { name: "Rodiola Rosea", dosage: "200-400mg al giorno (standardizzato al 3% di rosavine)" },
  "coq10": { name: "Coenzima Q10 (CoQ10)", dosage: "100-200mg al giorno (forma ubiquinolo preferibile)" },
  "vitamin-a": { name: "Vitamina A", dosage: "700-900mcg RAE al giorno" },
  "vitamin-e": { name: "Vitamina E", dosage: "15mg (22 UI) al giorno" },
  "biotin": { name: "Biotina (B7)", dosage: "2,5-5mg al giorno" },
  "probiotics": { name: "Probiotici", dosage: "10-50 miliardi di CFU al giorno (multi-ceppo)" },
  "collagen": { name: "Peptidi di Collagene", dosage: "10-15g al giorno" },
  "turmeric": { name: "Curcuma (Curcumina)", dosage: "500-1000mg di curcumina al giorno con piperina" },
  "nac": { name: "NAC (N-Acetil Cisteina)", dosage: "600-1200mg al giorno" },
  "lions-mane": { name: "Hericium (Lion's Mane)", dosage: "500-1000mg al giorno (estratto di corpo fruttifero)" },
  "spirulina": { name: "Spirulina", dosage: "3-10g al giorno" },
  "maca": { name: "Maca", dosage: "1,5-3g al giorno" },
  "magnesium": { name: "Magnesio", dosage: "300-400mg al giorno (forma glicinato o citrato preferibile)" },
  "cordyceps": { name: "Cordyceps", dosage: "1000-3000mg al giorno" },
  "reishi": { name: "Reishi", dosage: "1000-3000mg di estratto al giorno" },
  "tremella": { name: "Tremella", dosage: "500-1500mg di estratto al giorno" },
  "astaxanthin": { name: "Astaxantina", dosage: "4-12mg al giorno" },
  "vitamin-b6": { name: "Vitamina B6", dosage: "1,3-50mg al giorno (RDA: 1,3-1,7mg; terapeutico: 10-50mg)" },
  "potassium": { name: "Potassio", dosage: "99-400mg al giorno (apporto alimentare preferibile)" },
  "electrolytes": { name: "Elettroliti", dosage: "1 dose al giorno, o al bisogno intorno all'attività fisica" },
};

export function localizeSupplementText<T extends { slug: string; name: string; dosage: string }>(
  item: T,
  locale: Locale,
): T {
  if (locale !== "it") return item;
  const it = SUPPLEMENT_IT[item.slug];
  return it ? { ...item, name: it.name, dosage: it.dosage } : item;
}
